# Hero images

Drop files here with these exact names — no config, no `hugo.toml` edit. Hugo
crops and resizes them at build time, and falls back gracefully if absent.

| File | Becomes | Cropped to | If missing |
| --- | --- | --- | --- |
| `avatar.jpg` | profile picture | 320x320, centred | your initial in the display face |
| `banner.jpg` | cover image | 1600x350, centred | the generated SVG artwork |

`.jpeg`, `.png`, `.webp` and `.avif` work too — the first match wins, in that
order after `.jpg`.

Both are cropped from the centre, so put the subject near the middle. The banner
is very wide (32:7), so a tall image loses most of its top and bottom — start
from something landscape.

SVG is not supported here, since Hugo cannot crop it. For an SVG cover, edit
`layouts/partials/banner-art.html` directly instead.
