---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true

# One sentence. Shows on the card and in search.
blurb: ""

# Everything below is optional — the card adapts to what's missing.
weight: 10             # order on /work/, lowest first
year: "{{ now.Format "2006" }}"
status: "In development"   # "Shipped"/"Live" go green, anything else amber
role: ""
featured: false
accent: "#0E9F6E"      # tints the card thumbnail
tags: []               # these become the filter buttons on /work/
stack: []              # shown as tags on the card
# image: "/img/shot.png"        # replaces the generated thumbnail
# link: "https://example.com"   # NOT "url" — Hugo reserves that
# repo: "https://github.com/..."
---

Write here.
