# Portfolio

A Hugo site. No theme — the layouts are the site, so there is nothing to fight
when you want to change something.

Built and tested against **Hugo v0.164.0 extended**. It uses the template system
introduced in v0.146, so the layouts live flat in `layouts/` rather than in
`layouts/_default/`. Anything older than 0.146 will not find them.

## Run it

```sh
hugo server
```

Then open http://localhost:1313.

To build for production:

```sh
hugo --minify
```

Output lands in `public/`.

## Structure

```
hugo.toml              Site config, menu, social links, params
content/
  _index.md            The one-paragraph intro on the home page
  work/                One file per project
  writing/             One file per post
data/
  experience.yaml      Roles on the home page (real; from ../personnal)
  stack.yaml           Tool groups on the home page (real; from ../personnal)
archetypes/
  writing.md           Scaffold for `hugo new content writing/...`
  work.md              Scaffold for `hugo new content work/...`
layouts/
  baseof.html          Shell: head, no-flash theme script, asset pipeline
  home.html            Home page composition
  home.json            Search index consumed by the command palette
  page.html            Fallback single page
  section.html         Fallback section list
  work/section.html    Project index with filters
  work/page.html       Project detail
  writing/section.html Post index
  writing/page.html    Post detail
  partials/            topbar, hero, banner-art, band, project-card,
                       icon, tool-icon, footer, palette
assets/
  css/main.css         All styles, driven by custom properties
  js/app.js            Theme toggle, filters, command palette
```

## Adding a post or a project

Both sections are plain markdown in `content/` — drop a file in and it appears.
Nothing needs registering in a data file.

```sh
hugo new content writing/my-post.md      # scaffolds from archetypes/writing.md
hugo new content work/my-project.md      # scaffolds from archetypes/work.md
```

The archetypes fill in the front matter with comments explaining each field, so
you are editing values rather than remembering keys. Both scaffold with
`draft: true` — drop that line (or run `hugo server -D`) to see the page.

**The only required field is `title`.** Everything else is optional and the
layouts adapt: a project with no `stack` or links drops its footer rule, a card
with no `status` shows no badge, a post with no `summary` shows no summary line.
A file with no `date` falls back to the file's modification time, so posts still
sort and display sensibly.

### Project front matter

Create `content/work/my-project.md`:

```yaml
---
title: "My project"
weight: 5              # controls order, lowest first
year: "2026"
status: "In beta"      # free text, shown next to the title
role: "Solo"
blurb: "One sentence. This shows on the index and in search."
accent: "#0E9F6E"      # the project's own colour
featured: true         # optional, adds the "Featured" badge
card_link: "page"      # page (default) | external | none — see below
tags: ["product", "beta"]   # these become the filter buttons
image: "/img/shot.png"      # optional, replaces the generated thumbnail
stack: ["Flutter", "Supabase"]
link: "https://example.com"    # optional. NOT "url" — Hugo reserves that
repo: "https://github.com/..."  # optional
---

Markdown body goes here and renders on the detail page.
```

The filter buttons on `/work/` are generated from the `tags` actually in use, so
adding a new tag adds a new button. Nothing to register.

Without an `image`, a card draws its own thumbnail: a dot grid tinted with the
project's `accent`, and the title's initial set in the display face. Real
screenshots look better — this is just a floor, not a target.

`link` is deliberately not `url`: Hugo treats `url` in front matter as the page's
own output path and will fail the build on an absolute URL.

### What a card links to

`card_link` decides that, per project:

| Value | Behaviour |
| --- | --- |
| `page` (default) | opens the project's own detail page |
| `external` | goes straight to `link`, marked with a ↗ next to the title |
| `none` | not clickable at all |

Use `external` for a project with nothing written up — it skips the empty
detail page. Use `none` for something you want to show but not send people to.

With `none`, the globe and repo icons in the card footer become **real links**,
so the card can still offer a way through without being one big link itself.
(With `page` or `external` they stay decorative, since anchors cannot nest.)

`external` falls back to the detail page if `link` is missing, so a typo
degrades rather than producing a dead card.

A `none` card still has a detail page, it is just unlinked. To stop Hugo
building that page at all, add to the project's front matter:

```yaml
_build:
  render: never
  list: local
```

## Design notes

