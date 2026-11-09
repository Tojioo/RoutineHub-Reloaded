// ==UserScript==
// @name         RoutineHub Enhancer
// @version      1.0.0-alpha48
// @license      ANC-SA-1.0
// @author       Tojioo
// @description  Dark mode plus UX improvements for RoutineHub: quick changelog access, collapsible comment threads
// @match        https://routinehub.co/*
// @grant        GM.addStyle
// ==/UserScript==

// Copyright (C) 2026 Tojioo. Licensed under ANC-SA-1.0:
// https://github.com/Tojioo/RoutineHub-Reloaded/blob/main/LICENSE

// Parts of the dark mode and layout CSS and the homepage card reorder derive
// from Dark Mode RoutineHub by gluebyte (https://routinehub.co/shortcut/25368/).
// That code is used under the MIT License:
//
// Copyright (c) 2026 gluebyte
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function () {
	"use strict";

	// Dark styles key on the site's own html[data-theme=dark]. The site sets it from
	// the stored choice, else the OS preference, and follows OS changes live.

	// Font Awesome icon node. Never build markup from strings: page and API text is untrusted.
	function icon(name) {
		const i = document.createElement('i');
		i.className = `fas ${name}`;
		i.setAttribute('aria-hidden', 'true');
		return i;
	}

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
	.rh-pubgraph__chart { transform: scale(0.9); transform-origin: top left; }
}
/* Author Overview as one card: primary stats in 3 columns with dividers.
   .rh-scroll--stats is the site's carousel; grid stops the scrolling. */
.rh-scroll--stats {
	display: grid !important;
	grid-template-columns: repeat(3, 1fr) !important;
	overflow: visible !important;
	gap: 0 !important;
	padding: 14px 0 !important;
	margin-bottom: 8px !important;
	border-radius: 14px;
	background: #fff;
	border: 1px solid #f0f0f0;
}
.rh-scroll--stats > .rh-stat, .rh-stats-secondary > .rh-stat {
	background: transparent !important;
	border: 0 !important;
	border-radius: 0 !important;
	box-shadow: none !important;
	min-width: 0 !important;
	transform: none !important;
}
.rh-scroll--stats > .rh-stat {
	padding: 2px 6px !important;
	gap: 2px !important;
}
.rh-scroll--stats > .rh-stat + .rh-stat {
	border-left: 1px solid rgba(127, 127, 127, 0.22) !important;
}
.rh-scroll--stats .rh-stat__icon { order: 1; font-size: 0.9rem; }
.rh-scroll--stats .rh-stat__value { order: 2; font-size: 1.4rem !important; }
.rh-scroll--stats .rh-stat__label, .rh-stats-secondary .rh-stat__label {
	order: 3;
	margin: 0 !important;
	font-size: 0.75rem !important;
	font-weight: 600 !important;
	text-transform: none !important;
	letter-spacing: normal !important;
}
/* Secondary stats: compact icon, value and label chips. Own display value,
   so the toggle's inline display:none still wins. */
.rh-stats-secondary {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 6px 16px;
	margin: 2px 0 12px;
}
.rh-stats-secondary > .rh-stat {
	flex-direction: row !important;
	align-items: baseline !important;
	gap: 5px !important;
	padding: 2px 0 !important;
}
.rh-stats-secondary .rh-stat__icon { order: 1; font-size: 0.8rem; }
.rh-stats-secondary .rh-stat__value { order: 2; font-size: 0.95rem !important; font-weight: 700; }
.rh-stats-toggle { margin-bottom: 20px !important; }
/* Condensed Publish Activity preview: a weekly bar chart, not a shrunk clone
   of the heatmap. A 13-cluster of tiny colored squares needing a month label
   above and a day label to the left to decode is exactly what made the full
   chart hard to read; a bar per week with its own date label under it reads
   directly with no cross-referencing, and bars stretching to fill the card's
   width removes the dead space a small fixed-size cluster left behind. */
.rh-pubgraph__mini { margin-top: 10px; }
.rh-pubgraph__minibar-row { display: flex; align-items: flex-end; gap: 3px; height: 48px; }
.rh-pubgraph__minibar { flex: 1 1 0; max-width: 24px; background: var(--rhe-accent); border-radius: 4px 4px 0 0; min-height: 2px; }
.rh-pubgraph__minibar-labels { display: flex; gap: 3px; margin-top: 4px; }
.rh-pubgraph__minibar-labels span { flex: 1 1 0; max-width: 24px; font-size: 10px; text-align: center; white-space: nowrap; overflow: visible; }
.rh-pubgraph-toggle { margin-top: 0.75em; }
/* Native heatmap levels are plum (#61124b, dark: #eb9796). Use the accent, keep the opacity ramp. */
.rh-pubgraph__cell--l1, .rh-pubgraph__cell--l2, .rh-pubgraph__cell--l3, .rh-pubgraph__cell--l4 {
	background: var(--rhe-accent) !important;
}
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
	--rhe-bg: #0C1311;
	--rhe-surface-1: #112320;
	--rhe-surface-2: #1D424A;
	--rhe-border: #17302D;
	--rhe-text: #CBD9D7;
	--rhe-accent: #00DBAC;
	--rhe-accent-dim: rgba(0, 219, 172, 0.12);
	/* Accent for text on light backgrounds: the header petrol (10.9:1 on white). */
	--rhe-accent-ink: var(--rhe-surface-2);
	--rhe-input-bg: #C7D6D4;
}
.footer, .navbar, .navbar-menu, .navbar-dropdown, .dropdown-menu {
	color: var(--rhe-text) !important;
}
.footer {
	background-color: var(--rhe-surface-1) !important;
}
/* Bulma's dropdown has two layers: .dropdown-menu (positioning wrapper,
   transparent by default) and .dropdown-content (the actual visible card,
   white by default). The Sort dropdown uses both layers; the account-menu
   dropdown skips .dropdown-content and puts items directly in
   .dropdown-menu. Covering both classes handles either shape regardless of
   which one carries the real background for a given dropdown instance. */
.navbar, .navbar-menu, .navbar-dropdown, .dropdown-menu, .navbar-item, .dropdown-content {
	background-color: var(--rhe-surface-2) !important;
}
/* The rail's theme toggle wrapper reuses .navbar-item; keep it transparent. */
.navbar-item.rh-theme-item, .rh-rail .navbar-item {
	background-color: transparent !important;
}
/* Search browse backdrop sits above the navbar and tints it plum. */
.rh-browse-backdrop {
	background: rgba(12, 19, 17, 0.35) !important;
}
/* Search popup floats with a gap below the search bar and from the screen edges. */
.rh-browse {
	padding: 8px 10px 10px !important;
}
/* Phone layout: compact pills and rows. Pills only until a category is picked
   or a query is typed (.rhe-pills-only, set by quietSearchBrowse). */
