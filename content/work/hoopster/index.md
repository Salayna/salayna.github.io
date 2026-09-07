---
title: "Hoopster"
weight: 1
year: "2025 — now"
featured: true
status: "In beta"
role: "Solo — design, app, backend"
blurb: "Find a pickup basketball game near you. Courts, sessions, RSVPs and a check-in that actually gets used."
accent: "#0E9F6E"
tags: ["product", "beta"]
stack: ["Flutter", "Supabase", "Mapbox", "Bloc", "Postgres"]
link: "https://hoopster.lazertape.dev"
card_link: "none"
---

I moved to northern France and couldn't find a game. Asking around got me nowhere:
the courts were on nobody's map and the sessions lived in group chats I wasn't in.

Hoopster is the fix. It maps the courts, lets anyone open a session, and handles
the part that usually kills pickup sports apps — getting people to actually turn up.

## What's in it

- Court map with community-submitted spots and photos
- Sessions with RSVPs, a player cap and a waitlist
- Check-in at the court, which feeds a light XP system
- Friends, profiles and a post-session recap

## What I learned

The hard problem isn't the map, it's the hour before tip-off. Most no-shows happen
when nobody has confirmed and everyone assumes it's dead. Restructuring the session
around three moments — open, confirm, recap — did more for turnout than any feature.