The layout is a single centred column under a sticky top bar. Sections are
separated by **bands** — a display heading between two full-bleed hairlines, with
tick marks where the rules cross the content column. That band is the spine of
the page; `partials/band.html` draws every one of them, so changing it changes
the whole site.

Two families, three roles. Display and body are the same face — **Outfit** —
held apart by weight and tracking rather than by a second family:

| Role | Family | Weight | Used for |
| --- | --- | --- | --- |
| Display | **Outfit** | 500-600, tracking -0.03em | wordmark, name, section headings, `h2` in prose |
| Body | **Outfit** | 400, normal tracking | paragraphs, nav, card titles |
| Mono | **JetBrains Mono** | 400-500 | metadata, labels, badges, tags, `⌘K` |

`--display` is an alias of `--sans` in `main.css`. Point it at a different
family and every display surface switches over at once, with the body left
alone — that is the seam to use if you ever want a two-family system back.

Colour is nearly absent by design. The greys carry the page; only three things
are allowed to be coloured:

- `--live` (green) — anything shipped or running, and the "open to work" dot
- `--warn` (amber) — anything still in flight, and the "Featured" badge
- each project's own `accent`, which tints its card thumbnail and draws the bar
  on its detail page

If you colour the chrome, that hierarchy stops reading. Every colour lives in
the `:root` and `[data-theme="dark"]` blocks at the top of `main.css`; there is
no other hard-coded colour in the stylesheet.

Both fonts are on Google Fonts and free. To self-host, drop the woff2 files in
`assets/fonts/`, add an `@font-face` block at the top of `main.css`, and delete
the `fonts.googleapis.com` lines from `layouts/baseof.html`.

### The hero

`partials/hero.html` draws the banner and the identity row. Both images are
optional params in `hugo.toml`:

- `banner` — a wide image (roughly 24:7). Without it, `banner-art.html` renders
  a generated SVG: a dot grid, cropped rings, and a strata rule.
- `avatar` — a square image. Without it, the box shows your initial in the
  display face.

`snapshot` in `[params]` fills the card under About. Four short lines is the
shape it's built for.

### Tool icons

`data/stack.yaml` renders as tiles, each with a line glyph from
`partials/tool-icon.html`. That partial matches on the tool name, lowercased
with non-alphanumerics stripped, so `Platform channels` and `platform-channels`
hit the same case.

Icons come from three libraries, vendored into `assets/icons/` and inlined at
build time — no CDN call at runtime, and the site still works offline:

