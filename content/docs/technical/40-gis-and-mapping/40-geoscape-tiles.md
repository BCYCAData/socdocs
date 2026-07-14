---
title: Geoscape Tiles
description: Usage and lifecycle of Geoscape tile sources in SOC maps.
status: complete
---

SOC uses Geoscape endpoints for contextual mapping and geocoding workflows through server-side proxy routes.
Tiles are treated as contextual overlays, while authoritative project reference geometry is sourced from cached NSW datasets.

## Integration pattern

- Browser map requests flow through SvelteKit API endpoints.
- The server proxy keeps provider API details and keys away from client code.
- Tile/metadata responses are returned with cache headers suitable for CDN and browser reuse.

## Caching strategy

- Geoscape tiles are proxied and edge-cached for performance.
- They are not persisted as canonical project geometry in PostGIS.
- Error or empty responses use short TTL fallback behavior to recover quickly.

## Data roles

- Geoscape: contextual and search-supporting map services.
- NSW Spatial Services cache: authoritative reference geometry used for assignment and validation workflows.

## Attribution and licensing

- Keep required attributions visible in map profiles and data displays.
- Ensure data-currency context is available where source freshness matters.
- Validate product-tier and API terms with account owners when plans change.

## Failure and fallback behavior

- On upstream failure, map UI should remain usable with other available layers.
- Prefer graceful degradation over hard failure of entire map route.
- Monitor proxy routes and cache hit behavior for repeated upstream issues.

## Related pages

- [Mapping Stack](/docs/technical/gis-and-mapping/mapping-stack)
- [Spatial Data Pipeline](/docs/technical/gis-and-mapping/spatial-data-pipeline)
