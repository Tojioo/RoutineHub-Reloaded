# RoutineHub Reloaded

Project documentation for the RoutineHub UX userscript. Internal name stays
**RoutineHub Enhancer** through the alpha series; renames to **RoutineHub
Reloaded** at `1.0.0`.

-----

## Goal

RoutineHub's own UI has real friction on mobile: the changelog is buried
below the fold, comment threads on popular shortcuts run hundreds deep with
no way to collapse them, some chrome (navbar, footer, dark-variant buttons)
doesn't follow either theme consistently, and there's no lightweight way to
see a shortcut's free analytics without leaving the page. This userscript
fixes those directly on top of the live site, styled around a teal/petrol
palette sourced from Nicolas's reference images (`#0C1311` background,
`#00DBAC` accent, `#1D424A` petrol surface).

Built as a fork of gluebyte's **Dark Mode RoutineHub** (MIT, v1.1) — that
script's dark-mode CSS and layout tweaks are kept intact as the base;
everything else in this document is additive.

-----

## Pages covered so far

| Page | What's done |
|---|---|
| Shortcut detail | Changelog CTA button, hero metadata (creator on its own line, Version/iOS/Updated added), Required Apps swapped in for the ad-free pitch, free Stats card, redesigned/collapsible comments |
| Homepage | Hero tagline banner (`.rh-tagline`) and developer proof bar (`.rh-proof-bar`) — both use background-image gradients that ignore background-color, both had their own hardcoded text colors. Rest of the page (shortcut grids, AI category tiles, listings) uses classes already covered elsewhere, confirmed clean. |
| Feed (`/feed/`) | Daily check-in, composer, Trending Coders dev cards, logged-out login CTA, feed post body headings (`markdown-content` isn't covered by the `.content` heading rule) |
| Feed channel tabs (Announcements, General) | Channel head title/description (`.rh-feed-channel-head__title`/`__desc`, own hardcoded color same as the homepage tagline). Post cards, reactions, comment counts confirmed clean. |
| Discover / Shortcuts listing (`/shortcuts/`) | Confirmed clean at alpha8. Re-verified at alpha19 against real `.rh-appcard` markup (name/brief/price/stats), the Sort dropdown, and pagination — all correct, including `.rh-appcard-brief`/`.rh-price` which alpha17 added reactively without direct evidence. Pagination needed no fix at all: plain `<a>` tags already inherit accent color from the generic link rule. |
| Feed entry (single post) | Confirmed clean, no fixes needed |
| Upload New (`/new/`) | `.rhnew-card` picker rows fixed in alpha8 (inline-styled, not classed by the site). Page heading ("Create something new" + subtitle) missed by that fix — no class at all, outside the cards entirely — found and fixed in alpha18. |
| Login (`/login/`) | Fixed: `.field-label` (floating label over the email/password inputs) inherited the light theme text color meant for dark cards, but sits over `.input`'s intentionally-light background — light-on-light. Now dark text. Native `.form-button` (Log In) and the blue info notice left untouched — legible, semantic/brand colors, not contrast bugs, same reasoning as leaving `.rh-cta` and the Announcement badges alone. |
| Register (`/register/`) | Confirmed clean, no fixes needed |
| Version history (`/shortcut/<id>/changelog`) | Site redesigned this page entirely between alpha8 and alpha15 — old markup (stacked full-width Download/Edit/Delete buttons) no longer exists, replaced with `.rh-changelog__entry` cards. Alpha8's "confirmed clean" no longer applied to the new markup; re-fixed and re-verified in alpha15 (subtitle, version number, iOS badge, download count, muted timestamp). "Latest" badge and the Download button (`.rh-cta`) correctly need no fix — already legible, left native. |
| Notifications | Quoted comment text contrast fix (`.rh-notification__quote`) |
| Profile | Author Overview stat box sizing, Publish Activity heatmap scale (mobile breakpoint). Alpha9: `.rh-stat` given icons + full card treatment (border/shadow, matches other cards), Publish Activity condensed with a "Show full year" expand toggle, Authored grid's "Free" badge dropped, spacing added between Author Overview and Publish Activity. Alpha10: stats row no longer scrolls (`display:grid`, wraps instead), search button specificity fix. Alpha11: stat tiles redesigned (icon/value/label stacked via flex `order`, label contrast fixed), condensed Publish Activity rebuilt as a weekly bar chart instead of a shrunk heatmap clone, toggle-button position bug fixed. Alpha12: Author Overview redesigned — Followers/Following/Downloads fixed on one row, Shortcuts/Skills/Prompts/Plugins moved behind a "Show 4 more stats" toggle (`splitStatsOverview()`), icon shrunk and switched to full-strength accent color for better contrast. |
| Site-wide chrome | Navbar, navbar dropdown/hamburger menu, footer, `.button.is-dark` (covers primary/danger-dark red buttons) — themed unconditionally, not just in dark mode. Alpha9: extended search overlay (`.search`, Bulma's maroon `has-background-primary-dark`) added to the same unconditional bucket. |

## Pages not yet done

- **Search results, category-filtered listing pages** — likely share the Discover page's template (already confirmed clean), but not explicitly checked.
- **Account settings, API settings, CreatorHub (beta), My Orders (beta), Shortcut Sign (beta)** — require an authenticated session; `userscript-browser-check` currently only sees logged-out pages, so these remain unchecked live. Some visual context exists from user-provided screenshots/exports but hasn't been cross-checked against the current script version.
- **Owner-only states of already-checked pages** — e.g. the Edit/Delete buttons on the version history page, the full comment/reply form as a signed-in user, the real (non-CTA) Feed composer and daily check-in.

Everything else reachable without login has been swept: homepage, Feed (+ Announcements/General/Discover tabs), Feed Entry, Upload New, Login, Register, Version History.

## Open to-dos

- Search/category listing pages, and the auth-gated pages above.
- Stats card: data-correctness is fixed (real numbers, real timeout behavior); layout/appearance polish still deferred by request.
- No authenticated-session browser testing yet. A Claude Code + Browser Use plugin combination (drives the user's real, already-logged-in Chrome) was raised as a possible path for this specifically — not evaluated in depth, and it's a Claude Code capability, not something available from this chat.
- Alpha9's profile-page changes were verified against a static HTML export (`userscript-browser-check` pointed at a `file://` copy), not the live site — the Claude Code on the web session that made them had its outbound network blocked entirely by org policy (routinehub.co and everything else returned a 403 from the egress proxy), and the Browser Use plugin showed as enabled but exposed no callable tool/CLI there either. DOM structure and toggle behavior were confirmed correct against the export; live visual confirmation (especially whether `.rh-stat`'s card styling renders correctly on the anchor-based Followers/Following stats, which depend on the site's own flex layout that a static export with no stylesheet doesn't reproduce) is still worth a quick pass when a live-access session is available.
- Alpha13/14's toggle-margin and secondary-tile fixes are now confirmed live (both resolved as of alpha14 — see version table).
- Alpha20's navbar-during-search fix (`keepNavbarThemedDuringSearch()`) needs a real check whenever the site's reachable: open the hamburger menu, tap search, confirm the navbar/navbar-menu stay themed instead of reverting to native navy.
- Alpha21's `debugNavbarSearchIssue()` is temporary — remove it (and its call site) once the user reports back what the console actually shows for the search interaction.
- Alpha17's remaining gluebyte-sourced selectors still need a live pass: `.rh-feed-interstitial` (context/appearance still unknown), `.rh-checkin__label`, `.rh-feed-post--text .rh-feed-post__body`, `.rh-topcard-brief`, and the muted-tier three (`.rh-hero-header__meta`, `.rh-release__date`, `.rh-feed-post__verb`). `.rh-appcard-brief` and `.rh-price` are now confirmed as of alpha19 — see version table.
- **Next up, per explicit priority order**: Upload New (`/new/`) got its card-row fix in alpha8 and its page-heading fix in alpha18 (see version table). No further known issues on this page, though it hasn't had a full sweep pass the way the earlier public pages did — worth a proper look if time allows.

-----

## Version history

| Version | Changes |
|---|---|
| 1.0.0 | Forked from gluebyte's Dark Mode RoutineHub. Added: changelog quick-access button (cloned into hero CTA row); basic collapsible comment threads (text-link toggle, floated icon). |
| 1.0.0 *(palette revamp, no version bump)* | Replaced grayscale dark-mode palette with teal/petrol palette from reference images; introduced the `--rh-*` CSS variable system; 3-tier surface elevation. |
| 1.0.0-alpha3 | Hero metadata partially duplicated above CTA row (first pass); Required Apps swapped for ad-free pitch; comment/feedback buttons themed to match; collapse toggle redesigned as a right-aligned rotating chevron; textarea placeholder contrast fixed; footer background differentiated. |
| 1.0.0-alpha4 | Restructured CSS: navbar/footer/dropdown/`.button.is-dark` moved to an **unconditional** block (themed regardless of OS light/dark setting) instead of being gated behind `prefers-color-scheme: dark`. Creator promoted to its own line above hero meta. First version of the free Stats card (fetch + DOMParser — later found to only read placeholder text). Comment collapse mechanism rewritten to toggle captured elements directly instead of relying on a CSS structural selector (fixed "collapse does nothing" bug); toggle enlarged. Notification quote contrast fixed. Profile mobile aspect-ratio tweaks added. |
| 1.0.0-alpha5 | Comment threads flattened to a single reply level (any depth → direct children of the top-level comment), matching YouTube's convention; replies now start collapsed behind a `▾ View N replies` text link instead of an icon-only always-expanded toggle. Fixed the same "archived comments load one DOM level deeper" issue silently breaking both collapse-all and comment-card styling for archived comments. Stats card given a visible loading state + fetch timeout (didn't yet fix the root cause). |
| 1.0.0-alpha6 | Attempted stats fix via hidden iframe + polling (page's own script executes for real, unlike a plain fetch). Still broken in practice — very likely blocked by `X-Frame-Options`, silently yielding an empty document read as "ready." |
| 1.0.0-alpha7 | **Actual** stats fix: call the two JSON endpoints the stats page's own script uses directly (`/shortcut/<id>/get-engagement-stats`, `/shortcut/<id>/get-visit-stats`, both commented `FREE: always load` in that page's source) instead of trying to render the page at all. Also now surfaces referrers + direct/internal entry counts, not just hearts/feedback. Logout button background fixed (`.navbar-item` background doesn't inherit from its parent — needed its own rule). |
| 1.0.0-alpha8 | First full color-scheme sweep using the `userscript-browser-check` skill, live against the real site (plus one authenticated page rendered from a saved export where login was required). Fixed: homepage `.rh-tagline`/`.rh-proof-bar` (background-image gradients ignoring background-color, plus their own hardcoded text colors — same pattern hit three more times this pass); feed page `.rh-checkin`/`.rh-feed-composer`/`.rh-devcard`/`.rh-feed-login-cta`/feed post body headings/composer placeholder & submit button; feed channel head title/description; Upload New page's inline-styled `.rhnew-card` rows; login page's floating field label (light-on-light against the input). Confirmed clean with no changes needed: Discover, Feed Entry, General tab, Register, Version History. Left native/unthemed on purpose: `.form-button`, the login notice banner, and `.rh-cta` — semantic or brand colors, not contrast bugs. |
| 1.0.0-alpha9 | Extended search overlay (`.search`, Bulma's `has-background-primary-dark` maroon) themed to match, added to the unconditional chrome bucket alongside navbar/footer. Profile page: `addStatIcons()` adds a mapped icon per Author Overview stat label; `.rh-stat` given the same border/box-shadow treatment as other cards; `condensePublishActivity()` clones the last 13 weeks of the Publish Activity heatmap (real `.rh-pubgraph__week`/`__cell` nodes, so native level colors carry over with no guessing) into a compact preview behind a "Show full year" toggle that reveals the native 53-week chart; `cleanAuthoredGrid()` removes the redundant `.rh-price--free` "Free" badge from each Authored card, scoped to the Authored section via its heading. Verified DOM/toggle behavior against a static profile-page export (`file://`, no live site access this session — see Open to-dos); not yet confirmed against the live, fully-styled page. |
| 1.0.0-alpha10 | Two bugs found once the real stylesheet (`main.min.*.css`) was obtained and tested against directly, rather than a stylesheet-less export: (1) the search overlay's submit button was still native maroon (`#61124b`) — the site's own `.search .button.is-dark` rule (3 classes) outranks the plain `.button.is-dark` override (2 classes) on specificity, and `!important` on both sides doesn't change that; fixed with a matching-specificity `.search .button.is-dark` rule. (2) Author Overview's `.rh-scroll--stats` is the site's horizontal-carousel component (fixed `flex: 0 0 140px` children, `scroll-snap-type: x mandatory`) — same pattern as the Trending Coders dev-card strip — so it still required horizontal scrolling despite alpha9's icon/card-styling pass; overridden to `display: grid; grid-template-columns: repeat(auto-fit, minmax(92px, 1fr))` so all 7 stats wrap onto rows with zero scrolling, confirmed via screenshot. Both fixes verified by rendering the actual page source + actual stylesheet + userscript together locally (`file://`, still no live network access this session) rather than guessing from static exports. |
| 1.0.0-alpha11 | Real-device feedback on alpha10's stat tiles and Publish Activity prompted a design pass, not just a bugfix: (1) `.rh-stat__label` (and the icon inheriting its color) was native `#777`, under 2.5:1 contrast against `--rh-surface-2` — fixed to `rgba(203,217,215,0.75)` for the label, `0.45` for the icon (de-emphasis tier). (2) Icon was crammed inline before the label text at a size that crowded it; `addStatIcons()` now inserts the icon as `.rh-stat`'s first child (a sibling of `__label`/`__value`, not nested inside the label) so CSS `order` stacks icon-on-top / value-in-the-middle / label-as-caption, matching the dataviz skill's stat-tile contract (value most prominent, label secondary, icon decorative). (3) The condensed Publish Activity view was rebuilt entirely: real per-day counts (parsed from each cell's own `title` attribute, e.g. "4 publishes on Jul 11, 2026") are summed per week and rendered as a 13-bar weekly bar chart with a date label under every ~4th bar, replacing the previous approach of cloning the heatmap's actual `.rh-pubgraph__week`/`__cell` nodes at a smaller size. That heatmap-clone needed a month label above and a day label to the left to decode a single cell, and only filled about half the card's width at heatmap-cell density — both were named as concrete problems ("dead space," "have to look 3 places to read one value"). The rebuilt version uses one flat `--rh-accent` color (single series, no legend needed), bars stretch to fill the card width, and each bar carries an exact tooltip via `title`. Also fixed: the "Show full year" toggle button was pinned right after the mini/legend elements, which put it below the content when collapsed but *above* the content once expanded (the full chart renders after the button in DOM order) — reported as the button "snapping" position on toggle. Moved to `scrollWrap.after(toggle)` so it's always immediately after whichever of {mini, full chart} is actually visible. The native 53-week heatmap behind the toggle is deliberately left as-is — a GitHub-style calendar is a reasonable, recognizable format for the "see everything" escape hatch, even though the same month-label/day-label decoding friction exists there too; only the default/every-time view was rebuilt. Verified against the real stylesheet + full 53-week fixture data rendered locally. |
| 1.0.0-alpha12 | Author Overview redesigned, not just recolored, on direct feedback that icons were still too large/washed out and the 7-tile strip wasted space on content-type counts that are usually zero. Icon dropped from `1.4rem`/`45%`-opacity gray to `1rem` at full-strength `var(--rh-accent)` — registers as an actual icon now instead of a faint smudge; label bumped `0.75` → `0.85` opacity. Layout split: `splitStatsOverview()` partitions the 7 stats into Followers/Following/Downloads (always visible, fixed 3-column row) and Shortcuts/Skills/Prompts/Plugins (moved into a new `.rh-stats-secondary` grid, hidden behind a "Show 4 more stats" toggle) — same condense-and-reveal shape as Publish Activity's toggle, reusing its exact button styling for consistency. Hit a self-inflicted cascade bug immediately: the secondary grid initially also carried the `.rh-scroll--stats` class for its base grid styling, but that class's `display: grid !important` beat the toggle's plain (non-`!important`) inline `display: none` every time, so the "hidden" group rendered visible regardless of toggle state. Fixed by giving `.rh-stats-secondary` its own complete, independent grid declaration instead of sharing the `!important`-bearing class. Verified against the live site: default state (3 primary tiles + toggle, secondary genuinely hidden) and expanded state (2x2 secondary grid, toggle text updates) both confirmed via screenshot. |
| 1.0.0-alpha13 | Two more rounds of real-device feedback on alpha12: (1) the toggle button's `margin-bottom: 20px` was silently losing to some competing Bulma `.button` rule (exact rule not confirmed — Cloudflare's bot-challenge blocked live re-verification this session, see below), sitting flush against the Publish Activity card with zero gap; forced with `!important`. (2) The 2x2 secondary grid at the same tile size as primary looked "overkill" for stats that are meant to read as less important — changed to a single 4-column row with icon/value/label all scaled down (`0.7rem`/`1.05rem`/`0.56rem` respectively, down from `1rem`/mobile-1.35rem/`0.72rem`) so the size itself, not just the toggle, communicates lower importance. Not yet re-verified live: Cloudflare blocked repeated automated checks against `/user/tojioo` for the remainder of this session (see the skill's documented gotcha — a wait-and-retry doesn't reliably clear it). Open question raised but not resolved: at `0.7rem` a FontAwesome icon may not render as a recognizable glyph; dropping the icon from secondary tiles entirely was proposed as the fallback if so, pending visual confirmation. |
| 1.0.0-alpha14 | Resolved alpha13's open question, in the direction the user proposed rather than my fallback: dropped the visible label from secondary tiles entirely (not `display:none` — visually hidden via the standard clip-rect technique, so a screen reader still gets "0 Skills" rather than just "0") and used the freed vertical space to size the icon and value back up (`1.3rem`/`1.2rem`, from the `0.7rem`/`1.05rem` alpha13 shrunk them to). Justified specifically because the icon language is already established consistently elsewhere: `/new/`'s "Create something new" picker uses the same glyphs for the same content types, provided as ground truth via its actual HTML rather than guessed from a screenshot. Caught and fixed a real mismatch this uncovered: Skills was `fa-graduation-cap` (New page uses `fa-scroll`), Prompts was `fa-comment-dots` (New page uses `fa-terminal`) — both corrected in `addStatIcons()`'s icon map. Also fixed the toggle-margin bug from alpha13 for real this time (confirmed via live screenshot the `!important` fix landed correctly) and confirmed the alpha13 4-column secondary layout renders correctly, resolving both of alpha13's "not yet re-verified" items. Verified via live screenshot, both collapsed and expanded states. |
| 1.0.0-alpha15 | RoutineHub redesigned the changelog/version-history page (`/shortcut/<id>/changelog`) site-side between alpha8 and now — entirely new markup (`.rh-changelog__entry` cards replacing the old stacked-button layout), provided as real HTML rather than discovered via screenshot. Applied the by-now-well-established pattern (BEM-named text elements tend to carry their own hardcoded color, breaking inheritance from the themed card around them) preemptively to `.rh-changelog__subtitle`, `.rh-release__version`, `.rh-changelog__ios`, `.rh-changelog__downloads`. Also added `.text-muted` as a general utility-class fix (covers the absolute-time timestamp here, and anywhere else on the site using the same generic de-emphasis class) rather than scoping it narrowly to this one page. Left native on purpose: the "Latest" badge and the Download button (`.rh-cta`) — both already legible, matching the established precedent of not repainting every semantically-colored element. All of the above confirmed via live screenshot; nothing further needed on this page. |
| 1.0.0-alpha16 | RoutineHub also updated the navbar's search button between alpha8 and now: the version inside the expanded mobile menu (`.navbar-menu`, distinct from the always-icon-only top-bar magnifying glass) gained a `<span class="search-button__label">Search</span>` that didn't exist before — caught by diffing newly-provided HTML against an earlier capture of the same element, not from a screenshot. Same recurring bug as everywhere else this session: the label carried its own explicit color rather than inheriting the accent color `.navbar-item` already provides its siblings ("Sign up", "Log in"), so it rendered white and stood out. Fixed by adding `.search-button__label` to the existing accent-color rule. Confirmed via live screenshot (hamburger menu open) that it now matches its sibling menu items; the search icon itself correctly stays native red, same reasoning as the logo. |
| 1.0.0-alpha17 | gluebyte shipped their own Dark Mode RoutineHub to v1.2, independently updated for the same underlying site changes this project has been chasing all session — provided as a second data point, not a request to re-fork. Cross-referenced rather than merged wholesale: gluebyte's diff added `.rh-checkin`/`.rh-feed-composer`/`.rh-devcard` to their background+color rule, which independently matches fixes already made here in alpha8 — that overlap is what makes the rest of their diff worth trusting on the strength of the pattern, not screenshot-re-verified line by line. Adopted on that basis: `.rh-feed-interstitial` (new card type, added to the full card treatment — bg/color/border/shadow), `.rh-checkin__label`, `.rh-price`, `.rh-feed-post--text .rh-feed-post__body` (broader coverage than this project's own earlier heading-only fix for feed post bodies), `.rh-appcard-brief`, `.rh-topcard-brief` (all full-text tier); `.rh-hero-header__meta`, `.rh-release__date`, `.rh-feed-post__verb` (gluebyte's own muted `#999` tier, mapped to this project's equivalent `.text-muted` treatment rather than copied as a literal hex value). **Explicitly NOT adopted**: gluebyte's v1.2 moved `.field-new-control .field-label` back into their light-text tier. This project verified via live screenshot in an earlier version that this exact label needs dark text — it's a floating label sitting on top of `.input`'s intentionally light background, not a caption on a dark card — so gluebyte's v1.2 looks like a regression on their end for this one element specifically, not a fix to adopt. Kept this project's own dark-text rule unchanged. None of the six newly-adopted selectors have been independently screenshot-confirmed against this project's actual palette; flagged as such in the code comment. |
| 1.0.0-alpha18 | Upload New's page heading ("Create something new" + subtitle) turned out to sit in a plain unclassed `<div>`, inline `color:#000`/`color:#6b7280` directly on the h1/p with no class at all — outside `.rhnew-card` entirely, so alpha8's fix for the card rows never reached it, and it stayed black-on-dark regardless of theme. No class to hook directly; targeted structurally via the one class in reach, `.rhnew-wrap` (`.rhnew-wrap h1` for the title, `.rhnew-wrap > div > p` for the subtitle — safe since the cards use spans, not p tags, for their own text, so there's exactly one real `<p>` in the container). Verified against a fresh local extraction of the page (still auth-gated, Cloudflare still blocking live checks this session) — title now reads white, subtitle at the same muted tier as everywhere else. |
| 1.0.0-alpha19 | No code changes — a verification pass on the real Shortcuts listing page (`/shortcuts/?page=4&sort=top`, public HTML provided directly), prompted by a direct question about whether it had actually been checked. It hadn't, not with this exact markup: the original alpha8 "Discover confirmed clean" was against `/shortcuts/?sort=newest` before `.rh-appcard-brief`/`.rh-price` existed in this project's CSS at all. Live-verified now: both render correctly, confirming alpha17's gluebyte-sourced additions were both necessary and correct rather than just plausible. Also checked two elements never examined before — the Sort dropdown (already fine, `.button.is-dark` covers the trigger) and pagination (already fine with zero changes needed, since `.pagination-link` is a plain `<a>` and already inherits accent color from the generic link rule; the current-page highlight is a native indicator, left alone same as other semantic badges). |
| 1.0.0-alpha20 | Two bugs from a live screenshot of the Sort dropdown actually open, and the search overlay active while the hamburger menu was also open. (1) Dropdown background stayed white: Bulma's dropdown has two layers, `.dropdown-menu` (positioning wrapper, transparent) and `.dropdown-content` (the actual visible card, white by default) — the Sort dropdown uses both, but this project had only ever themed `.dropdown-menu`, which happens to be the *wrong* layer for that specific dropdown's real background. The account-menu dropdown (gear icon) skips `.dropdown-content` entirely and puts items directly in `.dropdown-menu`, which is exactly why that one already looked right and this one didn't — same component, two different internal shapes. Now covers both classes. (2) Search-active state made the navbar and navbar-menu themselves go native dark-navy, not just the search bar (which already had its own fix from an earlier version). No modifier class for this shows up in any static HTML capture taken this session, so the likely cause is either a runtime JS class toggle or a CSS sibling-selector rule keyed off the search panel's own hide/show state — invisible to a static export either way. Rather than guess a selector to out-specify, used a `MutationObserver` on the search panel's class list that re-asserts the navbar's color via inline `!important` style on every change — inline styles beat any stylesheet rule regardless of specificity, so this sidesteps needing to know what the competing rule actually is. **Not verified live**: Cloudflare blocked every attempt to reproduce this exact interaction (open hamburger, then tap search) this session; both fixes are reasoned from the two screenshots and the known DOM structure, not confirmed working firsthand. Flagged as such in the code comment — worth a real check next time the site's reachable. |
| 1.0.0-alpha21 | Added `debugNavbarSearchIssue()` — temporary, to be removed once alpha20's search/navbar bug is actually diagnosed. The user has console access via a web inspector extension on the real device, which this session's tooling doesn't have for authenticated/interactive states. Watches `class`/`style` mutations and computed background-color on `.navbar`, `.navbar-menu`, `.search`, and `document.body`, logging every change under the `[RHE debug]` prefix. Usage: open the console, open the hamburger menu, tap search, copy back what prints. Sanity-checked in this session (loads without throwing, logs the expected initial-state snapshot correctly) but the actual search-tap interaction still couldn't be exercised here — that's exactly what this exists to let the user do instead. |
| 1.0.0-alpha22 | The cross-cutting theme-trigger and toggle-icon fixes, both confirmed via live testing in Chromium and WebKit against the real site rather than just reasoned through. Replaced the `@media (prefers-color-scheme: dark)` gate entirely with a JS-driven `.rhe-dark` class on `<html>`, computed as OS-prefers-dark OR their `data-theme=dark`, kept live via a `matchMedia` listener and a `MutationObserver` on the attribute — a plain media query can't express an OR against a DOM attribute. Verified the exact gap this closes: forcing `data-theme=dark` while OS is light flips a real page's card background from their native palette to our `--rh-bg` live, no reload, confirmed by computed-style sampling in both engines. Also fixed the toggle icon mismatch: their dark-state visuals turned out to be plain `html[data-theme=dark]` CSS with hardcoded values (not `aria-checked`-driven), so those exact values got re-keyed onto `.rhe-dark`, plus `aria-checked` itself now syncs to the actual effective theme. Verified the specific reported scenario directly — OS dark, their attribute forced to explicitly `light` — and confirmed the icon renders fully dark while their `data-theme` attribute stays completely untouched underneath. Debug logging from alpha21 remains unresolved and still in the file; out of scope for this pass. |
| 1.0.0-alpha23 | RoutineHub replaced the flat navbar-menu dropdown with a slide-out sidebar (`.rh-rail`), confirmed from a real view-source PDF of the logged-in page, not guessed from a screenshot — the old `.navbar-menu` markup is still present in the DOM but the new `.rh-rail` is what actually renders. RoutineHub already ships full native dark-mode coverage for it in their own stylesheet, gated to their literal `html[data-theme=dark]` attribute, the same category of gap the alpha22 toggle-icon fix closed, just for a different component. Re-keyed with this project's own `--rh-*` palette rather than copied verbatim, so the sidebar matches the rest of the theme instead of introducing their gray-purple palette as a one-off exception. Left native on purpose: `.rh-rail__count` (a red unread-style badge) and `.rh-rail__join` (the ad-free/HubSign promo banner, indigo in both their light and dark versions) — same reasoning as the Announcement/Creator badges and `.rh-cta` elsewhere, consistent semantic or brand colors the site already applies deliberately. Verified rigorously despite no authenticated session being reachable: injected the real extracted markup into the actual live page (so real native CSS, including their real dark-mode rules, was loaded alongside it), then sampled computed styles before and after forcing `data-theme=dark`. Every property matched our variables exactly — background, link color, search background, section-title color — confirming our rules win the specificity contest against their real rules, not just calculated to on paper. Flagged as a followup, not yet investigated: whether `keepNavbarThemedDuringSearch()` and `debugNavbarSearchIssue()` (targeting the old `.navbar`/`.navbar-menu`/`.search`) are now partially obsolete, since search now lives inside `.rh-rail__search` rather than a separate full-screen overlay. |
| 1.0.0-alpha24 | The theme toggle inside the new `.rh-rail` sidebar showed a mismatched surface-2 patch behind it, same color as the top bar, reported from a live screenshot of the actual expanded sidebar. Root cause: RoutineHub reused the `.navbar-item` class on the toggle's wrapper (`.rh-rail__theme`), unrelated to its original navbar meaning, which meant the existing unconditional `.navbar-item` background rule bled onto it. Fixed with a more specific `.rh-rail .navbar-item { background-color: transparent }` override rather than narrowing the original rule, so the legitimate top-bar usage stays untouched. Verified the same way as alpha23 — real markup injected into the real live page — confirming the toggle wrapper is now fully transparent while the actual top-bar search button (also `.navbar-item`) still correctly resolves to `--rh-surface-2`, no collateral damage from the more specific override. |

-----

## Code documentation

Single IIFE, `@grant GM.addStyle` only. Structure, top to bottom:

### 1. Base layout tweaks (unconditional)
Gluebyte's original spacing/padding fixes, plus the mobile aspect-ratio
breakpoint for `.rh-scroll--stats` / `.rh-pubgraph__chart` (profile page).

### 2. Palette + "always-dark" chrome (unconditional)
```css
:root {
  --rh-bg: #0C1311;          /* page background */
  --rh-surface-1: #112320;   /* cards, footer */
  --rh-surface-2: #1D424A;   /* navbar, dropdown, code, blockquote, buttons */
  --rh-border: #17302D;
  --rh-text: #CBD9D7;
  --rh-accent: #00DBAC;      /* links, unread highlight */
  --rh-accent-dim: rgba(0, 219, 172, 0.12);
  --rh-input-bg: #C7D6D4;
}
```
Declared unconditionally (not inside the dark-mode media query) because the
elements that consume them here — `.footer`, `.navbar`, `.navbar-menu`,
`.navbar-dropdown`, `.dropdown-menu`, `.navbar-item`, `.button.is-dark` —
are already dark by the site's own default design regardless of OS theme.
`.navbar-item` specifically needed its own background rule: `background-color`
doesn't inherit from a parent the way `color` does, so a `<button
class="navbar-item">` (e.g. Logout) ignored the themed `.navbar-menu`
background around it until targeted directly.

### 3. Theme sync (`syncThemeClass()` + `initThemeSync()`)
Runs first, before any styling. Computes `effectiveDark = OS prefers dark
OR RoutineHub's own data-theme=dark attribute`, toggles a `.rhe-dark` class
on `<html>` accordingly, and keeps it live via a `matchMedia` change
listener plus a `MutationObserver` on the `data-theme` attribute. Replaced
a plain `@media (prefers-color-scheme: dark)` gate as of alpha22, once
RoutineHub shipped their own native dark mode toggle (independent of the
OS setting) and a real four-state pixel matrix (OS × their toggle) proved
`prefers-color-scheme` alone misses one cell: OS light + their toggle dark,
where cards/body fell through to their palette while unconditional chrome
stayed ours.

Also re-keys their own `.rh-theme-toggle` dark-state CSS (icon, knob
position, star opacity — exact values pulled from their stylesheet) onto
`.rhe-dark`, and syncs the toggle's `aria-checked` attribute to
`effectiveDark`. This fixes the icon mismatch case (OS dark + their toggle
light previously showed a sun icon on a fully dark page) without touching
their stored `data-theme` value at all — purely a visual override on our
own class, verified via live testing that their attribute is left
untouched underneath it.

### 4. Dark-mode block (`html.rhe-dark { ... }`)
Everything that should only change appearance when `effectiveDark` is
true: body/card backgrounds and text, link color, card shadows, borders,
input backgrounds, placeholder contrast, the top-level comment card
treatment (`.rh-top-comment`), the notification quote fix, and the
`.rh-rail` sidebar navigation (added alpha23 — see below). Uses "relaxed"
native CSS nesting — bare selectors like `body, .modal { ... }` directly
inside `html.rhe-dark { ... }`, no explicit `&` prefix needed — confirmed
via a live test in both Chromium and WebKit that this resolves to
`html.rhe-dark body, html.rhe-dark .modal { ... }` correctly before relying
on it here. `&`-prefixing every selector individually was considered and
rejected: correct either way, but the block has 15+ long comma-separated
selector lists, and relaxed nesting avoids rewriting all of them by hand.

**`.rh-rail` sub-section**: the sidebar that replaced the old flat
`.navbar-menu` dropdown (alpha23). RoutineHub already ships full native
dark-mode coverage for this component in their own stylesheet — confirmed
by reading their actual CSS, not assumed — but it's gated to their literal
`html[data-theme=dark]` attribute rather than anything that knows about
`effectiveDark`. Re-keyed with this project's own `--rh-*` variables rather
than their raw hex values, so the sidebar matches the rest of the theme
rather than sticking out in their gray-purple palette. `.rh-rail__count`
(red unread badge) and `.rh-rail__join` (the ad-free/HubSign promo banner,
indigo in both of their own theme versions) are deliberately left native —
same reasoning as the Announcement/Creator badges and `.rh-cta` elsewhere.

### 5. `keepNavbarThemedDuringSearch()`
Something re-colors the navbar/navbar-menu to native dark-navy specifically
while the search overlay is active (reported alpha20) — no modifier class
for it appears in any static HTML capture taken all session, so the cause
is either a runtime JS class toggle or a CSS sibling-selector rule keyed off
`.search`'s hide/show state. Rather than guess a selector to out-specify, a
`MutationObserver` watches `.search`'s class list and re-asserts the navbar's
color via inline `!important` style on every change — inline styles beat any
stylesheet rule regardless of specificity, sidestepping the need to know
what the competing rule actually is. Unverified live (see Open to-dos).

### 6. `addChangelogButton()`
Finds the "Version history" link inside the Latest Release Notes card
(scoped via `.rh-release__version`'s ancestor `.rh-card`, not a page-wide
`a[href*="/changelog"]` search — the footer has a same-substring sitewide
link that would otherwise match first) and clones it into the CTA row.

### 7. `addHeroMetadata()`
Reads Version/iOS/Updated out of the Information card's `.rh-info-list__item`
entries and duplicates them as icon+text spans in `.rh-hero-header__meta`.

### 8. `promoteCreatorLine()`
Moves the "by @author [tags]" span out of the meta row into its own `<p>`
before it. A DOM move, not a flex-basis trick — works regardless of the
meta row's own layout mode.

### 9. `addFreeStatsSummary()`
Gated on `.rh-stats-card` existing (only rendered for the shortcut owner).
Calls `/shortcut/<id>/get-engagement-stats` and `/shortcut/<id>/get-visit-stats`
directly in parallel (10s timeout each via `AbortController`), same as the
native stats page's own script. Renders hearts, feedback, direct/internal
entry counts, and top 5 referrers into a `.rh-info-list`-styled card
inserted before the Required Apps card. Three terminal states: populated,
`"Couldn't load stats."`, or removed entirely if every field comes back
empty (`hearts == null && feedback == null && !referrers.length`).

**Do not** re-attempt fetching the raw `/stats` HTML page for this data —
confirmed twice that the numbers aren't server-rendered (raw HTML has
`Loading...` placeholders the page's own script replaces client-side), and
iframing the page to force that script to run is unreliable (same-origin
framing can still be blocked by `X-Frame-Options`, and a blocked frame reads
as an empty-but-"loaded" document rather than an error).

### 10. `promoteRequiredApps()`
Moves (not clones) the `.rh-card` whose title is "Required Apps" to replace
`.rh-install-pitch`'s position. No-ops if the shortcut has no required apps
(`.rh-apps-grid__item` absent).

### 11. Profile page: `addStatIcons()`, `splitStatsOverview()`, `condensePublishActivity()`, `cleanAuthoredGrid()`
All four gated purely by DOM presence (no pathname check needed — the
targeted elements only exist on a profile page), each idempotent via a
`dataset` flag.

- **`addStatIcons()`**: the Author Overview strip (`.rh-scroll--stats`) is a
  row of `.rh-stat` items (two are `<a>` — Followers/Following link out —
  the rest are plain `<div>`s: Shortcuts, Skills, Prompts, Plugins,
  Downloads), each with a `.rh-stat__label` + `.rh-stat__value` child. A
  label string → FontAwesome-class lookup table inserts an `<i>` as `.rh-stat`'s
  *first child* — a sibling of `__label`/`__value`, not nested inside the
  label — so CSS `order` can stack icon / value / label regardless of DOM
  order (icon on top, big value, caption label, instead of an icon crammed
  inline before the label text). Unmapped labels (if the site adds a new
  stat) are silently skipped rather than left iconless-but-broken.
- **`splitStatsOverview()`**: must run after `addStatIcons()` so the tiles it
  moves keep their icons. Partitions the 7 stats into Followers/Following/
  Downloads (fixed 3-column row, always visible) and everything else
  (Shortcuts/Skills/Prompts/Plugins — moved into a new `.rh-stats-secondary`
  grid, hidden by default) behind a "Show N more stats" toggle. The secondary
  grid deliberately does NOT carry the `.rh-scroll--stats` class despite
  needing similar grid styling — that class's `display: grid !important`
  would beat the toggle's plain inline `display: none` every time (hit this
  exact bug in alpha12; fixed by giving `.rh-stats-secondary` its own
  standalone `display: grid` declaration instead of sharing the
  `!important`-bearing one). No-ops if there are 3 or fewer stats total
  (nothing to hide) or none of the primary labels are found.