- **`dv-*`** — [Devicon](https://devicon.dev) (MIT), `-plain` monochrome
  variants. The primary set, purpose-built for developer tooling: Flutter,
  Swift, Android, JavaScript, Go, Node.js, PostgreSQL, Supabase, Firebase,
  Docker, GitHub Actions.
- **`si-*`** — [Simple Icons](https://simpleicons.org) (CC0), for brands with no
  Devicon `-plain` variant: Sentry, Appwrite, PostHog — plus Dart, Figma,
  Linear, Mapbox, Fastlane, MQTT and Codemagic held in reserve.
- **`lu-*`** — [Lucide](https://lucide.dev) (ISC): line icons for tools with no
  brand mark at all.

The map in `tool-icon.html` deliberately covers more tools than `stack.yaml`
currently lists, so swapping tools in and out needs no icon work.

Both sets are monochrome and inherit `currentColor`, so they take the theme.
Brand marks are solid and line icons are stroked, so the solid ones render at
13px against the outlines' 15px — that evens out their optical weight.

Anything unmapped falls back to a package glyph, so adding a tool never leaves
a hole. See `assets/icons/SOURCES.md` for licences and how to add one.

## Images

Every image slot in the site, and what it does with what you give it. All of
them are optional — each falls back on its own if the file is absent.

| What | Put it here | Output | Shape | If missing |
| --- | --- | --- | --- | --- |
| Profile picture | `assets/img/avatar.*` | 320x320 | square, centre-cropped | your initial in the display face |
| Cover banner | `assets/img/banner.*` | 1600x350 | 32:7, centre-cropped | generated SVG artwork |
| Card thumbnail | `content/work/<project>/cover.*` (or `thumb.*`, or `image:`) | 640x360 | 16:9, centre-cropped | dot-grid with the title's initial |
| Body image | next to `index.md`, or `assets/<path>` | max 1400px wide | aspect kept | — |
| Favicon | `assets/img/favicon.*` | 32x32 + 180x180 | square, centre-cropped | no icon |
| Social preview | `assets/img/og.*` | 1200x630 | 1.91:1, centre-cropped | falls back to `banner.*` |

### Formats

| Slot | Accepts |
| --- | --- |
| avatar, banner, og | `.jpg` `.jpeg` `.png` `.webp` `.avif` |
| favicon | `.svg` (linked as-is, not resized), else `.jpg` `.jpeg` `.png` `.webp` |
| card thumbnail | any raster Hugo can decode |
| body images | any raster; `.svg` and `.gif` pass through untouched |

Where several extensions are listed the first match wins, in that order. Hugo
cannot resize SVG, and resizing a GIF would flatten its animation — so both are
passed straight through in body copy, and SVG is only special-cased for the
favicon.

Everything is cropped **from the centre**, so keep the subject near the middle.
The banner is the one to watch: at 32:7 it is very wide, so a tall photo loses
most of its top and bottom. Start from something landscape.

Locally-resolved images get real `width` and `height` attributes and are
lazy-loaded, so the page does not jump around as they load. Remote images
(absolute URLs in markdown) are passed through untouched and get no dimensions,
since those cannot be known at build time.

### In the body of a post or project

Turn the file into a **page bundle** — a folder with `index.md` inside — and put
images next to it:

```
content/work/hoopster.md          ->   content/work/hoopster/
                                         index.md
                                         cover.jpg
                                         shot.jpg
```

Then reference them by bare filename, no path:

```markdown
![Alt text](shot.jpg "An optional caption")
```

The third argument becomes a `<figcaption>`. `assets/`-relative paths
(`![x](img/diagram.jpg)`) and absolute URLs also work, in that order of
resolution.

Anything resolved locally is resized to a 1400px cap and gets real `width` and
`height` attributes, so the page does not jump around as images load. They are
lazy-loaded. SVG and GIF pass through untouched — Hugo cannot resize the first
and would flatten the animation on the second.

An image on its own line becomes a `<figure>`; one used mid-sentence stays
inline at text height.

### The card thumbnail on /work/

In order of preference:

1. a `cover.*` or `thumb.*` file in the project's page bundle — nothing to
   configure, it is just picked up
2. `image: "shot.jpg"` in front matter, resolved against the bundle then `assets/`
3. `image: "/img/shot.png"` as a plain path into `static/`
4. no image at all — the generated dot-grid thumbnail with the title's initial

Whatever it finds is cropped to 640x360 from the centre.

### The hero, favicon and social preview

All four live in `assets/img/` under fixed names — `avatar`, `banner`,
`favicon`, `og` — with no configuration. See `assets/img/README.md`.

The social preview falls back to `banner.*` if there is no `og.*`, so setting a
cover image gets you a link preview for free. Note `og:image` is emitted as an
absolute URL, so `baseURL` in `hugo.toml` must be right or previews will break.

## The interactive bits

**Theme toggle.** An inline blocking script in `baseof.html` sets
`data-theme` before first paint, so there is no flash. It reads `localStorage`
first, then falls back to `prefers-color-scheme`.

**Project filters.** `work/section.html` puts `data-tags` and `data-search` on
each card; `app.js` toggles `hidden`. No build step, no dependency.

**Command palette.** `⌘K` / `Ctrl-K`, or `/` anywhere outside a text field.
`layouts/home.json` emits every project, post and section to `/index.json` at
build time. `app.js` fetches it on first open and scores with a subsequence
matcher that rejects matches spread too thinly across a string — otherwise a
query like "hoop" matches any long sentence containing those letters in order.

## Before you ship

- Set `baseURL` in `hugo.toml`.
- Replace the placeholder social URLs and `email`.
- Set `available = false` in `[params]` to hide the "Open to new work" dot.
- Add `favicon.*` and `og.*` to `assets/img/` (see the Images table).
- Optionally add `banner` and `avatar` images, and edit `snapshot`.

## Deploying

Any static host works. Cloudflare Pages and Netlify both let you pin the Hugo
version with a `HUGO_VERSION` environment variable, which is worth doing — the
template system moved in 0.146 and pinning saves you a surprise.

Build command: `hugo --minify`
Publish directory: `public`
