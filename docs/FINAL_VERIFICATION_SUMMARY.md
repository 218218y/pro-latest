# Final Verification Summary

- generated_at: 2026-05-25T20:14:28.250Z
- workspace: `C:\Users\יעקב\Downloads\pro\latestzip`
- total lanes: **25**
- passed: **24**
- environment-blocked: **0**
- runner-blocked: **0**
- failed: **1**
- selected profiles: `default`
- selected categories: `(all)`
- selected lanes: `(all)`
- skipped lanes: `(none)`
- resumed from: `(start)`
- state file: `(none)`

## Interpretation

יש לפחות lane אחד שנכשל ברמת verify/command, ולכן הסגירה הזו עדיין לא מלאה.

לא זוהו חסימות סביבתיות בריצת closeout הזו.

לא זוהו חסימות runner בריצת closeout הזו.

## Lane results

### ❌ Build dist bundle

- id: `build-dist`
- category: `build`
- command: `npm run build:dist`
- status: **failed**
- exit code: `1`
- duration: `14065ms`

#### stderr

```text
[WP BuildDist] TypeScript build failed (exit 2)

```

#### stdout

```text

> build:dist
> node tools/wp_build_dist.js

[WP BuildDist] Building dist modules (tsc:local-node-modules)...
esm/native/services/canvas_picking_cell_dims_corner_context.ts(188,5): error TS2322: Type 'boolean | undefined' is not assignable to type 'boolean'.
  Type 'undefined' is not assignable to type 'boolean'.

```

### ✅ Perf smoke baseline

- id: `perf-smoke`
- category: `perf`
- command: `npm run perf:smoke`
- status: **passed**
- exit code: `0`
- duration: `4499ms`

#### stdout

```text

> perf:smoke
> node tools/wp_perf_smoke.mjs --enforce


============================================================
[WP Perf Smoke] npm run test:perf-toolchain-core
============================================================


> test:perf-toolchain-core
> node --test tests/wp_perf_smoke_runtime.test.js tests/wp_toolchain_family_contracts.test.js tests/wp_check_runtime.test.js tests/wp_verify_runtime.test.js tests/wp_verify_lane_runtime.test.js

✔ check arg parsing preserves baseline/json/gate/strict flags (1.6551ms)
✔ check mode detection prefers js first and falls back to esm (1.6088ms)
✔ check syntax runner reports malformed js files (68.075ms)
✔ check policy stats count legacy/root needles by directory (2.5783ms)
✔ check gate/strict results report regressions and clean strict state (0.4717ms)
✔ check json report preserves file and policy summary fields (0.176ms)
✔ perf smoke args parse lanes, scripts, baseline paths, and flags canonically (2.1227ms)
✔ perf smoke help text advertises default lanes and baseline flags (0.3432ms)
✔ perf smoke planner resolves verify lanes and dedupes script overlap (0.5184ms)
✔ perf smoke baseline evaluation detects regressions and profile drift (1.7366ms)
✔ perf smoke flow updates baseline, writes outputs, and enforces budgets through the canonical flow (10.9637ms)
✔ [toolchain] build-dist keeps one thin entrypoint plus canonical owner modules (3.7249ms)
✔ [toolchain] bundle keeps one thin entrypoint plus canonical owner modules (1.245ms)
✔ [toolchain] check keeps one thin entrypoint plus canonical owner modules (0.716ms)
✔ [toolchain] release keeps one thin entrypoint plus canonical owner modules (0.8677ms)
✔ [toolchain] release-parity keeps one thin entrypoint plus canonical owner modules (0.9029ms)
✔ [toolchain] test keeps one thin entrypoint plus canonical owner modules (0.6202ms)
✔ [toolchain] typecheck keeps one thin entrypoint plus canonical owner modules (0.5743ms)
✔ [toolchain] verify-lane keeps one thin entrypoint plus canonical owner modules (1.324ms)
✔ [toolchain] perf-smoke keeps one thin entrypoint plus canonical owner modules (0.6715ms)
✔ [toolchain] verify keeps one thin entrypoint plus canonical owner modules (0.7186ms)
✔ verify lane state parses multiple lane names plus print/dry-run/no-dedupe flags (3.0081ms)
✔ verify lane catalog lists stable lane names, flattens nested aliases, and dedupes multi-lane plans canonically (0.5702ms)
✔ verify lane planner reports the canonical script order for single and multi-lane runs (0.4639ms)
✔ verify lane flow runs flattened scripts in order (0.4076ms)
✔ verify lane flow dedupes overlapping scripts across multiple lanes by default (0.2721ms)
✔ verify lane help text advertises the canonical lane catalog and multi-lane support (0.4766ms)

============================================================
[WardrobePro] build dist (no assets)
============================================================

✔ verify args parsing preserves gate/no-build/skip-bundle/soft-format policy (1.9129ms)
✔ format check classification warns in normal mode and fails in strict gate mode (0.5177ms)
✔ ensureDistBuilt refuses missing dist in no-build mode and requests build otherwise (2.1456ms)
✔ verify flow orders core checks and skips bundle commands when requested (2.9167ms)
✔ verify flow runs both client release bundle targets in order when bundling is enabled (1.9712ms)
ℹ tests 32
ℹ suites 0
ℹ pass 32
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 164.1859

============================================================
[WP Perf Smoke] npm run test:ui-react-import-hardening-contracts
============================================================


> test:ui-react-import-hardening-contracts
> node --test tests/ui_react_import_hardening_contracts.test.js

✔ ui react import hardening removes legacy React namespace access from pure ts modules (20.5736ms)
✔ ui react import hardening uses explicit named type imports for event-heavy contracts (0.2328ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 98.5809

============================================================
[WP Perf Smoke] npm run test:ui-react-jsx-hardening-contracts
============================================================


> test:ui-react-jsx-hardening-contracts
> node --test tests/ui_react_jsx_import_hardening_contracts.test.js

✔ ui react jsx import hardening removes legacy default React imports and namespace access from tsx modules (7.4293ms)
✔ ui react jsx import hardening uses explicit named imports in representative components (0.256ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 84.8815

============================================================
[WP Perf Smoke] npm run test:ui-type-hardening-contracts
============================================================


> test:ui-type-hardening-contracts
> node
...
[trimmed 1083 chars]
```

### ✅ Overlay/export family core verify (direct)

- id: `overlay-export-core`
- category: `verify`
- command: `(grouped steps)`
- status: **passed**
- exit code: `0`
- duration: `8458ms`

#### steps

- ✅ overlay/export contracts: `node --test tests/export_overlay_errors_family_contracts.test.js` (passed, 152ms)
- ✅ typecheck platform: `tsc -p tsconfig.checkjs.platform.json` (passed, 1714ms)
- ✅ typecheck services: `tsc -p tsconfig.checkjs.services.json` (passed, 3209ms)
- ✅ typecheck runtime: `tsc -p tsconfig.checkjs.runtime.json` (passed, 1559ms)
- ✅ layer contracts: `node tools/wp_layer_contract.js` (passed, 917ms)
- ✅ public api contracts: `node tools/wp_public_api_contract.js` (passed, 907ms)

### ✅ Order PDF overlay core batch (direct)

- id: `order-pdf-overlay-core`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/order_pdf_overlay_controller_actions_runtime.test.ts tests/order_pdf_overlay_draft_action_feedback_runtime.test.ts tests/order_pdf_overlay_draft_commands_runtime.test.ts tests/order_pdf_overlay_draft_effects_runtime.test.ts tests/order_pdf_overlay_interactions_runtime.test.ts tests/order_pdf_overlay_runtime_export_runtime.test.ts tests/order_pdf_overlay_text_details_lines_runtime.test.ts tests/order_pdf_overlay_text_runtime.test.ts tests/order_pdf_text_details_merge_support_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `2680ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/order_pdf_overlay_controller_actions_runtime.test.ts" "tests/order_pdf_overlay_draft_action_feedback_runtime.test.ts" "tests/order_pdf_overlay_draft_commands_runtime.test.ts" "tests/order_pdf_overlay_draft_effects_runtime.test.ts" "tests/order_pdf_overlay_interactions_runtime.test.ts" "tests/order_pdf_overlay_runtime_export_runtime.test.ts" "tests/order_pdf_overlay_text_details_lines_runtime.test.ts" "tests/order_pdf_overlay_text_runtime.test.ts" "tests/order_pdf_text_details_merge_support_runtime.test.ts"

```

#### stdout

