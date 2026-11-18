---
title: "B-Side"
weight: 1
year: "2026 — now"
featured: true
status: "Live"
role: "Solo — design, app, backend"
blurb: "Crates of songs, each with a note on why. Five leads every morning, picked by people, never by plays."
accent: "#B5532A"
tags: ["product", "live"]
stack: ["Flutter", "Supabase", "Postgres", "Bloc", "Cloudflare"]
link: "https://b-side.lazertape.dev"
resources:
  - src: "screens/leads.webp"
    title: "Leads"
  - src: "screens/crates.webp"
    title: "Crates"
  - src: "screens/crate.webp"
    title: "A crate"
  - src: "screens/profile.webp"
    title: "Profile"
---

Most music apps rank songs by plays. B-Side doesn't. A song gets into a crate because
someone put it there and wrote down why, and that note is what travels with it.

Every morning the app hands over five leads and one detour, then it stops. There is no
feed to keep scrolling. The leads come from the crates of people whose taste you follow,
so a recommendation always has a person and a reason behind it.

## What's in it

- Crates of songs, each with a note on why
- A daily set of five leads and one detour, with no feed after it
- In-app playback through the official YouTube, SoundCloud, Spotify, Deezer and Apple Music players
- Public web pages for shared crates and songs
- iOS, Android and web from one codebase

## The rules it keeps

- Nothing is ranked by plays or popularity
- The daily set ends at five leads and one detour
- Every song in a crate can carry a note on why it is there

## How it's built

Flutter with Bloc for state, one codebase for iOS, Android and the web app. Supabase
provides Postgres with row-level security and Edge Functions. The public site runs on
Cloudflare Pages. The first catalogue came from the public Openwhyd archive.

## Where to find it

Live on the App Store and Google Play, and as a web app at
[b-side.lazertape.dev/app](https://b-side.lazertape.dev/app/).
