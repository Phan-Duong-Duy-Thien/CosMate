# Shipping API contract (BE)

Base: `{VITE_API_BASE_URL}` — same `ApiResponse<T>` envelope as existing CosMate APIs.

## Address CRUD (extended)

### POST/PUT `/api/users/{userId}/addresses`

```json
{
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "addressName": "Nhà riêng",
  "provinceCode": 79,
  "wardCode": 26734,
  "provinceName": "Thành phố Hồ Chí Minh",
  "wardName": "Phường Tân Vĩnh Lộc",
  "detailAddress": "123 Đường ABC",
  "internalLocCode": "VN-79-26734",
  "city": "Thành phố Hồ Chí Minh",
  "district": "Phường Tân Vĩnh Lộc",
  "address": "123 Đường ABC"
}
```

- `provinceCode` + `wardCode` are **required** for new addresses.
- Legacy `city` / `district` / `address` accepted during dual-read migration.

### Response `UserAddress`

Include codes when available:

```json
{
  "id": 1,
  "userId": 10,
  "name": "...",
  "phone": "...",
  "provinceCode": 79,
  "wardCode": 26734,
  "internalLocCode": "VN-79-26734",
  "provinceName": "...",
  "wardName": "...",
  "detailAddress": "...",
  "city": "...",
  "district": "...",
  "address": "..."
}
```

## Shipping fee estimate (provider-agnostic)

### GET `/api/orders/{orderId}/shipping-estimate`

| Query | Values |
|-------|--------|
| `provider` | `GHN`, `GHTK`, … (default `GHN`) |
| `direction` | `SHIP` \| `RETURN` |

**200**

```json
{
  "code": 200,
  "result": {
    "provider": "GHN",
    "fee": 45000,
    "currency": "VND",
    "approximate": false,
    "from": { "matchQuality": "EXACT" },
    "to": { "matchQuality": "EXACT" }
  }
}
```

**422 `ADDRESS_NOT_MAPPED`**

```json
{
  "code": 422,
  "message": "Không map được địa chỉ với đơn vị vận chuyển",
  "result": {
    "code": "ADDRESS_NOT_MAPPED",
    "unresolvedSide": "FROM"
  }
}
```

## Admin / sync (optional)

- `POST /api/admin/shipping/ghn/sync-master-data`
- `POST /api/admin/shipping/ghn/rebuild-mappings?provinceCode=79`
- `GET /api/admin/shipping/mappings?provinceCode=79&unmappedOnly=true`