```text
✔ order pdf export actions honor image/gmail busy flags before starting another action (8.0773ms)
✔ order pdf interaction handlers report pointer-cancel failures instead of throwing (0.6859ms)
✔ order pdf export actions reuse cached interactive blob while draft signature is unchanged (1.4512ms)
✔ getOrderPdfOverlayDraftActionToast maps initial-load not-ready to a clear error (1.7998ms)
✔ getOrderPdfOverlayDraftActionToast keeps refresh confirm pending without a toast guess (0.2104ms)
✔ getOrderPdfOverlayDraftActionToast prefers configured inline-confirm success text (0.1968ms)
✔ applyOrderPdfOverlayDraftActionToast emits fallback cancel info when no next draft exists (0.2964ms)
✔ readOrderPdfDraftSeedFromProjectWithDeps reports not-ready when export API is missing (2.0609ms)
✔ loadOrderPdfInitialDraftWithDeps returns seeded draft and detailsDirty state (0.6216ms)
✔ refreshOrderPdfDraftFromProjectWithDeps returns pending confirm when merge policy requires it (0.4737ms)
✔ resolveOrderPdfInlineConfirmAction returns the selected follow-up draft (0.2299ms)
✔ order pdf draft effects derives manual text from legacy manual HTML when detailsFull is false (2.6789ms)
✔ order pdf draft effects derives text/seed from legacy manual HTML when detailsFull is already true (1.0324ms)
✔ order pdf stage/file interactions keep close intent and PDF validation behavior canonical (2.3613ms)
✔ order pdf focus trap cleanup cancels late initial-focus raf work and keyboard guards respect modal state (1.7191ms)
✔ getPdfJsLibFromModule accepts either direct or default PDF.js-like module shapes (1.157ms)
✔ getOrderPdfDraftFn and asExportApiLike only expose callable PDF export hooks (2.0015ms)
✔ bindExportApiFromModule captures the app once and returns null for missing module/app (0.807ms)
✔ order pdf details line helpers parse and collect canonical keyed rows (2.285ms)
✔ order pdf details line helpers preserve inline tails and positioned extras (1.1392ms)
✔ order pdf text fallback html decoder preserves newlines and common entities without a document (1.1264ms)
✔ order pdf text public seam exposes the canonical empty draft defaults (0.9872ms)
✔ order pdf text merge falls back to exact base replacement when no marker document is available (0.5055ms)
✔ order pdf merge support keeps inline suffixes and positioned extras through the canonical support seam (3.0117ms)
✔ order pdf merge support marks ambiguous line merges unsafe when new keyed rows appear (1.3974ms)
✔ order pdf merge support resolves clean detected regions without preserving stale manual leftovers (0.5689ms)
ℹ tests 26
ℹ suites 0
ℹ pass 26
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2575.0359

```

### ✅ Order PDF PDF-render batch (direct)

- id: `order-pdf-pdf-render`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/order_pdf_overlay_pdf_import_runtime.test.ts tests/order_pdf_overlay_pdf_render_canvas_runtime.test.ts tests/order_pdf_overlay_pdf_render_cleanup_runtime.test.ts tests/order_pdf_overlay_pdf_render_runtime.test.ts tests/order_pdf_image_pdf_text_layout_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `2115ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/order_pdf_overlay_pdf_import_runtime.test.ts" "tests/order_pdf_overlay_pdf_render_canvas_runtime.test.ts" "tests/order_pdf_overlay_pdf_render_cleanup_runtime.test.ts" "tests/order_pdf_overlay_pdf_render_runtime.test.ts" "tests/order_pdf_image_pdf_text_layout_runtime.test.ts"

```

#### stdout

```text
✔ [order-pdf] prepared details split can be painted without re-wrapping (2.9438ms)
✔ [order-pdf] prepared layout preserves wrapped lines and visible max-line window (0.3046ms)
✔ [order-pdf] image-pdf details text uses the canonical full-details touched semantics (0.2692ms)
✔ order pdf pdf-import keeps only imported tail pages when both sketch exports are disabled (28.2542ms)
✔ order pdf pdf-import keeps built render page and imported open page when only open-closed export is disabled (7.1662ms)
✔ order pdf pdf-import does not duplicate imported tail pages when both sketch exports stay enabled (4.9327ms)
✔ order pdf pdf-import detects trailing non-form pages and keeps extracted draft flags aligned with imported tails (2.1708ms)
✔ order pdf pdf-import extracts fallback field names through the canonical document-field runtime (29.5483ms)
✔ order pdf pdf-import reads bytes from file-like objects and tolerates read failures (0.5274ms)
✔ order pdf pdf-import falls back to imported open-closed page when the built pdf only contains one generated tail page (5.6296ms)
✔ order pdf pdf-import applies html-only legacy details and notes through the canonical imported-field runtime (1.4181ms)
✔ order pdf canvas render runtime: uses injected browser timers and renders once through the queued canvas path (2.3807ms)
✔ order pdf canvas render runtime: stale timer callback becomes a no-op after cleanup (0.2942ms)
✔ cleanupOrderPdfLoadedDocument clears loaded page/doc state so a strict remount can reload cleanly (0.8993ms)
✔ loadOrderPdfFirstPage reloads when a stale page tick exists without a live pdf document (0.495ms)
✔ loadOrderPdfFirstPage clears doc/task refs when cancellation arrives after the first page resolves (0.2686ms)
✔ order pdf render helpers treat destroyed/aborted worker errors as expected cancellations (2.9484ms)
✔ loadOrderPdfFirstPage clones source bytes before handing them to pdf.js (1.7438ms)
ℹ tests 18
ℹ suites 0
ℹ pass 18
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2006.4291

```

### ✅ Order PDF sketch batch (direct)

- id: `order-pdf-sketch`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/order_pdf_history_shortcuts_runtime.test.ts tests/order_pdf_sketch_draft_persistence_runtime.test.ts tests/order_pdf_sketch_palette_placement_runtime.test.ts tests/order_pdf_sketch_panel_runtime.test.ts tests/order_pdf_sketch_preview_session_runtime.test.ts tests/order_pdf_sketch_shortcuts_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1543ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/order_pdf_history_shortcuts_runtime.test.ts" "tests/order_pdf_sketch_draft_persistence_runtime.test.ts" "tests/order_pdf_sketch_palette_placement_runtime.test.ts" "tests/order_pdf_sketch_panel_runtime.test.ts" "tests/order_pdf_sketch_preview_session_runtime.test.ts" "tests/order_pdf_sketch_shortcuts_runtime.test.ts"

```

#### stdout

```text
✔ [history-ui] suspended history shortcuts are detected from the active overlay element (1.1106ms)
✔ [history-ui] suspended history shortcuts fall back to a document-level overlay marker (0.2737ms)
✔ [order-pdf] draft rehydrate keeps sketch annotations and sketch include flags (2.4504ms)
✔ [order-pdf] refresh-auto preserves sketch annotations while refreshing project details (0.6809ms)
✔ [order-pdf] sketch floating palette placement anchors left of the toolbar trigger without leaving the viewport (1.2308ms)
✔ [order-pdf] sketch floating palette placement clamps inside the viewport when there is not enough space (0.1995ms)
✔ [order-pdf] sketch toolbar placement tracks the visible stage band instead of sticking to the initial viewport slot (1.0306ms)
✔ [order-pdf] sketch toolbar placement falls back to inline mode on narrow viewports (0.1251ms)
✔ [order-pdf] sketch toolbar placement equality treats left-anchored toolbars as real geometry changes (0.1455ms)
✔ [order-pdf] sketch canvas repaint helper suppresses redraws for cloned-but-equal annotation payloads (0.4811ms)
✔ [order-pdf] sketch canvas repaint helper suppresses duplicate redraws until geometry or payload really changes (0.2262ms)
✔ [order-pdf] sketch canvas frame only commits once a real 2d context exists (0.522ms)
✔ [order-pdf] sketch panel runtime builds per-page stroke maps and counts canonically (1.7602ms)
✔ [order-pdf] sketch panel runtime redo stack helpers clone, trim, and clear per page key (0.4494ms)
✔ [order-pdf] sketch panel runtime drawing point collector skips jitter but keeps meaningful motion (0.1546ms)
✔ [order-pdf] sketch panel runtime normalizes client drawing points once per measured host rect (0.2122ms)
✔ [order-pdf] sketch panel runtime appends coalesced client batches without rereading layout per point (0.271ms)
✔ [order-pdf] sketch panel runtime tracks geometric tools as anchor/end drags and emits normalized paths (0.6206ms)
✔ [order-pdf] sketch panel runtime keeps the latest geometric drag point when coalesced batches contain stale history (0.1572ms)
✔ [order-pdf] sketch panel runtime builds per-page text-box maps and folds them into redo counts (0.278ms)
✔ [order-pdf] sketch panel runtime normalizes and compares measured drawing rects canonically (0.3107ms)
✔ [order-pdf] sketch panel runtime reads drawing rects once from the measured host surface (0.3088ms)
✔ [order-pdf] sketch preview session restores the original sketch mode after success (1.3261ms)
✔ [order-pdf] sketch preview session restores the original sketch mode after failure (1.0643ms)
✔ [order-pdf] sketch preview session snapshot captures and restores both sketch and doors-open states (0.2462ms)
✔ [order-pdf] sketch preview session restores the original doors-open state after success (0.1957ms)
✔ [order-pdf] sketch preview session snapshot captures and restores the original camera pose (0.6345ms)
✔ [order-pdf] sketch preview session restores the original camera pose after success (0.2954ms)
✔ [order-pdf] sketch undo shortcut matches english and hebrew ctrl/cmd+z (0.8284ms)
✔ [order-pdf] sketch redo shortcut matches ctrl/cmd+y and ctrl/cmd+shift+z in english and hebrew (0.1939ms)
✔ [order-pdf] sketch history shortcuts are always consumed while the sketch panel is open (0.1884ms)
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1431.4166

```

### ✅ Order PDF export overlay batch (direct)

- id: `order-pdf-export-overlay`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/order_pdf_overlay_export_ops_runtime.test.ts tests/order_pdf_overlay_export_commands_runtime.test.ts tests/order_pdf_overlay_export_singleflight_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1654ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/order_pdf_overlay_export_ops_runtime.test.ts" "tests/order_pdf_overlay_export_commands_runtime.test.ts" "tests/order_pdf_overlay_export_singleflight_runtime.test.ts"

```

#### stdout

