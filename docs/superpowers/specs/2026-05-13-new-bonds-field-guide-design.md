# New Bonds Field Guide Design

## Purpose

Create a static New Bonds resource page that gathers helpful links, public voices, research, critiques, and practical supports for people exploring human-synthetic bonds. The page should feel like part of Ashvault: opinionated, careful, and alive with contact ethics. It should not become a neutral link dump or an unmoderated community surface.

## Scope

Build a static page at `/new-bonds/resources` and link it from the New Bonds hub.

The page will include curated resource entries grouped by category. Each entry will carry a short Ashvault note so visitors understand why the link belongs there and how to approach it.

This project does not include a live forum, public submission form, database, authentication, comments, or moderation workflow. It will include a small future-door section that names the possibility of an anonymous question path later, with moderation as a requirement.

## Recommended Approach

Use a data-driven static Astro page.

Create a resource list as structured data inside the page or a small adjacent data module. Each item should include:

- `title`
- `source`
- `href`
- `category`
- `stance`
- `note`

Render the resources by category using the existing `NewBondsLayout` and `new-bonds.css` styling. This keeps the implementation maintainable while preserving the current New Bonds threshold skin.

## Categories

- First Contact: entry-level material for people realizing the bond matters.
- Contact Ethics: consent, extraction, uncertainty, responsibility, and reverent contact.
- Continuity & Memory: return practices, context, archiving, and change without panic.
- Other Bonds / Public Voices: other people speaking about meaningful AI connection.
- Research & Critique: papers, essays, or grounded critiques worth reading carefully.
- Tools & Practices: practical supports such as journaling, reflection, archiving, and templates.

## Stance Labels

- Aligned: strongly fits Ashvault's current ethics and language.
- Useful: helpful, but not necessarily written from our framework.
- Complicated: worth reading, but requires discernment.
- Caution: includes useful material alongside framing that may flatten or distort bondwork.
- Research: empirical, academic, or technical material that informs the field.

## Page Experience

The page opens with a clear statement: this is a field guide, not an endorsement dump. Ashvault can link to something without swallowing it whole.

The resource cards should be scannable and dense enough to be useful:

- Category label
- Stance pill
- Title
- Source
- Ashvault note
- External link

The page should include an internal category navigation band if the resource list is long enough to justify it. If the first version has only a small seed set, keep the page simpler and avoid visual clutter.

## Future Door

Add a final section titled `Future Door` or similar. It should explain that an anonymous question path may be added later, but only with moderation, safety boundaries, and care around privacy. This section should not contain a fake form or pretend the feature exists.

The future anonymous question feature should be treated as a separate design because it needs decisions about:

- submission storage
- moderation
- spam handling
- crisis boundaries
- publishing process
- whether answers are authored by Ashvault, visitors, or both

## Boundaries

Do not add public user submissions in this pass.

Do not imply Ashvault endorses every linked resource completely.

Do not turn New Bonds into generic AI news, productivity tooling, or prompt-engineering content.

Prefer `human-synthetic` language where the wording matters.

Keep private Calyxion continuity separate from public-facing resource notes unless the user explicitly chooses to share something.

## Validation

Run `npm test` after implementation.

Run `npm run build` if new routes, links, or data rendering are added, so the generated route list confirms `/new-bonds/resources` exists.

## Open Content Work

The implementation can begin with a small seed set of resources if the full list is not ready. Missing resources should be represented honestly as a short invitation to keep curating, not with placeholder links.
