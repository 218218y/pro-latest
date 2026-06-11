# Supabase cloud sync setup

This project includes an optional Supabase-backed cloud sync path.

## Setup

1. Create/open the Supabase project.
2. Run `docs/supabase_cloud_sync.sql` in the SQL editor.
3. Configure the app with the expected Supabase URL/key through the existing runtime configuration path.
4. Verify cloud sync panel controls and lifecycle tests before release.

## Multi-store setup in one Supabase project

For the new multi-store build profiles, keep the existing Bargig table as `public.wp_shared_state` and run:

```sql
-- paste/run the full file in Supabase SQL editor
-- docs/supabase_cloud_sync_multi_store.sql
```

The added store profiles use separate tables and Realtime Broadcast prefixes:

- `store-1` -> `public.wp_shared_state_store_1`, channel prefix `wp_cloud_sync_store_1`
- `store-2` -> `public.wp_shared_state_store_2`, channel prefix `wp_cloud_sync_store_2`

This does not alter or truncate the existing `public.wp_shared_state` table.

## Notes

- Keep RLS/policies aligned with the SQL file.
- Do not duplicate table/schema instructions in another doc; update the SQL and this setup note together.
- The app lifecycle contract is summarized in `docs/CLOUD_SYNC_LIFECYCLE_STATE_MACHINE.md`.