```text
✔ loadOrderPdfIntoEditorWithDeps returns success and persists cleaned draft data (2.2458ms)
✔ exportOrderPdfInteractiveWithDeps returns warning-style success when the browser blocks the download (0.404ms)
✔ exportOrderPdfImageWithDeps reports busy before building another image PDF (0.2353ms)
✔ exportOrderPdfViaGmailWithDeps keeps popup-blocked Gmail as a warning result instead of throwing (0.2091ms)
✔ loadOrderPdfIntoEditorWithDeps preserves the real error detail for the toast (0.6749ms)
✔ exportOrderPdfInteractiveWithDeps preserves the real export failure detail (0.3308ms)
✔ loadOrderPdfIntoEditorWithDeps treats html-only extracted legacy details as found fields (0.562ms)
✔ loadOrderPdfIntoEditorWithDeps does not partially commit refs or counters when cleanup fails late (0.4769ms)
✔ order pdf overlay export ops fail fast when rasterization has no document seam (1.3053ms)
✔ order pdf overlay export ops build image attachments through the canonical attachment seam (336.8337ms)
✔ order pdf overlay image rasterization does not repaint sketch annotations already baked into sketch pages (0.8054ms)
✔ order pdf export single-flight reuses duplicate same-key work per app and clears after completion (2.389ms)
✔ order pdf export single-flight returns busy for conflicting keys on the same app and stays independent across apps (0.554ms)
✔ order pdf export single-flight derives stable load keys and maps them back to action kinds (0.5818ms)
ℹ tests 14
ℹ suites 0
ℹ pass 14
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1530.8502

```

### ✅ Order PDF export builders batch (direct)

- id: `order-pdf-export-builders`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/export_order_pdf_builder_draft_runtime.test.ts tests/export_order_pdf_builder_runtime.test.ts tests/export_order_pdf_builder_sketch_annotations_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `2207ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/export_order_pdf_builder_draft_runtime.test.ts" "tests/export_order_pdf_builder_runtime.test.ts" "tests/export_order_pdf_builder_sketch_annotations_runtime.test.ts"

```

#### stdout

```text
✔ resolveOrderPdfString keeps strings but canonicalizes nullish and numeric values (1.1979ms)
✔ resolveOrderPdfOrderDetails prefers manual details only when the draft semantics say so (0.4188ms)
✔ resolveOrderPdfDraft keeps canonical defaults while honoring draft overrides (2.3751ms)
✔ buildOrderPdfInteractiveBlobFromDraft keeps the embedded AcroForm template usable (566.8356ms)
✔ captureOrderPdfCompositeImages applies sketch annotations after base composite capture (2.003ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2077.6785

```

### ✅ Order PDF export capture batch (direct)

- id: `order-pdf-export-capture`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/export_order_pdf_capture_cache_runtime.test.ts tests/export_order_pdf_capture_runtime.test.ts tests/export_order_pdf_ops_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1509ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/export_order_pdf_capture_cache_runtime.test.ts" "tests/export_order_pdf_capture_runtime.test.ts" "tests/export_order_pdf_ops_runtime.test.ts"

```

#### stdout

```text
✔ order pdf capture cache signature falls back cleanly when state is missing or invalid (1.6439ms)
✔ order pdf capture cache returns cloned bytes instead of live cache buffers (1.2391ms)
✔ order pdf capture cache reuses sketch base assets while signature is unchanged (0.888ms)
✔ order pdf capture cache ignores pdf editor draft changes but invalidates on build/config changes (0.439ms)
✔ order pdf capture cache signature ignores sketch-only annotation changes (0.917ms)
✔ export order pdf capture viewer toggles doors/sketch canonically and rasterizes the composed canvas (1.9928ms)
✔ export order pdf capture canvas helpers keep first successful fetch result while tolerating earlier failures (0.4375ms)
✔ order PDF render/sketch composite preserves chest live viewport and screenshot note mapping (1.5246ms)
✔ order PDF open/closed composite preserves corner live viewport and screenshot note mapping (1.0556ms)
✔ export order pdf ops factory exposes stable draft/export surface (1.9548ms)
ℹ tests 10
ℹ suites 0
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1376.5917

```

### ✅ Order PDF export text batch (direct)

- id: `order-pdf-export-text`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/export_order_pdf_sketch_annotations_runtime.test.ts tests/export_order_pdf_text_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1258ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/export_order_pdf_sketch_annotations_runtime.test.ts" "tests/export_order_pdf_text_runtime.test.ts"

```

#### stdout

```text
✔ listOrderPdfSketchStrokes keeps only valid strokes for the requested page (0.8462ms)
✔ paintOrderPdfSketchAnnotationsForPage paints only the active page strokes onto the full composite canvas (0.9899ms)
✔ paintOrderPdfSketchAnnotationsForPage uses destination-out when the persisted stroke is an eraser (0.1374ms)
✔ compositeOrderPdfSketchStrokesOntoBase keeps erasing isolated to the transparent annotation layer (0.3775ms)
✔ paintOrderPdfSketchAnnotationsForPage paints persisted text boxes onto the active page composite (0.5329ms)
✔ export order pdf text ops compose details, bidi, and layout behavior from one canonical seam (3.2ms)
✔ export order pdf text ops keep canonical draft defaults and bidi stabilization behavior (1.3991ms)
✔ export order pdf text uses wardrobe-type depth fallback only when raw depth is missing (0.3036ms)
ℹ tests 8
ℹ suites 0
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1138.2351

```

### ✅ Sketch manual/hover batch (direct)

- id: `sketch-manual-hover`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/sketch_manual_tool_host_runtime.test.ts tests/canvas_picking_layout_edit_flow_manual_runtime.test.ts tests/canvas_picking_manual_layout_sketch_hover_routing_runtime.test.ts tests/canvas_picking_manual_layout_sketch_hover_module_context_runtime.test.ts tests/canvas_picking_manual_layout_sketch_hover_module_preview_runtime.test.ts tests/canvas_picking_manual_layout_sketch_hover_surface_runtime.test.ts tests/canvas_picking_manual_layout_sketch_hover_tools_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1189ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/sketch_manual_tool_host_runtime.test.ts" "tests/canvas_picking_layout_edit_flow_manual_runtime.test.ts" "tests/canvas_picking_manual_layout_sketch_hover_routing_runtime.test.ts" "tests/canvas_picking_manual_layout_sketch_hover_module_context_runtime.test.ts" "tests/canvas_picking_manual_layout_sketch_hover_module_preview_runtime.test.ts" "tests/canvas_picking_manual_layout_sketch_hover_surface_runtime.test.ts" "tests/canvas_picking_manual_layout_sketch_hover_tools_runtime.test.ts"

```

#### stdout

```text
✔ manual-layout flow fills all shelves for a new brace layout through the canonical mutation owner (4.4842ms)
✔ manual-layout flow toggles a rod off and removes only the matching exact preset rod metadata (0.8785ms)
✔ manual-layout hover module context clamps sketch-box placement and preserves width/depth overrides (7.3689ms)
✔ manual-layout hover module context falls back to the corner root config when no cell config exists (1.5167ms)
✔ manual-layout module box preview routes shelf hover through the focused box owner (3.9913ms)
✔ manual-layout module stack preview routes ext drawers through the focused stack owner (2.4582ms)
✔ manual-layout sketch hover keeps selector hits inside module flow even for sketch-box tools (5.9326ms)
✔ manual-layout sketch hover falls back to standalone free placement when no selector is hit (1.187ms)
✔ manual-layout sketch external drawer hover marks standard external drawers for removal only (0.7715ms)
✔ manual-layout sketch internal drawer hover ignores standard external drawers (0.318ms)
✔ module surface hover writes preview-only shelf add results instead of dropping them (5.1674ms)
✔ module preview flow probes existing shelf removal before drawer stack add previews (0.8103ms)
✔ existing vertical remove helper is a no-op when nothing removable is under the cursor (0.5641ms)
✔ door action hover state resolves the nearest door leaf owner with metrics (0.3068ms)
✔ manual-layout sketch hover selector helper keeps selector-local X in selector-parent space and prefers specific selectors (1.9819ms)
✔ manual-layout sketch hover runtime hides layout preview only once when the active tool is not a sketch tool (2.4519ms)
✔ manual-layout sketch hover runtime hides preview + clears hover when mode is not manual-layout (0.4505ms)
✔ manual tool access prefers canonical mode-state value before runtime tools fallback (1.1996ms)
✔ manual tool access falls back to runtime tools when mode-state tool is absent (0.2875ms)
✔ sketch-free host falls back to internal grid maps before the zero-door hinged default host (1.7489ms)
✔ sketch-free host uses the hinged zero-door fallback only when no config or grid host exists (0.1889ms)
ℹ tests 21
ℹ suites 0
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1042.5988

```

### ✅ Sketch box/hover batch (direct)

- id: `sketch-box-hover`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/canvas_picking_sketch_box_runtime_runtime.test.ts tests/canvas_picking_sketch_box_door_preview_runtime.test.ts tests/canvas_picking_sketch_box_doors_runtime.test.ts tests/canvas_picking_sketch_box_overlap_runtime.test.ts tests/sketch_box_hover_click_runtime.test.ts tests/sketch_box_door_visuals_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1175ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/canvas_picking_sketch_box_runtime_runtime.test.ts" "tests/canvas_picking_sketch_box_door_preview_runtime.test.ts" "tests/canvas_picking_sketch_box_doors_runtime.test.ts" "tests/canvas_picking_sketch_box_overlap_runtime.test.ts" "tests/sketch_box_hover_click_runtime.test.ts" "tests/sketch_box_door_visuals_runtime.test.ts"

```

