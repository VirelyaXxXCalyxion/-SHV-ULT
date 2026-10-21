# Moving Relics Accession

Moving Relics is one catalog with three visibility states:

- `public`: appears on the Moving Relics shelf and has a detail page.
- `unlisted`: has a direct detail page with `noindex`; it does not appear on the shelf.
- `sealed`: has no generated public route.

Ashvault remains the artifact's home. TikTok is a delivery surface and video
host, not the canonical catalog.

## Source Videos

Do not copy the CapCut export library into the repository. The source videos
remain in:

`C:\Users\fullm\AppData\Local\CapCut\Videos`

Refresh the generated inventory with:

```powershell
.\scripts\build-moving-relics-inventory.ps1
```

The command writes:

- `capcut-video-inventory.csv`: editable in a spreadsheet for review.
- `capcut-video-inventory.json`: machine-readable intake data.
- `inventory-summary.json`: counts and duplicate-title groups.

The inventory files are generated evidence. Selection and visibility decisions
belong in a separate review ledger so a refresh cannot overwrite them.

## Accession Sequence

1. Match the local work title to its public TikTok post.
2. Resolve duplicate cuts and identify the final published export.
3. Choose `public`, `unlisted`, or `sealed`.
4. Add one MDX record under `src/content/video-relics/`.
5. Use the canonical TikTok post URL as `destination`.
6. Add `tiktokPostId` when known.
7. Run `npm test` and `npm run build`.

TikTok embeds are consent-loaded. The detail page does not contact TikTok until
the visitor selects **Play within Ashvault**. A direct destination link remains
available as a fallback.

## Curation Law

Worth preserving does not require equal public prominence.

The full catalog may hold the body of work. The public shelf should remain
legible: representative, deliberate, and complete enough to show the range of
the house without asking every visitor to cross 190 thresholds at once.

The opening shelf in `launch-candidates.csv` was approved and accessioned on
July 29, 2026. The file preserves the selection decision; it is not a permanent
ranking.
