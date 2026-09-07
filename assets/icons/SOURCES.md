# Vendored icons

Inlined at build time by `layouts/partials/tool-icon.html`. Nothing here is
fetched at runtime, so the site has no CDN dependency and works offline.

## `dv-*.svg` — Devicon

Tech logos, `-plain` variants (the monochrome ones). Source:
https://devicon.dev (`devicons/devicon`), released under the **MIT** licence.
This is the primary set: it is purpose-built for developer tooling and covers
most of `data/stack.yaml` with real marks.

Normalised on vendoring: the hardcoded brand `fill` removed and
`fill="currentColor"` set on the root, so they take the theme colour; `xmlns`
stripped since they are inlined. The 128x128 viewBox is kept — CSS sizes them.

Sentry and Appwrite have no `-plain` variant, so they come from Simple Icons
instead.

## `si-*.svg` — Simple Icons

Brand marks. Source: https://simpleicons.org (npm `simple-icons`).
The SVG data is released under **CC0 1.0** (public domain).

Normalised on vendoring: `<title>` removed (the tile's text label is the
accessible name), `fill="currentColor"` added so they take the theme colour,
`xmlns` and `role` stripped since they are inlined rather than standalone files.

The brands themselves remain trademarks of their respective owners. They are
used here only to identify the tools they belong to.

## `lu-*.svg` — Lucide

Line icons, for the tools that have no brand mark. Source:
https://lucide.dev (npm `lucide-static`), released under the **ISC** licence.

Normalised on vendoring: licence comment, `class`, `xmlns` and the fixed
`width`/`height` removed — CSS sizes them. `stroke="currentColor"` is kept.

## Adding one

Drop a `si-` or `lu-` SVG in this directory and add a branch to the map in
`layouts/partials/tool-icon.html`. Run the same normalisation, or the icon will
ignore the theme colour and render at the wrong size.