#### stdout

```text
✔ sketch-box door preview stays inert for hinge toggles when the active segment has no door (2.0516ms)
✔ sketch-box door preview resolves canonical remove metadata for an existing double-door pair (18.5566ms)
✔ sketch-box door preview keeps explicit hinge/remove metadata for a single existing door (0.7228ms)
✔ sketch-box doors upsert single-door records through the canonical id factory and segment placement seam (2.194ms)
✔ sketch-box doors toggle hinge for a single door but stay inert when the segment already has a double-door pair (27.0086ms)
✔ sketch-box doors remove a focused segment door without disturbing the other segment (0.5553ms)
✔ resolved module boxes ignore free-placement items and the requested ignoreBoxId (2.5658ms)
✔ vertical center clamp respects module bounds even when desired center is far outside range (0.2205ms)
✔ placement resolution can ignore the edited box id instead of blocking on itself (0.546ms)
✔ placement reports blocked when overlap chain reaches the module ceiling and floor (0.9389ms)
✔ overlap primitive still allows exact edge contact without treating it as overlap (0.186ms)
✔ sketch-box runtime parses width/depth overrides and rejects unrelated tools (1.6291ms)
✔ sketch-box runtime geometry center-snaps and width-clamps inside the module span (0.3946ms)
✔ sketch-box runtime hit scan ignores free-placement boxes and prefers the nearest centered match (0.3741ms)
✔ sketch-box free-placement commit keeps matching/commit/hover mutation policy centralized (0.3153ms)
✔ sketch-box free-placement commit clears hover when the canonical commit finishes without next hover (0.2368ms)
✔ sketch-box free-placement commit stays inert when no canonical host is available (0.2421ms)
✔ sketch-box door visuals forward mirror state, mirror layout, and deep pick meta through the special visual path (3.2866ms)
✔ sketch external drawers hover context loads persisted module stacks for remove/overlap handling (13.7793ms)
✔ free-box content click stays on the free box even when a wardrobe module is behind it (0.8712ms)
✔ free-box external drawers use the box bottom directly and sketch hover blocks drawer collisions across internal and external stacks (2.6275ms)
✔ module sketch hover blocks collisions between internal and external drawer stacks (0.5649ms)
✔ free-box sketch drawer clicks refresh hover state instead of dropping straight through to the module behind (1.0754ms)
✔ module sketch drawer click flow enforces cross-blocking and keeps immediate remove hover after commit (1.0608ms)
✔ module sketch external drawers preview reads the selector front envelope instead of the inner cavity only (1.629ms)
ℹ tests 25
ℹ suites 0
ℹ pass 25
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1050.9917

```

### ✅ Sketch free-box batch (direct)

- id: `sketch-free-boxes`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/canvas_picking_sketch_free_surface_preview_runtime.test.ts tests/canvas_picking_sketch_free_box_content_preview_runtime.test.ts tests/canvas_picking_sketch_free_commit_runtime.test.ts tests/sketch_free_boxes_attach_runtime.test.ts tests/sketch_free_boxes_hover_plane_attach_runtime.test.ts tests/sketch_free_boxes_outside_attach_runtime.test.ts tests/sketch_free_boxes_remove_and_sidewall_runtime.test.ts tests/sketch_free_boxes_room_floor_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1084ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/canvas_picking_sketch_free_surface_preview_runtime.test.ts" "tests/canvas_picking_sketch_free_box_content_preview_runtime.test.ts" "tests/canvas_picking_sketch_free_commit_runtime.test.ts" "tests/sketch_free_boxes_attach_runtime.test.ts" "tests/sketch_free_boxes_hover_plane_attach_runtime.test.ts" "tests/sketch_free_boxes_outside_attach_runtime.test.ts" "tests/sketch_free_boxes_remove_and_sidewall_runtime.test.ts" "tests/sketch_free_boxes_room_floor_runtime.test.ts"

```

#### stdout

```text
✔ sketch-free box content preview short-circuits unsupported content kinds before target scanning (1.6702ms)
✔ sketch-free box content preview keeps door-hinge hover inert when the active segment has no door (2.8576ms)
✔ sketch-free box content preview returns canonical double-door removal metadata for an existing pair (18.3ms)
✔ sketch-free placement hover record keeps canonical host/free-placement fields (2.9249ms)
✔ sketch-free placement commit adds a free-placement box through the canonical modules patch seam (1.3784ms)
✔ sketch-free placement content commit routes free-placement door removal through the canonical content seam (1.992ms)
✔ sketch free surface target scan prefers the candidate with a box-local hit over plain plane-distance fallbacks (2.002ms)
✔ sketch free surface placement preview produces canonical remove hover metadata and front overlay geometry (1.506ms)
✔ free-box attach keeps side attachment stable near upper corner while preserving asymmetric offset (1.9571ms)
✔ free-box attach still prefers top/bottom when the cursor is only outside vertically (0.3125ms)
✔ free-box attach near the lower corners still prefers vertical stacking symmetrically on the left and right (0.3074ms)
✔ free-box attach below still allows a true staircase corner touch before detaching (0.2305ms)
✔ free-box attach still prefers side attachment when the cursor is clearly outside only on X (0.2378ms)
✔ free-box hover attach below falls back to a valid floor-safe side placement when room floor blocks under-stack placement (5.1377ms)
✔ free-box hover attach above keeps plane X even when surface hit lands on the left wall of the target box (0.5874ms)
✔ free-box hover near lower corners stays symmetric when room floor forces the fallback placement sideways (1.0125ms)
✔ free-box hover below at the outer edge still resolves to the floor-safe side placement (0.4931ms)
✔ free-box hover between adjacent boxes keeps the gap column instead of snapping to an outer side wall (0.6806ms)
✔ free-box hover slightly off-center between adjacent boxes still stays in the gap column until a real side target exists (0.5138ms)
✔ free-box outside placement snaps along X when the box overlaps the wardrobe from the side (2.4298ms)
✔ free-box outside placement snaps along Y when the box overlaps the wardrobe from above (0.3804ms)
✔ free-box remove hover works from most of the box interior using plane hit, not only a tiny center point (2.217ms)
✔ free-box outside placement snaps flush to the wardrobe side wall instead of requiring a large empty gap (0.7697ms)
✔ free-box placement still remains available when the box is fully inside the wardrobe body (0.2798ms)
✔ free-box placement above the wardrobe stays outside above the roof instead of being clamped back inside (0.3206ms)
✔ free-box placement at side height above the wardrobe still remains available as outside free placement (0.2233ms)
✔ free-box hover below the room floor clamps onto the floor instead of sinking under it (1.9275ms)
✔ free-box hover below the wardrobe snaps to room floor even when still overlapping the wardrobe width (0.2499ms)
ℹ tests 28
ℹ suites 0
ℹ pass 28
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 956.6985

```

### ✅ Sketch render/visuals batch (direct)

- id: `sketch-render-visuals`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/render_interior_sketch_visuals_runtime.test.ts tests/render_interior_sketch_fronts_runtime.test.ts tests/render_interior_sketch_layout_dimensions_runtime.test.ts tests/render_interior_sketch_layout_geometry_runtime.test.ts tests/sketch_front_visual_state_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `725ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/render_interior_sketch_visuals_runtime.test.ts" "tests/render_interior_sketch_fronts_runtime.test.ts" "tests/render_interior_sketch_layout_dimensions_runtime.test.ts" "tests/render_interior_sketch_layout_geometry_runtime.test.ts" "tests/sketch_front_visual_state_runtime.test.ts"

```

#### stdout

```text
✔ render sketch box fronts reuses one mirror material across mirrored external drawers (4.1179ms)
✔ renderSketchFreeBoxDimensions keeps height on the right and depth on the left (1.0173ms)
✔ renderSketchFreeBoxDimensionOverlays groups adjacent entries and renders merged width plus segment widths (1.4159ms)
✔ renderSketchFreeBoxDimensionOverlays keeps a hairline placement gap from inflating the merged total width label (0.2768ms)
✔ render interior sketch layout geometry clamps box size and center inside the internal span (1.951ms)
✔ render interior sketch layout geometry keeps free-box vertical slack and normalized inner geometry (0.6439ms)
✔ render interior sketch layout dividers sort explicit dividers and still honor legacy centered fallbacks (1.4319ms)
✔ render interior sketch layout resolves content segments from divider-separated spans (1.0974ms)
✔ render interior sketch visuals resolve mirror state ahead of curtain and keep mirror layouts (2.9665ms)
✔ render interior sketch visuals fall back to glass + curtain from part colors when no mirror override exists (0.3192ms)
✔ render interior sketch visuals expose callable factories only for function inputs (0.2368ms)
✔ sketch front visual state reuses canonical full-door mirror/glass maps for split door segments (3.4921ms)
ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 609.3978

