# Address migration job (BE)

## Phase A — Backfill codes on `user_address`

For each row where `province_code IS NULL`:

1. Match `city` → Province Open API V2 province (`fetch /p/`).
2. Match `district` → ward in province (`GET /p/{code}?depth=2`).
3. Use same normalization as FE `vnLocationNormalize` (strip Phường/Xã, diacritics).
4. If `district` matches GHN **district** name only (legacy quận): set `ward_code = NULL`, flag `needs_review`.
5. Set:
   - `province_code`, `ward_code`
   - `province_name`, `ward_name`, `detail_address` from legacy columns
   - `internal_loc_code = VN-{provinceCode}-{wardCode}`

## Phase B — Build GHN mappings

For each distinct `(province_code, ward_code)` where `ward_code IS NOT NULL`:

- Call `GhnAddressResolverService.resolve()`.
- Log unmapped pairs to admin report.

## Phase C — Order snapshot

New orders: copy codes from selected `user_address` into `order_address`.

Old orders: resolver uses codes if present, else name fallback (temporary).

## Phase D — FE cutover

FE sends `provinceCode` + `wardCode` on all address saves (CosMate_FE implemented).
