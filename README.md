# RoutineHub Reloaded

A userscript that fixes RoutineHub's mobile UX friction and inconsistent
theming, styled around a custom teal/petrol palette. Internal codename is
**RoutineHub Enhancer** through the alpha series; renames to **RoutineHub
Reloaded** at `1.0.0`.

Built as a fork of gluebyte's [Dark Mode RoutineHub](https://routinehub.co/user/gluebyte)
(MIT, v1.1) — that script's dark-mode CSS and layout tweaks are kept intact
as the base; everything else is additive.

## Why

RoutineHub's own UI has real friction on mobile:

- The changelog is buried below the fold on the shortcut page.
- Comment threads on popular shortcuts run hundreds deep with no way to
  collapse them.
- Some chrome (navbar, footer, dark-variant buttons) doesn't follow either
  theme consistently.
- There's no lightweight way to see a shortcut's free analytics without
  leaving the page.

This userscript fixes those directly on top of the live site.

## Install

Requires a userscript manager (e.g. [Tampermonkey](https://www.tampermonkey.net/)
or [Violentmonkey](https://violentmonkey.github.io/)). Install
[`RoutineHub_Enhancer.user.js`](./RoutineHub_Enhancer.user.js) through it,
then visit [routinehub.co](https://routinehub.co).

## Features

- Quick-access changelog button on the shortcut detail page.
- Hero metadata (creator on its own line, Version/iOS/Updated shown up front).
- Free stats card (hearts, feedback, referrers, entry counts) fetched live
  from RoutineHub's own public endpoints — no need to leave the page.
- Collapsible, flattened comment threads.
- Profile page: stat tile icons, a condensed weekly Publish Activity chart,
  and an Author Overview that shows the important stats first.
- Site-wide dark theme, synced to both the OS preference and RoutineHub's
  own in-app theme toggle.

See [`RoutineHub-Reloaded.md`](./RoutineHub-Reloaded.md) for the full
per-page breakdown, version history, and code documentation.

## Project docs

| File | Contents |
|---|---|
| [`RoutineHub-Reloaded.md`](./RoutineHub-Reloaded.md) | Goal, page-by-page coverage, version history, code structure, key selectors, recurring patterns |
| [`RoutineHub-Reloaded-Theme-Audit.md`](./RoutineHub-Reloaded-Theme-Audit.md) | Coverage audit of RoutineHub's native dark-theme CSS against what this script styles |
| [`RoutineHub-Reloaded-Status.json`](./RoutineHub-Reloaded-Status.json) | Structured, frequently-updated status tracker per page/feature |

## License

MIT — see [`LICENSE`](./LICENSE). Includes code from gluebyte's Dark Mode
RoutineHub (MIT, v1.1).
