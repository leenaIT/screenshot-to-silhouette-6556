<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## BUNYAN architecture
- Spatial limits come only from the pure-TS `src/lib/geometry.ts` (tested); AI/mock services supply parameters, never dimensions — keeps geometry deterministic and testable.
- Legacy AI, GIS and plan demonstrations use `src/lib/services.ts` and `src/lib/mock-data.ts`; the selected-parcel workspace uses separate configurable JSON datasets, with regulatory values and excerpts reviewed against original PDF pages, so independent legacy scenarios never become real-parcel findings.
- 3D scenes load via `Scene3D` (ClientOnly + lazy) so three.js never runs during SSR.
- App pages wrap content in `AppShell` (right-side RTL nav); i18n via `src/lib/i18n.tsx`.
- The map-first home workspace gates analysis behind parcel and project selection and keeps conversation, map, and source-viewer state in-place to preserve the user journey.
- PDF documents use immutable asset pointers and local source configuration; React-PDF and its worker load lazily in the browser to avoid SSR evaluation.
- Project geographic rings through `geometry.ts` to metre coordinates; absent verified spatial parameters, use a separately labeled illustrative villa and centroid-scaled coverage comparisons, never inferred legal envelopes.
- The selected-parcel scene uses a dedicated browser-only illustration branch; coverage ratios and floor count come from verified JSON, while model heights/materials remain explicitly illustrative to isolate legacy scenarios.
- Compare coverage automatically on ground-level illustrative polygons, with source-area arithmetic in geometry.ts; missing height/setback limits remain text-only so no fabricated spatial envelope is drawn.
- Automatic review is keyed to a confirmed selection and guarded by a ref; callbacks never retrigger it, preserving follow-up conversations during layout changes.
- Keep parcel geometry invisible until selection; focus the Leaflet map only on explicit selection, never on panel resize, so document and chat interactions retain geographic navigation.
- Scripted answers use numbered document/page citations and a single workflow status; assistant expansion keeps its mounted state, and arbitrary plan uploads are preview-only rather than assigned demo findings.
- Interactive parcel details use a pure regulatory-JSON adapter and shared dialog selection state; missing areas and floor ratios stay unavailable rather than becoming invented findings.
- Claude follow-ups stream through the native Messages gateway in a server-only handler with verified JSON context; the existing scripted initial review remains separate, and session-only chat is not persisted.
- AI endpoint safety uses server-only database pauses and atomic hashed-visitor rate counters; provider denials require owner recovery rather than reload retries.
