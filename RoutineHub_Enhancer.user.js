// ==UserScript==
// @name         RoutineHub Enhancer
// @version      1.0.0-alpha23
// @license      MIT
// @author       Tojioo
// @description  Dark mode plus UX improvements for RoutineHub: quick changelog access, collapsible comment threads
// @match        https://routinehub.co/*
// @grant        GM.addStyle
// ==/UserScript==

// Based on Dark Mode RoutineHub by gluebyte (MIT):
// https://routinehub.co/user/gluebyte
// Original dark mode styling and layout tweaks kept intact below; UX additions
// (changelog quick-access button, collapsible comment threads) are new.

(function () {
	"use strict";

	// ---- Theme sync: match RoutineHub's own dark mode toggle, not just the OS ----
	// Our theme activates when EITHER the OS prefers dark OR RoutineHub's own
	// data-theme=dark attribute is set, their in-app toggle, independent of
	// the OS setting. Verified via a real four state pixel matrix, OS times
	// their toggle, against live screenshots. This OR condition is the one
	// that closes the single confirmed gap, OS light plus their toggle dark,
	// where cards and body fell through to their native palette while our
	// unconditional chrome rules still applied. A plain
	// @media(prefers-color-scheme:dark) query can't express an OR against a
	// DOM attribute, so the whole dark mode block below is driven by a JS
	// toggled class, .rhe-dark on the html element, instead of a media
	// query. Confirmed with a live test in both Chromium and WebKit that
	// relaxed CSS nesting, bare selectors like body, .modal { ... } inside
	// html.rhe-dark { ... }, correctly resolves to html.rhe-dark body,
	// html.rhe-dark .modal { ... } without needing an explicit & prefix on
	// each one.
	//
	// Also drives the toggle's own visual state (icon, knob position) to
	// match, not just page colors. Their dark visual state turned out to be
	// driven entirely by plain html[data-theme=dark] CSS with hardcoded
	// values, not aria-checked, so those exact values are re-keyed onto
	// html.rhe-dark below. This fixes the reported icon mismatch, OS dark
	// with their toggle set to light previously showed a sun icon on a
	// fully dark page, now the icon reflects what is actually rendered
	// regardless of which signal caused it. aria-checked on their button is
	// also kept in sync for the same reason, a screen reader should report
	// the switch as on when the page is actually dark.
	function syncThemeClass() {
		const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const theirDark = document.documentElement.getAttribute('data-theme') === 'dark';
		const effectiveDark = osDark || theirDark;
		document.documentElement.classList.toggle('rhe-dark', effectiveDark);
		document.querySelector('.rh-theme-toggle')?.setAttribute('aria-checked', String(effectiveDark));
	}

	function initThemeSync() {
		syncThemeClass();
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeClass);
		new MutationObserver(syncThemeClass).observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});
	}

	initThemeSync();

	// ---- Dark mode & layout tweaks (gluebyte, Dark Mode RoutineHub v1.1) ----
	GM.addStyle(
`.section { padding: 1rem !important; }
.rh-hero-row, .rh-section { margin-bottom: 8px !important; height: auto !important; }
.rh-section-header { margin-bottom: 4px !important; }
.rh-topcard { padding: 10px 8px !important; }
.rh-detail { padding: 8px !important; margin: 0 !important;}
.feedback .media .media { padding-left: .5rem !important; }
.shortcut article.media { padding: .5rem 0 0 0 !important; }
.rh-creator-line { display: block; margin-bottom: 0.4em; }
@media (max-width: 600px) {
	.rh-scroll--stats .rh-stat { padding: 10px 6px !important; min-width: 74px !important; }
	.rh-scroll--stats .rh-stat__value { font-size: 1.35rem !important; }
	.rh-pubgraph__chart { transform: scale(0.9); transform-origin: top left; }
}
/* .rh-scroll--stats is the site's horizontal-carousel component (flex row,
   scroll-snap, fixed-width .rh-stat children via ">" combinator) -- the same
   pattern used for the Trending Coders dev card strip. Overridden to wrap
   onto multiple rows instead of scrolling, per explicit request; "flex"
   on .rh-stat itself needs no override since grid layout ignores flex-*
   properties on its items. The carousel pattern elsewhere on the site is
   left alone -- this is scoped to the stats row specifically. */
.rh-scroll--stats {
	display: grid !important;
	grid-template-columns: repeat(3, 1fr) !important;
	overflow: visible !important;
	gap: 10px;
	margin-bottom: 10px !important;
}
/* Secondary stat group (everything besides Followers/Following/Downloads),
   built by splitStatsOverview() and hidden until the toggle button below is
   pressed -- same condense-and-reveal shape as Publish Activity's toggle.
   Its own full grid declaration, not shared with .rh-scroll--stats: that
   class's "display: grid !important" would otherwise beat the toggle's
   plain (non-!important) inline "display: none" every time. All 4 fit on one
   row. Labels are visually hidden here (not deleted -- see below), so the
   icon carries the meaning alone; freed-up vertical space goes to a larger
   icon and value instead of keeping everything shrunk. */
.rh-stats-secondary {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 6px;
	margin-top: 10px;
	margin-bottom: 20px !important;
}
.rh-stats-secondary .rh-stat {
	padding: 10px 4px !important;
	border-radius: 8px;
	position: relative;
}
.rh-stats-secondary .rh-stat__icon {
	font-size: 1.3rem !important;
	margin-bottom: 0;
}
.rh-stats-secondary .rh-stat__value {
	font-size: 1.2rem !important;
}
/* Visually hidden, not display:none or removed -- a screen reader still
   gets "0 Skills", not just "0" with no context. Icon meaning is
   established consistently on the "New" page (bolt = Shortcut, terminal =
   Prompt, scroll = Skill, puzzle = Plugin -- addStatIcons() below uses the
   same glyphs), which is what makes dropping the visible caption here
   reasonable rather than just saving space at the cost of clarity. */
.rh-stats-secondary .rh-stat__label {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
/* Bulma's own .button rules apparently tie or beat this on specificity --
   margin-bottom was silently dropped (button sat flush against the next
   card). !important forces it regardless of the exact competing rule. */
.rh-stats-toggle { margin-bottom: 20px !important; }
.rh-stat { border-radius: 10px; padding: 14px 10px !important; }
/* Icon is a sibling of .rh-stat__label/__value (inserted as .rh-stat's first
   child by addStatIcons(), not nested inside the label) so flex "order" can
   put it on its own row above the value -- icon/value/label stacked, instead
   of an icon crammed inline before the label text. Smaller and in the accent
   color rather than a dimmed neutral: at 1.4rem/45%-opacity it read as too
   large and too washed out to actually register as an icon. */
.rh-stat__icon { order: 1; font-size: 1rem; margin-bottom: 2px; }
.rh-stat__value { order: 2; }
.rh-stat__label { order: 3; font-size: 0.72rem; }
/* Condensed Publish Activity preview: a weekly bar chart, not a shrunk clone
   of the heatmap. A 13-cluster of tiny colored squares needing a month label
   above and a day label to the left to decode is exactly what made the full
   chart hard to read; a bar per week with its own date label under it reads
   directly with no cross-referencing, and bars stretching to fill the card's
   width removes the dead space a small fixed-size cluster left behind. */
.rh-pubgraph__mini { margin-top: 10px; }
.rh-pubgraph__minibar-row { display: flex; align-items: flex-end; gap: 3px; height: 48px; }
.rh-pubgraph__minibar { flex: 1 1 0; max-width: 24px; background: var(--rh-accent); border-radius: 4px 4px 0 0; min-height: 2px; }
.rh-pubgraph__minibar-labels { display: flex; gap: 3px; margin-top: 4px; }
.rh-pubgraph__minibar-labels span { flex: 1 1 0; max-width: 24px; font-size: 10px; text-align: center; white-space: nowrap; overflow: visible; }
.rh-pubgraph-toggle { margin-top: 0.75em; }
`);
	document.querySelectorAll('.rh-topcard-action, .rh-listrow-action').forEach(a => a.remove());
	if (window.location.pathname === '/') {
		// Upstream fix (gluebyte, Dark Mode RoutineHub v1.2): the naive
		// same-index reorder (a.parentElement.children[i]) broke once the
		// homepage grew more filtered sections than it had when that logic
		// was written -- the new AI Prompts/Skills/Plugins sections shifted
		// everything after them out of place. Explicit target-slot mapping
		// (some sections deliberately land on the same index) instead of a
		// 1:1 index fixes it. Ported verbatim; this is a functional bug fix,
		// not a styling choice, so no reason to diverge from upstream here.
		let sections = document.querySelectorAll('.rh-section');
		let container = document.querySelector('.rh-container');
		Array.from(sections)
		.filter(e => !e.firstElementChild.firstElementChild.textContent.endsWith(' AI')
			&& e.children[1].className === 'rh-scroll'
			|| e.children[1].className === 'rh-topgrid')
		.forEach((a,i) => container.insertBefore(a, container.children[[0,0,1,2,2,3,3][i]]));
	}

	// ---- Palette variables + chrome that's dark by the site's own default ----
	// The top navbar, its expanded mobile menu, the footer, and the "dark"
	// button variant (which covers the primary/danger-dark red buttons too)
	// are already dark regardless of the OS light/dark setting, so these
	// apply unconditionally rather than only inside the dark-mode block below.
	GM.addStyle(
`:root {
	--rh-bg: #0C1311;
	--rh-surface-1: #112320;
	--rh-surface-2: #1D424A;
	--rh-border: #17302D;
	--rh-text: #CBD9D7;
	--rh-accent: #00DBAC;
	--rh-accent-dim: rgba(0, 219, 172, 0.12);
	--rh-input-bg: #C7D6D4;
}
.footer, .navbar, .navbar-menu, .navbar-dropdown, .dropdown-menu {
	color: var(--rh-text) !important;
}
.footer {
	background-color: var(--rh-surface-1) !important;
}
/* Bulma's dropdown has two layers: .dropdown-menu (positioning wrapper,
   transparent by default) and .dropdown-content (the actual visible card,
   white by default). The Sort dropdown uses both layers; the account-menu
   dropdown skips .dropdown-content and puts items directly in
   .dropdown-menu. Covering both classes handles either shape regardless of
   which one carries the real background for a given dropdown instance. */
.navbar, .navbar-menu, .navbar-dropdown, .dropdown-menu, .navbar-item, .dropdown-content {
	background-color: var(--rh-surface-2) !important;
}
.footer a, .navbar a, .navbar-item, .dropdown-menu a, .search-button__label {
	color: var(--rh-accent) !important;
}
/* Expanded search bar (tap the navbar search icon) uses Bulma's
   has-background-primary-dark utility class -- the site's brand maroon, not
   theme-aware. Same "always dark chrome" bucket as the navbar/footer above,
   so unconditional rather than dark-mode-gated. */
.search {
	background-color: var(--rh-surface-2) !important;
}
.button.is-dark {
	background-color: var(--rh-surface-2) !important;
	color: var(--rh-text) !important;
	border-color: var(--rh-border) !important;
}
/* The site's own CSS has a more specific ".search .button.is-dark" rule
   (its own brand maroon, #61124b) that outranks the plain ".button.is-dark"
   override above on specificity alone -- !important on both sides doesn't
   change that, since specificity is still the tiebreaker between competing
   !important declarations. Needs a selector of matching specificity. */
.search .button.is-dark {
	background-color: var(--rh-surface-2) !important;
}`);

	GM.addStyle(
`html.rhe-dark {
	/* Re-keyed from RoutineHub's own html[data-theme=dark] .rh-theme-toggle
	   rules, exact values, so the toggle's icon and knob always match what
	   is actually rendered instead of only their own stored preference. */
	.rh-theme-toggle {
		background-color: #3d3a45 !important;
	}
	.rh-theme-toggle__knob {
		transform: translateX(24px) !important;
		background-color: #d8d8dd !important;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .55), inset -3px -2px 0 rgba(0, 0, 0, .12) !important;
	}
	.rh-theme-toggle__cloud {
		transform: translate(-32px, 5px) !important;
	}
	.rh-theme-toggle__stars {
		opacity: 1 !important;
	}
	/* .rh-feed-interstitial, .rh-checkin__label, .rh-feed-post--text
	   .rh-feed-post__body, .rh-topcard-brief: found via gluebyte's own Dark
	   Mode RoutineHub v1.2 update, still not independently confirmed here.
	   gluebyte's .rh-checkin/.rh-feed-composer/.rh-devcard additions in that
	   update independently matched fixes already made here, which is why the
	   rest of that diff was trusted rather than re-verified line by line.
	   .rh-appcard-brief and .rh-price (also from that diff) are now confirmed
	   correct via a live screenshot of the real Shortcuts listing page --
	   the remaining four are still added on the strength of the pattern
	   alone (BEM sub-elements keep carrying their own hardcoded color all
	   session), not on direct evidence. */
	body, .modal, .shortcut-card, .notification-card, .rh-card, .rh-hero-header, .box, .rh-listrow, .rh-tagline, .rh-checkin, .rh-feed-composer, .rh-devcard, .rh-feed-login-cta, .rh-proof-bar, .rh-feed-interstitial {
		background-color: var(--rh-bg) !important;
		color: var(--rh-text) !important;
	}
	body strong, .title, .rh-section-title, .rh-appcard-name, .rh-topcard-name, .rh-listrow-name, .rh-listrow-brief, .heading, .card-content nav, .card-content strong, .card-content small, .level-item, .content h1, .content h2, .content h3, .content h4, .content h5, .content h6, .content table thead td, .content table thead th, pre, .rh-hero-header__title, .rh-hero-header__brief, .rh-card__title, .content, .rh-info-list__value, .rh-release__notes, .notification-text, .rh-stat__value, .textarea, blockquote, .rh-notification__quote, .rh-feed-empty-hint, .rh-changelog__subtitle, .rh-release__version, .rh-changelog__ios, .rh-changelog__downloads, .rh-price, .rh-checkin__label, .rh-appcard-brief, .rh-topcard-brief, .rh-feed-post--text .rh-feed-post__body {
		color: var(--rh-text) !important;
	}
	/* "text-muted" reads as a generic de-emphasis utility (used at least on
	   the changelog's absolute-time span), not a component-specific class --
	   themed globally rather than scoped, on the same reasoning as the
	   placeholder/quote contrast fixes: muted text should dim, never
	   disappear, regardless of which component happens to use the utility. */
	.text-muted {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	/* Same muted tier as .text-muted, same trust level as the six selectors
	   in the comment above (from gluebyte's v1.2, not independently
	   screenshot-confirmed): .rh-hero-header__meta, .rh-release__date,
	   .rh-feed-post__verb. gluebyte grouped these with .rh-appcard-brief/
	   .rh-topcard-brief as a #999 secondary tier; those two are already in
	   the full-text rule above rather than reshuffled here, since the
	   difference is a subtle emphasis nuance not worth churning without
	   visual confirmation either way. */
	.rh-hero-header__meta, .rh-release__date, .rh-feed-post__verb {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	/* .rh-stat__label keeps its native #777 (fine against the site's own
	   white card) -- against --rh-surface-2 that's under 2.5:1 contrast, well
	   short of the 4.5:1 minimum. .rh-stat__icon uses the accent color at
	   full strength rather than a dimmed neutral -- muted-gray-on-dark-teal
	   read as too washed out to register as an icon at all. */
	.rh-stat__label {
		color: rgba(203, 217, 215, 0.85) !important;
	}
	.rh-stat__icon {
		color: var(--rh-accent) !important;
	}
	/* This floating label sits ON TOP of .input (a "transparent-control"
	   overlay, not a real placeholder -- the input's placeholder is just a
	   single space). .input keeps a light background intentionally for
	   native contrast, so the label needs dark text here, not the light
	   text color used everywhere else against dark cards. */
	.field-new-control .field-label {
		color: var(--rh-bg) !important;
	}
	a {
		color: var(--rh-accent) !important;
	}
	.rh-topcard, .shortcut .description .content blockquote, code, pre, .field-new-control, .rh-cta--secondary, blockquote, .rh-feed-post, .textarea, .rh-stat, .rh-pubgraph__cell--l0, .rh-feed-composer__submit {
		background-color: var(--rh-surface-2) !important;
	}
	.card, .rh-card, .rh-hero-header, .box, .rh-tagline, .rh-checkin, .rh-feed-composer, .rh-devcard, .rh-feed-login-cta, .rh-feed-post, .rh-proof-bar, .rh-stat, .rh-feed-interstitial {
		box-shadow: 0 .5em 1em -.125em var(--rh-accent-dim), 0 0 0 1px rgba(0, 219, 172, 0.05) !important;
	}
	.input, .select select, hr {
		background-color: var(--rh-input-bg) !important;
	}
	.rh-notification--unread {
		background: var(--rh-accent-dim) !important;
	}
	.rh-listrow, .rh-card, .rh-hero-header, .card, .box, .rh-tagline, .rh-checkin, .rh-feed-composer, .rh-devcard, .rh-feed-login-cta, .rh-feed-post, .rh-proof-bar, .rh-stat, .rh-feed-interstitial {
		border: 1px solid var(--rh-border) !important;
	}
	.textarea::placeholder, .input::placeholder, .rh-feed-composer__textarea::placeholder {
		color: rgba(203, 217, 215, 0.65) !important;
		opacity: 1 !important;
	}
	#feedback .rh-top-comment {
		background-color: var(--rh-surface-1) !important;
		border: 1px solid var(--rh-border) !important;
		border-radius: 10px !important;
		padding: 0.85rem 0.9rem !important;
		margin-bottom: 0.75rem !important;
	}
	.rh-notification__quote {
		opacity: 1 !important;
	}
	/* .rhnew-card ("Create something new" picker) uses inline styles for
	   background/border/text color, not classes -- none are !important, so
	   these rules still win. Title/description text has no distinguishing
	   class, only inline color, so targeted structurally: the text wrapper is
	   the last direct <span> child (the icon wrapper is the other one), and
	   title/description are its two children. */
	.rhnew-card {
		background: var(--rh-bg) !important;
		border-color: var(--rh-border) !important;
	}
	.rhnew-card > span:last-of-type > span {
		color: var(--rh-text) !important;
	}
	.rhnew-card .fa-chevron-right {
		color: var(--rh-text) !important;
	}
	/* The page heading above the cards ("Create something new" + subtitle)
	   sits in a plain unclassed <div>, inline color:#000/#6b7280 directly on
	   the h1/p with no class at all -- .rhnew-card's fix never touched it
	   since it's outside those elements entirely. Only class in reach is the
	   .rhnew-wrap container; there's exactly one h1 and one p in it (the
	   cards use spans, not p tags, for their own text), so this is safe. */
	.rhnew-wrap h1 {
		color: var(--rh-text) !important;
	}
	.rhnew-wrap > div > p {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	/* .rh-tagline uses a background-image gradient layered on top of any
	   background-color, so the color-only rule above has no visible effect
	   here -- needs its own background-image reset. Title/subtitle also carry
	   their own explicit color (not inherited from the container), same
	   pattern as the feed post headings above. .rh-tagline-accent ("Earn")
	   is left alone -- already legible, and it's a deliberate brand accent.
	*/
	.rh-tagline {
		background-image: none !important;
	}
	.rh-proof-bar {
		background-image: none !important;
	}
	.rh-tagline-title, .rh-tagline-sub, .rh-feed-channel-head__title, .rh-feed-channel-head__desc {
		color: var(--rh-text) !important;
	}
	/* Markdown-rendered feed post bodies (.markdown-content) aren't covered by
	   the .content heading rule above -- headings there carry their own dark
	   color from the site's prose styles, unlike plain paragraphs which just
	   inherit and were already readable. */
	.rh-feed-post__body h1, .rh-feed-post__body h2, .rh-feed-post__body h3, .rh-feed-post__body h4, .rh-feed-post__body h5, .rh-feed-post__body h6, .rh-feed-post__body strong {
		color: var(--rh-text) !important;
	}
	/* .rh-rail: the sidebar navigation that replaced the old flat
	   navbar-menu dropdown (2026-09-13). RoutineHub already ships full
	   native dark-mode coverage for it, confirmed in their own stylesheet,
	   but it's gated to their literal html[data-theme=dark] attribute, the
	   same category of gap the theme toggle icon fix above closes, just for
	   a different component. Re-keyed with this project's own --rh-*
	   palette rather than copied verbatim, so the sidebar matches the rest
	   of the theme instead of introducing their gray-purple palette as a
	   one-off. .rh-rail__count (a red unread-style badge) and .rh-rail__join
	   (the ad-free/HubSign promo banner, indigo in both of their own light
	   and dark versions) are deliberately left native -- same reasoning as
	   the Announcement/Creator badges and .rh-cta elsewhere: consistent
	   semantic/brand colors the site already applies deliberately, not a
	   contrast bug. Not yet live-verified -- built from real extracted
	   markup and their real CSS values, not a screenshot guess, but the
	   site's own auth-gated rendering couldn't be reached this session. */
	.rh-rail {
		background: var(--rh-bg) !important;
		border-right: 1px solid var(--rh-border) !important;
	}
	.rh-rail__close {
		color: var(--rh-text) !important;
		opacity: 0.65;
	}
	.rh-rail__close:hover {
		opacity: 1;
	}
	.rh-rail__search {
		border: 1px solid var(--rh-border) !important;
		background: var(--rh-surface-2) !important;
		color: rgba(203, 217, 215, 0.65) !important;
	}
	.rh-rail__search:hover {
		background: var(--rh-surface-1) !important;
		color: var(--rh-text) !important;
	}
	.rh-rail__link, .rh-rail__sublink, .rh-rail__treelink {
		color: var(--rh-text) !important;
	}
	.rh-rail__link:hover, .rh-rail__sublink:hover, .rh-rail__treelink:hover {
		background: var(--rh-surface-1) !important;
		color: var(--rh-accent) !important;
	}
	.rh-rail__link.is-active, .rh-rail__sublink.is-active {
		background: var(--rh-accent) !important;
		color: var(--rh-bg) !important;
	}
	.rh-rail__hash, .rh-rail__sublink--locked, .rh-rail__title, .rh-rail__chev, .rh-rail__social a, .rh-rail__toggle {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	.rh-rail__sublink--locked:hover, .rh-rail__chev:hover, .rh-rail__social a:hover, .rh-rail__toggle:hover {
		background: var(--rh-surface-1) !important;
		color: var(--rh-text) !important;
	}
	.rh-rail__tree::before, .rh-rail__treelink::before {
		background: var(--rh-border) !important;
	}
	.rh-rail__group, .rh-rail__foot, .rh-rail__bottom {
		border-top: 1px solid var(--rh-border) !important;
	}
}`);

	// ---- Keep the navbar themed while the search overlay is active ----
	// Reported: opening search (from within the hamburger menu) makes the
	// navbar and navbar-menu itself go native dark-navy instead of staying
	// themed -- not just the search bar, which already has its own fix
	// above. No visible evidence in any static HTML capture of what causes
	// this (no modifier class shows up in any page source seen), so the
	// likely mechanism is either a class toggled at runtime via JS, or a
	// CSS sibling-selector rule keyed off .search's own hide/show state --
	// either way, invisible to a static export and not confidently
	// targetable with a plain selector. Sidesteps the guessing entirely: an
	// inline !important style set directly on the elements beats ANY
	// stylesheet rule regardless of its selector or specificity, so this
	// just re-asserts our colors every time .search's class list changes
	// (covers both opening and closing) rather than trying to out-specify
	// whatever the competing rule turns out to be. Unverified against the
	// live site -- Cloudflare blocked every attempt to reproduce this
	// interaction this session, so this is reasoned from the two
	// screenshots provided, not confirmed fixed firsthand.
	function keepNavbarThemedDuringSearch() {
		const navbar = document.querySelector('.navbar');
		const navbarMenu = document.querySelector('.navbar-menu');
		const searchPanel = document.querySelector('.search');
		if (!navbar) return;

		const enforce = () => {
			[navbar, navbarMenu].forEach(el => {
				if (!el) return;
				el.style.setProperty('background-color', 'var(--rh-surface-2)', 'important');
				el.style.setProperty('color', 'var(--rh-text)', 'important');
			});
		};

		enforce();
		const observer = new MutationObserver(enforce);
		observer.observe(navbar, { attributes: true, attributeFilter: ['class'] });
		if (searchPanel) observer.observe(searchPanel, { attributes: true, attributeFilter: ['class'] });
	}

	// ---- TEMPORARY DEBUG: diagnose the search/navbar color bug ----
	// Remove this whole function and its call site once diagnosed. Watches
	// class/style/computed-background on navbar, navbar-menu, search, and
	// body, and logs every change. To use: open the console, open the
	// hamburger menu, tap search, and copy back whatever prints under
	// "[RHE debug]". If keepNavbarThemedDuringSearch() above is already
	// fully fixing it, this will just show the color staying correct
	// throughout -- also useful to know.
	function debugNavbarSearchIssue() {
		const navbar = document.querySelector('.navbar');
		const navbarMenu = document.querySelector('.navbar-menu');
		const searchPanel = document.querySelector('.search');
		const log = (...args) => console.log('[RHE debug]', ...args);

		const snapshot = label => {
			log(label, {
				navbarClass: navbar?.className,
				navbarBg: navbar && getComputedStyle(navbar).backgroundColor,
				navbarMenuClass: navbarMenu?.className,
				navbarMenuBg: navbarMenu && getComputedStyle(navbarMenu).backgroundColor,
				searchClass: searchPanel?.className,
				searchBg: searchPanel && getComputedStyle(searchPanel).backgroundColor,
				bodyClass: document.body.className,
			});
		};

		log('elements found:', { navbar: !!navbar, navbarMenu: !!navbarMenu, searchPanel: !!searchPanel });
		snapshot('initial state');

		[navbar, navbarMenu, searchPanel, document.body].forEach(el => {
			if (!el) return;
			new MutationObserver(muts => {
				muts.forEach(m => log('mutation:', el.className || el.tagName, '-', m.attributeName, 'changed'));
				snapshot('state after mutation');
			}).observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
		});
	}

	// ---- Changelog quick-access button ----
	// The "Version history" link normally sits inside the "Latest Release Notes"
	// card, far below the fold. Cloning it into the top CTA row (next to Get
	// Shortcut / Edit / New Version / RoutinePub) makes it reachable without
	// scrolling. Scoped to the release notes card specifically, since the site
	// footer also has a link containing "/changelog" (the sitewide one).
	function addChangelogButton() {
		const ctaRow = document.querySelector('.rh-hero-header__cta');
		if (!ctaRow || ctaRow.querySelector('.rh-changelog-shortcut')) return;

		const versionLink = document.querySelector('.rh-release__version')
			?.closest('.rh-card')
			?.querySelector('a[href*="/changelog"]');
		if (!versionLink) return;

		const btn = versionLink.cloneNode(false);
		btn.className = 'rh-cta rh-cta--secondary rh-changelog-shortcut';
		btn.innerHTML = '<i class="fas fa-history"></i> Changelog';
		ctaRow.appendChild(btn);
	}

	// ---- Extra metadata in the hero row ----
	// The hero's meta line (above the CTA buttons) already shows author and
	// download count; Version, iOS, and Updated live only in the Information
	// card much further down. Duplicating them up top saves a scroll for info
	// that's already on the page.
	function addHeroMetadata() {
		const meta = document.querySelector('.rh-hero-header__meta');
		if (!meta || meta.querySelector('.rh-meta-extra')) return;

		const infoItems = document.querySelectorAll('.rh-info-list__item');
		if (!infoItems.length) return;

		const wanted = {
			Version: { icon: 'fa-code-branch', prefix: 'v' },
			iOS: { icon: 'fa-mobile-alt', prefix: 'iOS ' },
			Updated: { icon: 'fa-clock', prefix: '' },
		};
		infoItems.forEach(item => {
			const label = item.querySelector('.rh-info-list__label')?.textContent.trim();
			const config = wanted[label];
			if (!config) return;

			const value = item.querySelector('.rh-info-list__value')?.textContent.trim();
			if (!value) return;

			const span = document.createElement('span');
			span.className = 'rh-meta-extra';
			span.innerHTML = `<i class="fas ${config.icon}"></i> ${config.prefix}${value}`;
			meta.appendChild(span);
		});
	}

	// ---- Creator on its own line ----
	// The "by @author [tags]" span is the first child of the meta row, mixed in
	// with download count / hearts / version / iOS / updated. Moving it out to
	// a sibling <p> before that row puts it on its own line for free, no flex
	// trickery needed, since it's no longer competing for space with siblings.
	function promoteCreatorLine() {
		const meta = document.querySelector('.rh-hero-header__meta');
		const body = document.querySelector('.rh-hero-header__body');
		if (!meta || !body || document.querySelector('.rh-creator-line')) return;

		const creatorSpan = meta.querySelector(':scope > span');
		if (!creatorSpan || !creatorSpan.textContent.trim().startsWith('by')) return;

		creatorSpan.classList.add('rh-creator-line');
		body.insertBefore(creatorSpan, meta);
	}

	// ---- Free stats summary above Required Apps ----
	// Only the shortcut owner sees the native "Your Analytics" sidebar card, and
	// only that card links to the full /stats page, so its presence is exactly
	// the right gate. The numbers are NOT server-rendered or embedded in the
	// page source at all: the page's own script calls two JSON endpoints and
	// fills the DOM in afterward, both explicitly commented "FREE: always
	// load" in that script -- /get-engagement-stats for hearts/feedback
	// totals, /get-visit-stats for referrers and direct/internal entry counts.
	// Calling those directly is what the page itself does, so it carries none
	// of the risk an iframe would (some sites block same-origin framing
	// entirely via X-Frame-Options, which silently yields an empty document).
	async function addFreeStatsSummary() {
		const nativeCard = document.querySelector('.rh-stats-card');
		const statsLink = nativeCard?.querySelector('.rh-stats-card__btn');
		const shortcutId = statsLink?.href.match(/\/shortcut\/(\d+)\/stats/)?.[1];
		if (!shortcutId || document.querySelector('.rh-free-stats')) return;

		const anchor = Array.from(document.querySelectorAll('.rh-card')).find(
			c => c.querySelector('.rh-card__title')?.textContent.trim() === 'Required Apps'
		) ?? document.querySelector('.rh-card');
		if (!anchor) return;

		const card = document.createElement('div');
		card.className = 'rh-card rh-free-stats';
		card.innerHTML = '<h2 class="rh-card__title">Stats</h2><p class="rh-free-stats__status">Loading\u2026</p>';
		anchor.before(card);
		const status = card.querySelector('.rh-free-stats__status');

		const getJson = async endpoint => {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 10000);
			try {
				const res = await fetch(`/shortcut/${shortcutId}/${endpoint}`, { credentials: 'same-origin', signal: controller.signal });
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return await res.json();
			} finally {
				clearTimeout(timeout);
			}
		};

		let engagement, visits;
		try {
			[engagement, visits] = await Promise.all([
				getJson('get-engagement-stats'),
				getJson('get-visit-stats'),
			]);
		} catch {
			status.textContent = "Couldn't load stats.";
			return;
		}

		const hearts = engagement?.total_hearts;
		const feedback = engagement?.total_feedback;
		const directCount = visits?.direct_entry_count;
		const internalCount = visits?.internal_entry_count;
		const referrers = (visits?.top_referrers ?? []).slice(0, 5).map(r => `${r.referrer_domain} - ${r.count}`);
		if (hearts == null && feedback == null && !referrers.length) {
			card.remove();
			return;
		}

		const row = (label, value) => value != null
			? `<div class="rh-info-list__item"><p class="rh-info-list__label">${label}</p><p class="rh-info-list__value">${value}</p></div>`
			: '';

		card.innerHTML = `
			<h2 class="rh-card__title">Stats</h2>
			<div class="rh-info-list">
				${row('Hearts', hearts)}${row('Feedback', feedback)}${row('Direct Entries', directCount)}${row('Internal Entries', internalCount)}
			</div>
			${referrers.length ? `<p class="rh-info-list__label" style="margin-top:16px;">Top Referrers</p><ul class="fa-ul" style="margin-top:6px;">${referrers.map(r => `<li class="mb-1">${r}</li>`).join('')}</ul>` : ''}
		`;
	}

	// ---- Required Apps in place of the ad-free pitch ----
	// Moves the actual node rather than copying it, so its own markup (icons,
	// links, alt text) stays intact and there's nothing to keep in sync.
	function promoteRequiredApps() {
		const pitch = document.querySelector('.rh-install-pitch');
		if (!pitch) return;

		const appsCard = Array.from(document.querySelectorAll('.rh-card')).find(
			card => card.querySelector('.rh-card__title')?.textContent.trim() === 'Required Apps'
		);
		if (!appsCard || !appsCard.querySelector('.rh-apps-grid__item')) return;

		pitch.replaceWith(appsCard);
	}

	// ---- Profile: icons on the Author Overview stat strip ----
	// Icon is inserted as .rh-stat's first child -- a sibling of __label and
	// __value, not nested inside the label -- so CSS "order" can stack them
	// icon-on-top / value-in-the-middle / label-as-caption instead of cramming
	// an icon inline before the label text (too tight, hard to read at the
	// sizes that fit in a small stat tile). Shortcuts/Skills/Prompts/Plugins
	// use the same glyphs as the "New" page's own icons (fa-bolt/fa-scroll/
	// fa-terminal/fa-puzzle-piece) for a consistent icon language across the
	// site -- deliberate, not incidental, since splitStatsOverview() below
	// relies on these being recognizable without a visible label.
	function addStatIcons() {
		const icons = {
			Followers: 'fa-user-friends',
			Following: 'fa-user-plus',
			Shortcuts: 'fa-bolt',
			Skills: 'fa-scroll',
			Prompts: 'fa-terminal',
			Plugins: 'fa-puzzle-piece',
			Downloads: 'fa-download',
		};
		document.querySelectorAll('.rh-scroll--stats .rh-stat').forEach(stat => {
			if (stat.querySelector(':scope > .rh-stat__icon')) return;
			const label = stat.querySelector(':scope > .rh-stat__label');
			const icon = icons[label?.textContent.trim()];
			if (!icon) return;
			const i = document.createElement('i');
			i.className = `fas ${icon} rh-stat__icon`;
			stat.prepend(i);
		});
	}

	// ---- Profile: Followers/Following/Downloads up front, the rest behind a toggle ----
	// Seven equal-weight tiles buried content-type counts (Skills/Prompts/
	// Plugins) that are usually zero next to the three numbers people
	// actually look at. Same condense-and-reveal shape as
	// condensePublishActivity() below: primary set always visible, secondary
	// set built as its own hidden grid, one button toggles it. Must run after
	// addStatIcons() so the moved tiles keep their icons.
	function splitStatsOverview() {
		const PRIMARY_LABELS = ['Followers', 'Following', 'Downloads'];
		const container = document.querySelector('.rh-scroll--stats');
		if (!container || container.dataset.rhSplit) return;

		const stats = Array.from(container.querySelectorAll(':scope > .rh-stat'));
		if (stats.length <= PRIMARY_LABELS.length) return;

		const labelOf = stat => stat.querySelector(':scope > .rh-stat__label')?.textContent.trim();
		const primary = PRIMARY_LABELS.map(name => stats.find(stat => labelOf(stat) === name)).filter(Boolean);
		const secondary = stats.filter(stat => !primary.includes(stat));
		if (!secondary.length) return;

		container.dataset.rhSplit = 'true';

		const secondaryGrid = document.createElement('div');
		secondaryGrid.className = 'rh-stats-secondary';
		secondaryGrid.style.display = 'none';
		secondary.forEach(stat => secondaryGrid.appendChild(stat)); // also removes each from container
		primary.forEach(stat => container.appendChild(stat)); // reorders remaining (primary-only) children

		container.after(secondaryGrid);

		const toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.className = 'button is-dark is-fullwidth rh-stats-toggle';
		toggle.textContent = `Show ${secondary.length} more stats`;
		toggle.addEventListener('click', () => {
			const expanding = secondaryGrid.style.display === 'none';
			secondaryGrid.style.display = expanding ? '' : 'none';
			toggle.textContent = expanding ? 'Show less' : `Show ${secondary.length} more stats`;
		});
		secondaryGrid.after(toggle);
	}

	// ---- Profile: condensed Publish Activity, expandable to the full year ----
	// The native chart is a heatmap: a value needs a month label above AND a
	// day label to the left to decode, and at heatmap density (11px cells) a
	// 13-week window only fills a fraction of the card's width. A weekly bar
	// chart reads directly instead -- one bar per week, height = that week's
	// total, a date label sits right under its own bar, and bars stretch to
	// fill the available width. Real per-day counts come from each native
	// cell's title ("N publishes on <date>" / "No publishes on <date>"),
	// summed per week -- no separate data source, no guessing. The full
	// 53-week heatmap (behind "Show full year") is left as the native
	// component: a once-in-a-while "see everything" view is exactly what a
	// GitHub-style calendar is for, unlike the every-time default view.
	function condensePublishActivity() {
		const RECENT_WEEKS = 13;
		const MAX_BAR_HEIGHT = 48;
		const card = document.querySelector('.rh-pubgraph');
		if (!card || card.dataset.rhCondensed) return;

		const scrollWrap = card.querySelector('.rh-pubgraph__scroll');
		const weeks = scrollWrap?.querySelectorAll('.rh-pubgraph__week');
		if (!weeks || weeks.length <= RECENT_WEEKS) return;
		card.dataset.rhCondensed = 'true';

		const recentWeeks = Array.from(weeks).slice(-RECENT_WEEKS);
		const weekData = recentWeeks.map(week => {
			const cells = Array.from(week.querySelectorAll('.rh-pubgraph__cell'));
			const total = cells.reduce((sum, cell) => sum + (parseInt(cell.title, 10) || 0), 0);
			const startDate = cells[0]?.title.match(/on (.+)$/)?.[1] ?? '';
			return { total, startDate };
		});
		const maxTotal = Math.max(1, ...weekData.map(w => w.total));
		const labelEvery = Math.ceil(weekData.length / 4);

		const barRow = document.createElement('div');
		barRow.className = 'rh-pubgraph__minibar-row';
		const labelRow = document.createElement('div');
		labelRow.className = 'rh-pubgraph__minibar-labels';

		weekData.forEach((week, i) => {
			const bar = document.createElement('div');
			bar.className = 'rh-pubgraph__minibar';
			bar.style.height = `${Math.max(2, Math.round((week.total / maxTotal) * MAX_BAR_HEIGHT))}px`;
			bar.title = `${week.total} ${week.total === 1 ? 'publish' : 'publishes'}, week of ${week.startDate}`;
			barRow.appendChild(bar);

			const labelEl = document.createElement('span');
			const showLabel = i === 0 || i === weekData.length - 1 || i % labelEvery === 0;
			if (showLabel) labelEl.textContent = week.startDate.replace(/, \d{4}$/, '');
			labelRow.appendChild(labelEl);
		});

		const mini = document.createElement('div');
		mini.className = 'rh-pubgraph__mini';
		mini.append(barRow, labelRow);

		scrollWrap.before(mini);
		scrollWrap.style.display = 'none';

		const toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.className = 'button is-dark is-fullwidth rh-pubgraph-toggle';
		toggle.textContent = 'Show full year';
		toggle.addEventListener('click', () => {
			const expanding = toggle.textContent === 'Show full year';
			scrollWrap.style.display = expanding ? '' : 'none';
			mini.style.display = expanding ? 'none' : '';
			toggle.textContent = expanding ? 'Show less' : 'Show full year';
		});
		// Inserted after scrollWrap (not after mini) so the button always sits
		// directly below whichever of the two is actually visible -- mini and
		// scrollWrap are never both visible at once, so this doesn't depend on
		// which one currently is. Previously the toggle was pinned after mini,
		// so it stayed above the content once expanded instead of below it.
		scrollWrap.after(toggle);
	}

	// ---- Profile: drop the redundant "Free" badge from the Authored grid ----
	// Every authored shortcut is free (paid shortcuts aren't a thing here yet),
	// so the badge is pure repetition on every single card. Scoped to the
	// Authored section specifically via its heading, since .rh-price--free is
	// a generic shared class also used on Discover/homepage grids.
	function cleanAuthoredGrid() {
		const heading = Array.from(document.querySelectorAll('.rh-section-title')).find(h => h.textContent.trim() === 'Authored');
		const grid = heading?.nextElementSibling;
		if (!grid?.classList.contains('rh-grid') || grid.dataset.rhCleaned) return;
		grid.dataset.rhCleaned = 'true';

		grid.querySelectorAll('.rh-price--free').forEach(el => el.remove());
	}

	// ---- Flatten reply nesting to a single level ----
	// Threads can nest many levels deep (a reply to a reply to a reply...).
	// Re-parenting every descendant reply directly under its top-level
	// ancestor's .media-content, in original document order, turns that into
	// one flat list per top-level comment -- the same single-level-depth
	// convention YouTube uses to keep long threads readable. "Top-level" is
	// determined by walking up for any ancestor comment, not by DOM depth
	// from #feedback, since archived comments load one level deeper inside
	// #archivedCommentsContainer.
	function flattenReplyThreads() {
		const feedback = document.getElementById('feedback');
		if (!feedback) return;

		feedback.querySelectorAll('article.media[data-feedback-id]').forEach(comment => {
			const isTopLevel = !comment.parentElement.closest('article.media[data-feedback-id]');
			if (!isTopLevel || comment.dataset.rhFlattened) return;
			comment.classList.add('rh-top-comment');
			comment.dataset.rhFlattened = 'true';

			const content = comment.querySelector(':scope > .media-content');
			const descendants = content?.querySelectorAll('article.media[data-feedback-id]');
			descendants?.forEach(reply => content.appendChild(reply));
		});
	}

	// ---- Collapsible comment threads ----
	// Replies start collapsed behind a "View N replies" link rather than shown
	// expanded, YouTube-style -- the common case is a long thread the reader
	// doesn't need in full immediately. Visibility is toggled directly on the
	// captured reply elements rather than through a CSS structural selector,
	// so it isn't at the mercy of markup variation between comment types.
	function makeCommentsCollapsible() {
		const feedback = document.getElementById('feedback');
		if (!feedback) return;

		feedback.querySelectorAll('.rh-top-comment').forEach(comment => {
			const content = comment.querySelector(':scope > .media-content');
			const replies = content?.querySelectorAll(':scope > article.media[data-feedback-id]');
			if (!replies?.length || content.querySelector(':scope > .rh-toggle-replies')) return;

			const replyWord = replies.length === 1 ? 'reply' : 'replies';
			const toggle = document.createElement('a');
			toggle.href = '#';
			toggle.className = 'rh-toggle-replies is-collapsed';

			const updateLabel = () => {
				const collapsed = toggle.classList.contains('is-collapsed');
				toggle.innerHTML = `<span class="rh-toggle-replies__chevron">\u25be</span>${collapsed ? 'View' : 'Hide'} ${replies.length} ${replyWord}`;
			};
			replies.forEach(reply => { reply.style.display = 'none'; });
			updateLabel();

			toggle.addEventListener('click', event => {
				event.preventDefault();
				toggle.classList.toggle('is-collapsed');
				const collapsed = toggle.classList.contains('is-collapsed');
				replies.forEach(reply => { reply.style.display = collapsed ? 'none' : ''; });
				updateLabel();
			});

			content.appendChild(toggle);
		});

		addCollapseAllControl(feedback);
	}

	function addCollapseAllControl(feedback) {
		if (!feedback.querySelector('.rh-toggle-replies') || feedback.querySelector('.rh-collapse-all')) return;

		const button = document.createElement('button');
		button.className = 'button is-dark is-fullwidth rh-collapse-all';
		button.style.marginBottom = '0.75em';
		button.textContent = 'Expand all reply threads';
		button.addEventListener('click', () => {
			const expanding = button.textContent.startsWith('Expand');
			feedback.querySelectorAll('.rh-toggle-replies').forEach(toggle => {
				if (expanding === toggle.classList.contains('is-collapsed')) toggle.click();
			});
			button.textContent = expanding ? 'Collapse all reply threads' : 'Expand all reply threads';
		});

		const anchor = feedback.querySelector('#toggleArchived') ?? feedback.querySelector('article.media[data-feedback-id]');
		anchor?.before(button);
	}

	GM.addStyle(
`.rh-toggle-replies {
	display: inline-block;
	margin-top: 0.4em;
	font-weight: 600;
	text-decoration: none;
	cursor: pointer;
}
.rh-toggle-replies__chevron { display: inline-block; margin-right: 0.3em; }`);

	function refreshComments() {
		flattenReplyThreads();
		makeCommentsCollapsible();
	}

	addChangelogButton();
	keepNavbarThemedDuringSearch();
	debugNavbarSearchIssue();
	addHeroMetadata();
	promoteCreatorLine();
	promoteRequiredApps();
	addFreeStatsSummary();
	addStatIcons();
	splitStatsOverview();
	condensePublishActivity();
	cleanAuthoredGrid();
	refreshComments();

	// Archived comments (and the changelog card) can load in after an AJAX call,
	// so re-run once the relevant containers change.
	const feedbackEl = document.getElementById('feedback');
	if (feedbackEl) new MutationObserver(refreshComments).observe(feedbackEl, { childList: true, subtree: true });
})();
