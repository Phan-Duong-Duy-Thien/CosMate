# Backend service layout

```
com.cosmate.shipping/
├── domain/
│   InternalAddress.java
│   ShippingLocationCode.java      // VN-{provinceCode}-{wardCode}
│   ResolvedProviderAddress.java
│   MatchQuality.java              // EXACT, APPROXIMATE, MANUAL
├── resolver/
│   AddressResolver.java
│   GhnAddressResolverService.java
│   MappingLookupRepository.java
├── adapter/
│   ShippingProviderAdapter.java
│   GhnShippingAdapter.java
│   ShippingProviderRegistry.java
├── sync/
│   GhnMasterDataSyncService.java
│   GhnMappingRebuildJob.java
├── api/
│   ShippingController.java
└── facade/
    ShippingFacade.java
```

## GhnAddressResolverService

1. Lookup `ghn_address_mapping` by `(province_code, ward_code)`.
2. On miss: resolve using `ghn_master_*` + normalized ward name from Open API mirror.
3. Persist mapping (`AUTO_RESOLVE`, `APPROXIMATE` if needed).
4. Return `ghn_district_id`, `ghn_ward_code`.

## GhnShippingAdapter

- `estimateFee(ResolvedProviderAddress from, ResolvedProviderAddress to, ParcelSpec parcel)`
- Uses GHN token + shop ID from **server env only**.

## ShippingFacade

- `estimateOrderFee(orderId, providerCode, direction)` loads `order_address` rows, resolves both sides, delegates to adapter.
