# GHN master data sync (BE cron)

## GHN endpoints

- `GET /shiip/public-api/master-data/province`
- `GET /shiip/public-api/master-data/district?province_id={id}`
- `GET /shiip/public-api/master-data/ward?district_id={id}`

Headers: `Token`, `ShopId` (server-side only).

## GhnMasterDataSyncService (weekly cron)

1. Upsert all provinces → `ghn_master_province`.
2. For each province, upsert districts → `ghn_master_district`.
3. For each district, upsert wards → `ghn_master_ward`.
4. Rate-limit: batch with delay between provinces.

## After sync — GhnMappingRebuildJob

- Select internal addresses without `ghn_address_mapping`.
- Run auto-resolve per `(province_code, ward_code)`.
- Update `match_quality` / `source`.

## Admin trigger

`POST /api/admin/shipping/ghn/sync-master-data` — manual run for ops.