- **`condensePublishActivity()`**: the native chart always renders all 53
  week-columns as a heatmap — decoding one cell means reading a month label
  above *and* a day label to the left. Rather than cloning the heatmap at a
  smaller size (tried in alpha9; a 13-cell cluster only filled about half the
  card's width and was no easier to decode), this sums each of the last 13
  weeks' real per-day counts — parsed straight from each `.rh-pubgraph__cell`'s
  own `title` (`"N publishes on <date>"` / `"No publishes on <date>"`, via
  `parseInt(cell.title, 10) || 0`, which naturally reads 0 for the "No
  publishes" case) — and renders one bar per week (`.rh-pubgraph__minibar`,
  height ∝ that week's total, flat `--rh-accent` fill since it's a single
  series) with a date label under roughly every 4th bar. Bars use `flex:1 1 0`
  so they stretch to fill the card's width. A "Show full year" button toggles
  between the bar chart and the original `.rh-pubgraph__scroll` by flipping
  `display` on each; the button is inserted with `scrollWrap.after(toggle)`
  specifically so it always lands directly after whichever of the two is
  currently visible (an earlier version pinned it right after the mini
  chart, which put it *above* the full chart once expanded — reported as the
  button "snapping" position on toggle). No-ops if there are 13 weeks of data
  or fewer. The full-year heatmap itself is left native and unmodified —
  intentionally: a GitHub-style calendar is a reasonable "see everything"
  format for an occasional deep-dive, even though it shares the same
  decoding friction; only the every-time default view was rebuilt.
- **`cleanAuthoredGrid()`**: drops `.rh-price--free` ("Free" badge) from
  every card in the Authored section's `.rh-grid`. Scoped to that specific
  grid (found via the "Authored" `.rh-section-title` heading's
  `nextElementSibling`) rather than sitewide, since `.rh-price--free` is a
  shared class also used on Discover/homepage grids that weren't part of
  this ask.

### 12. `flattenReplyThreads()` + `makeCommentsCollapsible()` + `addCollapseAllControl()`
Run together as `refreshComments()`, both initially and on every mutation of
`#feedback` (covers the "Show Archived Comments" AJAX load).

- **Top-level detection** is ancestor-based
  (`!comment.parentElement.closest('article.media[data-feedback-id]')`), not
  DOM-depth-based, because archived comments load one level deeper inside
  `#archivedCommentsContainer` — a depth-based check silently missed them
  for both flattening and the visual card treatment. Top-level comments get
  a `.rh-top-comment` class; CSS and later passes key off that class, not
  DOM position.
- **Flattening**: every descendant `article.media[data-feedback-id]` (any
  depth) gets re-appended directly under its top-level ancestor's
  `.media-content`, in original document order (depth-first, which is
  already correct chronological/hierarchical order). Marked idempotent via
  `comment.dataset.rhFlattened`.
- **Collapsing**: replies start hidden (`display: none` set directly on the
  captured `replies` NodeList — not a CSS structural selector, which is what
  broke collapsing in the first place under some markup variants). Toggle is
  a text link, `▾ View N replies` / `▾ Hide N replies`, appended after the
  comment body.
- **Collapse-all button**: queries `.rh-toggle-replies` anywhere in
  `#feedback` (not scoped to direct children) so it also reaches archived
  threads; bulk-toggles by calling `.click()` on each toggle rather than
  duplicating the show/hide logic.

-----

## Key selectors reference

Confirmed against real page exports, not guessed:

| Element | Selector |
|---|---|
| Hero CTA row | `.rh-hero-header__cta` |
| Hero meta row | `.rh-hero-header__meta` |
| Release notes card (for changelog link) | `.rh-release__version` → closest `.rh-card` → `a[href*="/changelog"]` |
| Ad-free pitch | `.rh-install-pitch` |
| Required Apps card | `.rh-card` with `.rh-card__title` text `"Required Apps"`, items in `.rh-apps-grid__item` |
| Owner-only analytics card | `.rh-stats-card`, link `.rh-stats-card__btn` |
| Information card rows | `.rh-info-list__item` → `.rh-info-list__label` / `.rh-info-list__value` |
| Comments container | `#feedback`, top-level vs. reply via ancestor check (see above) |
| Comment/reply article | `article.media[data-feedback-id]` |
| Comment body wrapper | `.media-content` (direct child of the article) |
| Archived comments | load into `#archivedCommentsContainer`, one level deeper than top-level `#feedback` children |
| Notification quote | `.rh-notification__quote` (a `<blockquote>` — generic `blockquote` background rule already applied, text color did not) |
| Homepage hero banner | `.rh-tagline` / `.rh-tagline-title` / `.rh-tagline-sub` / `.rh-tagline-accent` (accent span left untouched — deliberate brand color, already legible) |
| Homepage developer proof bar | `.rh-proof-bar` / `.rh-proof-headline` / `.rh-proof-detail` |
| Feed composer | `.rh-feed-composer` / `__textarea` / `__submit` |
| Feed daily check-in | `.rh-checkin` |
| Feed dev card (Trending Coders) | `.rh-devcard` |
| Feed logged-out prompt | `.rh-feed-login-cta`, `.rh-feed-empty-hint` |
| Feed post card | `.rh-feed-post`, body wrapper `.rh-feed-post__body.markdown-content` (headings need explicit color — not covered by the `.content h1...` rule since it's a different wrapper class) |
| Feed channel head (Announcements/General) | `.rh-feed-channel-head__title` / `__desc` |
| Login floating label | `.field-new-control .field-label` — sits over `.input`'s light background via `.transparent-control`, needs dark text unlike every other themed label |
| Upload New picker rows | `.rhnew-card` — inline-styled by the site (background/border/text color all inline, none `!important`, so class-based `!important` rules still win); title/description text targeted structurally via `.rhnew-card > span:last-of-type > span` since those spans have no distinguishing class. Real HTML obtained (`/new/`, requires auth) — icon per content type: Apple Shortcut `fa-bolt`, AI Prompt `fa-terminal`, AI Skill `fa-scroll`, AI Plugin `fa-puzzle-piece`, Cherri Program `fa-code`. This is the canonical icon language other parts of the site should match — `addStatIcons()` (Author Overview) already does. |
| Upload New page heading (alpha18) | `.rhnew-wrap h1` (title), `.rhnew-wrap > div > p` (subtitle) — both have inline color with no class at all, in a plain `<div>` outside `.rhnew-card`, so the row-level fix above never reached them. `.rhnew-wrap` is the only class in reach; safe to target broadly since the cards use spans (not `<p>`) for their own text. |
| Stats JSON endpoints | `GET /shortcut/<id>/get-engagement-stats`, `GET /shortcut/<id>/get-visit-stats` |
| Changelog entry card (redesigned, alpha15) | `.rh-card.rh-release.rh-changelog__entry` — card treatment already free via `.rh-card`. Text: `.rh-changelog__subtitle`, `.rh-release__version`, `.rh-changelog__ios`, `.rh-changelog__downloads` (all needed explicit color), `.text-muted` (the absolute-time timestamp, fixed as a general utility not scoped to this page). Left native: `.rh-changelog__latest` ("Latest" badge), `.rh-cta.matomo_download` (Download button) |
| Navbar search button label (added, alpha16) | `.search-button__label` — new span inside the desktop/expanded-menu variant of `.search-button.navbar-item` (the always-icon-only `is-hidden-desktop` mobile variant is unchanged, no label). Needed explicit color despite `.navbar-item` already covering its siblings — same inheritance-breaking pattern as every other BEM text element found this session. |
| Sidebar navigation, `.rh-rail` (replaced the flat menu, alpha23) | `<aside class="rh-rail" data-rail-root>` containing `.rh-rail__head` (logo, close button), `.rh-rail__search`, `.rh-rail__scroll > .rh-rail__list` (Home/@user/Community/Create New) plus `.rh-rail__group[data-rail-group]` sections (Channels, Account, Links) each with a `.rh-rail__title` header, a `.rh-rail__chev` collapse toggle, and a `.rh-rail__sub` list of `.rh-rail__sublink` items (channels use a `.rh-rail__hash` "#" prefix; the Settings item nests a further `.rh-rail__tree` of `.rh-rail__treelink`s; HubSign carries `.rh-rail__sublink--locked` plus a `.rh-rail__out` lock icon). Ends in `.rh-rail__foot` with the `.rh-rail__join` promo banner, a `.rh-rail__list` of Notifications/Support/Logout, `.rh-rail__social` icons, and `.rh-rail__bottom` holding the theme toggle plus a `.rh-rail__toggle` (collapse-to-icon-rail button, desktop-oriented, distinct from `.rh-rail__close`). The old `.navbar-menu` flat dropdown is still present in the DOM but not what actually renders once logged in. |
| From gluebyte's Dark Mode RoutineHub v1.2 (alpha17, not independently verified) | `.rh-feed-interstitial` (unknown context, added to full card treatment defensively), `.rh-checkin__label`, `.rh-price`, `.rh-feed-post--text .rh-feed-post__body`, `.rh-appcard-brief`, `.rh-topcard-brief` (all full-text tier); `.rh-hero-header__meta`, `.rh-release__date`, `.rh-feed-post__verb` (muted tier). See alpha17 changelog entry for the corroboration reasoning and the one selector deliberately NOT adopted (`.field-new-control .field-label` — gluebyte's version looks like a regression there). |
| Extended search overlay | `.search` (wrapper, carries Bulma's `has-background-primary-dark`) → `.search-bar` → `form` → `input.input` / `button.button.is-dark` |
| Author Overview stats | `.rh-scroll.rh-scroll--stats` → `.rh-stat` (`<a>` for Followers/Following, `<div>` for the rest) → `.rh-stat__label` / `.rh-stat__value` |
| Publish Activity heatmap | `.rh-card.rh-pubgraph` → `.rh-pubgraph__total` (always-visible summary text) + `.rh-pubgraph__scroll` → `.rh-pubgraph__chart` → `.rh-pubgraph__months` (one `.rh-pubgraph__month` span per week-column) + `.rh-pubgraph__body` (`.rh-pubgraph__daylabels` + one `.rh-pubgraph__week` div per week, each holding 7 `.rh-pubgraph__cell.rh-pubgraph__cell--l0..l4\|future`) + `.rh-pubgraph__legend` (sibling of `__months`/`__body`, still inside `__chart` — scrolls/scales with the chart, confirmed by counting divs, not by seeing computed layout) |
| Authored grid (profile) | `.rh-section-title` text `"Authored"` → `.rh-grid` → `.rh-appcard` (`<a>`) → `.rh-appcard-icon-wrapper`, `.rh-appcard-name`, `.rh-appcard-brief`, `.rh-appcard-stats` (→ `.rh-price.rh-price--free`, `.rh-appcard-stat` × download/heart) |

-----

-----

## Recurring patterns worth knowing before the next pass

- **Background-image gradients silently defeat background-color overrides.**
  Hit three times in the alpha8 sweep (`.rh-tagline`, `.rh-proof-bar`, and by
  extension worth checking any other promotional card). If a card stays its
  native color despite a `background-color: ... !important` rule, check
  whether it actually uses `background-image` (a gradient) — that needs its
  own `background-image: none !important` on top.
- **Headings/emphasized text inside a themed card often carry their own
  explicit color, which doesn't inherit from the card's color rule.** Hit on
  `.rh-tagline-title`/`.rh-tagline-sub`, `.rh-feed-post__body` headings, and
  `.rh-feed-channel-head__title`/`__desc`. When a card's background goes dark
  but its heading text stays dark-on-dark, this is almost always the cause —
  target the heading directly rather than assuming inheritance will work.
- **`!important` on both sides doesn't cancel out specificity.** A plain
  class override like `.button.is-dark { ... !important }` can still lose to
  a more specific site rule like `.search .button.is-dark { ... }` (3
  classes vs. 2), even with `!important` on the override too — among
  competing `!important` declarations, specificity is still the tiebreaker,
  source order only decides ties. Hit on the search bar's submit button
  (alpha10). If a themed element stays its native color despite an
  `!important` override that looks like it should apply, check whether the
  site has a more specific descendant-selector rule targeting the same
  property, and match its specificity rather than assuming `!important`
  alone wins.
- **A "requires scrolling" complaint may be an intentional site component,
  not a bug** — check the real CSS before assuming a fix is simple.
  `.rh-scroll--stats` (alpha9/10) turned out to be the site's horizontal-
  carousel pattern (`display:flex`, fixed-width children via `flex:0 0 Npx`,
  `scroll-snap-type:x mandatory`), the same one used for the Trending Coders
  dev-card strip elsewhere — deliberate, not an overflow bug. Eliminating it
  needed an explicit `display:grid` override, not a tweak to existing rules.
- **Cloudflare's bot-challenge can block the check skill after roughly
  8-10 rapid automated requests in a short window**, even against a
  same-origin-friendly `X-Frame-Options: SAMEORIGIN` site. It doesn't behave
  like simple rate-limiting — a wait-and-reload doesn't clear it reliably.
  Space out live checks rather than looping rapidly through many pages; when
  it happens mid-sweep, fall back to a previously-saved authenticated export
  extracted to a local file (strip the outer prism.js viewer wrapper down to
  the second `<!DOCTYPE html>` occurrence, then point the check skill at the
  resulting `file://` path).
- **RoutineHub itself is actively shipping changes underneath this
  userscript.** Twice now (alpha15's changelog redesign, alpha16's search
  label) a "confirmed clean" or "not yet touched" page turned out to have
  new site markup since it was last checked. There's no way to detect this
  proactively from here — it only surfaces when fresh HTML or a fresh
  screenshot is provided. Treat any earlier "confirmed clean" note as a
  snapshot in time, not a permanent guarantee, especially for pages that
  haven't been re-checked in a while.

## Tools

- **`userscript-browser-check` skill** — headless-browser render/screenshot
  loop for verifying this script's actual visual effect without manual
  HTML/PDF exports. General-purpose, not specific to this project.
- Syntax validation: `node --check "RoutineHub Enhancer.user.js"` after every
  edit, per project convention.
