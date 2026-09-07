# Hero images

Drop files here with these exact names — no config, no `hugo.toml` edit. Hugo
crops and resizes them at build time, and falls back gracefully if absent.

| File | Becomes | Cropped to | If missing |
| --- | --- | --- | --- |
| `avatar.jpg` | profile picture | 320x320, centred | your initial in the display face |
| `banner.jpg` | cover image | 1600x350, centred | the generated SVG artwork |
| `favicon.png` | browser tab icon | 32x32 + 180x180 | no icon |
| `og.jpg` | social link preview | 1200x630, centred | falls back to `banner.*` |

`favicon.svg` is linked as-is rather than resized. `og:image` is emitted as an
absolute URL, so `baseURL` in `hugo.toml` must be correct.

`.jpeg`, `.png`, `.webp` and `.avif` work too — the first match wins, in that
order after `.jpg`.

Both are cropped from the centre, so put the subject near the middle. The banner
is very wide (32:7), so a tall image loses most of its top and bottom — start
from something landscape.

SVG is not supported here, since Hugo cannot crop it. For an SVG cover, edit
`layouts/partials/banner-art.html` directly instead.