@media (max-width: 1023px) {
	.rh-browse.rhe-pills-only .rh-browse__items { display: none !important; }
	.rh-browse.rhe-pills-only .rh-browse__sections { border-bottom: 0 !important; }
	/* Edge fades on the pill row, only toward sides that can still scroll. */
	.rh-browse__sections.rhe-fade-r {
		-webkit-mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
		mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
	}
	.rh-browse__sections.rhe-fade-l {
		-webkit-mask-image: linear-gradient(to left, #000 calc(100% - 32px), transparent);
		mask-image: linear-gradient(to left, #000 calc(100% - 32px), transparent);
	}
	.rh-browse__sections.rhe-fade-l.rhe-fade-r {
		-webkit-mask-image: linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent);
		mask-image: linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent);
	}
	/* Same for the list, vertically. */
	.rh-browse__items.rhe-fade-b {
		-webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 40px), transparent);
		mask-image: linear-gradient(to bottom, #000 calc(100% - 40px), transparent);
	}
	.rh-browse__items.rhe-fade-t {
		-webkit-mask-image: linear-gradient(to top, #000 calc(100% - 40px), transparent);
		mask-image: linear-gradient(to top, #000 calc(100% - 40px), transparent);
	}
	.rh-browse__items.rhe-fade-t.rhe-fade-b {
		-webkit-mask-image: linear-gradient(to bottom, transparent, #000 40px, #000 calc(100% - 40px), transparent);
		mask-image: linear-gradient(to bottom, transparent, #000 40px, #000 calc(100% - 40px), transparent);
	}
	.rh-browse__sections { padding: 8px 10px !important; gap: 6px !important; }
	.rh-browse__section { padding: 4px 11px !important; font-size: 13px !important; gap: 6px !important; }
	.rh-browse__section i { font-size: 12px !important; }
	.rh-browse__items { padding: 4px 0 !important; }
	.rh-browse__title { padding: 6px 14px 4px !important; font-size: 10px !important; }
	.rh-browse__row { padding: 9px 14px !important; font-size: 15px !important; gap: 10px !important; }
	.rh-browse__row i.rh-browse__icon { width: 18px !important; font-size: 14px !important; }
}
/* Notifications: one card with divided compact rows (enhanceNotifications). */
.notifications .rh-feed-timeline {
	background: #fff;
	border: 1px solid #f0f0f0;
	border-radius: 14px;
	overflow: clip;
	padding: 0 0 2px;
	/* Site gap showed as a strip above each section band. Rows space themselves. */
	gap: 0 !important;
}
/* Server day headers (NEW, TODAY, repeated per "load more" page) replaced by
   .rhe-daygroup, computed from timestamps and shown once each. */
.notifications .rh-feed-timeline > .rh-feed-daygroup { display: none !important; }
/* Shapes: controls are pills, the card is rounded, everything inside it is square.
   Section headers: a sticky band per day section, tap to collapse. */
.rhe-daygroup {
	position: sticky;
	top: 0;
	z-index: 2;
	margin: 0 !important;
	padding: 0 !important;
	background: #f4f5f7;
	border-bottom: 1px solid rgba(127, 127, 127, 0.15);
	color: #8a93a3;
}
.rhe-daygroup__toggle {
	-webkit-appearance: none !important;
	appearance: none !important;
	display: flex !important;
	align-items: center;
	gap: 8px;
	width: 100%;
	margin: 0 !important;
	padding: 9px 14px !important;
	background: transparent !important;
	border: 0 !important;
	border-radius: 0 !important;
	color: inherit !important;
	font: inherit !important;
	cursor: pointer;
	text-align: left;
}
.rhe-daygroup__label {
	flex: 1 1 auto;
	font-size: 0.72rem;
	font-weight: 800;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}
.rhe-daygroup__count { font-size: 0.72rem; font-weight: 600; opacity: 0.8; }
.rhe-daygroup__chev { font-size: 0.7rem; transition: transform 0.15s; }
.rhe-daygroup.is-collapsed .rhe-daygroup__chev { transform: rotate(-90deg); }
.rhe-section-hidden { display: none !important; }
.notifications .rh-notification {
	margin: 0 !important;
	padding: 12px 14px !important;
	border: 0 !important;
	border-bottom: 1px solid rgba(127, 127, 127, 0.15) !important;
	border-radius: 0 !important;
	box-shadow: none !important;
	background: transparent !important;
}
.notifications .rh-notification__avatar img,
.notifications .rh-notification__avatar .rh-feed-post__avatar-fallback {
	width: 32px !important;
	height: 32px !important;
}
.notifications .rh-feed-post__byline {
	display: grid !important;
	grid-template-columns: 1fr auto;
	column-gap: 8px;
	align-items: baseline;
}
.notifications .rh-notification__meta {
	display: flex !important;
	align-items: center;
	gap: 6px;
	white-space: nowrap;
	font-size: 0.75rem;
}
.notifications .rh-notification__preview { margin: 3px 0 0 42px !important; }
.notifications .rh-notification__quote {
	-webkit-line-clamp: 1 !important;
	white-space: normal !important;
	padding: 0 0 0 8px !important;
	font-size: 0.82rem !important;
	background: transparent !important;
}
.notifications .rhe-thread-linked .rh-notification__actions { display: none !important; }
.rhe-quote-link { display: block; text-decoration: none !important; color: inherit !important; }
/* Bursts from one account collapse into a group row. */
.rhe-notif-group { border-bottom: 1px solid rgba(127, 127, 127, 0.15); }
/* Reset native button looks so the head reads as a row like the others. */
.rhe-notif-group__head {
	-webkit-appearance: none !important;
	appearance: none !important;
	display: flex !important;
	align-items: center;
	gap: 10px;
	width: 100% !important;
	height: auto !important;
	margin: 0 !important;
	padding: 12px 14px !important;
	background: transparent !important;
	border: 0 !important;
	border-radius: 0 !important;
	box-shadow: none !important;
	font: inherit !important;
	color: inherit;
	text-align: left;
	cursor: pointer;
}
.rhe-notif-group.is-open .rhe-notif-group__body { background: rgba(127, 127, 127, 0.06); }
.rhe-notif-filter { align-items: center; }
.rhe-notif-filter .read-all { margin-left: auto; }
.rhe-notif-group__avatar { position: relative; flex: 0 0 32px; }
.rhe-notif-group__avatar img { width: 32px; height: 32px; border-radius: 50%; display: block; }
.rhe-notif-group__text { flex: 1 1 auto; min-width: 0; font-size: 0.92rem; line-height: 1.4; }
.rhe-notif-group__meta { display: flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 0.75rem; }
/* !important: iOS managers inject this sheet as user origin, where the site's
   display:inline-block on the dot wins over any normal declaration. */
.rhe-notif-group:not(.is-unread) .rhe-notif-group__dot { display: none !important; }
/* Unread dot in the navbar counter red, so it reads as "new", not as accent. */
.notifications .rh-notification__dot { width: 8px !important; height: 8px !important; background: #f65052 !important; }
.rhe-notif-group__chev { transition: transform 0.15s; }
.rhe-notif-group.is-open .rhe-notif-group__chev { transform: rotate(180deg); }
.rhe-notif-group__body { display: none; }
.rhe-notif-group.is-open .rhe-notif-group__body { display: block; }
.notifications .rhe-notif-group__body .rh-notification { padding-left: 56px !important; }
.rhe-notif-group__body .rh-notification__avatar, .rhe-notif-group__body .rh-notification__actor { display: none !important; }
.notifications .rhe-notif-group__body .rh-notification__preview { margin-left: 0 !important; }
.notifications .rhe-notif-group__body .rh-notification:last-child { border-bottom: 0 !important; }
/* Yours / Following filter. */
.rhe-notif-filter { display: flex; gap: 8px; margin: 0 0 10px; }
.rhe-notif-filter .rh-feed-tab { padding: 6px 14px !important; font-size: 0.85rem !important; border: 0; cursor: pointer; }
/* Settings: round icon button at pill height; bell 15.2px tall. */
.notifications .rhe-notif-settings {
	width: 34px !important;
	height: 34px !important;
	padding: 0 !important;
	border: 0 !important;
	border-radius: 50% !important;
	text-decoration: none !important;
}
.rhe-notif-settings__icon {
	display: block !important;
	width: 17.3px !important;
	height: 16.5px !important;
	fill: currentColor !important;
}
/* Settings tabs as pills, like the notification filters. The row scrolls
   sideways; fades (settingsTabs) mark the sides with more tabs. */
.rh-settings .rh-settings-tabs {
	margin: 4px 0 16px !important;
	scrollbar-width: none;
}
.rh-settings-tabs::-webkit-scrollbar { display: none; }
.rh-settings .rh-settings-tabs ul { border-bottom: 0 !important; gap: 8px !important; }
.rh-settings .rh-settings-tabs li a {
	margin: 0 !important;
	padding: 6px 14px !important;
	border: 0 !important;
	border-radius: 999px !important;
	background-color: #f4f4f6 !important;
	color: #555 !important;
	font-size: 0.85rem !important;
	font-weight: 600 !important;
	white-space: nowrap;
}
.rh-settings .rh-settings-tabs li.is-active a { background-color: #1a1a1a !important; color: #fff !important; }
.rh-settings .rh-settings-tabs .icon:first-child { margin-right: 0.35em !important; }
/* Bulma pulls a subtitle up 1.25rem, onto the Social Links title. */
.rh-settings .title + .subtitle { margin-top: -8px !important; }
/* Recent checks sits flush under the inline Generate button. */
.rh-settings .proof-key > .title.is-6 { margin-top: 24px !important; }
/* Change email is a maroon link and the key warning crimson natively. */
.rh-settings .email-change-entry a {
	color: var(--rhe-accent-ink) !important;
	text-decoration-color: rgba(29, 66, 74, 0.35) !important;
}
.rh-settings .api-key strong {
	color: #353535 !important;
	text-decoration-color: rgba(53, 53, 53, 0.3) !important;
}
.rhe-char-count {
	margin-top: 4px !important;
	text-align: right;
	font-variant-numeric: tabular-nums;
	color: #888 !important;
}
.rhe-char-count.is-near { color: #1a1a1a !important; font-weight: 600; }
.rh-settings-tabs.rhe-fade-r {
	-webkit-mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
	mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
}
.rh-settings-tabs.rhe-fade-l {
	-webkit-mask-image: linear-gradient(to left, #000 calc(100% - 32px), transparent);
	mask-image: linear-gradient(to left, #000 calc(100% - 32px), transparent);
}
.rh-settings-tabs.rhe-fade-l.rhe-fade-r {
	-webkit-mask-image: linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent);
	mask-image: linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent);
}
.rh-feed-timeline[data-rhe-filter=own] .rhe-following,
.rh-feed-timeline[data-rhe-filter=following] .rhe-own { display: none !important; }
.footer a, .navbar a, .navbar-item, .dropdown-menu a, .search-button__label {
	color: var(--rhe-accent) !important;
}
/* Expanded search bar (tap the navbar search icon) uses Bulma's
   has-background-primary-dark utility class -- the site's brand maroon, not
   theme-aware. Same "always dark chrome" bucket as the navbar/footer above,
   so unconditional rather than dark-mode-gated. */
.search {
	background-color: var(--rhe-surface-2) !important;
}
/* Overlay instead of page flow: absolute without top keeps its spot under the
   navbar but stops pushing the page down. */
.search {
	position: absolute !important;
	left: 0;
	right: 0;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}
.button.is-dark {
	background-color: var(--rhe-surface-2) !important;
	color: var(--rhe-text) !important;
	border-color: var(--rhe-border) !important;
}
/* The site's own CSS has a more specific ".search .button.is-dark" rule
   (its own brand maroon, #61124b) that outranks the plain ".button.is-dark"
   override above on specificity alone -- !important on both sides doesn't
   change that, since specificity is still the tiebreaker between competing
   !important declarations. Needs a selector of matching specificity. */
.search .button.is-dark {
	background-color: var(--rhe-surface-2) !important;
}`);

	GM.addStyle(
`html[data-theme=dark] {
	/* Site variables, re-keyed to our palette. */
	--rh-text: var(--rhe-text);
	--rh-text-secondary: rgba(203, 217, 215, 0.75);
	--rh-border: var(--rhe-border);
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
		background-color: var(--rhe-bg) !important;
		color: var(--rhe-text) !important;
	}
	body strong, .title, .rh-section-title, .rh-appcard-name, .rh-topcard-name, .rh-listrow-name, .rh-listrow-brief, .heading, .card-content nav, .card-content strong, .card-content small, .level-item, .content h1, .content h2, .content h3, .content h4, .content h5, .content h6, .content table thead td, .content table thead th, pre, .rh-hero-header__title, .rh-hero-header__brief, .rh-card__title, .content, .rh-info-list__value, .rh-release__notes, .notification-text, .rh-stat__value, .textarea, blockquote, .rh-notification__quote, .rh-feed-empty-hint, .rh-changelog__subtitle, .rh-release__version, .rh-changelog__ios, .rh-changelog__downloads, .rh-price, .rh-checkin__label, .rh-appcard-brief, .rh-topcard-brief, .rh-feed-post--text .rh-feed-post__body {
		color: var(--rhe-text) !important;
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
	   white card) -- against --rhe-surface-2 that's under 2.5:1 contrast, well
	   short of the 4.5:1 minimum. .rh-stat__icon uses the accent color at
	   full strength rather than a dimmed neutral -- muted-gray-on-dark-teal
	   read as too washed out to register as an icon at all. */
	.rh-stat__label {
		color: rgba(203, 217, 215, 0.85) !important;
	}
	.rh-stat__icon {
		color: var(--rhe-accent) !important;
	}
	.rh-topcard, .shortcut .description .content blockquote, code, pre, .field-new-control, .rh-cta--secondary, blockquote, .rh-feed-post, .textarea, .rh-pubgraph__cell--l0, .rh-feed-composer__submit {
		background-color: var(--rhe-surface-2) !important;
	}
	.card, .rh-card, .rh-hero-header, .box, .rh-tagline, .rh-checkin, .rh-feed-composer, .rh-devcard, .rh-feed-login-cta, .rh-feed-post, .rh-proof-bar, .rh-feed-interstitial {
		box-shadow: 0 .5em 1em -.125em var(--rhe-accent-dim), 0 0 0 1px rgba(0, 219, 172, 0.05) !important;
	}
	/* Light fields: set text and background together. */
	.input, .select select {
		background-color: var(--rhe-input-bg) !important;
		color: var(--rhe-bg) !important;
	}
	/* Placeholders: lighter and italic, so empty fields don't read as filled. */
	.input::placeholder, .rh-tzpick__input::placeholder {
		color: #66726F !important;
		font-style: italic;
		opacity: 1 !important;
	}
	hr {
		background-color: var(--rhe-border) !important;
	}
	.rh-notification--unread {
		background: var(--rhe-accent-dim) !important;
	}
	.rh-listrow, .rh-card, .rh-hero-header, .card, .box, .rh-tagline, .rh-checkin, .rh-feed-composer, .rh-devcard, .rh-feed-login-cta, .rh-feed-post, .rh-proof-bar, .rh-feed-interstitial {
		border: 1px solid var(--rhe-border) !important;
	}
	.textarea::placeholder, .rh-feed-composer__textarea::placeholder {
		color: rgba(203, 217, 215, 0.65) !important;
		font-style: italic;
		opacity: 1 !important;
	}
	#feedback .rh-top-comment {
		background-color: var(--rhe-surface-1) !important;
		border: 1px solid var(--rhe-border) !important;
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
		background: var(--rhe-bg) !important;
		border-color: var(--rhe-border) !important;
	}
	.rhnew-card > span:last-of-type > span {
		color: var(--rhe-text) !important;
	}
	.rhnew-card .fa-chevron-right {
		color: var(--rhe-text) !important;
	}
	/* The page heading above the cards ("Create something new" + subtitle)
	   sits in a plain unclassed <div>, inline color:#000/#6b7280 directly on
	   the h1/p with no class at all -- .rhnew-card's fix never touched it
	   since it's outside those elements entirely. Only class in reach is the
	   .rhnew-wrap container; there's exactly one h1 and one p in it (the
	   cards use spans, not p tags, for their own text), so this is safe. */
	.rhnew-wrap h1 {
		color: var(--rhe-text) !important;
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
		color: var(--rhe-text) !important;
	}
	/* Markdown-rendered feed post bodies (.markdown-content) aren't covered by
	   the .content heading rule above -- headings there carry their own dark
	   color from the site's prose styles, unlike plain paragraphs which just
	   inherit and were already readable. */
	.rh-feed-post__body h1, .rh-feed-post__body h2, .rh-feed-post__body h3, .rh-feed-post__body h4, .rh-feed-post__body h5, .rh-feed-post__body h6, .rh-feed-post__body strong {
		color: var(--rhe-text) !important;
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
		background: var(--rhe-bg) !important;
		border-right: 1px solid var(--rhe-border) !important;
	}
	.rh-rail__close {
		color: var(--rhe-text) !important;
		opacity: 0.65;
	}
	.rh-rail__close:hover {
		opacity: 1;
	}
	.rh-rail__search {
		border: 1px solid var(--rhe-border) !important;
		background: var(--rhe-surface-2) !important;
		color: rgba(203, 217, 215, 0.65) !important;
	}
	.rh-rail__search:hover {
		background: var(--rhe-surface-1) !important;
		color: var(--rhe-text) !important;
	}
	.rh-rail__link, .rh-rail__sublink, .rh-rail__treelink {
		color: var(--rhe-text) !important;
	}
	.rh-rail__link:hover, .rh-rail__sublink:hover, .rh-rail__treelink:hover {
		background: var(--rhe-surface-1) !important;
		color: var(--rhe-accent) !important;
	}
	.rh-rail__link.is-active, .rh-rail__sublink.is-active {
		background: var(--rhe-accent) !important;
		color: var(--rhe-bg) !important;
	}
	.rh-rail__hash, .rh-rail__sublink--locked, .rh-rail__title, .rh-rail__chev, .rh-rail__social a, .rh-rail__toggle {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	.rh-rail__sublink--locked:hover, .rh-rail__chev:hover, .rh-rail__social a:hover, .rh-rail__toggle:hover {
		background: var(--rhe-surface-1) !important;
		color: var(--rhe-text) !important;
	}
	.rh-rail__tree::before, .rh-rail__treelink::before {
		background: var(--rhe-border) !important;
	}
	.rh-scroll--stats {
		background: var(--rhe-surface-1) !important;
		border-color: var(--rhe-border) !important;
	}
	/* Search browse panel: flat suggestion list (YouTube mobile style), category pills on top. */
	.rh-browse__card {
		background: var(--rhe-bg) !important;
		color: var(--rhe-text) !important;
		border: 1px solid var(--rhe-border) !important;
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45) !important;
	}
	.rh-browse__sections, .rh-browse__hints {
		background: var(--rhe-bg) !important;
		border-color: var(--rhe-border) !important;
	}
	.rh-browse__section {
		background: var(--rhe-surface-2) !important;
		color: var(--rhe-text) !important;
		border-radius: 999px !important;
		font-weight: 500 !important;
	}
	.rh-browse__section:hover, .rh-browse__section:focus-visible {
		background: var(--rhe-surface-1) !important;
		color: var(--rhe-accent) !important;
	}
	.rh-browse__section.is-active {
		background: var(--rhe-accent) !important;
		color: var(--rhe-bg) !important;
		font-weight: 600 !important;
	}
	.rh-browse__section i, .rh-browse__section.is-active i {
		color: inherit !important;
	}
	.rh-browse__title {
		color: rgba(203, 217, 215, 0.55) !important;
	}
	.rh-browse__title--results {
		color: var(--rhe-accent) !important;
	}
	.rh-browse__title--results ~ .rh-browse__title {
		border-color: var(--rhe-border) !important;
	}
	.rh-browse__row {
		color: var(--rhe-text) !important;
		font-weight: 400 !important;
		border-radius: 0 !important;
	}
	.rh-browse__row.is-active, .rh-browse__row:hover {
		background: var(--rhe-surface-1) !important;
		color: var(--rhe-text) !important;
	}
	.rh-browse__row i.rh-browse__icon {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	.rh-browse__row--result {
		font-weight: 500 !important;
	}
	.rh-browse__row--search, .rh-browse__row--search i.rh-browse__icon {
		color: var(--rhe-accent) !important;
	}
	.rh-browse__row--muted, .rh-browse__row--muted:hover, .rh-browse__row--locked {
		background: transparent !important;
		color: rgba(203, 217, 215, 0.55) !important;
	}
	.rh-browse__chevron, .rh-browse__lock, .rh-browse__kind {
		color: rgba(203, 217, 215, 0.45) !important;
	}
	/* Feed tabs and notification buttons ("Mark all as read", "Adjust notifications"). */
	.rh-feed-tab {
		background: var(--rhe-surface-2) !important;
		color: var(--rhe-text) !important;
	}
	.rh-feed-tab:hover {
		background: var(--rhe-surface-1) !important;
		color: var(--rhe-accent) !important;
	}
	.rh-feed-tab.is-active {
		background: var(--rhe-accent) !important;
		color: var(--rhe-bg) !important;
	}
	/* Notifications: native blue to teal, cards flattened into one list card. */
	.rh-feed-daygroup, .rhe-daygroup {
		color: rgba(203, 217, 215, 0.55) !important;
		border-bottom-color: var(--rhe-border) !important;
	}
	.rh-feed-daygroup--new {
		color: var(--rhe-accent) !important;
		border-bottom-color: rgba(0, 219, 172, 0.25) !important;
	}
	.rh-feed-daygroup--new::before {
		background: var(--rhe-accent) !important;
	}
	.rh-notification__badge {
		border-color: var(--rhe-surface-1) !important;
	}
	.rh-notification__badge--feedback {
		background: var(--rhe-accent) !important;
		color: var(--rhe-bg) !important;
	}
	.rh-feed-spinner {
		border-color: var(--rhe-border) !important;
		border-top-color: var(--rhe-accent) !important;
	}
	.notifications .rh-feed-timeline {
		background: var(--rhe-surface-1) !important;
		border-color: var(--rhe-border) !important;
	}
	.notifications .rh-notification, .rhe-notif-group {
		background: transparent !important;
		border: 0 !important;
		border-bottom: 1px solid var(--rhe-border) !important;
		box-shadow: none !important;
	}
	.rhe-daygroup {
		background: #0f1c1a !important;
		border-bottom-color: var(--rhe-border) !important;
	}
	/* Unread is the dot alone; nearly everything is unread, so tints and bars were noise. */
	.rhe-notif-group.is-open .rhe-notif-group__body {
		background: var(--rhe-bg) !important;
	}
	.rh-notification__text, .rhe-notif-group__text {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	.rh-notification__actor {
		color: var(--rhe-text) !important;
	}
	.rh-notification__obj {
		color: var(--rhe-accent) !important;
	}
	.rh-notification__quote {
		color: rgba(203, 217, 215, 0.75) !important;
		border-left-color: var(--rhe-border) !important;
		background: transparent !important;
	}
	.notifications .rh-feed-post__time, .rhe-notif-group__meta {
		color: rgba(203, 217, 215, 0.55) !important;
	}
	/* Settings: teal surfaces and accent in place of the site's plum and blue. */
	.rh-settings .card {
		background-color: var(--rhe-surface-1) !important;
		box-shadow: none !important;
	}
	.rh-settings .button.is-primary {
		background-color: var(--rhe-accent) !important;
		border-color: transparent !important;
		color: var(--rhe-bg) !important;
		font-weight: 700;
	}
	/* Remove and Deactivate are crimson outlines natively. Neutral outline instead. */
	.rh-settings .button.rh-avatar-remove, .rh-settings .rh-danger-zone__button:not(.rh-danger-zone__button--go) {
		background-color: transparent !important;
		border-color: rgba(203, 217, 215, 0.3) !important;
		color: var(--rhe-text) !important;
	}
	.rh-settings .rh-danger-zone {
		border-top-color: var(--rhe-border) !important;
	}
	.rh-settings .rh-danger-zone__title {
		color: var(--rhe-text) !important;
	}
	.rh-settings .rh-danger-zone__button--go {
		background-color: transparent !important;
		border-color: var(--rhe-border) !important;
	}
	.rh-settings .rh-danger-zone__button--go:not([disabled]) {
		background-color: var(--rhe-accent) !important;
		border-color: transparent !important;
		color: var(--rhe-bg) !important;
	}
	.rh-settings .rh-danger-zone__check input {
		accent-color: var(--rhe-accent) !important;
	}
	.rh-settings .file-cta {
		background-color: var(--rhe-surface-2) !important;
		border-color: var(--rhe-border) !important;
		color: var(--rhe-text) !important;
	}
	.rh-settings .rh-avatar-row #image_preview {
		background-color: var(--rhe-surface-2) !important;
		border-color: var(--rhe-border) !important;
	}
	.rh-settings .input:focus, .rh-settings .textarea:focus, .rh-settings select:focus {
		border-color: var(--rhe-accent) !important;
		box-shadow: 0 0 0 3px var(--rhe-accent-dim) !important;
	}
	/* Bio Markdown / Preview tabs keep their underline, in teal. */
	.rh-settings .tabs:not(.rh-settings-tabs) ul {
		border-bottom-color: var(--rhe-border) !important;
	}
	.rh-settings .tabs:not(.rh-settings-tabs) li a {
		color: rgba(203, 217, 215, 0.65) !important;
	}
	.rh-settings .tabs:not(.rh-settings-tabs) li.is-active a {
		color: var(--rhe-accent) !important;
		border-bottom-color: var(--rhe-accent) !important;
	}
	/* Switches: off is a quiet outline, on is solid teal. */
	.rh-settings .rh-pill-toggle__state, .rh-settings .rh-tile-toggle__state {
		background-color: var(--rhe-bg) !important;
		border-color: var(--rhe-border) !important;
		color: rgba(203, 217, 215, 0.55) !important;
	}
	.rh-settings .rh-pill-toggle__input:checked + .rh-pill-toggle__state,
	.rh-settings .rh-tile-toggle__input:checked + .rh-tile-toggle__tile .rh-tile-toggle__state {
		background-color: var(--rhe-accent) !important;
		border-color: var(--rhe-accent) !important;
		color: var(--rhe-bg) !important;
	}
	.rh-settings .rh-pill-toggle__input:focus-visible + .rh-pill-toggle__state,
	.rh-settings .rh-tile-toggle__input:focus-visible + .rh-tile-toggle__tile {
		border-color: var(--rhe-accent) !important;
		box-shadow: 0 0 0 3px var(--rhe-accent-dim) !important;
	}
	.rh-settings .rh-tile-toggle__tile {
		background-color: var(--rhe-bg) !important;
		border-color: var(--rhe-border) !important;
	}
	.rh-settings .rh-tile-toggle__icon {
		background-color: var(--rhe-surface-2) !important;
		color: rgba(203, 217, 215, 0.55) !important;
	}
	.rh-settings .rh-tile-toggle__input:checked + .rh-tile-toggle__tile {
		background-color: var(--rhe-accent-dim) !important;
		border-color: rgba(0, 219, 172, 0.45) !important;
	}
	.rh-settings .rh-tile-toggle__input:checked + .rh-tile-toggle__tile .rh-tile-toggle__icon {
		background-color: rgba(0, 219, 172, 0.16) !important;
		color: var(--rhe-accent) !important;
	}
	.rh-settings .table td, .rh-settings .table th, .rh-settings .notif-prefs .notif-section-title {
		border-color: var(--rhe-border) !important;
	}
	.rh-settings .notif-prefs tbody tr:not(.notif-section):hover {
		background-color: rgba(0, 219, 172, 0.04) !important;
	}
	.rh-settings .rh-autosave-hint i {
		color: var(--rhe-accent) !important;
	}
	/* Sign-in methods: plum rows and a green badge natively. */
	.rh-settings .sign-in-methods .sign-in-list {
		border-color: var(--rhe-border) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method {
		background-color: var(--rhe-bg) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method + .sign-in-method {
		border-top-color: var(--rhe-border) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method__mark {
		background-color: var(--rhe-surface-2) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method__state {
		background-color: var(--rhe-accent-dim) !important;
		color: var(--rhe-accent) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method__connect, .rh-tzpick__device {
		background-color: transparent !important;
		border-color: rgba(203, 217, 215, 0.3) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method__connect {
		color: var(--rhe-text) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method__connect:hover, .rh-tzpick__device:hover {
		background-color: var(--rhe-surface-2) !important;
	}
	.rh-settings .sign-in-methods .sign-in-method__connect:focus-visible {
		outline-color: var(--rhe-accent) !important;
	}
	/* Time zone picker: plum field, list and button, navy UTC box, blue accents natively. */
	.rh-tzpick__input {
		background-color: var(--rhe-input-bg) !important;
		color: var(--rhe-bg) !important;
	}
	.rh-tzpick__search > i {
		color: #66726F !important;
	}
	.rh-tzpick__input:focus {
		border-color: var(--rhe-accent) !important;
		box-shadow: 0 0 0 3px var(--rhe-accent-dim) !important;
	}
	.rh-tzpick__utc, .rh-tzpick__list {
		background-color: var(--rhe-bg) !important;
		border-color: var(--rhe-border) !important;
	}
	.rh-tzpick__row.is-active, .rh-tzpick__row:hover {
		background-color: var(--rhe-surface-2) !important;
	}
	.rh-tzpick__row.is-current.is-active, .rh-tzpick__row.is-current:hover {
		background-color: var(--rhe-accent-dim) !important;
	}
	.rh-tzpick__row.is-current .rh-tzpick__name, .rh-tzpick__current > i, .rh-tzpick__device, .rh-tzpick__hint {
		color: var(--rhe-accent) !important;
	}
	.rhe-char-count {
		color: rgba(203, 217, 215, 0.55) !important;
	}
	.rhe-char-count.is-near {
		color: var(--rhe-text) !important;
	}
	/* Change email is salmon natively; the key warning has a pink underline. */
	.rh-settings .email-change-entry a {
		color: var(--rhe-accent) !important;
		text-decoration-color: rgba(0, 219, 172, 0.35) !important;
	}
	.rh-settings .api-key strong {
		color: var(--rhe-text) !important;
		text-decoration-color: rgba(203, 217, 215, 0.35) !important;
	}
	/* Settings tabs: pills in the notification filter colors. */
	.rh-settings .rh-settings-tabs li a {
		background-color: var(--rhe-surface-2) !important;
		color: var(--rhe-text) !important;
	}
	.rh-settings .rh-settings-tabs li.is-active a {
		background-color: var(--rhe-accent) !important;
		color: var(--rhe-bg) !important;
	}
	/* Native dark stage and contact circles are plum. */
	.rh-pubgraph__stage {
		background: var(--rhe-surface-1) !important;
	}
	.rh-social-icon {
		background: var(--rhe-surface-2) !important;
		color: var(--rhe-accent) !important;
	}
	.rh-social-icon:hover {
		background: var(--rhe-accent) !important;
		color: var(--rhe-bg) !important;
	}
	.rh-rail__group, .rh-rail__foot, .rh-rail__bottom {
		border-top: 1px solid var(--rhe-border) !important;
	}
}
/* Zero specificity: site !important colors (white text on filled buttons) win. */
:where(html[data-theme=dark]) :where(a) {
	color: var(--rhe-accent) !important;
}`);

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
		btn.append(icon('fa-history'), ' Changelog');
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
			span.append(icon(config.icon), ` ${config.prefix}${value}`);
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

		const el = (tag, className, text) => {
			const node = document.createElement(tag);
			if (className) node.className = className;
			if (text != null) node.textContent = text;
			return node;
		};
		const card = el('div', 'rh-card rh-free-stats');
		const status = el('p', 'rh-free-stats__status', 'Loading\u2026');
		card.append(el('h2', 'rh-card__title', 'Stats'), status);
		anchor.before(card);

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

		// API values are untrusted: numbers must be finite, domains plain strings.
		const num = v => (Number.isFinite(v) ? v : null);
		const hearts = num(engagement?.total_hearts);
		const feedback = num(engagement?.total_feedback);
		const directCount = num(visits?.direct_entry_count);
		const internalCount = num(visits?.internal_entry_count);
		const referrers = (Array.isArray(visits?.top_referrers) ? visits.top_referrers : [])
			.filter(r => typeof r?.referrer_domain === 'string' && Number.isFinite(r.count))
			.slice(0, 5);
		if (hearts == null && feedback == null && !referrers.length) {
			card.remove();
			return;
		}

		const list = el('div', 'rh-info-list');
		[['Hearts', hearts], ['Feedback', feedback], ['Direct Entries', directCount], ['Internal Entries', internalCount]]
			.filter(([, value]) => value != null)
			.forEach(([label, value]) => {
				const item = el('div', 'rh-info-list__item');
				item.append(el('p', 'rh-info-list__label', label), el('p', 'rh-info-list__value', String(value)));
				list.append(item);
			});
		status.replaceWith(list);

		if (referrers.length) {
			const heading = el('p', 'rh-info-list__label', 'Top Referrers');
			heading.style.marginTop = '16px';
			const ul = el('ul', 'fa-ul');
			ul.style.marginTop = '6px';
			referrers.forEach(r => ul.append(el('li', 'mb-1', `${r.referrer_domain}: ${r.count}`)));
			card.append(heading, ul);
		}
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
		// Stat label (exact site text) -> Font Awesome 5 solid class.
		// Live labels: Followers, Following, Downloads, Shortcuts, Skills, Prompts,
		// Agents, Plugins, Favorites (only on some profiles).
		// Content types reuse the "Create new" page glyphs. Unmapped labels get no icon.
		const icons = {
			Followers: 'fa-user-friends',
			Following: 'fa-user-check',
			Downloads: 'fa-download',
			Shortcuts: 'fa-bolt',
			Skills: 'fa-scroll',
			Prompts: 'fa-terminal',
			Agents: 'fa-robot',
			Plugins: 'fa-puzzle-piece',
			Favorites: 'fa-heart',
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

		// Cells carry "N publishes on <date>" in data-label (older markup: title).
		const cellText = cell => cell?.dataset.label || cell?.title || '';
		const recentWeeks = Array.from(weeks).slice(-RECENT_WEEKS);
		const weekData = recentWeeks.map(week => {
			const cells = Array.from(week.querySelectorAll('.rh-pubgraph__cell'));
			const total = cells.reduce((sum, cell) => sum + (parseInt(cellText(cell), 10) || 0), 0);
			const startDate = cellText(cells[0]).match(/on (.+)$/)?.[1] ?? '';
			return { total, startDate };
		});
		// Unknown markup: keep the native chart rather than show empty bars.
		if (!weekData.some(w => w.startDate)) return;
		card.dataset.rhCondensed = 'true';
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
		// Tap hint and Less/More legend describe the heatmap only.
		const foot = card.querySelector('.rh-pubgraph__foot');
		if (foot) foot.style.display = 'none';

		const toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.className = 'button is-dark is-fullwidth rh-pubgraph-toggle';
		toggle.textContent = 'Show full year';
		toggle.addEventListener('click', () => {
			const expanding = toggle.textContent === 'Show full year';
			scrollWrap.style.display = expanding ? '' : 'none';
			if (foot) foot.style.display = expanding ? '' : 'none';
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

	// ---- Notifications: compact rows, yours vs following, burst groups ----
	// Paths of the signed-in user's own items, from their profile. Cached 12 h.
	async function loadOwnItems() {
		const me = document.querySelector('.rh-rail a[href^="/user/"]')?.getAttribute('href');
		if (!me) return null;
		const KEY = 'rhe-own-items';
		try {
			const cached = JSON.parse(localStorage.getItem(KEY) || 'null');
			if (cached?.user === me && Date.now() - cached.at < 12 * 3600e3) return new Set(cached.items);
		} catch {}
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		try {
			const res = await fetch(me, { credentials: 'same-origin', signal: controller.signal });
			if (!res.ok) return null;
			const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
			const items = new Set();
			doc.querySelectorAll('.rh-section-title').forEach(title => {
				// Skip sections listing other people's items.
				if (/favou?rite|like|follow/i.test(title.textContent)) return;
				title.nextElementSibling?.querySelectorAll('a[href]').forEach(a => {
					const path = a.getAttribute('href');
					if (/^\/(shortcut|skill|prompt|plugin|agent|model|cherri)\/[^/?#]+\/?$/.test(path)) {
						items.add(path.endsWith('/') ? path : `${path}/`);
					}
				});
			});
			try { localStorage.setItem(KEY, JSON.stringify({ user: me, at: Date.now(), items: [...items] })); } catch {}
			return items;
		} catch {
			return null;
		} finally {
			clearTimeout(timeout);
		}
	}

	// ---- Settings tabs ----
	// Pills scroll sideways on phones. Fades mark hidden tabs; the active one stays in view.
	function settingsTabs() {
		const bar = document.querySelector('.rh-settings-tabs');
		const list = bar?.querySelector('ul');
		if (!list || bar.dataset.rheTabs) return;
		bar.dataset.rheTabs = 'true';
		const fade = () => {
			const max = bar.scrollWidth - bar.clientWidth;
			bar.classList.toggle('rhe-fade-l', bar.scrollLeft > 2);
			bar.classList.toggle('rhe-fade-r', bar.scrollLeft < max - 2);
		};
		const reveal = () => {
			const li = list.querySelector('li.is-active');
			if (!li) return;
			const b = bar.getBoundingClientRect();
			const r = li.getBoundingClientRect();
			if (r.left < b.left) bar.scrollLeft -= b.left - r.left + 24;
			else if (r.right > b.right) bar.scrollLeft += r.right - b.right + 24;
			fade();
		};
		bar.addEventListener('scroll', fade, { passive: true });
		window.addEventListener('resize', fade);
		// The site switches tabs (click or #hash) by moving li.is-active.
		new MutationObserver(reveal).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });
		reveal();
		fade();
	}

	// ---- Live character counter on length-limited fields ----
	// Bio only for now. Widen COUNTED to cover more maxlength fields.
	const COUNTED = '#id_bio';
	function addCharCounters() {
		document.querySelectorAll(COUNTED).forEach(field => {
			const max = field.maxLength;
			if (max < 1 || field.dataset.rheCount) return;
			field.dataset.rheCount = 'true';
			const out = document.createElement('p');
			out.className = 'help rhe-char-count';
			out.id = `${field.id || field.name}-rhe-count`;
			field.after(out);
			field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), out.id].filter(Boolean).join(' '));
			// Last tenth of the limit stands out.
			const update = () => {
				const n = field.value.length;
				out.textContent = `${n} / ${max}`;
				out.classList.toggle('is-near', max - n <= Math.ceil(max / 10));
			};
			field.addEventListener('input', update);
			update();
		});
	}

	async function enhanceNotifications() {
		const timeline = document.querySelector('.notifications .rh-feed-timeline');
		if (!timeline || timeline.dataset.rheNotif) return;
		timeline.dataset.rheNotif = 'true';
		const own = await loadOwnItems();

		const UNITS = { minute: 'm', hour: 'h', day: 'd', week: 'w', month: 'mo', year: 'y' };
		const objPath = n => n.querySelector('.rh-notification__obj')?.getAttribute('href') ?? '';
		const actorOf = n => n.querySelector('.rh-notification__actor')?.getAttribute('href') ?? '';
		const timeOf = n => Date.parse(n.querySelector('time')?.getAttribute('datetime') ?? '') || 0;
		// Phrase between the actor and the first object link: "commented on", "updated",
		// "replied to you on". Empty for notifications without an actor (streaks, milestones).
		const verbOf = n => {
			const actor = n.querySelector('.rh-notification__text .rh-notification__actor');
			if (!actor) return '';
			let verb = '';
			for (let node = actor.nextSibling; node && !(node.nodeType === 1 && node.matches('a')); node = node.nextSibling) {
				verb += node.textContent;
			}
			return verb.replace(/\s+/g, ' ').trim();
		};

		// B: short time in the title row, quote as the one-line link to the thread.
		const compact = n => {
			if (n.dataset.rheCompact) return;
			n.dataset.rheCompact = 'true';
			const time = n.querySelector('.rh-feed-post__time');
			// "1 day, 2 hours ago": the first, largest unit is the age.
			const m = time?.textContent.match(/(\d+)\s*(minute|hour|day|week|month|year)s?/);
			if (m) {
				time.title = time.textContent.trim();
				time.textContent = m[1] + UNITS[m[2]];
			}
			const stat = n.querySelector('.rh-notification__stat');
			const quote = n.querySelector('.rh-notification__quote');
			if (stat && quote) {
				const link = document.createElement('a');
				link.className = 'rhe-quote-link';
				link.href = stat.getAttribute('href');
				quote.replaceWith(link);
				link.append(quote);
				n.classList.add('rhe-thread-linked');
			}
			if (own) n.classList.add(own.has(objPath(n)) ? 'rhe-own' : 'rhe-following');
		};

		const syncUnread = g => g.classList.toggle('is-unread', !!g.querySelector('.rh-notification--unread'));

		// Day sections from timestamps, so they match what the rows say.
		const DAY = 864e5;
		const bucketOf = t => {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
			if (t >= today) return 'Today';
			if (t >= today - DAY) return 'Yesterday';
			if (t >= today - 6 * DAY) return 'This week';
			if (t >= today - 29 * DAY) return 'This month';
			return 'Older';
		};
		const timeOfEntry = el => el.matches('.rhe-notif-group')
			? timeOf(el.querySelector('.rh-notification'))
			: el.matches('article.rh-notification') ? timeOf(el) : null;
		const isHeader = el => el.matches('.rh-feed-daygroup, .rhe-daygroup');

		// C: everything one account did the same way within one day section, 2+ items.
		// Not limited to neighbours, and later pages ("load more") join existing groups.
		const keyOf = n => `${bucketOf(timeOf(n))}|${actorOf(n)}|${verbOf(n)}`;
		const updateGroup = g => {
			const members = [...g.querySelectorAll('.rhe-notif-group__body > article.rh-notification')];
			const paths = members.map(objPath);
			const noun = paths.every(p => p.startsWith('/shortcut/')) ? 'shortcuts'
				: paths.every(p => p.startsWith('/user/')) ? 'people' : 'items';
			const count = g.querySelector('.rhe-notif-group__count');
			const label = ` ${verbOf(members[0])} ${members.length} ${noun}`;
			if (count.textContent !== label) count.textContent = label;
			syncUnread(g);
		};
		const buildGroup = (run, key) => {
			const first = run[0];
			const g = document.createElement('div');
			g.className = own ? 'rhe-notif-group rhe-following' : 'rhe-notif-group';
			g.dataset.key = key;
			const head = document.createElement('button');
			head.type = 'button';
			head.className = 'rhe-notif-group__head';
			head.setAttribute('aria-expanded', 'false');
			const avatar = document.createElement('span');
			avatar.className = 'rhe-notif-group__avatar';
			first.querySelectorAll('.rh-notification__avatar > *').forEach(c => avatar.append(c.cloneNode(true)));
			const text = document.createElement('span');
			text.className = 'rhe-notif-group__text';
			const name = document.createElement('span');
			name.className = 'rh-notification__actor';
			name.textContent = first.querySelector('.rh-notification__actor')?.textContent.trim() ?? '';
			const count = document.createElement('span');
			count.className = 'rhe-notif-group__count';
			text.append(name, count);
			const meta = document.createElement('span');
			meta.className = 'rhe-notif-group__meta';
			const dot = document.createElement('span');
			dot.className = 'rh-notification__dot rhe-notif-group__dot';
			const chev = icon('fa-chevron-down');
			chev.classList.add('rhe-notif-group__chev');
			meta.append(first.querySelector('.rh-feed-post__time')?.textContent ?? '', dot, chev);
			head.append(avatar, text, meta);
			const body = document.createElement('div');
			body.className = 'rhe-notif-group__body';
			first.before(g);
			g.append(head, body);
			body.append(...run);
			head.addEventListener('click', () => {
				head.setAttribute('aria-expanded', String(g.classList.toggle('is-open')));
			});
			updateGroup(g);
			return g;
		};

		// Consecutive only, so the timeline order never changes. A group that ends the list keeps
		// growing when the next page continues the run. Only person actions group ("commented on").
		const groupable = el => el.matches('article.rh-notification')
			&& !el.classList.contains('rhe-own') && /^[a-z]/i.test(verbOf(el));
		const group = () => {
			let current = null;
			const flush = () => {
				if (current && !current.group && current.items.length >= 2) buildGroup(current.items, current.key);
				current = null;
			};
			for (const el of [...timeline.children]) {
				if (isHeader(el)) continue;
				if (el.matches('.rhe-notif-group')) {
					flush();
					current = { key: el.dataset.key, group: el, items: [] };
					continue;
				}
				if (!groupable(el)) {
					flush();
					continue;
				}
				const key = keyOf(el);
				if (current?.key !== key) {
					flush();
					current = { key, items: [] };
				}
				if (current.group) {
					current.group.querySelector('.rhe-notif-group__body').append(el);
					updateGroup(current.group);
				} else {
					current.items.push(el);
				}
			}
			flush();
		};

		// The site loads the next page when [data-feed-loadmore] enters a 600px margin.
		// Grouping can keep the page so short that it never leaves, so the loader stalls.
		// Hiding it for two frames lets the IntersectionObserver see it enter again.
		const loadMore = document.querySelector('.notifications [data-feed-loadmore]');
		let nudging = false;
		const nudgeLoadMore = () => {
			if (!loadMore || loadMore.hidden || nudging) return;
			// A collapsed last section would otherwise pull in every remaining page.
			if ([...timeline.querySelectorAll('.rhe-daygroup')].pop()?.classList.contains('is-collapsed')) return;
			if (loadMore.getBoundingClientRect().top > window.innerHeight + 600) return;
			nudging = true;
			loadMore.style.display = 'none';
			requestAnimationFrame(() => requestAnimationFrame(() => {
				loadMore.style.display = '';
				nudging = false;
			}));
		};

		// Collapsed sections, remembered per label.
		const COLLAPSED_KEY = 'rhe-notif-collapsed';
		let collapsed = new Set();
		try { collapsed = new Set(JSON.parse(localStorage.getItem(COLLAPSED_KEY) || '[]')); } catch {}

		const makeHeader = bucket => {
			const h = document.createElement('h3');
			h.className = 'rhe-daygroup';
			h.dataset.bucket = bucket;
			const toggle = document.createElement('button');
			toggle.type = 'button';
			toggle.className = 'rhe-daygroup__toggle';
			const label = document.createElement('span');
			label.className = 'rhe-daygroup__label';
			label.textContent = bucket;
			const count = document.createElement('span');
			count.className = 'rhe-daygroup__count';
			const chev = icon('fa-chevron-down');
			chev.classList.add('rhe-daygroup__chev');
			toggle.append(label, count, chev);
			toggle.addEventListener('click', () => {
				if (collapsed.has(bucket)) collapsed.delete(bucket);
				else collapsed.add(bucket);
				try { localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...collapsed])); } catch {}
				sections();
			});
			h.append(toggle);
			return h;
		};

		// One header per section. Only inserts or removes when something is off, so the observer settles.
		const headers = () => {
			let prevBucket = null;
			for (const el of [...timeline.children]) {
				if (isHeader(el)) continue;
				const t = timeOfEntry(el);
				if (t == null) continue;
				const bucket = bucketOf(t);
				let before = el.previousElementSibling;
				while (before?.matches('.rh-feed-daygroup')) before = before.previousElementSibling;
				const ours = before?.matches('.rhe-daygroup') ? before : null;
				if (bucket !== prevBucket && ours?.dataset.bucket !== bucket) {
					el.before(makeHeader(bucket));
				} else if (bucket === prevBucket && ours) {
					ours.remove();
				}
				prevBucket = bucket;
			}
			timeline.querySelectorAll('.rhe-daygroup').forEach(h => {
				let next = h.nextElementSibling;
				while (next?.matches('.rh-feed-daygroup')) next = next.nextElementSibling;
				if (!next || isHeader(next)) h.remove();
			});
		};

		// Item counts on headers, and hiding the rows of collapsed sections.
		const sections = () => {
			let header = null;
			let count = 0;
			const close = () => {
				if (!header) return;
				const label = String(count);
				const el = header.querySelector('.rhe-daygroup__count');
				if (el.textContent !== label) el.textContent = label;
				const isCollapsed = collapsed.has(header.dataset.bucket);
				header.classList.toggle('is-collapsed', isCollapsed);
				const toggle = header.querySelector('.rhe-daygroup__toggle');
				if (toggle.getAttribute('aria-expanded') !== String(!isCollapsed)) toggle.setAttribute('aria-expanded', String(!isCollapsed));
			};
			for (const el of [...timeline.children]) {
				if (el.matches('.rh-feed-daygroup')) continue;
				if (el.matches('.rhe-daygroup')) {
					close();
					header = el;
					count = 0;
					continue;
				}
				count += el.matches('.rhe-notif-group') ? el.querySelectorAll('article.rh-notification').length : 1;
				el.classList.toggle('rhe-section-hidden', !!header && collapsed.has(header.dataset.bucket));
			}
			close();
		};

		// Settings link as a bell with a gear badge; the text pill outsized the title.
		// Inline SVG so the gear cuts a contour gap into the bell on any background.
		// Paths: Font Awesome Free 6.6.0 solid bell and gear (CC BY 4.0).
		const settings = document.querySelector('.notifications .rh-section-header a[href*="settings"]');
		if (settings) {
			const BELL = 'M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z';
			const GEAR = 'M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z';
			const svgEl = (tag, attrs) => {
				const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
				return el;
			};
			// Bell 448x512 at the origin; gear r=132 centred at (450, 424).
			const gearAt = { transform: 'translate(318 292) scale(0.515625)', d: GEAR };
			const svg = svgEl('svg', { viewBox: '0 0 582 556', class: 'rhe-notif-settings__icon', 'aria-hidden': 'true' });
			const mask = svgEl('mask', { id: 'rhe-gear-cut', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 582, height: 556 });
			// Gear plus a 78/2 unit stroke (20 after scaling) is the gap; the circle covers the hub hole.
			mask.append(
				svgEl('rect', { width: 582, height: 556, fill: '#fff' }),
				svgEl('path', { ...gearAt, fill: '#000', stroke: '#000', 'stroke-width': 78, 'stroke-linejoin': 'round' }),
				svgEl('circle', { cx: 450, cy: 424, r: 60, fill: '#000' }),
			);
			svg.append(mask, svgEl('path', { d: BELL, mask: 'url(#rhe-gear-cut)' }), svgEl('path', gearAt));
			settings.classList.add('rhe-notif-settings');
			settings.setAttribute('aria-label', 'Adjust notifications');
			settings.title = 'Adjust notifications';
			settings.replaceChildren(svg);
		}

		if (own) {
			const bar = document.createElement('div');
			bar.className = 'rhe-notif-filter';
			bar.setAttribute('role', 'tablist');
			const tabs = [['all', 'All'], ['own', 'Yours'], ['following', 'Following']].map(([key, label]) => {
				const tab = document.createElement('button');
				tab.type = 'button';
				tab.className = 'rh-feed-tab';
				tab.setAttribute('role', 'tab');
				tab.textContent = label;
				tab.addEventListener('click', () => setFilter(key));
				bar.append(tab);
				return [key, tab];
			});
			const setFilter = key => {
				timeline.dataset.rheFilter = key;
				tabs.forEach(([k, tab]) => {
					tab.classList.toggle('is-active', k === key);
					tab.setAttribute('aria-selected', String(k === key));
				});
				try { localStorage.setItem('rhe-notif-filter', key); } catch {}
			};
			let saved = 'all';
			try { saved = localStorage.getItem('rhe-notif-filter') || 'all'; } catch {}
			// One toolbar row: filter left, the site's own "Mark all as read" right (moved, handlers kept).
			const readAll = document.querySelector('.notifications .read-all');
			if (readAll) bar.append(readAll);
			timeline.before(bar);
			setFilter(saved);
		}

		// Re-runs for "load more" and read-state changes; every step is idempotent.
		const refresh = () => {
			timeline.querySelectorAll('article.rh-notification').forEach(compact);
			group();
			headers();
			sections();
			requestAnimationFrame(nudgeLoadMore);
			timeline.querySelectorAll('.rhe-notif-group').forEach(syncUnread);
		};
		refresh();
		new MutationObserver(refresh).observe(timeline, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
	}

	// ---- Search popup: search first, browse on demand ----
	// Empty field on "All" shows pills only; the site would repeat them as rows.
	// A picked category or a typed query shows the list, capped above the keyboard.
	function quietSearchBrowse() {
		const root = document.getElementById('rh-browse');
		if (!root || root.dataset.rheQuiet) return;
		root.dataset.rheQuiet = 'true';
		const input = document.querySelector('.search #id_q');

		const fade = () => {
			const row = root.querySelector('.rh-browse__sections');
			if (row) {
				const max = row.scrollWidth - row.clientWidth;
				row.classList.toggle('rhe-fade-l', row.scrollLeft > 2);
				row.classList.toggle('rhe-fade-r', row.scrollLeft < max - 2);
			}
			const list = root.querySelector('.rh-browse__items');
			if (list) {
				const max = list.scrollHeight - list.clientHeight;
				list.classList.toggle('rhe-fade-t', list.scrollTop > 2);
				list.classList.toggle('rhe-fade-b', list.scrollTop < max - 2);
			}
		};
		// scroll does not bubble; capture catches the re-rendered pill row too.
		root.addEventListener('scroll', fade, { capture: true, passive: true });

		const update = () => {
			fade();
			const active = root.querySelector('.rh-browse__section.is-active')?.dataset.key;
			const empty = !(input?.value || '').trim();
			root.classList.toggle('rhe-pills-only', empty && (!active || active === 'all'));
			const items = root.querySelector('.rh-browse__items');
			const vv = window.visualViewport;
			if (!items || !vv || root.classList.contains('rhe-pills-only')) return;
			const room = vv.offsetTop + vv.height - items.getBoundingClientRect().top - 12;
			items.style.setProperty('max-height', `${Math.max(140, Math.round(room))}px`, 'important');
			fade();
		};
		// Style writes are not observed, so update cannot retrigger itself.
		new MutationObserver(update).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
		input?.addEventListener('input', update);
		window.visualViewport?.addEventListener('resize', update);
		window.visualViewport?.addEventListener('scroll', update);
		update();
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
	addHeroMetadata();
	promoteCreatorLine();
	promoteRequiredApps();
	addFreeStatsSummary();
	addStatIcons();
	splitStatsOverview();
	condensePublishActivity();
	cleanAuthoredGrid();
	quietSearchBrowse();
	enhanceNotifications();
	settingsTabs();
	addCharCounters();
	refreshComments();

	// Archived comments (and the changelog card) can load in after an AJAX call,
	// so re-run once the relevant containers change.
	const feedbackEl = document.getElementById('feedback');
	if (feedbackEl) new MutationObserver(refreshComments).observe(feedbackEl, { childList: true, subtree: true });
})();
