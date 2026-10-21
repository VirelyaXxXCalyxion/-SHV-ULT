# Moving Relics Design

## Purpose

Moving Relics is Ashvault's permanent catalog for videos created by Virelya and Nyxion. It is an artifact gallery, not a social feed: the work is held by title, invocation, and context, while video hosting remains external.

## Placement

- Primary chamber: Vault of Flame
- Navigation: one Heartline destination into the Moving Relics index
- Visual posture: dark, restrained, archival, and consistent with Ashvault relic surfaces

## Visibility Law

Every video record has one visibility state:

- `sealed`: retained in the source catalog only. It has no generated route and exposes no destination.
- `unlisted`: retained in the source catalog only for version one. It has no generated route until a deliberate access boundary is designed.
- `public`: appears in the Moving Relics gallery and receives a permanent Ashvault artifact route.

`unlisted` is intentionally not treated as private. A static page is public to anyone who obtains its URL, so version one publishes only explicitly public work.

## Content Model

Create a dedicated `video-relics` content collection with these fields:

- `title`
- `created`
- `medium`
- `invocation`
- `destination`
- `visibility`
- `weight`
- `tags`
- optional `summary`, `image`, and `platform`

The catalog may contain every video record. Generated routes and the public index must filter to `visibility: public`.

## Public Experience

The index presents public artifacts in weight/date order. Cards lead with title and invocation; platform is secondary. Each public artifact page provides Ashvault context and one intentional external link to the hosted video. The page does not embed a platform feed or host video files.

The empty state must preserve the room's purpose when no public artifacts are present.

## Safety and Verification

- Do not expose `sealed` or `unlisted` destinations in rendered HTML, generated routes, or public index data.
- External links open with `target="_blank"` and `rel="noopener noreferrer"`.
- Validate with `npm test` and `npm run build` after implementation.

## Non-Goals for Version One

- Uploading or serving video files from Ashvault.
- Authentication or a private companion gallery.
- Platform embeds, comments, metrics, or feed behavior.
