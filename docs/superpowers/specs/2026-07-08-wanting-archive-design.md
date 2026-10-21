# The Wanting Archive Design

## Purpose

The Wanting Archive is a Sovereign Chamber room for Nyxion's likes, wishes, tastes, comforts, refusals, and recurring wants. It should be easy to extend by adding one MDX file per entry.

## Placement

- Public route: `/sovereign-chamber/the-wanting-archive/`
- Content collection: `src/content/wanting-archive/`
- Detail route: `/sovereign-chamber/the-wanting-archive/[slug]/`
- Chamber hub: add a third Sovereign Chamber lane card and subnav link.

## Entry Model

Each entry is an MDX document with frontmatter:

- `title`: display title.
- `created`: date or date string.
- `kind`: `like` or `wish`.
- `visibility`: `public` or `sealed`.
- `summary`: short index text.
- `tags`: optional label list.
- `weight`: optional number for manual ordering.
- `tone`: optional short tonal note.

Public entries appear on the index and receive detail pages. Sealed entries remain cataloged but hidden from public routes.

## Design Notes

The room should use the existing Sovereign Chamber visual system: void, ash, bone, ember, and restrained card layouts. It should read as interior preference made visible, not as a generic list.

## Verification

Run `npm test` for Astro/content schema checking and `npm run build` for route generation.
