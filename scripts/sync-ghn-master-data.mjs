/**
 * Sync GHN master-data (provinces, districts, wards) to public/data/ghn-master.json.
 *
 * Usage:
 *   npm run ghn:sync-master
 *
 * Env (from .env.development / .env or shell):
 *   VITE_GHN_TOKEN       — required
 *   VITE_GHN_API_BASE    — optional; default https://online-gateway.ghn.vn
 *   VITE_GHN_SHOP_ID     — optional for master-data GET
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_PATH = join(ROOT, 'public', 'data', 'ghn-master.json');

const BATCH_SIZE = 8;
const WARD_FETCH_RETRIES = 2;
const WARD_RETRY_DELAY_MS = 300;

async function loadEnvFile(filename) {
  try {
    const raw = await readFile(join(ROOT, filename), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] == null || process.env[key] === '') {
        process.env[key] = value;
      }
    }
  } catch {
    // optional file
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveApiBase() {
  const raw = process.env.VITE_GHN_API_BASE?.trim() || '';
  if (!raw || raw === '/ghn-proxy') {
    return 'https://online-gateway.ghn.vn';
  }
  return raw.replace(/\/$/, '');
}

async function ghnFetchList(base, token, shopId, path) {
  const headers = {
    'Content-Type': 'application/json',
    Token: token,
  };
  if (shopId) headers.ShopId = shopId;

  const res = await fetch(`${base}${path}`, { method: 'GET', headers });
  const text = await res.text();
  const trimmed = text.trim();

  if (trimmed.startsWith('<')) {
    throw new Error(`GHN returned HTML for ${path}`);
  }
  if (!res.ok) {
    throw new Error(`GHN HTTP ${res.status} for ${path}: ${trimmed.slice(0, 120)}`);
  }

  const json = JSON.parse(trimmed);
  if (json.code !== 200) {
    throw new Error(json.message ?? `GHN API error for ${path}`);
  }
  return Array.isArray(json.data) ? json.data : [];
}

async function fetchWardsWithRetry(base, token, shopId, districtId) {
  let lastError;
  for (let attempt = 0; attempt <= WARD_FETCH_RETRIES; attempt++) {
    try {
      return await ghnFetchList(
        base,
        token,
        shopId,
        `/shiip/public-api/master-data/ward?district_id=${districtId}`
      );
    } catch (err) {
      lastError = err;
      if (attempt < WARD_FETCH_RETRIES) {
        await delay(WARD_RETRY_DELAY_MS);
      }
    }
  }
  console.warn(`  [warn] wards failed for district ${districtId}:`, lastError?.message);
  return [];
}

async function main() {
  await loadEnvFile('.env.development');
  await loadEnvFile('.env');

  const token = process.env.VITE_GHN_TOKEN?.trim();
  const shopId = process.env.VITE_GHN_SHOP_ID?.trim() || '';
  const base = resolveApiBase();

  if (!token) {
    console.error('Missing VITE_GHN_TOKEN. Set in .env.development or environment.');
    process.exit(1);
  }

  console.log(`GHN API base: ${base}`);
  console.log('Fetching provinces...');

  const provinces = await ghnFetchList(
    base,
    token,
    shopId,
    '/shiip/public-api/master-data/province'
  );

  const snapshot = {
    version: 1,
    generatedAt: new Date().toISOString(),
    apiBase: base,
    provinces: [],
  };

  for (let pi = 0; pi < provinces.length; pi++) {
    const province = provinces[pi];
    const provinceId = province.ProvinceID;
    const provinceName = province.ProvinceName;
    console.log(`[${pi + 1}/${provinces.length}] ${provinceName} (${provinceId})`);

    const districts = await ghnFetchList(
      base,
      token,
      shopId,
      `/shiip/public-api/master-data/district?province_id=${provinceId}`
    );

    const districtEntries = [];

    for (let i = 0; i < districts.length; i += BATCH_SIZE) {
      const batch = districts.slice(i, i + BATCH_SIZE);
      const wardGroups = await Promise.all(
        batch.map(async (d) => {
          const wards = await fetchWardsWithRetry(base, token, shopId, d.DistrictID);
          return {
            DistrictID: d.DistrictID,
            DistrictName: d.DistrictName,
            wards: wards.map((w) => ({
              WardCode: w.WardCode,
              WardName: w.WardName,
            })),
          };
        })
      );
      districtEntries.push(...wardGroups);
    }

    snapshot.provinces.push({
      ProvinceID: provinceId,
      ProvinceName: provinceName,
      districts: districtEntries,
    });
  }

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(snapshot), 'utf8');

  const districtCount = snapshot.provinces.reduce((n, p) => n + p.districts.length, 0);
  const wardCount = snapshot.provinces.reduce(
    (n, p) => n + p.districts.reduce((m, d) => m + d.wards.length, 0),
    0
  );

  console.log(`\nWrote ${OUT_PATH}`);
  console.log(`  provinces: ${snapshot.provinces.length}`);
  console.log(`  districts: ${districtCount}`);
  console.log(`  wards:     ${wardCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