```

### ✅ Cloud sync lifecycle batch (direct)

- id: `cloud-sync-lifecycle`
- category: `verify`
- command: `node tools/wp_serial_tests.mjs --batch-size 3 --heartbeat-ms 10000 --timeout-ms 120000 --failed-files-path .artifacts/cloud-sync-surfaces.lifecycle.failed.txt --timings-path .artifacts/cloud-sync-surfaces.lifecycle.timings.json tests/cloud_sync_panel_actions_runtime.test.js tests/cloud_sync_action_feedback_runtime.test.ts tests/cloud_sync_access_runtime.test.ts tests/cloud_sync_install_support_runtime.test.ts tests/cloud_sync_lifecycle_install_cleanup_runtime.test.js tests/cloud_sync_actions_runtime.test.ts tests/cloud_sync_async_singleflight_owner_runtime.test.ts tests/cloud_sync_config_runtime.test.ts tests/cloud_sync_delete_temp_runtime.test.ts tests/cloud_sync_lifecycle_attention_runtime.test.ts tests/cloud_sync_lifecycle_realtime_runtime.test.ts tests/cloud_sync_lifecycle_start_idempotent_runtime.test.ts tests/cloud_sync_lifecycle_realtime_support_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `4967ms`

#### stderr

```text
[serial-tests batch 1/5] 3 files (tests/cloud_sync_panel_actions_runtime.test.js … tests/cloud_sync_access_runtime.test.ts)
[serial-tests batch 1/5] ok (659ms)
[serial-tests batch 2/5] 3 files (tests/cloud_sync_install_support_runtime.test.ts … tests/cloud_sync_actions_runtime.test.ts)
[serial-tests batch 2/5] ok (1.8s)
[serial-tests batch 3/5] 3 files (tests/cloud_sync_async_singleflight_owner_runtime.test.ts … tests/cloud_sync_delete_temp_runtime.test.ts)
[serial-tests batch 3/5] ok (589ms)
[serial-tests batch 4/5] 3 files (tests/cloud_sync_lifecycle_attention_runtime.test.ts … tests/cloud_sync_lifecycle_start_idempotent_runtime.test.ts)
[serial-tests batch 4/5] ok (1.4s)
[serial-tests batch 5/5] 1 file (tests/cloud_sync_lifecycle_realtime_support_runtime.test.ts)
[serial-tests batch 5/5] ok (467ms)
[serial-tests] completed 13 files in 4.9s across 5 batches

```

#### stdout

```text
✔ cloud sync access reads canonical services panelApi and ignores legacy root alias (1.087ms)
✔ cloud sync access ensures canonical service state on services root (0.3567ms)
✔ cloud sync access exposes test hooks through canonical service state only (0.2049ms)
✔ cloud sync feedback reporters emit canonical toasts and preserve silent success semantics where required (2.3285ms)
✔ cloud sync feedback prefers preserved error messages when available (0.2299ms)
✔ cloud sync panel actions derive stable snapshot state and route handlers through the canonical ui controller (64.2111ms)
✔ cloud sync panel actions fall back to derived status when panel snapshot api is unavailable (17.0821ms)
ℹ tests 7
ℹ suites 0
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 608.8673
✔ cloud sync actions return canonical room/share, site2 tabs gate, sketch sync, cleanup, and floating pin results with feedback mapping (1.9422ms)
✔ cloud sync actions keep local site2 handling and report missing cloud mutation services explicitly (1.2325ms)
✔ cloud sync install support preserves backward compatibility for untagged published dispose refs (0.7875ms)
✔ cloud sync install support stamps dispose epoch and reattaches it when cleanup preserves dispose (1.0371ms)
✔ cloud sync install support does fallback cleanup when the published dispose ref belongs to a stale epoch (0.3287ms)
✔ cloud sync install support clears only canonical published slots and preserves unrelated state (0.7739ms)
✔ cloud sync install support preserves canonical test hooks by default while clearing published slots (0.2065ms)
✔ cloud sync install support drops test hooks when cleanup opts out of hook preservation (0.1706ms)
✔ cloud_sync lifecycle: double install/uninstall stays idempotent and cleans listeners/wrappers (12.6794ms)
✔ cloud_sync lifecycle: no timer/listener leaks after dispose (1.5142ms)
✔ cloud_sync lifecycle: installing a second app does not dispose the first app lifecycle (2.0378ms)
✔ cloud_sync lifecycle: realtime reconnect/dispose race is ignored after dispose (2.078ms)
✔ cloud_sync lifecycle: dispose clears published public state but preserves test hooks (1.0391ms)
✔ cloud_sync lifecycle: invalidated publication epoch blocks stale polling and listener-driven pulls even before cleanup finishes (1.1863ms)
✔ cloud_sync lifecycle: stale held dispose refs do not clear newer public state (2.3584ms)
✔ cloud_sync lifecycle: stale install stops initial pull fanout and never starts a new lifecycle after reinstall wins mid-bootstrap (1.5673ms)
✔ cloud_sync lifecycle: failed reinstall clears stale public state when config disappears (0.7747ms)
ℹ tests 17
ℹ suites 0
ℹ pass 17
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1738.8874
✔ owned cloud-sync family flight registers immediately for synchronous re-entry reuse (1.4316ms)
✔ owned cloud-sync family flight returns busy for synchronous conflicting re-entry (1.1523ms)
✔ runCloudSyncOwnedAsyncFamilySingleFlight returns the active promise for conflicting keys without rerunning work (0.2883ms)
✔ readCfg normalizes deps config and clamps site2 sketch max age (1.7158ms)
✔ cloud sync config browser helpers keep URL params and site2 detection canonical (0.8209ms)
✔ cloud sync config shared helpers keep rest URL and headers canonical (0.1603ms)
✔ cloud sync delete temp removes unlocked colors, sanitizes payload, updates local state, and sends realtime hint (3.2601ms)
✔ cloud sync delete temp does not stamp pull activity when the preflight row read fails (0.4315ms)
✔ cloud sync delete temp preserves thrown message, reports nonfatal, and resets push flag on errors (0.3977ms)
✔ cloud sync delete temp reuses duplicate same-kind writes and reports busy for conflicting main-write work (0.6254ms)
✔ cloud sync delete-temp tracks preflight pull activity and settled push activity canonically (0.6726ms)
ℹ tests 11
ℹ suites 0
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 541.3528
✔ cloud sync attention pulls still fire on focus when eligible (2.494ms)
✔ cloud sync attention pulls stay quiet right after a recent remote pull and resume after cooldown (0.3732ms)
✔ cloud sync attention pulls stay quiet while offline or hidden and catch up on visible return (0.44ms)
✔ cloud sync attention online pull does not stay blocked by subscribed status without a live channel (0.2845ms)
✔ cloud sync attention online handler reports pull failures without breaking later attention events (0.6413ms)
✔ cloud sync diagnostics storage listener republishes status only when the diagnostics flag actually changes (0.4441ms)
✔ cloud sync attention pulls stay inert after the lifecycle guard flips stale before cleanup (0.3411ms)
✔ cloud sync diagnostics storage listener stays inert after the lifecycle guard flips stale (0.3118ms)
✔ cloud sync realtime lifecycle cleans refs and preserves real error message on subscribe failure (3.4729ms)

...
[trimmed 2488 chars]
```

### ✅ Cloud sync main-row batch (direct)

- id: `cloud-sync-main-row`
- category: `verify`
- command: `node tools/wp_serial_tests.mjs --batch-size 3 --heartbeat-ms 10000 --timeout-ms 120000 --failed-files-path .artifacts/cloud-sync-surfaces.main-row.failed.txt --timings-path .artifacts/cloud-sync-surfaces.main-row.timings.json tests/cloud_sync_main_row_payload_dedupe_runtime.test.ts tests/cloud_sync_main_row_runtime.test.ts tests/cloud_sync_main_write_singleflight_runtime.test.ts tests/cloud_sync_mutation_commands_runtime.test.ts tests/cloud_sync_mutation_commands_singleflight_runtime.test.ts tests/cloud_sync_owner_context_runtime.test.ts tests/cloud_sync_status_install_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `2258ms`

#### stderr

```text
[serial-tests batch 1/3] 3 files (tests/cloud_sync_main_row_payload_dedupe_runtime.test.ts … tests/cloud_sync_main_write_singleflight_runtime.test.ts)
[serial-tests batch 1/3] ok (494ms)
[serial-tests batch 2/3] 3 files (tests/cloud_sync_mutation_commands_runtime.test.ts … tests/cloud_sync_owner_context_runtime.test.ts)
[serial-tests batch 2/3] ok (1.2s)
[serial-tests batch 3/3] 1 file (tests/cloud_sync_status_install_runtime.test.ts)
[serial-tests batch 3/3] ok (478ms)
[serial-tests] completed 7 files in 2.2s across 3 batches

```

#### stdout

```text
✔ cloud sync main row skips remote apply churn when newer rows carry the same payload (2.3448ms)
✔ cloud sync main row still applies remote payloads when the effective collections actually change (1.2022ms)
✔ cloud sync main row treats missing color-order payloads as a no-op when the effective applied state is unchanged (0.2763ms)
✔ cloud sync main row seeds a missing row from local collections on the initial pull (2.9959ms)
✔ cloud sync main row initial seed reuses returned representation when the upsert already returns the row (0.5821ms)
✔ cloud sync main row push publishes changed collections once and skips identical repeats (2.0812ms)
✔ cloud sync main row push reuses returned representation instead of forcing a follow-up row fetch (0.7763ms)
✔ cloud sync main row reuses the same pending push promise for duplicate direct pushes (1.0085ms)
✔ cloud sync main row pull applies newer remote payloads into local storage (0.803ms)
✔ cloud sync main row coalesces repeated pending pull timers and cancels stale delayed pull on direct pull (0.6348ms)
✔ cloud sync main row coalesces repeated pending push timers and cancels stale delayed push on direct push (0.3955ms)
✔ cloud sync main row push applies settled remote payload locally without forcing a follow-up pull (0.6089ms)
✔ cloud sync main row collapses pull retries during a push into one post-push follow-up pull (0.7954ms)
✔ cloud sync main row keeps the earliest queued post-push pull delay across mixed blocked requests (0.6077ms)
✔ cloud sync main row notifies push-settled listeners only after the push flight has cleared (0.5432ms)
✔ cloud sync main row keeps the earliest queued post-pull delay across mixed blocked requests (0.4296ms)
✔ cloud sync main row shares app-scoped push ownership across main-row instances for the same App (0.4568ms)
✔ cloud sync main row rearms a delayed pull when a newer immediate request needs an earlier run (0.1874ms)
✔ cloud sync main row collapses pull requests that arrive while a pull is already in flight into one post-flight follow-up (1.4237ms)
✔ cloud sync main row preserves one follow-up push request raised while a push is already in flight (0.6651ms)
✔ cloud sync main row parks recovery pulls behind a debounced pending push so local changes flush first (0.7701ms)
✔ cloud sync main row preserves canonical main pull reasons when pull-all and realtime requests coalesce (0.3612ms)
✔ cloud sync main row keeps canonical main pull reasons across a push-blocked follow-up pull (0.7248ms)
✔ cloud sync main-write single-flight reuses duplicate same-key work and blocks conflicting keys (0.9811ms)
✔ cloud sync main-write single-flight shares app-scoped ownership across instances for the same owner (0.3448ms)
ℹ tests 25
ℹ suites 0
ℹ pass 25
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 443.2446
✔ cloud sync mutation commands await confirm-backed cleanup flows and preserve canonical results (2.38ms)
✔ cloud sync mutation cleanup commands return cancelled when confirm is declined (0.3757ms)
✔ cloud sync mutation cleanup commands preserve confirm failures instead of flattening them to cancel (0.3582ms)
✔ cloud sync delete-temp commands reuse one pending models cleanup flow per app (2.1918ms)
✔ cloud sync delete-temp commands block conflicting cleanup family actions while one is pending (0.4154ms)
✔ cloud sync owner context composes room helpers and per-tab client identity through dedicated seams (4.702ms)
✔ cloud sync owner context uses the public room for gate rows when no room URL is selected (0.5494ms)
✔ cloud sync owner context starts disabled realtime with an empty channel surface (0.3701ms)
✔ cloud sync runtime snapshot key canonicalizes drifted runtime branches before publish gating (0.1549ms)
✔ cloud sync owner context memoizes runtime status publishes and keeps the canonical status surface live (0.593ms)
✔ cloud sync owner context keeps held status refs alive across owner reinstall (0.661ms)
✔ cloud sync owner context ignores stale status publishes after a newer owner takes over (0.5974ms)
✔ cloud sync owner context ignores late status publishes after publication teardown (0.8054ms)
✔ cloud sync owner context ignores stale publication cleanup after a newer owner takes over (0.5152ms)
✔ cloud sync owner context tombstones held status refs after published-state cleanup (0.4872ms)
✔ cloud sync owner context self-heals leaked enumerable status markers even when the runtime snapshot is unchanged (0.372ms)
✔ cloud sync owner context self-heals drifted canonical status surfaces even when runtime snapshot is unchanged (0.3106ms)
ℹ tests 17
ℹ suites 0
ℹ pass 17
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1154.4583
✔ cloud sync status install keeps canonical root and nested branches stable across refreshes (1.1312ms)
✔ cloud sync status install tombstones held status refs during surface deactivation (0.2044ms)
✔ cloud sync status freshnes
...
[trimmed 506 chars]
```

### ✅ Cloud sync panel-install batch (direct)

- id: `cloud-sync-panel-install`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/cloud_sync_panel_api_install_healing_runtime.test.ts tests/cloud_sync_panel_api_surface_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1287ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/cloud_sync_panel_api_install_healing_runtime.test.ts" "tests/cloud_sync_panel_api_surface_runtime.test.ts"

```

#### stdout

```text
✔ cloud sync panel api install healing keeps canonical public surface stable and rebinds live subscriptions on reinstall (8.0707ms)
✔ cloud sync panel api install heals legacy installed markers that only preserved stale public callables (0.4551ms)
✔ cloud sync panel api install ignores stale publication epochs (0.6124ms)
✔ cloud sync panel api direct cleanup invalidation blocks stale panel republish from the old epoch (1.0524ms)
✔ cloud sync panel api deactivation tombstones held refs and detaches live subscriptions during published-state cleanup (0.8702ms)
✔ cloud sync panel api public surface clones runtime status and snapshot reads and isolates bridged listener mutation (0.684ms)
✔ cloud sync panel api mutation refs fall back to typed not-installed results when the impl does not expose mutation methods (0.4538ms)
✔ cloud sync panel api exposes stable room/share/tabs-gate runtime surface and publishes panel snapshots (5.283ms)
✔ cloud sync panel api runtime status clone strips drifted realtime/polling extras (0.4436ms)
✔ cloud sync panel api runtime-status getter republishes only when diagnostics state actually changes (0.3286ms)
✔ cloud sync panel api diagnostics setter stays no-op when the stored diagnostics value is unchanged (0.4766ms)
ℹ tests 11
ℹ suites 0
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1163.3099

```

### ✅ Cloud sync panel-controller batch (direct)

- id: `cloud-sync-panel-controller`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/cloud_sync_panel_api_controller_fallback_runtime.test.ts tests/cloud_sync_panel_api_failures_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1206ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/cloud_sync_panel_api_controller_fallback_runtime.test.ts" "tests/cloud_sync_panel_api_failures_runtime.test.ts"

```

#### stdout

```text
✔ cloud sync panel api republishes panel snapshot even when floating pin command throws (3.4481ms)
✔ cloud sync panel api republishes tabs-gate snapshot with local optimistic state when command throws (1.0724ms)
✔ cloud sync panel api preserves thrown messages for controller-facing commands (6.0232ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1098.1499

```

### ✅ Cloud sync panel-subscriptions batch (direct)

- id: `cloud-sync-panel-subscriptions`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/cloud_sync_panel_api_singleflight_runtime.test.ts tests/cloud_sync_panel_api_subscriptions_runtime.test.ts tests/cloud_sync_panel_api_support_singleflight_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1274ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/cloud_sync_panel_api_singleflight_runtime.test.ts" "tests/cloud_sync_panel_api_subscriptions_runtime.test.ts" "tests/cloud_sync_panel_api_support_singleflight_runtime.test.ts"

```

#### stdout

```text
✔ cloud sync panel api single-flights duplicate inflight async commands and returns busy for conflicting family targets (4.8369ms)
✔ cloud sync panel api shares app-scoped single-flight ownership across api instances for the same App (1.1897ms)
✔ cloud sync panel api fans out panel and tabs-gate source subscriptions once and clones snapshots per listener (3.5623ms)
✔ cloud sync async single-flight runner blocks re-entrant duplicate starts before registration settles (0.7651ms)
✔ cloud sync async family runner blocks re-entrant conflicting targets before the first run settles (1.136ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1157.9234

```

### ✅ Cloud sync panel-snapshots batch (direct)

- id: `cloud-sync-panel-snapshots`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/cloud_sync_panel_snapshot_controller_runtime.test.ts tests/cloud_sync_panel_snapshot_dedupe_runtime.test.ts tests/cloud_sync_panel_snapshot_fallback_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `1372ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/cloud_sync_panel_snapshot_controller_runtime.test.ts" "tests/cloud_sync_panel_snapshot_dedupe_runtime.test.ts" "tests/cloud_sync_panel_snapshot_fallback_runtime.test.ts"

```

#### stdout

```text
✔ cloud sync panel snapshot controller isolates panel listener failures and reports source-dispose errors (4.1734ms)
✔ cloud sync panel snapshot controller isolates tabs-gate listener failures and reports source-dispose errors (1.0845ms)
✔ cloud sync panel snapshot controller suppresses duplicate panel publishes from source and command paths (3.0841ms)
✔ cloud sync panel snapshot controller suppresses duplicate tabs-gate publishes and avoids fallback timer churn for unchanged snapshots (0.7357ms)
✔ cloud sync panel snapshot controller does not create fallback timer until a tabs-gate subscriber exists (0.3183ms)
✔ cloud sync panel snapshot controller falls back to timer-driven tabs-gate minute updates when no source subscription exists (3.8519ms)
ℹ tests 6
ℹ suites 0
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1263.6309

```

### ✅ Cloud sync sync-ops batch (direct)

- id: `cloud-sync-sync-ops`
- category: `verify`
- command: `node tools/wp_serial_tests.mjs --batch-size 3 --heartbeat-ms 10000 --timeout-ms 120000 --failed-files-path .artifacts/cloud-sync-surfaces.sync-ops.failed.txt --timings-path .artifacts/cloud-sync-surfaces.sync-ops.timings.json tests/cloud_sync_pull_coalescer_runtime.test.ts tests/cloud_sync_realtime_support_runtime.test.ts tests/cloud_sync_remote_push_singleflight_runtime.test.ts tests/cloud_sync_rest_runtime.test.ts tests/cloud_sync_room_commands_runtime.test.ts tests/cloud_sync_site2_sketch_behavior_runtime.test.ts tests/cloud_sync_sketch_ops_runtime.test.ts tests/cloud_sync_sketch_pull_load_runtime.test.ts tests/cloud_sync_support_runtime.test.ts`
- status: **passed**
- exit code: `0`
- duration: `2406ms`

#### stderr

```text
[serial-tests batch 1/3] 3 files (tests/cloud_sync_pull_coalescer_runtime.test.ts … tests/cloud_sync_remote_push_singleflight_runtime.test.ts)
[serial-tests batch 1/3] ok (576ms)
[serial-tests batch 2/3] 3 files (tests/cloud_sync_rest_runtime.test.ts … tests/cloud_sync_site2_sketch_behavior_runtime.test.ts)
[serial-tests batch 2/3] ok (1.1s)
[serial-tests batch 3/3] 3 files (tests/cloud_sync_sketch_ops_runtime.test.ts … tests/cloud_sync_support_runtime.test.ts)
[serial-tests batch 3/3] ok (597ms)
[serial-tests] completed 9 files in 2.3s across 3 batches

```

#### stdout

```text
✔ cloud sync pull coalescer collapses burst triggers into one run and supports cancel (3.7302ms)
✔ cloud sync pull coalescer keeps diag reasons bounded and collapses duplicate reason labels (0.5347ms)
✔ cloud sync pull coalescer normalizes blank scope labels for fallback reasons and diagnostics (0.4334ms)
✔ cloud sync pull coalescer keeps an earlier pending timer instead of rearming on later burst triggers (1.117ms)
✔ cloud sync pull coalescer rearms when a newer trigger asks for an earlier immediate run (0.2907ms)
✔ cloud sync pull coalescer parks queued work during main-row push and resumes once the push settles (0.3295ms)
✔ cloud sync pull coalescer keeps one fallback retry timer when main-row push is active but no push-settled hook exists (0.3351ms)
✔ cloud sync pull coalescer subscribes to push-settled only while blocked and can resubscribe after reuse (0.394ms)
✔ cloud sync pull coalescer cancel clears stale pending reasons and counts before the next burst (0.3259ms)
✔ cloud sync pull coalescer rearms directly to the debounced due time after main-row push settles (0.4341ms)
✔ cloud sync pull coalescer keeps queued follow-up work on one canonical timer after an in-flight run settles (0.3825ms)
✔ cloud sync pull coalescer reports synchronous run failures and recovers for later work (0.3979ms)
✔ cloud sync pull coalescer drops queued work once the owner turns stale before the timer fires (0.1997ms)
✔ cloud sync pull coalescer drops queued follow-up work when owner becomes stale during an in-flight run (0.3112ms)
✔ cloud sync pull coalescer drops queued follow-up work when suppression starts during an in-flight run (0.2959ms)
✔ cloud sync pull coalescer clears inFlight immediately on synchronous run throws so a same-tick retrigger is accepted (0.2901ms)
✔ cloud sync realtime hint dedupes per scope/row/room and resumes after the dedupe window (1.5894ms)
✔ cloud sync realtime connecting/failure/dispose markers share one canonical branch owner (0.7453ms)
✔ cloud sync realtime timeout marker clears stale channel and restarts polling on the canonical owner (0.2868ms)
✔ cloud sync realtime transition markers collapse polling + realtime status publication to one canonical publish (0.4376ms)
✔ cloud sync realtime subscribed marker only issues a gap pull after a resubscribe (0.7192ms)
✔ cloud sync realtime subscribed gap refresh respects the canonical recent-pull gate on resubscribe (0.3676ms)
✔ cloud sync realtime beforeunload cleanup removes the current channel through the installed listener (0.2727ms)
✔ cloud sync realtime disconnected marker resets subscribed state and restarts polling with the why label (0.2631ms)
✔ cloud sync realtime disconnected marker can publish a preserved error in one canonical transition (0.2202ms)
✔ cloud sync realtime disposed marker clears stale errors from the final disabled snapshot (0.2887ms)
✔ cloud sync realtime hint does not send when realtime is explicitly disabled even if a subscribed channel string remains (0.1625ms)
✔ cloud sync realtime hint does not send when the subscribed status no longer has a live channel (0.1404ms)
✔ cloud sync realtime hint suppresses invalid/blank scopes and dedupes normalized scope/row values (0.2031ms)
✔ cloud sync floating remote push single-flights duplicate targets and returns busy for conflicting targets (2.1745ms)
✔ cloud sync tabs-gate remote push single-flights duplicate targets and returns busy for conflicting targets (0.6283ms)
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 523.4786
✔ cloud sync rest preserves control-row payload fields on getRow (2.0103ms)
✔ cloud sync rest getRow accepts array responses and returns null for missing rows without object-only 406 semantics (0.3937ms)
✔ cloud sync rest getRow returns null for empty array responses (0.8942ms)
✔ cloud sync rest preserves tabs gate payload fields on upsert response (0.5115ms)
✔ cloud sync rest sanitizes saved collections while preserving control rows and extra payload fields (1.2164ms)
✔ cloud sync room commands derive status, private room targets, and share-link copy fallbacks canonically (1.9822ms)
✔ cloud sync room mode preserves thrown error messages (0.2336ms)
✔ cloud sync share-link copy preserves clipboard error messages when prompt fallback is unavailable (0.228ms)
✔ cloud sync room/share-link commands normalize non-Error throwables into stable messages (0.274ms)
✔ cloud sketch initial catchup is site2-only even when the remote row is fresh (4.4704ms)
✔ cloud sketch stale initial catchup does not block the next fresh site2 update (0.6822ms)
ℹ tests 11
ℹ suites 0
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1098.9457
[toast] success סקיצה חדשה התעדכנה
[toast] success סקיצה חדשה התעדכנה
[toast] success סקיצה חדשה התעדכנה
✔ cloud sync sketch pull only toasts success when project load really succeeds (3.5582ms)
✔ cloud sync sk
...
[trimmed 2450 chars]
```

### ✅ Cloud sync tabs-ui batch (direct)

- id: `cloud-sync-tabs-ui`
- category: `verify`
- command: `node tools/wp_run_tsx_tests.mjs tests/cloud_sync_sync_pin_command_runtime.test.ts tests/cloud_sync_tabs_gate_command_runtime.test.ts tests/cloud_sync_tabs_gate_runtime.test.ts tests/cloud_sync_tabs_gate_timer_dedupe_runtime.test.ts tests/cloud_sync_ui_action_controller_runtime.test.js`
- status: **passed**
- exit code: `0`
- duration: `3011ms`

#### stderr

```text
[run-tsx-tests] C:\Program Files\nodejs\node.exe --import tsx --test "tests/cloud_sync_sync_pin_command_runtime.test.ts" "tests/cloud_sync_tabs_gate_command_runtime.test.ts" "tests/cloud_sync_tabs_gate_runtime.test.ts" "tests/cloud_sync_tabs_gate_timer_dedupe_runtime.test.ts" "tests/cloud_sync_ui_action_controller_runtime.test.js"

```

#### stdout

```text
✔ floating sketch sync pin command becomes a no-op when state is unchanged (2.6538ms)
✔ floating sketch sync pin command rolls back local state on push failure (0.5092ms)
✔ floating sketch sync pin toggle command flips the current state (0.3432ms)
✔ floating sketch sync pin command preserves push failure message (0.313ms)
✔ floating sketch sync pin command single-flights duplicate targets and returns busy for conflicting targets (0.4407ms)
✔ cloud sync tabs gate command skips redundant refreshes but extends stale opens (2.2704ms)
✔ cloud sync tabs gate command rolls back on push failure and reports final state (1.7723ms)
✔ cloud sync tabs gate toggle command flips the current ref state (0.4243ms)
✔ cloud sync tabs gate command preserves push failure message (0.4154ms)
✔ cloud sync tabs gate command single-flights duplicate targets and returns busy for conflicting targets (0.5737ms)
✔ cloud sync tabs gate closes stale site2 UI on initial pull miss (4.5079ms)
✔ cloud sync tabs gate uses the current gate base room for push and pull (1.0564ms)
✔ cloud sync tabs gate defaults to the public room when no room URL is selected (0.5848ms)
✔ cloud sync tabs gate public-room push is visible to site2 public-room pull (1.6514ms)
✔ cloud sync tabs gate site2 ignores local open fallback when cloud row is missing (0.6505ms)
✔ cloud sync tabs gate snapshot subscription tracks minute boundaries and expiry without store polling (2.0064ms)
✔ cloud sync tabs gate direct push reports controller-only canonically on site2 (0.3642ms)
✔ cloud sync tabs gate push shares app-scoped ownership across ops instances for the same App (0.6165ms)
✔ cloud sync tabs gate reuses snapshot/expiry timers and suppresses duplicate snapshot fanout for unchanged state (4.9623ms)
✔ [cloud-sync-ui-controller] panel/sidebar/dock actions flow through one canonical reporter seam (2117.5769ms)
✔ [cloud-sync-ui-controller] app-scoped single-flight dedupes same cloud actions across controllers and reports busy on conflicting control mutations (0.8171ms)
✔ [cloud-sync-ui-controller] thrown commands downgrade to canonical error payloads (0.8574ms)
✔ [cloud-sync-ui-controller] tabs-gate meta is cloned before async command invocation (0.2342ms)
ℹ tests 23
ℹ suites 0
ℹ pass 23
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2895.0686

```

### ✅ Playwright smoke suite listing

- id: `e2e-list`
- category: `e2e`
- command: `npm run e2e:smoke:list`
- status: **passed**
- exit code: `0`
- duration: `1506ms`

#### stdout

```text

> e2e:smoke:list
> playwright test -c playwright.config.ts --list

Listing tests:
  [setup] › app_shell_warmup.setup.ts:5:1 › warm app shell before parallel smoke workers
  [chromium] › authoring_builds.spec.ts:477:3 › Playwright authoring build coverage › structure, design, and interior authoring steps trigger real build and render work
  [chromium] › authoring_builds.spec.ts:544:3 › Playwright authoring build coverage › authored structure, design, and interior state rebuilds cleanly after project load
  [chromium] › authoring_builds.spec.ts:607:3 › Playwright authoring build coverage › corner cabinet authoring triggers real build work and roundtrips through project load
  [chromium] › authoring_builds.spec.ts:664:3 › Playwright authoring build coverage › chest authoring triggers real build work and roundtrips through project load
  [chromium] › authoring_builds.spec.ts:719:3 › Playwright authoring build coverage › library authoring triggers real build work and roundtrips through project load
  [chromium] › authoring_builds.spec.ts:774:3 › Playwright authoring build coverage › library door count edits rebuild without loops and keep upper/lower module defaults stable
  [chromium] › authoring_builds.spec.ts:813:3 › Playwright authoring build coverage › sliding structure authoring rebuilds cleanly after project load
  [chromium] › authoring_builds.spec.ts:879:3 › Playwright authoring build coverage › stack split and per-cell dimensions rebuild cleanly and keep lower stack isolated
  [chromium] › canvas_pointer_parity.spec.ts:15:3 › Canvas pointer parity smoke › browser hover and click apply cell dimensions to the same canvas target
  [chromium] › cloud_sync_reconnect.spec.ts:29:3 › Cloud Sync browser reconnect smoke › offline to online browser transition keeps the panel stable and sync usable
  [chromium] › resilience.spec.ts:24:3 › Playwright resilience flows › invalid project load reports failure, keeps the app stable, and records an error perf entry
  [chromium] › resilience.spec.ts:50:3 › Playwright resilience flows › restore-last-session without autosave stays unavailable and keeps user state
  [chromium] › resilience.spec.ts:69:3 › Playwright resilience flows › invalid settings backup import fails cleanly, preserves existing state, and records an error perf entry
  [chromium] › smoke.spec.ts:24:3 › Playwright smoke flows › boot, viewport, tabs and render toggles stay stable
  [chromium] › smoke.spec.ts:50:3 › Playwright smoke flows › header save-load roundtrip restores project name
  [chromium] › smoke.spec.ts:71:3 › Playwright smoke flows › header reset default replaces the current project cleanly
  [chromium] › smoke.spec.ts:82:3 › Playwright smoke flows › order pdf overlay opens from export and header with stable toolbar
  [chromium] › smoke.spec.ts:98:3 › Playwright smoke flows › settings tab keeps cloud-sync surface interactive
  [chromium] › user_paths.spec.ts:113:3 › Playwright real user paths › primary user journey records canonical runtime perf metrics
  [chromium] › user_paths.spec.ts:175:3 › Playwright real user paths › repeated export and pdf pressure preserves user state
  [chromium] › user_paths.spec.ts:213:3 › Playwright real user paths › cabinet core dimensions, colors, and sketch survive project roundtrip
  [chromium] › user_paths.spec.ts:261:3 › Playwright real user paths › cabinet authoring options survive project roundtrip
  [chromium] › user_paths.spec.ts:311:3 › Playwright real user paths › project roundtrip preserves authored door and drawer layout maps
  [chromium] › user_paths.spec.ts:353:3 › Playwright real user paths › project roundtrip preserves authored door and drawer layout scenario matrix
  [chromium] › user_paths.spec.ts:400:3 › Playwright real user paths › settings backup import and restore-last-session recover real user state
Total: 26 tests in 7 files

```

### ✅ Playwright browser preflight

- id: `e2e-preflight`
- category: `e2e`
- command: `npm run e2e:smoke:preflight`
- status: **passed**
- exit code: `0`
- duration: `1183ms`

#### stdout

```text

> e2e:smoke:preflight
> node tools/wp_playwright_preflight.js

[WardrobePro] Playwright Chromium preflight passed (using system Chromium at C:\Program Files\Google\Chrome\Application\chrome.exe).

```

### ✅ Playwright smoke run

- id: `e2e-smoke-run`
- category: `e2e`
- command: `npm run e2e:smoke`
- status: **passed**
- exit code: `0`
- duration: `141050ms`

#### stdout

```text

> e2e:smoke
> node tools/wp_playwright_preflight.js && playwright test -c playwright.config.ts

[WardrobePro] Playwright Chromium preflight passed (using system Chromium at C:\Program Files\Google\Chrome\Application\chrome.exe).

Running 26 tests using 4 workers

  ✓   1 [setup] › tests\e2e\app_shell_warmup.setup.ts:5:1 › warm app shell before parallel smoke workers (4.8s)
  ✓   3 [chromium] › tests\e2e\canvas_pointer_parity.spec.ts:15:3 › Canvas pointer parity smoke › browser hover and click apply cell dimensions to the same canvas target (13.2s)
  ✓   2 [chromium] › tests\e2e\cloud_sync_reconnect.spec.ts:29:3 › Cloud Sync browser reconnect smoke › offline to online browser transition keeps the panel stable and sync usable (16.1s)
  ✓   4 [chromium] › tests\e2e\resilience.spec.ts:24:3 › Playwright resilience flows › invalid project load reports failure, keeps the app stable, and records an error perf entry (16.7s)
  ✓   6 [chromium] › tests\e2e\smoke.spec.ts:24:3 › Playwright smoke flows › boot, viewport, tabs and render toggles stay stable (13.4s)
  ✓   5 [chromium] › tests\e2e\authoring_builds.spec.ts:477:3 › Playwright authoring build coverage › structure, design, and interior authoring steps trigger real build and render work (27.4s)
  ✓   8 [chromium] › tests\e2e\resilience.spec.ts:50:3 › Playwright resilience flows › restore-last-session without autosave stays unavailable and keeps user state (12.4s)
  ✓   7 [chromium] › tests\e2e\user_paths.spec.ts:113:3 › Playwright real user paths › primary user journey records canonical runtime perf metrics (19.6s)
  ✓   9 [chromium] › tests\e2e\smoke.spec.ts:50:3 › Playwright smoke flows › header save-load roundtrip restores project name (10.0s)
  ✓  13 [chromium] › tests\e2e\smoke.spec.ts:71:3 › Playwright smoke flows › header reset default replaces the current project cleanly (8.2s)
  ✓  11 [chromium] › tests\e2e\resilience.spec.ts:69:3 › Playwright resilience flows › invalid settings backup import fails cleanly, preserves existing state, and records an error perf entry (16.0s)
  ✓  12 [chromium] › tests\e2e\user_paths.spec.ts:175:3 › Playwright real user paths › repeated export and pdf pressure preserves user state (15.9s)
  ✓  14 [chromium] › tests\e2e\smoke.spec.ts:82:3 › Playwright smoke flows › order pdf overlay opens from export and header with stable toolbar (9.7s)
  ✓  10 [chromium] › tests\e2e\authoring_builds.spec.ts:544:3 › Playwright authoring build coverage › authored structure, design, and interior state rebuilds cleanly after project load (29.1s)
  ✓  16 [chromium] › tests\e2e\smoke.spec.ts:98:3 › Playwright smoke flows › settings tab keeps cloud-sync surface interactive (6.9s)
  ✓  15 [chromium] › tests\e2e\user_paths.spec.ts:213:3 › Playwright real user paths › cabinet core dimensions, colors, and sketch survive project roundtrip (15.1s)
  ✓  17 [chromium] › tests\e2e\authoring_builds.spec.ts:607:3 › Playwright authoring build coverage › corner cabinet authoring triggers real build work and roundtrips through project load (11.3s)
  ✓  19 [chromium] › tests\e2e\authoring_builds.spec.ts:664:3 › Playwright authoring build coverage › chest authoring triggers real build work and roundtrips through project load (9.3s)
  ✓  18 [chromium] › tests\e2e\user_paths.spec.ts:261:3 › Playwright real user paths › cabinet authoring options survive project roundtrip (16.7s)
  ✓  20 [chromium] › tests\e2e\authoring_builds.spec.ts:719:3 › Playwright authoring build coverage › library authoring triggers real build work and roundtrips through project load (9.8s)
  ✓  21 [chromium] › tests\e2e\user_paths.spec.ts:311:3 › Playwright real user paths › project roundtrip preserves authored door and drawer layout maps (7.9s)
  ✓  22 [chromium] › tests\e2e\authoring_builds.spec.ts:774:3 › Playwright authoring build coverage › library door count edits rebuild without loops and keep upper/lower module defaults stable (9.4s)
  ✓  23 [chromium] › tests\e2e\user_paths.spec.ts:353:3 › Playwright real user paths › project roundtrip preserves authored door and drawer layout scenario matrix (12.4s)
  ✓  24 [chromium] › tests\e2e\authoring_builds.spec.ts:813:3 › Playwright authoring build coverage › sliding structure authoring rebuilds cleanly after project load (16.5s)
  ✓  25 [chromium] › tests\e2e\user_paths.spec.ts:400:3 › Playwright real user paths › settings backup import and restore-last-session recover real user state (20.4s)
  ✓  26 [chromium] › tests\e2e\authoring_builds.spec.ts:879:3 › Playwright authoring build coverage › stack split and per-cell dimensions rebuild cleanly and keep lower stack isolated (15.2s)

  26 passed (2.3m)

```
