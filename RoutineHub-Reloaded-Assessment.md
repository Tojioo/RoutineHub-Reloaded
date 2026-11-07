# RoutineHub Reloaded assessment

Date 2026-11-07. Live snapshots from 2026-11-06, logged out. Script `RoutineHub_Enhancer.user.js` 1.0.0-alpha23, commit 914913f. Scope: code, docs, tracker, license, repo state and 34 live pages.

## Summary

The shortcut page and the comment threads still work. Much of the rest has drifted from the live site. RoutineHub shipped a native dark theme, new markup and new components after the last sweep. Several old fixes now fight the site instead of fixing it.

- Two DOM XSS sinks exist. Both fired with crafted input in a test run. Fix them first.
- The profile chart is empty on every profile. The homepage reorder moves five sections above the tagline.
- The theme gate ignores an explicit light choice. The script's `--rh-*` names collide with variables the site reads, which blanks text in light mode.
- Filled buttons, the navbar search field and the login labels fail contrast. The search-time navbar fix targets the wrong cause.
- Docs and tracker describe the site as it was in September. The alpha24 fix exists in no commit.

86 findings: 0 critical, 8 high, 18 medium, 41 low, 19 info. 46 confirmed by skeptic checks, 22 low findings not independently verified, 18 info observations. None refuted.

### Top fixes

0. Export the installed build from the phone and commit it before changing anything. alpha24 exists only there ([M-03](#m-03)).
1. Build DOM nodes instead of parsing strings in `addHeroMetadata` and `addFreeStatsSummary` ([H-01](#h-01)).
2. Gate the dark block on the site's own `data-theme` and rename the private tokens ([H-03](#h-03), [H-05](#h-05), [I-01](#i-01)).
3. Read `data-label` in the Publish Activity chart, re-target the homepage reorder, map the new stat labels ([H-02](#h-02), [M-01](#m-01), [M-02](#m-02)).
4. Restore contrast on filled buttons, the search field and the login labels ([H-06](#h-06), [H-07](#h-07), [H-08](#h-08)).
5. Replace the navbar observer with one `.rh-browse-backdrop` rule and delete the debug logger ([H-04](#h-04), [L-17](#l-17)).

## Scorecard

| Area | Status | Reason |
|---|---|---|
| JS correctness | Needs work | One throw stops every later feature. Several functions assume old markup. |
| Live-site compatibility | Broken | Profile chart, homepage order, stat icons and search tint are wrong today. |
| Security | Broken | Two innerHTML sinks take author and API strings. |
| CSS and theming | Broken | Token collision blanks light-mode text. Native dark and script dark mix. |
| Accessibility | Needs work | Contrast fails on core controls. Disclosures expose no state. |
| Performance and robustness | Needs work | No `@run-at`. Debug observers on every page. One-shot features miss later content. |
| Packaging and compatibility | Needs work | No update channel. The 1.0 rename creates a second script. Needs relaxed CSS nesting. |
| License | Needs work | gluebyte's copyright notice is not reproduced. |
| Docs and tracker | Needs work | They describe September markup and contradict the code in places. |
| Repo and process | Needs work | One commit. alpha24 missing. README and LICENSE on an unmerged branch. No CI. |

## How to read the findings

IDs run by severity: H high, M medium, L low, I info. Each entry states how it was checked.

- Confirmed: one to three skeptic agents re-derived the claim from the files and did not refute it.
- Not independently verified: the skeptic check did not run. Treat the entry as a strong lead.
- Observation: info items, deliberately not checked.

Verification notes under high and medium entries hold the skeptics' corrections. Where they differ from the reviewer text, the notes win.

## Contents

- [Live-site compatibility](#live-site-compatibility)
- [Theme audit rerun](#theme-audit-rerun)
- [Suggested order of work](#suggested-order-of-work)
- [High findings](#high-findings) (8)
- [Medium findings](#medium-findings) (18)
- [Low findings](#low-findings) (41)
- [Observations](#observations) (19)
- [Docs and tracker corrections](#docs-and-tracker-corrections)
- [Verified working](#verified-working)
- [Method and limitations](#method-and-limitations)

## Live-site compatibility

Logged out, 2026-11-06. Status: works, partial, broken, not themed or not checked.

| Page | Script features there | Status | Note |
|---|---|---|---|
| Homepage | Section reorder, action label removal, tagline and proof bar | Broken | Reorder puts 5 sections above the tagline ([M-01](#m-01)). Proof bar text unverified ([L-23](#l-23)). |
| Shortcut detail | Changelog button, hero metadata, creator line, Required Apps, stats card, comments | Partial | Button, metadata and comment flattening work. XSS sinks ([H-01](#h-01)), CTA contrast ([H-06](#h-06)), unthemed new components ([M-08](#m-08)), 34-icon Required Apps grid ([M-13](#m-13)). |
| Version history | Card and text theming | Partial | New components unthemed ([M-08](#m-08)). Download CTA contrast ([H-06](#h-06)). |
| Profile | Stat icons, stats split, condensed chart, Free badge removal | Broken | Chart empty ([H-02](#h-02)). Legend and readout stay visible ([M-06](#m-06)). Agents and Favorites bare ([M-02](#m-02)). Plum palette remains ([M-07](#m-07)). |
| Feed and channels | Card, composer and check-in theming | Partial | Markup changed after the docs were written ([M-17](#m-17)). |
| Listings, category, search results | Card theming | Partial | Search page keeps the site palette ([L-02](#l-02)). Heatseekers contrast ([L-25](#l-25)). Card counts below 4.5:1 ([L-27](#l-27)). |
| Navbar and search overlay | Chrome theming, search observer | Broken | Tint comes from `.rh-browse-backdrop` ([H-04](#h-04)). Search field contrast ([H-07](#h-07)). Popovers leak ([M-10](#m-10)). |
| Login and register | Floating label rule | Broken | Now a modal at `/#/login`. Labels at 1.73:1 ([H-08](#h-08)). |
| Upload New (`/new/`) | Picker and heading rules | Partial | Redesigned and public. Selectors still match ([L-13](#l-13)). |
| Skill, Prompt, Agent, Plugin, Model, Cherri, Sell, Membership | Generic theming only | Not themed | CTA contrast ([H-06](#h-06)). Only generic rules apply ([L-22](#l-22)). |
| Notifications, settings, rail, stats page, owner states | Rail theming, stats card | Not checked | Needs a logged-in pass ([I-14](#i-14)). |

## Theme audit rerun

Same method as `RoutineHub-Reloaded-Theme-Audit.md`, against `main.min.261102-102115.css`.

| Metric | 2026-09-10 | 2026-09-11 | 2026-11-06 |
|---|---|---|---|
| Distinct classes in native dark selectors | 569 | 675 | 885 |
| Overlap with the script | 71 | 71 | 87 |
| `rh-` gap | 292 | 395 | 537 |
| Generic gap | 206 | 209 | 261 |

- The overlap of 87 includes the 16 `rh-rail` classes added in alpha23. Without them it is 71, as before.
- Native dark is attribute only: 1,370 `:where(html[data-theme=dark])` selectors and 57 plain `html[data-theme=dark]` selectors. The site CSS has no `prefers-color-scheme` query.
- 1,108 of the 1,111 dark rules only change colors. Using native dark as the base layer brings no layout side effects.
- The old regex missed the plain selector form and element-only rules. 175 unreferenced `rh-` classes appear in no doc ([L-10](#l-10)).
- Recommendation: gate on `data-theme`, rename the private tokens, re-key only the core surfaces and let native dark cover the rest ([I-01](#i-01)).

## Suggested order of work

**Phase 0, before any code change.** Export the installed build from the phone and commit it ([M-03](#m-03)). Tag 914913f as alpha23. One commit and one tag per version from now on.

**Now, all small.** [H-01](#h-01), [H-03](#h-03), [H-05](#h-05), [H-02](#h-02), [M-01](#m-01), [M-02](#m-02), [H-04](#h-04), [L-17](#l-17), [H-06](#h-06), [H-07](#h-07), [H-08](#h-08), [M-04](#m-04).

**Next.** Robustness and coverage: [M-05](#m-05), [M-10](#m-10), [M-11](#m-11), [M-06](#m-06), [M-07](#m-07), [M-08](#m-08), [M-09](#m-09), [M-12](#m-12), [M-13](#m-13), [M-14](#m-14), [M-15](#m-15). Packaging and license: [L-03](#l-03), [L-04](#l-04), [L-05](#l-05), [L-06](#l-06), [L-07](#l-07), [L-08](#l-08), [L-09](#l-09), [L-19](#l-19).

**Docs.** Rewrite tracker and docs against the current site: [M-16](#m-16), [L-10](#l-10), [L-11](#l-11), [L-12](#l-12), [M-17](#m-17), [L-13](#l-13), [M-18](#m-18), [L-14](#l-14), [L-41](#l-41).

**Later.** Logged-in pass ([I-14](#i-14)). Scope decisions ([I-07](#i-07), [I-10](#i-10)). Remaining low findings.

**1.0.0 should require:** no open high or medium finding, a dark gate keyed on the site theme, a stable identity with an update channel, the license notice, CI running the harness on saved fixtures, a logged-in check of the auth pages, and docs that match the shipped build. Details in [I-19](#i-19).

## High findings

<a id="h-01"></a>
### H-01. Two innerHTML sinks re-parse Version text and API referrers as HTML (DOM XSS)

**Where.** [RoutineHub_Enhancer.user.js:L574-L586](RoutineHub_Enhancer.user.js#L574-L586); [RoutineHub_Enhancer.user.js:L657-L677](RoutineHub_Enhancer.user.js#L657-L677)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix). Severity changed from critical to high.  
**Effort.** S. **Confidence.** medium. **Category.** security.

**Evidence.** addHeroMetadata reads the decoded textContent of .rh-info-list__value (L579) and writes it through span.innerHTML (L584). addFreeStatsSummary builds `${r.referrer_domain} - ${r.count}` (L661) and raw row() values (L667-L669) into card.innerHTML (L671-L677). Harness probe: Version '1.0&lt;img src=x id=rhe-xss-ver&gt;' and referrer '&lt;img src=x id=rhe-xss-ref&gt;' became live elements. exp-sinks.js and exp-realpage.js (4 real shortcut pages with all site scripts and handlers stripped) executed both handlers. Python urlsplit keeps a slash-free Referer payload intact in netloc and hostname, and the site changelog shows the server stores Referer data, which curl can forge. No CSP meta or nonce; 132 inline handlers make a strict script-src unlikely. All 190 to 198 snapshot versions are numeric, so server-side Version validation is unknown. Pages carry csrfmiddlewaretoken. The origin exposes /wallet/export/ (private_key JSON), /wallet/send/transaction/ and /api/v2/payments/initiate/ (csrftoken cookie only) and API keys on /settings-api.

**Impact.** An author who can store markup in Version runs script for every userscript user who opens the page. Anyone can push a referrer payload into the top 5 with repeated curl requests and run script as the shortcut owner, first of all the script author (/user/tojioo, 9 shortcuts). Payloads can export the wallet key, start USDC payments, read API keys or publish versions of the victim's shortcuts.

**Fix.** Build nodes instead of parsing strings: create the &lt;i&gt;, set className, then span.append(i, ` ${config.prefix}${value}`). Render the stats card with createElement and textContent, accept counts only when Number.isFinite, check Array.isArray(visits?.top_referrers) and skip non-string domains (optionally only /^[a-z0-9.-]{1,253}$/i). Validated: the patched build shows both payloads as text. Bump @version and ship through an update channel. To gauge exploitability, save a harmless `1.0<b>x</b>` on a draft and send one curl with Referer `http://<b>x</b>/` to an own shortcut. Fix without waiting for those tests.

<details><summary>Verification notes</summary>

**reproduce.** 1) The API-keys page is /forms/settings-api/ ("View all your keys in Settings"), not /settings-api. 2) "132 inline handlers" is the total across all 34 snapshots. Each page has only 4-5 onload attributes plus 12-19 inline scripts without nonces. Response headers were not captured, so say "no CSP meta tag", not "no CSP". 3) Add that changelog-site L2522 limits Version to 25 characters and L2866 mentions submission rules, so Version input is restricted to some unknown degree. 4) "Anyone can push a referrer into the top 5 with repeated curl requests" overstates it: L2637 says stats show unique data, and the referrer source (Referer header or something else) and any Cloudflare filtering are unverified. 5) Lower severity from critical to high and keep confidence at medium until the harmless live tests in the recommendation are run. The recommended fix (build DOM nodes, use textContent, accept only Number.isFinite counts and string domains) is sound.

**impact.** Downgrade critical to high. The sink mechanics and the sensitive same-origin context are confirmed, but neither payload source could be confirmed from the read-only files, and the finding's own confidence is medium; 'critical' (an exploitable hole) overstates what the evidence proves. It rises to critical only once a markup-accepting source is confirmed (server stores markup in Version, or preserves markup through Referer extraction into top_referrers). Evidence fixes: (1) Version count is exactly 198 strings across snapshots, all numeric (changelog-4448 134, changelog-19090 56, four shortcut pages 2 each), not '190 to 198'. (2) Temper the referrer-sink evidence: get-visit-stats, get-engagement-stats, top_referrers, referrer_domain, .rh-stats-card, 'Your Analytics' and 'FREE: always' occur in ZERO logged-out snapshots and in the logged-out script.min bundle; the harness and both experiments synthesize the owner-only stats card and stub the fetch with assumed field names, so this path's real data source rests on the script's own L606-616 comment, not independent evidence. The urlsplit claim describes Python, not RoutineHub's server. (3) The '132 inline handlers' are all onload on &lt;link rel=preload&gt; font preloads (4 per page, 5 on shortcut pages); they correctly establish that no strict CSP is deployed, but are not 132 diverse risky handlers. Keep location and recommendation; I additionally confirmed X-CSRFToken=getCookie('csrftoken') and the wallet/payments/settings-api/USDC endpoints in the live bundle, which supports the escalation and readable-CSRF-cookie model.

**fix.** 1. Severity: high until a server test shows markup survives. Raise it to critical then.

2. Number.isFinite: drop it. textContent already makes any value inert. Keep `value != null` and set `textContent = String(value)`. Otherwise numeric-string counts give a card with only the "Stats" title, which breaks the documented three terminal states (RoutineHub-Reloaded.md:L206-L208). If a type check is still wanted, run it before the empty-card check.

3. Exact fix, hero (L584):
`const icon = document.createElement('i'); icon.className = `fas ${config.icon}`; span.append(icon, ` ${config.prefix}${value}`);`

4. Exact fix, stats (replace L661-L677). Filter before the empty check:
`const list = Array.isArray(visits?.top_referrers) ? visits.top_referrers : []; const referrers = list.filter(r => typeof r?.referrer_domain === 'string').slice(0, 5).map(r => `${r.referrer_domain} - ${r.count}`);`
Keep the existing `card.remove()` check. Then:
`const el = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls; if (text != null) n.textContent = String(text); return n; };`
Build div.rh-info-list from [Hearts, Feedback, Direct Entries, Internal Entries], skipping null values. Call `card.replaceChildren(el('h2','rh-card__title','Stats'), info)`. When there are referrers, append p.rh-info-list__label "Top Referrers" (style.marginTop='16px') and ul.fa-ul (style.marginTop='6px') with one li.mb-1 per referrer. This matches the original DOM exactly for benign data (fixcheck.js).

5. Skip the optional /^[a-z0-9.-]{1,253}$/i allowlist. After textContent it adds no security, and it would hide "localhost:8000", IDN domains and underscores.

6. Fix the exploitability test. The Referer `http://<b>x</b>/` is not slash-free: urlsplit returns netloc and hostname `<b>x<`. Use `http://<b>x<b>/` instead. RoutineHub has unpublished shortcuts, not drafts. A Version saved on a published shortcut is public, so test on an unpublished one. Send one request only, since the docs warn of Cloudflare challenges after about 8-10 rapid requests.

7. Shipping: the header (L1-L9) has no @updateURL or @downloadURL, so installs, the iPhone manager included, never update on their own. Either add both, pointing at a stable raw URL, or tell users to reinstall. RoutineHub-Reloaded.md:L93 already claims alpha24 for a fix that never shipped (F4). Ship this together with that rail fix as alpha24, or as alpha25 and correct the docs.

8. Evidence nits:
- "132 inline handlers" is the total across 34 snapshots. Each page has 4-5, all `<link rel=preload onload>`. The stronger fact: each shortcut page has 13 executable inline `<script>` blocks without a nonce, so any CSP must allow 'unsafe-inline'. Response headers were not captured.
- The API keys page is /forms/settings-api/.
- urlsplit `.hostname` lowercases the payload. "Intact" is true only for `.netloc`.

</details>

<a id="h-02"></a>
### H-02. Condensed Publish Activity shows 13 empty bars because cells moved from title to data-label

**Where.** [RoutineHub_Enhancer.user.js:L789-L841](RoutineHub_Enhancer.user.js#L789-L841)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix).  
**Effort.** S. **Confidence.** high. **Category.** live-drift.

**Evidence.** L794 sums parseInt(cell.title) and L795 reads cells[0]?.title. Both profiles have 376 .rh-pubgraph__cell: 370 with data-label (e.g. '1 publish on Nov 2, 2025'), 0 with title, plus 1 --future cell and 5 legend swatches. Site JS binds its readout to [data-label]. Harness and profrun.js: all 13 minibars '2px | 0 publishes, week of ' with 13 empty labels. With dataset.label: tojioo 1,0,0,0,0,0,0,0,2,1,0,6,0 and gluebyte 2,3,4,6,0,1,0,0,0,0,0,0,0, labels Aug 9, Sep 6, Oct 4, Nov 1. Summed data-labels (31, 89) match each page's 'N publishes in the last year'. md L80, L254-L256, L342 and comment L775 still describe title parsing and the legend inside __chart. Status L288-L290 says implemented; the README advertises the chart.

**Impact.** Every profile claims zero activity for 13 weeks under a header that says '31 publishes in the last year'. Real data appears only after 'Show full year'.

**Fix.** Read data-label with a title fallback: const text = c =&gt; c?.dataset.label || c?.title || ''; parse counts and /on (.+)$/ from it. Compute weekData before setting card.dataset.rhCondensed and return early, keeping the native chart, when no week has a startDate. Update docs, comment and tracker. Then decide whether the condensed view is still worth keeping, since the native chart now has a touch readout.

<details><summary>Verification notes</summary>

**reproduce.** 1. Location: the function spans RoutineHub_Enhancer.user.js:L780-L842. The defect is at L794-L795 (the weekData map, L792-L797). The stale comment is L774-L776. L789-L841 falls inside the function but starts at the rhCondensed assignment.

2. Impact wording: on every profile all 13 bars render at the 2px minimum with no date labels. Profiles that published in the window are misreported as zero: the real 13-week totals are 10 (tojioo) and 16 (gluebyte). A profile with no recent publishes gets correct bars by accident but still has no labels. On iPhone the title tooltips never show, so the user sees only flat stubs.

3. Missing symptom from the same drift: .rh-pubgraph__foot holds the readout ('Hover a square to see that day', data-idle-touch 'Tap a square to see that day') and the Less/More legend. It is a sibling of .rh-pubgraph__scroll inside .rh-pubgraph__stage. The script hides only scrollWrap, so in condensed view the order is: bars, 'Show full year' button, then a readout pointing at hidden squares and a heatmap legend that does not apply. Verified in jsdom: stage children are 'mini &gt; scroll[display:none] &gt; rh-pubgraph-toggle &gt; foot'.
- Extend the recommendation: toggle the foot together with scrollWrap, or toggle the whole stage.
- Correct md L342 accordingly.
- If this symptom is already a separate finding, cross-reference it.

4. Add to the evidence: the site JS never sets a title on pubgraph cells. The jsdom 'page scripts not executed' caveat therefore does not hide a runtime title.

**impact.** Location: narrow to RoutineHub_Enhancer.user.js:L789-L795. L789 sets the flag before the data is checked, and L794-L795 parse title. The function spans L780-L842.

Evidence: the example label "1 publish on Nov 2, 2025" comes from gluebyte. tojioo's first cell reads "No publishes on Nov 2, 2025". Add that the site JS never sets title on cells (only 2 unrelated .title= uses), so a real browser matches the jsdom result.

Impact, missing piece: in the condensed state, the native .rh-pubgraph__foot stays visible under the toggle. It holds the readout "Hover a square to see that day" (or "Tap a square to see that day" on touch) and the Less/More swatch legend. It stays visible because it is now a sibling of __scroll inside .rh-pubgraph__stage, and only __scroll is hidden. Order after the script: mini &gt; scroll (hidden) &gt; toggle &gt; foot. md L342, which says the legend is still inside __chart, is the stale assumption behind this.

Recommendation: I checked it with an in-memory patch.
- With the data-label/title fallback plus the early-return guard, tojioo bar heights are 8,2,2,2,2,2,2,2,16,8,2,48,2 px and gluebyte heights are 16,24,32,48,2,8,2,2,2,2,2,2,2 px. Labels are Aug 9 / Sep 6 / Oct 4 / Nov 1.
- With all labels stripped, rhCondensed stays unset and the native chart stays visible.
- Returning early without setting the flag is safe: condensePublishActivity runs once (L967), not from the #feedback MutationObserver.

Add to the fix: hide .rh-pubgraph__foot together with __scroll in the condensed state, or insert mini before .rh-pubgraph__stage and toggle the whole stage. Also rewrite md L342 to the current structure: __stage &gt; __scroll (__chart: __months, __body) + __foot (__readout, __legend).

**fix.** Recommendation: keep the data-label read with title fallback and the startDate guard set before card.dataset.rhCondensed. Also toggle the whole stage instead of __scroll, so __foot (readout plus heatmap legend) hides with the heatmap and the button stays below whichever view is visible:
const full = card.querySelector('.rh-pubgraph__stage') ?? scrollWrap;
full.before(mini); full.style.display = 'none';
in the click handler: full.style.display = expanding ? '' : 'none';
full.after(toggle);
Verified in jsdom on both profiles. Optional stronger guard: sum all 53 weeks and return early if the sum differs from .rh-pubgraph__total strong (31 and 89 match today). It catches a count-format change that leaves dates parseable, which the startDate guard misses.

Docs:
- Update comment L774-L776 and L836-L840.
- Update md L254-L256, L260-L266 and L342. New tree for L342: .rh-pubgraph__stage &gt; __scroll &gt; __chart &gt; __months + __body, then __foot &gt; __readout + __legend; cells carry data-label, no title.
- Leave the alpha11 history row at md L80 unchanged and add a new version row.
- Bump @version, coordinated with F4 (alpha24 is documented but not shipped).
- Status L288-L290: add a note.

Impact: add that the condensed view also shows the native readout ('Tap a square to see that day' on iPhone) and the Less/More legend below the button. Expanded, the button splits the heatmap from its foot.

Evidence: the README mention is README.md L40 on origin/claude/github-repo-documentation-7o6b3u, not on main.

Location: core read is L792-L797; placement issue L823-L841; whole function L780-L842.

</details>

<a id="h-03"></a>
### H-03. OS-dark OR logic overrides an explicit light choice and yields a half-themed page

**Where.** [RoutineHub_Enhancer.user.js:L46-L61](RoutineHub_Enhancer.user.js#L46-L61); [RoutineHub_Enhancer.user.js:L245-L258](RoutineHub_Enhancer.user.js#L245-L258)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix).  
**Effort.** S. **Confidence.** high. **Category.** correctness.

**Evidence.** Every page head script sets data-theme from localStorage rh_theme, else prefers-color-scheme. The bundle follows OS changes while nothing is stored and sets aria-checked on every .rh-theme-toggle. So osDark || theirDark (L47-L49) differs from data-theme only after a light choice on an OS-dark device. Harness themeMatrix: rhe-dark on for dark, light and absent. Site CSS has 0 prefers-color-scheme queries and 1427 html[data-theme=dark] occurrences, so uncovered components revert to light. Scans: 747 to 824 script-caused failures on 23 to 32 pages, e.g. /changelog/ .card #CBD9D7 on #fff 1.45:1 (248), skill-detail markdown 1.06 to 1.36:1, sell title 1.19:1, .rh-alsocard links 1.79:1, feed tabs and reactions 1.63:1, .rh-proof-detail 2.64:1, .rh-pf-label 2.52:1, deal sheet and login modal 1.45:1, a white .rh-anchor ad bar. html has no dark background, so iOS overscroll is white. L245-L258 pin the toggle visuals to dark. L51 updates only the first toggle: toggles read ['true','false']; on desktop the visible switch looks on but reports off, on mobile VoiceOver always hears on. Track #3d3a45 on surface-2 is 1.02:1. md L132-L146, code L19-L45 and Status cross_cutting still call the site toggle independent of the OS; README says 'synced'.

**Impact.** One tap on the site switch persists a broken page across visits, and the toggle looks dead. Assistive tech gets contradictory state (WCAG 4.1.2).

**Fix.** Decision D1: key the dark block on html[data-theme=dark] (same specificity, no JS), or use effectiveDark = data-theme === 'dark' with the OS only as fallback. Delete syncThemeClass, the aria-checked write (L51), the matchMedia listener (L56) and the toggle re-key (L245-L258), since the site syncs all toggles. If OS dark must win, set data-theme=dark instead and use querySelectorAll. Give the track 3:1 against its background. Update docs, code comment, Status and README; release note: a site set to light stays light.

<details><summary>Verification notes</summary>

**reproduce.** 1) Counts. 747 (css-cascade scan, 3:1 threshold, 23 of 31 pages) and 824 (a11y-contrast scan, WCAG thresholds, 27 of 32 pages) are raw totals for the OS-dark/site-light state. The finding's "23 to 32 pages" is wrong. Only 541 to 598 failures on 19 to 25 pages are absent in the default both-dark state. The rest also fail when both are dark (css-cascade 628, a11y 226), for example 193 .rh-cta Download links #00DBAC on #3273dc at 2.54:1 from html.rhe-dark a. The 134 and 56 failures on changelog-4448 and changelog-19090 are the same in both states. Cite 541 to 598 as the OR-logic impact.
2) Drop the deal sheet. .rh-deal__title, __option, __perks and __celebrate use color:var(--rh-text,#2d2f36), and the script defines --rh-text:#CBD9D7 on :root unconditionally (L191-L200). The sheet is therefore 1.45:1 in OS-light/site-light too, with rhe-dark off. That is a variable-name collision, and D1 does not fix it.
3) The login modal at 1.45:1 rests on synthetic markup. The real form is fetched at runtime from /login/?modal=true and is not in the snapshots. The mechanism is sound: .modal-card-body is #fff and turns #1f191f only under data-theme=dark. Label this item as inferred.
4) The harness shows ['true','false'] for every OS-dark row only because the site bundle did not run. With o() modeled, the mismatch appears only with OS dark and data-theme=light. Both toggles read true when both are dark.
5) The 1.02:1 track does not come from the OR logic. It also occurs in the both-dark state: the site's own html[data-theme=dark] .rh-theme-toggle sets #3d3a45, and the script's unconditional .navbar-item rule (L213-L215) puts it on surface-2. Move it to a separate low item.
6) Status.json cross_cutting (L40-L47) does not say "independent". It records the OR logic, and "OS dark with their attribute forced to light renders fully dark", as done and verified. md L91 (the alpha22 row) repeats that claim. The "independent of the OS" wording is only in code L21 and md L133.
7) The OR also differs from data-theme when localStorage throws. The head script's catch then leaves data-theme unset, and the bundle's init writes light. This case is rare.
8) Recommendation. Delete all of L46-L63 (syncThemeClass, initThemeSync with its MutationObserver at L57-L60, and the call at L63) together with L242-L258. The "set data-theme=dark" alternative needs a guard that writes only when the value changes. A same-value setAttribute still queues a mutation record (jsdom fired 1 callback), so an unguarded write inside the data-theme observer loops forever. That option also reverts the site's own tap at once, so the switch stays dead. Under D1, querySelectorAll is not needed because o() already writes every toggle.

**impact.** 1. Counts. 747 and 824 are all script-caused failures in state M. Many of the same kind also occur in default dark D (628 in css-cascade, 226 in a11y-contrast). Failures that exist only because of the OR (M minus D) are 541 on 19 of 31 pages (css-cascade/contrast.json) and 598 on 25 of 32 pages (a11y-contrast/scan-390.json). Pages with any M failure number 23 to 27, not up to 32.
2. Drop the deal sheet. .rh-deal__title uses the site's color:var(--rh-text,#2d2f36). The script's unconditional :root --rh-text:#CBD9D7 (L191-L200) hijacks it. So it also fails with OS light and site light while rhe-dark is off (live-feed-chrome rep-probes, us-light 1.45). The site has 22 var(--rh-text,...) uses and 2 var(--rh-border,...) uses. This needs its own finding, and D1 does not fix it.
3. The login modal 1.45:1 is not reproduced. Its content is injected at runtime. The synthetic login scan in state M shows only .rh-proof-detail 2.64 and field labels 1.73, and the labels also fail in D. The CSS does leave .modal-card-body #fff in M. Keep the item as plausible without the number.
4. Split out the track. #3d3a45 on surface-2 is 1.02:1 in every dark state, D included. It comes from the site's own dark track color plus the script's unconditional .navbar-item surface-2 rule (L213-L215). The knob stays at 7.66:1, so the switch state is still visible. Rate it low, as a separate item.
5. Docs. Status cross_cutting (L40-L47) never calls the toggle independent of the OS. Only md L133 and code L21-L22 do. Status L47 instead claims the OS dark plus forced light case was verified with the icon fully dark, and that claim needs updating. README exists only on the docs branch (L42-L43).
6. Wording. With OS dark, the mobile switch reports on before and after every tap. The desktop switch keeps the site's value. 'Looks dead' means the switch graphic never moves. The page does change, but for the worse.
7. Second trigger. If localStorage throws, the head script's catch skips setAttribute, and the bundle then writes data-theme=light on DOMContentLoaded. OS-dark users then reach state M without tapping. The 'OS only as fallback' variant does not cover this case, because the attribute is light, not absent. Prefer the plain html[data-theme=dark] key.
8. Location. Add RoutineHub_Enhancer.user.js:L19-L45 and L240-L258, RoutineHub-Reloaded.md:L133 and L139-L146, and RoutineHub-Reloaded-Status.json:L45-L47.

**fix.** Evidence:
- Status cross_cutting (L40-L47) never calls the toggle independent of the OS. It records the OR logic as done. That wording is in md L133 and code L21-L22.
- The scan counts come from a static cascade model, not a browser. In scan-390 state M, 226 of the 824 failures also fail when both signals are dark. 598 on 25 pages come from the light choice.
- The harness shows ['true','false'] in every OS-dark row only because site JS never runs. With the bundle modeled, the split occurs only while light is stored.
- F6 'no visible effect' goes too far. The light choice flips every component the dark block leaves uncovered. Only the toggle stays the same.

Location: add L19-L63, L241, L398-L413 and md L148-L170. The rail comment rationale at L398-L413 goes stale after the fix.

Primary fix:
- Delete L19-L63. That removes the comment, syncThemeClass with the L51 write, initThemeSync with the L56 listener and the L57-L60 observer, and the call at L63.
- Change L241 `html.rhe-dark {` to `html[data-theme=dark] {`.
- Delete L242-L258.
- This reverses the documented alpha22 behavior (md L139-L146, Status 'Toggle icon mismatch'), so the owner must decide.
- Option 2 sets the class from data-theme and uses the OS only when the attribute is absent. It keeps the observer but hedges against the site renaming the attribute.
- Safari users with blocked storage get the site's light page under both options. The head script throws before it sets the attribute, and the bundle then writes light.

'OS dark must win' variant:
- Write data-theme only when the value differs. Otherwise the observer loops on the first tap.
- Restore localStorage rh_theme, or light, when the OS turns light.
- Set aria-checked on all toggles after each revert.
- Hide .rh-theme-item while forcing dark, since taps do nothing in that mode.
- If any of these is missing, drop the variant.

Track:
- No dark fill reaches 3:1 on #1D424A. Even #000 gives only 1.93:1.
- Use a ring instead: html[data-theme=dark] .rh-theme-toggle { box-shadow: inset 0 0 0 1px rgba(203,217,215,.65), inset 0 2px 4px rgba(0,0,0,.28) !important; }. It gives 4.14:1 on #1D424A and 7.15:1 on #0C1311.
- The site's own track is the same #3d3a45. So this 1.4.11 issue exists in every dark state and survives the main fix. Split it into its own low finding.

</details>

<a id="h-04"></a>
### H-04. Search-time navbar tint comes from the site's .rh-browse-backdrop; the observer fix cannot work

**Where.** [RoutineHub_Enhancer.user.js:L460-L534](RoutineHub_Enhancer.user.js#L460-L534); [RoutineHub_Enhancer.user.js:L959-L960](RoutineHub_Enhancer.user.js#L959-L960)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix).  
**Effort.** S. **Confidence.** high. **Category.** correctness.

**Evidence.** Opening search (.search-button click or focusin on #id_q) runs I(), which appends div.rh-browse-backdrop to body; M() detaches it. CSS: .rh-browse-backdrop{position:fixed;inset:0;z-index:30;background:rgba(50,8,50,.35)}, .navbar{position:relative;z-index:30}, .search{z-index:40}. At equal z-index the later backdrop paints over the navbar and .navbar-menu. Over the script's #1D424A it blends to #242E42 navy, the alpha20 report; over native #320832 it is invisible. The bundle never touches .navbar styles, so keepNavbarThemedDuringSearch re-asserts an unchanged color. debugNavbarSearchIssue watches attributes, not body childList, and would print the pattern its comment (L503-L505) reads as success. backdrop-sim.js confirms the DOM effect.

**Impact.** The tracked alpha20 fix (Status L76-L78) is ineffective, and the bug persists on every page. Docs L59-L60, L92 and Status L86-L89 chase the wrong cause.

**Fix.** Add `.rh-browse-backdrop { background: rgba(12,19,17,.35) !important; }` (or rgba(29,66,74,.35)) to the chrome block, or z-index: 29 !important so it dims content but not the navbar. Delete keepNavbarThemedDuringSearch, debugNavbarSearchIssue and their calls, and close the alpha20 and alpha21 to-dos. Verify on iPhone: open the menu, tap search and sample the navbar (expect #1D424A). Check the logged-in .rh-rail search separately.

<details><summary>Verification notes</summary>

**reproduce.** 1. Recommendation: rgba(12,19,17,.35) over #1D424A gives #173236, so the navbar is still dimmed. "Expect #1D424A" only holds for rgba(29,66,74,.35) or z-index: 29. Make rgba(29,66,74,.35) the primary option. It mirrors the native design, where the scrim color equals the navbar color, and it keeps tap-on-navbar-to-close (the bundle binds `.rh-browse-backdrop` click to its close function). With z-index: 29, navbar taps land on navbar items instead, which changes behavior. Option A is invisible only over #0C1311 surfaces.
2. Add locations that state the wrong mechanism: RoutineHub-Reloaded.md:L89 (alpha20 row), RoutineHub-Reloaded.md:L174-L183 (section 5), and the code comment RoutineHub_Enhancer.user.js:L460-L477.
3. Scope of "every page": all 32 snapshots with site chrome. There are 34 snapshots, and login/register are redirect stubs without a navbar.
4. Logged-in layout: `.rh-app-topbar .navbar-menu{display:none}` hides the old menu, and the burger opens the z-index 60 rail drawer. So "open the menu, tap search" only reproduces logged out. On desktop logged in, the navbar is hidden, but the sticky z-index:auto .rh-rail sits under the scrim (#0C1311 becomes #190F1D).
5. The alpha20 link rests on the color match alone. No screenshot exists, and the September CSS is gone.

**impact.** 1) Lower severity from high to medium. 2) Recommendation: rgba(12,19,17,.35) renders the navbar #173236, not the #1D424A that the finding's own verify step expects. It stays visibly darker than the undimmed #1D424A search bar directly below. Make rgba(29,66,74,.35) the primary fix in the unconditional chrome block (L190-L238). It matches the scrim to the navbar color, the same trick the site uses with #320832. The navbar stays #1D424A, and the dark page lifts to #122325 (the native scrim gives #190F1D). z-index: 29 also works, but taps on the navbar then reach the navbar instead of the backdrop's close handler, and content keeps the purple cast. 3) Verify step: compare pixels (a screenshot of navbar vs search bar), not getComputedStyle. Computed style reads #1D424A with or without the bug, the same trap debugNavbarSearchIssue falls into. 4) Docs that state the wrong mechanism: RoutineHub-Reloaded.md:L89 (alpha20 row), RoutineHub-Reloaded.md:L174-L183 (section 5) and the code comment RoutineHub_Enhancer.user.js:L460-L477. RoutineHub-Reloaded.md:L59-L60 are verification to-dos. RoutineHub-Reloaded.md:L92 and RoutineHub-Reloaded-Status.json:L86-L89 assume search moved into .rh-rail__search. That is false logged out. 5) Logged in: .rh-app-topbar&gt;.navbar is hidden only at min-width 1024px, and .rh-app creates no stacking context. The logged-in mobile top bar likely tints the same way. This is unverified without logged-in HTML. 6) Caveat: it is inferred, not proven, that the backdrop caused the original alpha20 report. rh-browse classes existed by the 2026-09-10 audit, and #242E42 matches the reported dark navy.

**fix.** Recommendation:
1. Primary fix: put `.rh-browse-backdrop { background: rgba(29, 66, 74, .35) !important; }` in the unconditional chrome GM.addStyle (RoutineHub_Enhancer.user.js:L190-L238, next to `.search` at L223). This mirrors the site's design, where the tint color equals the navbar color. The navbar stays exactly #1D424A. The backdrop still catches taps and closes search. The rule works whatever the stacking context. Optional single-source variant: `color-mix(in srgb, var(--rh-surface-2) 35%, transparent)`.
2. Drop rgba(12,19,17,.35). Over #1D424A it gives #173236, so the navbar still darkens and no longer matches the #1D424A search bar below it.
3. Do not offer z-index:29 as an equal option, for three reasons:
- The purple wash stays on themed content: #0C1311 becomes #190F1D, and #1D424A content surfaces still go #242E42.
- The navbar becomes clickable while browse is open.
- It only works while the navbar sits in the root stacking context, which is unverified for the logged-in .rh-app-topbar.
4. Deleting keepNavbarThemedDuringSearch (L460-L496) and debugNavbarSearchIssue (L498-L534) and the calls at L959-L960 is safe. L201-L203 and L213-L215 already set the same background and color with !important. The site has no !important rule on .navbar or .navbar-menu; only descendants of .navbar.is-transparent have one.
5. Docs: also rewrite RoutineHub-Reloaded.md:L174-L183 (code docs section 5) and Status L76-L78 to describe the backdrop rule. Close Docs L59-L60 and Status L86-L89 after the device check, not before. Bump @version.
6. Verification: check that the navbar stays #1D424A. Also check that page bg under the backdrop is about #122325, not #190F1D, and that a tap on the navbar still closes search. Test desktop as well, because the backdrop is not gated by viewport.

Evidence:
- Add the click path: the direct .search-button handler toggles .hide on .search and focuses #id_q, then focusin and the delegated click handler run I().
- Add the same tint's purple wash on themed content (#0C1311 to #190F1D) as part of the bug.
- Replace "backdrop-sim.js confirms" with the reproducible check: jsdom over 32 snapshots gives navbar at body child 1, search at child 3 and the backdrop as the last child. The debug logger printed 0 lines on the backdrop append.

</details>

<a id="h-05"></a>
### H-05. Unconditional :root tokens hijack the site's --rh-text and --rh-border hooks and blank light-mode text

**Where.** [RoutineHub_Enhancer.user.js:L190-L200](RoutineHub_Enhancer.user.js#L190-L200)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix).  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** The script defines --rh-bg, --rh-surface-1/2, --rh-border, --rh-text, --rh-accent, --rh-accent-dim and --rh-input-bg on :root in the unconditional block. main.min.261102-102115.css defines no --rh-* name but reads var(--rh-text,#2d2f36) 22 times, var(--rh-border,...) twice and var(--rh-text-secondary,...) 28 times: .rh-install-pitch, .rh-deal__title, __option (#fff), __perks, __progress-text, __celebrate, .rh-deal-page__*, .rh-endless-spinner, plus inline .rh-modelfacts b on model-detail. Resolver with rhe-dark off: pitch #CBD9D7 on #f6f6fe 1.35:1 (native 12.41:1) on shortcut-19090 and 26376, which have no Required Apps; deal title, options and perks 1.45:1 (native 13.36:1); celebrate 1.35:1; model labels 1.45:1 (native 18.88:1). #rh-deal-sheet is on all 4 shortcut pages and /new/ and auto-opens from the 2nd view per session (8 s or 240 px, once per 7 days). The site also now defines .rh-stat__icon (2rem, opacity .85, semantic --warn/--ok/--money colors), a class the script invented.

**Impact.** Light-mode users get an unreadable ad-free pitch and an unreadable auto-opening membership sheet. OS dark plus site light shows the same 1.45:1 on the white sheet panel. Any future site definition of these names makes both palettes overwrite each other in both themes.

**Fix.** Rename private tokens and created classes to an own prefix such as --rhe-* or --rhr-* (8 definitions, about 48 var() uses, inline values at L487-L488). Set the site hooks --rh-text, --rh-text-secondary and --rh-border only inside the dark gate. That re-keys 52 site declarations on purpose and fixes AI-page secondary text (3.89:1). Add a check that greps each new site CSS and JS build for every name the script creates.

<details><summary>Verification notes</summary>

**reproduce.** 1. The site CSS reads var(--rh-text,...) 22 times, but only 11 of those use the fallback #2d2f36 (the light rules). The other 11 are the :where(html[data-theme=dark]) variants with fallback #c9c9c9. The two --rh-border reads use #e5e7eb and #292d36. The script does not define --rh-text-secondary, so its 28 reads are not hijacked today. They only matter for the recommendation.
2. The site JS (function c) gives the checked "trial" option .is-selected, which puts it on #f7f7fe. Its title and perks are 1.37:1 (native 12.56:1). The 1.45:1 figure applies to the title and the unselected option only.
3. The OS dark plus site light case is not caused by the unconditional tokens alone. In that state the gate is on, but .rh-pay-sheet__panel and .rh-deal__option stay #fff. Moving --rh-text into the dark gate would leave the title at 1.45:1 and the selected option and perks at 1.37:1. On top of that, the gate's `a` rule colors the celebrate link #00DBAC (1.66:1 on #ecf9f5), and `body strong` gives its strong #CBD9D7 (1.35:1). The recommendation also needs dark-gate rules that give .rh-pay-sheet__panel, .rh-deal__option and .rh-deal-page__member a dark surface (the site's own dark value is #1f191f) and keep the gate's link color off .rh-deal__celebrate. Without them the sheet stays unreadable in that state.
4. The site's .rh-stat__icon also has --danger (#ff3860) and --info (#3273dc) modifiers, plus `.rh-detail--compact .rh-stat__icon` at 1.35rem. No snapshot page renders the class server side; it most likely sits on the owner-only stats page, which returns 403 logged out. The concrete collision: the script's L150 (font-size 1rem) and L304-L306 (accent color, !important) would override the site's size and semantic colors there. The site's opacity .85 already dims the icons the script injects on profiles.
5. The var() count is exactly 48, not "about 48".
6. The 3.89:1 AI-page figure is not a regression caused by the script. The site's own dark mode gives 3.97:1 (#6b7280 on #130d14).
7. Evidence anchors:
- Pitch: shortcut-19090.html:L725, shortcut-26376.html:L726.
- Sheet: shortcut-19090.html:L732, shortcut-26376.html:L733, shortcut-4448.html:L742, shortcut-5870.html:L732, new.html:L760.
- Auto-open logic: js/script.min.261102-102115.js (sessionStorage rh_deal_views, localStorage rh_deal_last, `240<window.scrollY`, setTimeout 8000).

**impact.** 1) Not all of the "22 times" are var(--rh-text,#2d2f36). They are 11 light reads with #2d2f36 and 11 dark-gated copies with #c9c9c9. Only the 11 light reads and the inline .rh-modelfacts b lose contrast. The dark copies get #CBD9D7 instead of #c9c9c9, which is harmless (11.87:1 on #1f191f). 2) The script never defines --rh-text-secondary (28 reads), so it is unaffected today. Move it out of the hijack evidence and keep it in the recommendation only. 3) --rh-border feeds only the ring of .rh-endless-spinner, which JS inserts on infinite-scroll listings. The ring turns #17302D instead of #e5e7eb, a cosmetic change. Base the title on --rh-text. "Blank light-mode text" overstates it. The pitch keeps its bold "Go ad-free" (site strong{color:#353535}) and the indigo "Join". The sheet keeps its kicker, lede, option subs (#6b7280 fallback), badge, Continue and close. 4) Native pitch contrast is 12.43:1, not 12.41:1. The selected option (.is-selected) is 1.36:1. 5) .rh-stat__icon also has --danger and --info modifiers. Profile tiles carry no modifier, so none of these colors apply. The only certain effect is opacity .85 on the script's icons, while alpha12 wants full-strength accent. font-size and margin tie with L150 at equal specificity, so stylesheet order decides. "Now defines" cannot be checked because the 260911 CSS is gone. Only 1 of the script's 13 created rh- class names collides (the other 12 have 0 hits in site CSS and JS). Treat this as a separate low finding. 6) .rh-deal-page__* belongs to /membership/sweat-equity/, which is not in the snapshots, so it is unverified. 7) Recommendation gap: hooks inside html.rhe-dark fix OS light plus site light. They do not fix OS dark plus site light, the case the impact cites. There the panel and options stay #fff, so the text stays at 1.45:1, and the generic a{color:var(--rh-accent)!important} adds .rh-deal__celebrate at 1.66:1 and .rh-pay-sheet__fallback at 1.79:1. Also re-key the site's :where(html[data-theme=dark]) rules for .rh-pay-sheet__panel and .rh-deal__option (background #1f191f) and .rh-pay-sheet__close (#b9b9b9) onto html.rhe-dark, the same pattern as the alpha22 toggle fix. 8) Ship the rename and the dark-gate hooks in one change. A rename alone removes the hook in dark mode too, and .rh-modelfacts b then falls back to #111 on #0C1311 (1.00:1). 9) Location: add the model-detail inline style for .rh-modelfacts b, L150, L304-L306 and L721 for the .rh-stat__icon part, and RoutineHub-Reloaded.md L118-L125 for the rationale to update.

**fix.** Evidence:
1. --rh-text has 22 reads in the site CSS: 11 light-branch (#2d2f36) and 11 dark-branch (#c9c9c9). The finding says 22 times #2d2f36.
2. --rh-text-secondary is not hijacked today because the script never defines it. That covers 28 CSS reads and 45 inline uses on 8 AI pages. Only --rh-text (22, plus 1 inline on model-detail) and --rh-border (2) collide.
3. Some pitch text stays readable. The &lt;strong&gt;Go ad-free&lt;/strong&gt; keeps site strong #353535 and "Join" keeps #6366f1. Only the sentence drops to 1.35:1.
4. Parts of the sheet stay readable: kicker, lede, option-sub, badge, close and Continue. Title, option titles, perks, celebrate and progress text drop to 1.35 to 1.45:1.
5. OS dark + site light is not uniformly 1.45:1:
- L315-L317 (`a` accent !important) makes .rh-deal__celebrate 1.66:1 and .rh-pay-sheet__fallback 1.79:1.
- L274 `body strong` recolors @kingaz123 to #CBD9D7.
6. Drop "now" for .rh-stat__icon. The 260911 CSS is gone, so it cannot be dated.
- No snapshot page uses .rh-stat__icon natively.
- Today's visible effect on the profile icons is opacity .85, which undoes alpha12's full-strength icon. The site's 2rem rule ties on specificity with the script's 1rem.
- L304-L306 would flatten the semantic --warn/--danger/--ok/--info/--money colors only on auth-gated pages. Unverified.

Recommendation:
1. The rename and the gated hooks must ship together. Moving --rh-text and --rh-border into the gate without renaming leaves var() unresolved in light mode for the chrome at L201-L238 and the inline values at L487-L488.
2. Use --rhe-*, which matches the existing rhe-dark class and [RHE debug] prefix.
3. Put the declarations first in the html.rhe-dark block, before the nested rules: `--rh-text: var(--rhe-text); --rh-text-secondary: rgba(203, 217, 215, 0.65); --rh-border: var(--rhe-border);`. The muted value gives 5.98:1 on --rh-bg.
4. Add surface overrides for OS dark + site light. There the gate is on, but the light-branch rules keep #fff surfaces, so text stays #CBD9D7 on white. Rename-only would actually leave title and options more readable in that state. Re-key like the toggle and rail, inside html.rhe-dark:
- `.rh-pay-sheet__panel, .rh-deal__option:not(.is-selected), .rh-deal-page__member { background: var(--rhe-surface-1) !important; }`
- `.rh-pay-sheet__close { color: var(--rhe-text) !important; }`
   The other option is to honor data-theme=light, which reverses the documented alpha22 OR rule and needs the owner's decision.
5. Rename only the classes the script invents: rh-changelog-shortcut, rh-meta-extra, rh-creator-line, rh-free-stats*, rh-stat__icon, rh-stats-secondary, rh-stats-toggle, rh-pubgraph__mini*, rh-pubgraph-toggle, rh-top-comment, rh-toggle-replies*, rh-collapse-all.
- Keep the site classes it reuses on purpose: rh-card, rh-card__title, rh-info-list*, rh-cta, rh-cta--secondary, button is-dark.
- For rh-stat__icon, update L115-L117, L150 and L304-L306. Keep the L716 guard also matching .rh-stat__icon, so a future native icon is not duplicated.
6. The build check must also grep page HTML, both inline &lt;style&gt; and style="". model-detail and the 46 AI-page uses are not in the bundle. The check must cover custom property names, which the 2026-09-11 audit's class diff did not.
7. Update the palette block in RoutineHub-Reloaded.md, section 2, L105-L125.

</details>

<a id="h-06"></a>
### H-06. Dark link rule turns white labels on filled buttons teal; alpha22 nesting flipped the cascade

**Where.** [RoutineHub_Enhancer.user.js:L315-L317](RoutineHub_Enhancer.user.js#L315-L317)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix).  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** Nested `a { color: var(--rh-accent) !important }` resolves to html.rhe-dark a (0,1,2) and beats .rh-cta{color:#fff !important} (0,1,0) and inline color:#fff. As a bare media-query `a` (0,0,1) before alpha22 it lost; flips.js shows the nesting caused 205 flips. Dark contrast: Get Shortcut and the changelog Download buttons (193 a.rh-cta.matomo_download, 134 on changelog-4448, 56 on 19090) #00DBAC on #3273dc 2.54:1 (native 4.54:1); 'Sign in to buy $1.99' 2.54:1; .rh-meter__cta 1.90:1; .rh-wall-btn--member and .rh-btn-primary 2.24:1; .rh-skill-cta 1.74 to 2.11:1; .rh-sell-btn--primary 1.95:1; .rh-platform-chip.is-active 2.49:1; homepage .rh-ai-tile labels 1.20 to 3.18:1 (native 2.15 to 5.70:1); membership .button.is-primary 3.94:1; .pagination-link.is-current teal on maroon. About 219 failing items on 15 pages. Also lost: brand colors (Sign in with Apple, Claude/ChatGPT/Gemini chips), the Announcement badge color, muted --locked links, gray unhearted .rh-heart a; .rh-cta--disabled would look enabled. Docs L37, L39, L77, L84, L172 and L336 still call .rh-cta native; L31 calls the AI tiles clean.

**Impact.** The primary download CTA on every shortcut and changelog page and the CTAs on skill, agent, plugin and sell pages fail WCAG AA in the default dark state (15.2px at weight 800 is not large text). The +(0,1,1) nesting shift may have flipped other site !important rules too.

**Fix.** Drop the rule to zero specificity, e.g. :where(html.rhe-dark) :where(a) or a:not([class]), so site !important colors win. Alternatively restore white with html.rhe-dark .rh-cta:not(.rh-cta--secondary), .rh-meter__cta, .rh-wall-btn--member, .rh-sell-btn--primary, a.rh-ai-tile, a.rh-platform-chip.is-active, a.pagination-link.is-current { color: #fff !important } (0,2,1). Give .rh-cta--secondary color var(--rh-text) !important, set .rh-heart a to inherit and put --locked links in the muted tier. Re-run a cascade contrast probe and fix the doc lines.

<details><summary>Verification notes</summary>

**reproduce.** 1) Count. The real figure is 213 failing text items (212 anchors) on 14 distinct pages, not about 219 on 15. The 219/15 figure includes the notifications snapshot, which is homepage HTML (F8), so the 6 AI tiles are counted twice. Including it reproduces exactly 219/15. Of the 213, 197 pass natively and 16 already fail natively.

2) Cause. Only the .rh-cta family flipped because of alpha22. That is 195 of the 213 failing items: 193 Download/Get Shortcut plus 2 text nodes of 'Sign in to buy'. There are 205 nesting flips in total (194 .rh-cta and 11 .rh-cta--secondary). The 11 secondary buttons pass at 6.08:1. A check of all dark-block properties found no other site-rule flips in the logged-out snapshots, so the impact's guess about other !important rules found nothing. Hover and logged-in states were not tested. The remaining items have non-!important site or inline colors. The bare pre-alpha22 `a{...!important}` also beat them, so they predate the nesting. These are .rh-wall-btn--member, .rh-btn-primary (inline color:#fff), .rh-skill-cta, .rh-sell-btn--primary, chips, a.rh-ai-tile, membership .button.is-primary, pagination, Apple, the Announcement badge, --locked and .rh-heart a. 'Beats inline color:#fff' is true but is not a nesting effect.

3) Several already fail natively: white on #007aff at 4.02, sell 3.49, skill-cta 3.12 to 4.64, chip 4.47, and 5 of the 6 tiles. The new failures outside .rh-cta are the membership featured button (7.05 to 3.94) and the plugin tile (4.60 to 2.57).

4) .rh-meter__cta is hidden in all 31 snapshots (inside div#rh-meter-pop[hidden]). Its teal also comes from the unconditional `.navbar a` rule at L216-L218, (0,1,1)!important. That rule wins even with the dark rule at (0,0,1), and also in light mode. Native white is 3.39:1.

5) .rh-skill-cta runs from 1.74 to 2.59 across the gradient; 2.11 is the midpoint. Membership 3.94 is the top of the featured card's gradient (3.94 to 4.91). The other card passes at 6.39 to 8.58. .pagination-link.is-current is 6.91:1, which passes; it is a look change only.

6) Recommendation. `:where(html.rhe-dark) :where(a)` must be a top-level rule. Nested as written, it becomes `html.rhe-dark :where(html.rhe-dark) :where(a)`, which matches no element, so every link would lose the accent. Zero specificity only fixes the .rh-cta family. The 18 non-!important items need the explicit list. In that list, `.rh-cta:not(.rh-cta--secondary)` would also force #fff onto .rh-cta--warning (bg #ffdd57) and .rh-cta--disabled, so exclude both. .rh-meter__cta needs a rule that beats L216-L218. Add L216-L218 to the location.

7) The script comment at L405-L410 also calls .rh-cta native.

8) Unverified: if the iOS manager injects GM.addStyle as user-origin CSS, the specificity fix fails there; only the explicit list works in both cases.

**impact.** 1. Location: add RoutineHub_Enhancer.user.js:L216-L218. That unconditional `.navbar a` rule alone makes .rh-meter__cta teal on #f65052 (1.90:1) in both themes. Fixing L315 will not change that button.

2. Evidence: limit "alpha22 flipped the cascade" to the .rh-cta family, where the site sets color with !important at (0,1,0).
- 193 a.rh-cta.matomo_download plus "Sign in to buy" make 195 failing items on 6 pages.
- 11 .rh-cta--secondary links (3 of them script clones) are teal at 6.08:1 and pass.

3. The other listed items predate alpha22. Their site colors are not !important, so a bare `a` rule beat them too. That covers .rh-wall-btn--member, .rh-btn-primary (inline color:#fff), .rh-sell-btn--primary, .rh-platform-chip.is-active, .rh-skill-cta, a.rh-ai-tile, membership .button.is-primary, the Announcement badge, .rh-section-link--locked and .rh-heart a.

4. Several of these already fail natively: member and rh-btn 4.02, sell 3.49, skill CTA 3.12, active chip 4.47.

5. Remove .pagination-link.is-current from the failing list. It is 6.91:1, and alpha19 accepted it (docs L34, L88).

6. Change the .rh-skill-cta range to 1.74 to 2.59:1.

7. Change the count to about 210 failing items on 14 pages. 190 of them are repeated changelog Download buttons.

8. The non-active brand chips lose their color only. Their background is an 8% tint, so contrast is fine.

9. Drop the guess about other flipped !important rules. A scan of every other nested rule found no further visible color or background flips.

10. Recommendation, zero-specificity option: inside the nested block it gets an implicit `& ` prefix. `:where(html.rhe-dark) :where(a)` then becomes `html.rhe-dark :where(html.rhe-dark) a`, which matches nothing and drops all link theming. Use it at top level or as `:where(& a)`. Even then it fixes only the .rh-cta family.

11. Recommendation, white-restore rule (preferred):
- Inside the block, drop the literal html.rhe-dark prefix, or `& html.rhe-dark ...` never matches. At top level, prefix every selector.
- Add a.rh-btn-primary, .rh-skill-cta and .membership .tier-cta .button.is-primary.
- Fix .rh-meter__cta at L216, e.g. `.navbar a:not(.rh-meter__cta)`.
- This option also holds if the iOS manager injects user-origin CSS. That is unverified, and in that case specificity tricks cannot beat site !important.

12. Docs: L92, the script comment at L409 and Theme-Audit L105-107 also call .rh-cta native. L37, L92, L172 and script L409 call the Announcement badges native, but they render teal.

**fix.** EVIDENCE
- Limit 'alpha22 nesting flipped' to the .rh-cta family: 205 anchors on 7 pages, plus the latent --disabled/--warning variants. That is 194 `.rh-cta` (#fff !important) and 11 `.rh-cta--secondary` (#dcdcdc dark or #1a1a1a light, !important).
- Of the ~219 failing items, only the 194 .rh-cta on 6 pages come from nesting.
- Remove 'and inline color:#fff' as a nesting effect. That inline color is not !important and also lost before alpha22.
- Relabel these as pre-existing because the site colors are not !important: .rh-wall-btn--member/--apple/--google, .rh-btn-primary, .rh-skill-cta, .rh-sell-btn--primary, .rh-platform-chip, a.rh-ai-tile, .pagination-link.is-current, .tier-cta .button.is-primary, .rh-heart a, the --locked links and the Announcement badge.
- .rh-meter__cta is also painted by L216 `.navbar a`. .pagination-link.is-current is 6.91:1 and passes.
- Add L216 and L318 to location.

RECOMMENDATION
1. Preferred fix. It works whatever the injection origin. Change L315 to `a:not(:where(.rh-cta, .rh-meter__cta, .rh-wall-btn, .rh-btn-primary, .rh-skill-cta, .rh-sell-btn, .rh-ai-tile, .rh-platform-chip.is-active, .pagination-link.is-current, .tier-cta .button, .rh-feed-post__badge)) { color: var(--rh-accent) !important; }`. `:not(:where())` adds 0, so the rule stays (0,1,2). Modeled result: exactly 263 anchors on 31 pages change, all to native colors on their own fills (plus the 15 badges).
2. Change L216 to `.navbar a:not(:where(.rh-meter__cta))`, which stays (0,1,1). Otherwise 'Refill now' stays at 1.90:1 in both modes.
3. Mandatory with 1 or with 4. Inside the block add `.rh-cta--secondary { color: var(--rh-text) !important; }`. Without it, data-theme=light under OS dark shows #1a1a1a on the L318 surface-2 at 1.60:1. That hits 11 buttons, including the script's own Changelog button. With the rule it is 7.48:1.
4. Minimal regression-only fix. Delete L315-L317 and add `:where(html.rhe-dark) a { color: var(--rh-accent) !important; }` at top level after the block closes at L458. That is (0,0,1), identical to pre-alpha22. Writing `:where(&) a` in place also works. Never put `:where(a)` or `:where(html.rhe-dark) :where(a)` inside the block. This only fixes the 205 anchors, and only if GM.addStyle injects an author-origin style element. Some managers inject through tabs.insertCSS with cssOrigin user (possibly the iOS Userscripts app; unverified). There every script !important beats every site !important, so specificity changes do nothing. Fix 1 still works there.
5. Drop `a:not([class])`.
6. If you keep an explicit white list instead of 1, put it inside the block. At top level only the first selector is gated, and the (0,1,0)/(0,1,1) entries lose to (0,1,2). Leave the .rh-cta family out.
7. `.rh-heart a` inherit and the --locked muted tier are fine as polish if nested with !important.

DOCS
- After 1-3, L37, L39, L77, L84, L172 and L336 are true again. So are L92, script L406-L411 and Theme-Audit L105-L107. Add a version entry and a note at L153-L160 that nesting adds (0,1,1).
- Three claims were already false before alpha22: L31 (AI tiles clean), L34/L88 (current page 'left alone') and the Announcement-badge 'native' lines (L37, L92, L172). They become true only with fix 1.

</details>

<a id="h-07"></a>
### H-07. Search input text renders at 1.15:1 and its placeholder at 1.02:1 in dark mode

**Where.** [RoutineHub_Enhancer.user.js:L324-L336](RoutineHub_Enhancer.user.js#L324-L336); all pages: .search input.input#id_q  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix).  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** L324-L326 force .input and .select select to #C7D6D4 !important with no text color. The site's html[data-theme=dark] input:not(...){background-color:#1f191f;color:#c5c5c5} (0,6,2) still supplies the text color. #id_q sits on all 32 pages and is the only '[dark] .input' match. Typed text #c5c5c5 on #C7D6D4 is 1.15:1 (native 10.0:1). The L333-L336 placeholder rgba(203,217,215,.65) composites to #CAD8D6, 1.02:1 in every rhe-dark state. With data-theme=light typed text reaches 8.18:1 but the placeholder stays 1.02:1. The script pairs a light .input background with the light placeholder written for the dark .textarea (L318, L274). Comment L307-L311 predates native dark mode. Related site bug: the inline-styled search input on /skills/ and /agents/ shows #c5c5c5 on #fff at 1.73:1.

**Impact.** In the default iPhone setup (OS dark, no stored choice) the main navigation search shows no readable hint and barely readable text. Selects on settings pages likely share the problem.

**Fix.** Theme .input and .select select like .textarea (surface background, --rh-text, light placeholder) and exclude .transparent-control .input. Or keep the light field and set color var(--rh-bg) !important (12.53:1) plus a dark placeholder such as #4A5553 (5.15:1). Split .input::placeholder from .textarea::placeholder. Always set foreground and background together. Optionally cover the AI listing input and recheck the login modal.

<details><summary>Verification notes</summary>

**reproduce.** 1. Location: tighten to RoutineHub_Enhancer.user.js:L324-L326 and L333-L336, plus L199 where `--rh-input-bg: #C7D6D4` is defined. L327-L332 are unrelated rules (unread notification, borders).

2. "#id_q sits on all 32 pages": exactly 32 of the 34 snapshot files. The login and register files are JS redirect stubs with no markup. Two of the 32 are not distinct page types: notifications is homepage HTML and stats-4448 is the 403 page.

3. "Selects on settings pages likely share the problem" is unverified. The snapshots contain no `.select select` and no `<select>` at all. From the site CSS, the same light background with #c5c5c5 text would also hit any authenticated `.input`, for example `.rh-settings .input`, `.rh-settings select.input` and `.rh-keep__field .input`.

4. Additions to the impact:
- The caret inherits #c5c5c5, so it is equally invisible.
- The site's own dark placeholder is only 2.08:1 (rgba(197,197,197,.3) on #1f191f), so do not use it as the target. The script still makes things worse (1.02:1).

5. Recommendation: L312-L314 (`.field-new-control .field-label` uses `--rh-bg` dark text) rests on the same light-.input premise and must be revisited with any .input change. With `.field-new-control` on surface-2 (L318), a dark label measures 1.73:1. The login modal markup is not in the snapshots, so the label's real backdrop is unverified.

**impact.** Location: use RoutineHub_Enhancer.user.js:L324-L326 and L333-L336. L327-L332 are unrelated rules. "All pages" means 32 of 34 snapshots: login and register are redirect stubs with no .search.

Selects: none of the logged-out snapshots has a `.select select` (0 on all 34). The select or settings claim is unverified. It is plausible from the CSS: `html[data-theme=dark] select` (0,1,2) gives #c5c5c5, and `.rh-settings select.input` carries .input.

Recommendation, option 1 as written fails. The `.search` overlay is itself --rh-surface-2 (L223-L225), so a surface-2 field reads 1.00:1 against it. The site's dark border #3e363e reads 1.07:1, and the light placeholder on surface-2 is only 4.16:1. Option 1 would need a different fill or a visible border.

Make option 2 the primary fix. It matches the documented intentional light field (L307-L311; MD L37/L86/L332). The light field currently stands out at 7.25:1 against the overlay.

Both options must exclude `.field-new-control .transparent-control .input`. Reason: in data-theme=dark the site's `html[data-theme=dark] .field-new-control .transparent-control .input{background-color:transparent!important}` (0,4,1) beats the script's (0,2,1) !important. That field therefore shows the surface-2 `.field-new-control` behind it (L318). `color: var(--rh-bg)` there would drop the login text from 6.30:1 to 1.73:1.

Concrete fix inside html.rhe-dark:
- `.input:not(.transparent-control .input), .select select { color: var(--rh-bg) !important; }`
- `.input::placeholder { color: #4A5553 !important; }`
- Remove `.input::placeholder` from the L333 light group.

Related, separate issue for the "recheck the login modal" note: by the same mechanism, L312-L314 `.field-new-control .field-label { color: var(--rh-bg) }` sits on surface-2 at 1.73:1 in data-theme=dark. The modal markup is not in any snapshot, so this is unverified against markup.

**fix.** The recommendation needs fixes.

1) Option 2 also needs the transparent-control exclusion. In data-theme=dark the site rule html[data-theme=dark] .field-new-control .transparent-control .input {background-color: transparent !important} (0,4,1) beats the script's (0,2,1) !important. So the login input stays transparent over the script's #1D424A .field-new-control (L318). A global .input color var(--rh-bg) would drop login typed text from 6.30:1 to 1.73:1. This uses synthetic markup built from the site CSS. The real modal loads from /login/?modal=true and was not captured.

2) Prefer option 2. It keeps the documented light-field decision (user.js L307-L311, RoutineHub-Reloaded.md L37, L86, L332). The field also stays visible in the .search panel: #C7D6D4 against #1D424A is 7.25:1. Option 1 as written copies the .textarea fill --rh-surface-2. That is the same fill as .search (L223-L225), so the field edge would rest on the site's #3e363e border at 1.07:1. The shared light placeholder would be 4.15:1. If option 1 is chosen anyway, use var(--rh-bg) as the fill (text 12.93:1, placeholder at .65 alpha 6.00:1). Add a border of at least 3:1 against #1D424A, for example var(--rh-accent) at 6.08:1. Update the comment and the docs too.

3) Minimal patch inside html.rhe-dark. Keep L324-L326 as they are and add:
.input:not(.transparent-control .input), .select select { color: var(--rh-bg) !important; }
.input:not(.transparent-control .input)::placeholder { color: #4A5553 !important; opacity: 1 !important; }
Then remove .input::placeholder from L333.

Simulated results: #id_q gets 12.53:1 text and 5.15:1 placeholder in states A, B and C. Login typed text is unchanged (6.30:1 in A, 13.40:1 in B). .select select reaches 12.53:1. Do not add the same :not to the L324 background rule. In state B the login input would then turn transparent over #1D424A with the site's #110311 text (1.85:1).

4) Concrete login recheck: in state A the floating label (L312-L314, var(--rh-bg)) sits over that transparent input on #1D424A at 1.73:1. This is a separate bug, inferred from CSS only.

</details>

<a id="h-08"></a>
### H-08. Login modal floating labels render #0C1311 on dark teal at 1.73:1

**Where.** [RoutineHub_Enhancer.user.js:L307-L318](RoutineHub_Enhancer.user.js#L307-L318)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix).  
**Effort.** S. **Confidence.** medium. **Category.** css.

**Evidence.** The site's html[data-theme=dark] .field-new-control .transparent-control .input{background-color:transparent !important} (0,4,1) beats the script's .input (0,2,1), so the input is transparent. L318 paints .field-new-control surface-2 #1D424A over the site's rgba(255,255,255,.06). L312-L314 .field-new-control .field-label{color:var(--rh-bg) !important} (0,3,1) beats the site's dark label rgba(255,255,255,.62). Probe on a fragment built from site selectors: 1.73:1 with data-theme dark and light (native 6.03 to 6.56:1). In the mixed state the white .modal-card-body also gets #CBD9D7 text at 1.45:1. /login/ and /register/ now redirect to /#/login and /#/register, and AuthModal loads /login/?modal=true into #modal-template-page #modal-content. The real fragment was not captured. Docs L37, L86 and L332 still call the dark label verified and gluebyte's v1.2 light label a regression.

**Impact.** Email and Password labels on the only sign-in form are near invisible for dark users. Users lose the field names once they type.

**Fix.** Delete L312-L314, or limit them to html.rhe-dark:not([data-theme=dark]), where the input really gets the light background. Otherwise use a muted light label such as rgba(203,217,215,.65). Add .modal-card-body to the --rh-bg list at L270. Verify against captures of /login/?modal=true and /register/?modal=true.

<details><summary>Verification notes</summary>

**reproduce.** 1. Native contrast is 6.56:1 in dark and 6.28:1 in light. 6.03:1 is the overridden :where(html[data-theme=dark]) label rgba(234,234,234,.65), not a state that actually renders.
2. The label rule wins by !important. The specificity is a tie, (0,3,1) against (0,3,1).
3. Location should add L324-L326. That .input light-background rule now loses in data-theme=dark. Docs references should add L77, L339 and the code comment at L307-L311.
4. Impact correction for data-theme=dark: the input is transparent, so the label is 1.73:1 at rest and when floated. "Lose the field names once they type" fits only the mixed state. There, going by the site CSS geometry (unverified without layout), the resting label partly overlaps the light strip. The floated label sits on #1D424A at 1.73:1. The label texts "Email" and "Password" are not verified.
5. Recommendation corrections:
- Deleting L312-L314 alone gives 5.28:1 in data-theme=dark. In the mixed state the site's light label rgba(17,3,17,.65) lands on #1D424A at 1.61:1.
- Scoping the rule to html.rhe-dark:not([data-theme=dark]) leaves the floated label at 1.73:1, because the light input background is only an 18px strip.
- rgba(203,217,215,.65) gives 4.16:1 on #1D424A, below AA 4.5:1 for 12-14px text. It gives 1.02:1 over the light strip.
   Proposed fix, inside html.rhe-dark:
- Set .field-new-control .field-label {color: rgba(203,217,215,.85) !important} (5.90:1), or use var(--rh-text) (7.48:1).
- Add .field-new-control .transparent-control .input {background-color: transparent !important; color: var(--rh-text) !important}. Its (0,4,1) ties the site's !important rule and wins on later order. Without the color, mixed-state typed text #110311 would turn dark on dark.
- Adding .modal-card-body to L270 is correct. It fixes the 1.45:1 text and the accent links at 1.79:1 on white.

**impact.** 1) Impact. With data-theme dark the labels are 1.73:1 both at rest and when floated, because the input is transparent. "Users lose the field names once they type" fits only the mixed state (OS dark, data-theme light). It is not "the only sign-in form", since the modal also offers social sign-in. The Register form is affected too, although docs L38 calls it clean.

2) Evidence. The native light contrast comes out at 6.28:1 (rgba(17,3,17,.65) on #FBF3F3), not 6.03. Extend the location to L307-L326. The broken premise is L324-L326 (.input light background).

3) Recommendation.
- Drop the html.rhe-dark:not([data-theme=dark]) option. In that state the floated label (top:0) sits above the input (bottom:-36px, 18px tall) on the #1D424A field, which is still 1.73:1.
- rgba(203,217,215,.65) gives only 4.16:1 on #1D424A. That is below 4.5:1 for 12px and 14px text.
- Use rgba(203,217,215,.85) (5.90:1, same as .rh-stat__label) or var(--rh-text) (7.48:1) in every rhe-dark state.
- Add `.field-new-control .transparent-control .input { background-color: transparent !important; color: var(--rh-text) !important; }` inside html.rhe-dark. It is (0,4,1) and wins by later order, so the mixed state matches.
- Adding .modal-card-body to the L270 list is correct.
- I probed all three changes on a scratch copy at &lt;scratch&gt;\agents\H-08-verifier\fixed.user.js. In every rhe-dark state the label is 5.90:1, typed text 7.48:1 and modal text 12.93:1.
- Update the comment at L307-L311 and docs L37, L38, L86 and L332. gluebyte's v1.2 light label matches the current site CSS.
- Verify against captures of /login/?modal=true and /register/?modal=true, including the eye icon fill in the mixed state.

**fix.** Evidence:
- Native light label is 6.28:1 (rgba(17,3,17,.65) on #FBF3F3). Native dark is 6.56:1. The 6.03 figure did not reproduce.
- In the mixed state, the 1.73:1 applies to the floated label (top:0 places it above the input strip). At rest the label straddles the light #C7D6D4 input strip.
- The mixed state also renders modal links #00DBAC on white at 1.79:1.
- Add L324-L326 (the .input light background that wins in the mixed state) and the comment at L307-L311 to the location.
- Add docs L339 to the stale-doc list.

Recommendation, replacing the delete, gate and .65 options:
1. Replace L312-L314 inside html.rhe-dark with:
   .field-new-control .field-label { color: rgba(203, 217, 215, 0.85) !important; }
   .field-new-control .transparent-control .input { background-color: transparent !important; color: var(--rh-text) !important; }
   Result: label 5.90:1 and input text 7.48:1 in both data-theme=dark and the mixed state.
   This matches the site's own design, which keeps that input transparent in both themes.
   It uses the 0.85 tier that L296-L303 already picked for --rh-surface-2. Alpha 0.65 gives 4.16:1 and 0.70 is the minimum for 4.5:1.
2. If .modal-card-body goes into the L270 list, do the same in the same change for the CSS's auth-modal text classes:
- Add .center-title and .code-rules to the L274 text list.
- Add .acount-message, .log-block-group, .pass-rules-message and .forgot-text to the muted list at L293.
   Otherwise the mixed state renders them dark on #0C1311 at 1.05 to 1.07:1. These classes come from CSS only, so confirm them in the fragment.
3. Rewrite the L307-L311 comment and docs L37, L86, L332 and L339. They should say that the label now sits on the field background and that gluebyte's v1.2 light label matches the current site.
4. Verify against captures of /login/?modal=true and /register/?modal=true, both with data-theme=dark and with OS dark plus site light.

</details>

## Medium findings

<a id="m-01"></a>
### M-01. Homepage reorder indexes .rh-container children and puts 5 sections above the tagline and h1

**Where.** [RoutineHub_Enhancer.user.js:L167-L183](RoutineHub_Enhancer.user.js#L167-L183)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix). Severity changed from high to medium.  
**Effort.** S. **Confidence.** high. **Category.** live-drift.

**Evidence.** All 35 .rh-section now sit in .rh-main-content inside .rh-main-layout. .rh-container children are tagline, two ad slots, hero row, proof bar and main layout. L182 inserts before container.children[[0,0,1,2,2,3,3][i]], a 7-slot map with only 5 matches today. Result: New Shortcuts, Recently Updated, Heatseekers, Top Shortcuts and Best Sellers sit above the tagline, ads, hero, proof bar and Build with AI band. Best Sellers drops from 2nd to 5th; Heatseekers jumps from 30th to 3rd. Five h2 now precede the only h1. The logged-out /notifications/ redirect (pathname '/') gets the same result. Exact className 'rh-scroll' or 'rh-topgrid' tests drop a section silently once it gains a modifier. Comment L174-L175 calls it a verbatim gluebyte v1.2 fix. jsdom with the sections' own parent restores the intended order.

**Impact.** On iPhone the homepage opens with five carousels above the hero, ads and proof bar. Heading navigation starts mid-outline.

**Fix.** Confirm the reorder is still wanted. If yes, use the sections' parent with an explicit title list: map titles to sections, then parent.prepend(...titles.map(t =&gt; map.get(t)).filter(Boolean)), after .rh-ai-band or at the top of .rh-main-content, never above .rh-tagline. Use classList.contains and .rh-section-title text. Document it. If not, delete L167-L183.

<details><summary>Verification notes</summary>

**reproduce.** 1) Comment reference: the gluebyte v1.2 attribution is on L168 and "Ported verbatim" on L174, so cite L168-L175, not L174-L175. 2) "Best Sellers drops from 2nd to 5th, Heatseekers jumps from 30th to 3rd" are ranks among the 35 .rh-section. In page position Best Sellers moves up: it used to sit below the tagline, 2 ads, hero row, proof bar, AI band and New in AI. 3) Replace "jsdom with the sections' own parent restores the intended order" with this: using sections[0].parentElement keeps the tagline, ads, hero and proof bar on top and puts the same five sections (NS, RU, HS, TS, BS) at the top of .rh-main-content, above .rh-ai-band. Whether that is the intended order can't be checked. 4) Add this: the slot map can only place matches at the very top of its target, so the above-tagline placement may be upstream's own behavior. Present the placement as a decision for the owner and the reshuffling as the defect. Evidence: a class modifier on New Shortcuts' row drops it and leaves RU, TS, HS, BS. The title test uses raw textContent without trim and parses as (!AI && scroll) || topgrid, so a trailing newline in "Popular in AI" pulls it in and yields Popular in AI, NS, TS, HS, RU, BS. 5) The /notifications/ redirect lands on the homepage itself, so it is not a separate case. 6) Recommendation: parent.prepend(...) puts the sections above .rh-ai-band. Placing them after the band needs document.querySelector('.rh-ai-band').after(...). Trim the .rh-section-title text, because category titles carry newlines. 7) The impact was verified logged out only.

**impact.** Severity: high becomes medium.

Evidence fixes:
- Replace "Best Sellers drops from 2nd to 5th; Heatseekers jumps from 30th to 3rd" with: the slot map orders the 5 matches New Shortcuts, Recently Updated, Heatseekers, Top Shortcuts, Best Sellers. Using the sections' own parent keeps that order. Targeting .rh-container only causes the placement above tagline, ads, hero row, proof bar and AI band.
- Mark the drift as unverified. No older DOM shows the sections below .rh-tagline, and upstream inserts at slot 0 of .rh-container.
- Replace "jsdom with the sections' own parent restores the intended order" with: with a.parentElement, the tagline/h1, ads, hero row and proof bar stay on top, and the 5 sections lead .rh-main-content above .rh-ai-band.

Evidence to add:
- A .rh-section with fewer than 2 children throws at L180-L181. That happens before the palette GM.addStyle at L190, so all homepage theming is lost. Reproduced: GM.addStyle calls drop from 4 to 1.
- Matches beyond 7 are appended after .rh-main-layout.
- One match dropping out reshuffles the others.

Recommendation fixes:
- parent.prepend(...) lands above .rh-ai-band. To place the sections after the band, use band.after(...).
- Guard the block with try/catch, or run it after the L190 palette call, so a DOM change cannot drop theming.
- Record the chosen placement in RoutineHub-Reloaded.md (Homepage row and code docs). Today it lives only in the L168-L175 comment.

**fix.** Evidence: replace "jsdom with the sections' own parent restores the intended order" with: "With container = sections[0].parentElement and the same map, the five keep the same order but sit at the top of .rh-main-content, above .rh-ai-band. The tagline, hero and proof bar stay first and 0 h2 come before the h1. No intended order is documented. Without Best Sellers the same map gives RU, TS, HS, NS, so the result depends on how many sections match."

Recommendation:
(1) prepend only puts the five at the top of .rh-main-content, which is above the Build with AI band. To place them after the band, use band.after(...). Suggested code:
if (location.pathname === '/') { const order = [/* owner list; today's effective order: 'New Shortcuts','Recently Updated','Heatseekers','Top Shortcuts','Best Sellers' */]; const byTitle = new Map(); document.querySelectorAll('.rh-main-content &gt; .rh-section').forEach(s =&gt; { const t = s.querySelector('.rh-section-title')?.textContent.trim(); if (t && !byTitle.has(t)) byTitle.set(t, s); }); const picked = order.map(t =&gt; byTitle.get(t)).filter(Boolean); const parent = picked[0]?.parentElement; const band = parent?.querySelector(':scope &gt; .rh-ai-band'); if (picked.length) band ? band.after(...picked) : parent.prepend(...picked); }
This passes in jsdom on home.html. It also passes with a malformed .rh-section added, and all 4 GM.addStyle calls still run.
(2) Require throw safety. Drop the positional child access (firstElementChild.firstElementChild, children[1]) and use optional chaining. Or move the block after the GM.addStyle calls, or wrap it in try/catch. Today a single malformed .rh-section makes L179 throw and removes the palette, chrome and dark-mode CSS from the homepage.
(3) With a title list, drop the className tests entirely. Only use classList.contains if a structural filter is kept.
(4) This reverses the decision at L174-L175 ("Ported verbatim ... no reason to diverge from upstream"). The owner needs to approve the divergence, and the comment has to be rewritten. Document the reorder, and the .rh-topcard-action/.rh-listrow-action removal at L166, in RoutineHub-Reloaded.md code docs section 1. None of the three doc files mention either one today.

</details>

<a id="m-02"></a>
### M-02. Agents and Favorites stat tiles show bare numbers; secondary grid and docs assume fixed counts

**Where.** [RoutineHub_Enhancer.user.js:L87-L138](RoutineHub_Enhancer.user.js#L87-L138); [RoutineHub_Enhancer.user.js:L705-L766](RoutineHub_Enhancer.user.js#L705-L766)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix). Severity changed from high to medium.  
**Effort.** S. **Confidence.** high. **Category.** live-drift.

**Evidence.** Profiles now show 8 stats (Agents, #profile_total_agents) or 9 (gluebyte adds Favorites, #profile_favorites_count). The icon map (L706-L714) lacks both, and L128-L138 hide every secondary label, so the tiles read '0' and '34' with no icon or caption. The toggle says 'Show 5 more stats' or 'Show 6 more stats'. repeat(4,1fr) (L105) wraps as 4+1 and 4+2. The primary repeat(3,1fr) is minmax(auto,1fr), so '1,345,168' at 2.4rem in a 177px tile (601 to 768px) may overflow (estimate, clipped by body overflow-x:hidden). The hidden-label rule lacks clip-path: inset(50%). Site glyphs: fa-robot for agents (home.html L807, /agents/) and fa-heart for Favorites (gluebyte L544). Stale: md L79, L81, L228-L238 (7 stats), md L41, L81 and Status L283 ('Show 4 more stats'), md L235-L236 ('rather than left iconless-but-broken'), comments L99-L100 and L727.

**Impact.** On every profile the expanded panel shows one or two unlabeled numbers and orphan tiles. Each stat the site adds repeats this.

**Fix.** Add Agents: 'fa-robot' and Favorites: 'fa-heart', with aria-hidden on the &lt;i&gt;. Keep labels visible on tiles without an icon, e.g. limit the clip rule to .rh-stats-secondary .rh-stat:has(&gt; .rh-stat__icon) &gt; .rh-stat__label, or tag mapped tiles. Size the secondary grid from N (5 gives 3+2, 6 gives 3+3) or use repeat(auto-fit,minmax(64px,1fr)). Use minmax(0,1fr) plus clamp() for the primary row. Optionally key the map by value ids. Describe the secondary group in the docs as every stat except Followers, Following and Downloads.

<details><summary>Verification notes</summary>

**reproduce.** 1. fa-heart is at profile-gluebyte.html L545. L544 is the opening &lt;a class="rh-cta rh-cta--secondary" href="/user/gluebyte/favorites"&gt;.

2. Drop the primary-row overflow claim.
- Layout: .rh-scroll--stats sits in div.rh-detail inside main.section. The content box is the viewport minus 48px (L67 .section padding 1rem !important, L71 .rh-detail padding 8px !important). Each 1fr share is 177.7px only at exactly 601px; at 768px it is 233px.
- Sizes: the site sets .rh-stat__value to 2.4rem Plus Jakarta Sans 800. "1,345,168" plus padding (L143) and border has a min-content of roughly 190-210px.
- Result: with 1fr = minmax(auto,1fr), the Downloads track freezes at its min-content and the other two share the rest (about 165px each). The total equals the container, so nothing overflows. The only effect is a wider Downloads tile, from 601px up to about 650-700px. iPhones at 375-393px show the same small effect at 1.35rem.
- An overflow at 601px would need the value text to exceed about 310px (about 0.9em per glyph), which is implausible.
- Overflow-x:hidden is set on html always, and on body and html (!important) only at max-width:768px.

3. Drop or qualify the minmax(0,1fr) recommendation. It removes the auto minimum, so the ~200px content would spill out of a 177px tile unless the clamp() size is guaranteed to fit.

4. The missing clip-path: inset(50%) has no visible effect. Chromium and WebKit still honor clip on absolutely positioned elements. Treat it as a hardening nit, not evidence of the bug.

5. repeat(auto-fit, minmax(64px,1fr)) with the 6px gap does not fix the orphans on iPhone. Columns = floor((content+6)/70): 4 at 375-390px (5 tiles give 4+1, 6 give 4+2) and 5 at 393-440px (6 tiles give 5+1). Keep only the column count derived from N.

6. Docs: md L79 and L81 are dated version-history rows (alpha10, alpha12) and are accurate as history. Do not rewrite them. The text that misdescribes current behavior is:
- md L227-L248: L228-L230 list, L238 "the 7 stats", L240 four-item secondary list, L235-L236, L247-L248.
- Status L283.
- Code comments L94-L102, L122-L127 (the New-page icon rationale does not cover Agents or Favorites, and /new/ has no agent card) and L726-L732.

7. Related latent bug with the same fixed-label assumption. md L247-L248 says the split is skipped when none of the primary labels are found, but L742-L744 only bail when the secondary list is empty. I renamed Followers, Following and Downloads in the gluebyte snapshot: the result was 0 primary tiles, 9 hidden tiles and "Show 9 more stats". Keying by value ids (#profile_follower_count, #profile_following_count, #profile_total_downloads) would cover both the icon map and PRIMARY_LABELS.

**impact.** 1. Drop the primary-row overflow claim. repeat(3,1fr) means minmax(auto,1fr), and above 600px no min-width is set, so a track never shrinks below its tile's min-content. "1,345,168" cannot overflow. At 601px the available width is 601 minus 32 (.section 1rem !important, L67) minus 16 (.rh-detail 8px !important, L71), which is 553px. That gives a 177.7px share. The Downloads column widens past it (estimate about 185 to 196px) and the other two columns narrow, only between about 601 and 655px. Result: columns of unequal width, no overflow. Below 601px, L76 sets min-width:74px !important, which replaces the content-based minimum. There the 1.35rem value may get tight in a tile of about 102px at 375px. That is an estimate, not verified, and unrelated to Agents or Favorites.

2. Remove "Use minmax(0,1fr) plus clamp()" from the recommendation. minmax(0,1fr) removes the content-based minimum and would cause that overflow at 601 to 655px.

3. Remove "lacks clip-path: inset(50%)". clip: rect() is deprecated but Safari, Chrome and Firefox still honor it on the absolutely positioned label, and the label is hidden today. At most an optional modernization.

4. repeat(auto-fit, minmax(64px,1fr)) does not fix the orphan tiles on common iPhone widths. At 375 and 390px the grid is 327 and 342px wide. floor((W+6)/70) gives 4 columns, so the layout stays 4+1 and 4+2. At 393 to 440px it gives 5 columns, and 6 tiles become 5+1. Recommend only sizing from N, for example cols = ceil(N / ceil(N/4)): 5 gives 3+2, 6 gives 3+3, 7 gives 4+3, 8 gives 4+4.

5. Visible-label fallback: "FAVORITES" in uppercase at 0.72rem (about 75px) barely fits a 77px tile with 4px padding on a 4-column grid at 375px. Pair the fallback with the 3-column layout. Adding the two icons stays the main fix.

6. Glyph refs: on gluebyte the fa-heart &lt;i&gt; is at L545. L544 is the &lt;a&gt;. /new/ (the icon-language source cited at L122-L127 and L700-L704) has no Agents card. fa-robot comes from home.html L807, agents-listing.html (18 uses) and agent-detail.html, so it is still the site's consistent agent glyph.

7. Docs: md L79, md L81 and the "Alpha12:" sentence in md L41 are version-history records, accurate when written. Do not list them as stale to edit. The stale current-state text is:
- md L227-L241 (L229 and L240 list only Shortcuts/Skills/Prompts/Plugins, L238 says "7 stats")
- md L235-L236 (its premise fails since alpha14)
- Status.json L283
- script comments L99-L100, L122-L127, L700-L704 and L727

Location should read RoutineHub_Enhancer.user.js:L87-L152 and L695-L766.

**fix.** EVIDENCE
1. The fa-heart &lt;i&gt; is at gluebyte L545. L544 is the &lt;a&gt;.
2. The primary-row aside has the mechanism backwards.
- At 601-768px, min-width is auto, so repeat(3,1fr) = minmax(auto,1fr) widens the Downloads column instead (est. 193-210px vs about 160-170px for the other two). The tiles become unequal. Nothing overflows.
- The real spill risk is at &lt;=600px. L76's min-width:74px !important replaces the automatic minimum, so all three columns stay equal. Content box: about 88px at 375px, 94px at 393px. '1,345,168' at 1.35rem measures 96-99px in proxy bold fonts (Roboto, Helvetica, Segoe). Plus Jakarta Sans is likely wider.
- This is an estimate. Add L75-L77 to the location and confirm in a rendered browser.
3. The missing clip-path: inset(50%) is optional hardening. clip: rect() still hides the absolutely positioned label. Drop it from the evidence.
4. md L79 and L81 are version-history rows and were correct for alpha10 and alpha12. Leave them and add a new version row instead. Current-state text to fix:
- md L227-L247, including the L240 list
- Status L279 and L283
- Comments L94-L102, L122-L127, L700-L704 and L727. L122-L127 and L700-L704 say every glyph comes from /new/, which has no Agent or Favorites card.

RECOMMENDATION
a) The icon entries plus aria-hidden are correct. Cite the glyph sources in the comments: fa-robot from the homepage AI band (home.html L807) and the /agents/ cards; fa-heart from the profile's Favorites CTA.
b) The label fallback via :has() or a tag class is correct.
c) Replace both secondary-grid options:
- Three columns ("3+2 / 3+3") makes secondary tiles about 105px wide at 375px, wider than the primary tiles (about 102px). That reverses the alpha13 decision (md L82, "single smaller row") and still leaves a ragged row for 5 tiles.
- repeat(auto-fit,minmax(64px,1fr)) gives 4 columns at 375-390px (content 327/342px) and 5 at 393-440px. 4+1 and 4+2 stay on most iPhones, and 6 tiles become 5+1.
- Use one row instead. Replace L105 with grid-auto-flow: column; grid-auto-columns: 1fr;. Or in JS, use repeat(n,1fr) for n&lt;=6 and Math.ceil(n/2) columns above that. At 375px that gives about 61px tiles for 5 and about 50px for 6.
- Keep plain 1fr, not minmax(0,1fr), so a long value widens its own column instead of spilling.
d) Drop "minmax(0,1fr) plus clamp()" for the primary row. minmax(0,1fr) turns the 601-768px unequal-width case into a real spill and changes nothing at &lt;=600px. Instead, either:
- remove min-width:74px from L76. It is the project's own alpha4 breakpoint (md L101-L102), and the labels already keep tiles at about 84px or wider.
- or shrink only long values inside the &lt;=600px block.
   Verify in a rendered browser.

</details>

<a id="m-03"></a>
### M-03. alpha24 rail toggle fix is documented as shipped and verified but exists in no commit

**Where.** [RoutineHub-Reloaded.md:L93](RoutineHub-Reloaded.md?plain=1#L93); [RoutineHub-Reloaded-Status.json:L83](RoutineHub-Reloaded-Status.json#L83); [RoutineHub_Enhancer.user.js:L3](RoutineHub_Enhancer.user.js#L3)  
**Check.** Confirmed by 3 skeptic checks (reproduce, impact, fix). Severity changed from high to medium.  
**Effort.** S. **Confidence.** high. **Category.** repo-process.

**Evidence.** md L93 and Status L83 say alpha24 added `.rh-rail .navbar-item { background-color: transparent }`, verified live. Script L3 is @version 1.0.0-alpha23. Its only .navbar-item background rule is the unconditional surface-2 !important at L213-L215. git grep over all revisions finds the rule only in the md (914913f, 396c0c3). The repo has 2 commits and no tags, and the 24-row version table has no commits or dates. Status was reset 2026-09-13, one day before the Initial Commit. As written the rule could not win: a normal declaration never beats the !important one. The wrapper is now .rh-theme-item; .rh-rail__theme no longer exists.

**Impact.** The owner believes the fix is live. Any edit from the repo ships alpha23 and loses alpha24 for good. Versions cannot be diffed, bisected or reverted.

**Fix.** Export the installed copy from the iPhone manager, diff it with 914913f and commit it as its own version. If lost, add `.navbar-item.rh-theme-item, .rh-rail .navbar-item { background-color: transparent !important; }` after L213-L215. Tag 914913f as v1.0.0-alpha23. From now on make one commit and tag per version that updates script, changelog and tracker together, with a CI check of @version against the newest changelog entry. Mark the note unverified until checked logged in.

<details><summary>Verification notes</summary>

**reproduce.** 1) Status L83 does not quote the selector. It says "Now overridden to transparent specifically inside rh-rail, verified live". Only md L93 quotes `.rh-rail .navbar-item { background-color: transparent }`. The verification md L93 describes was saved markup injected into a logged-out live page (the alpha23 method), not a logged-in check.

2) Replace "The wrapper is now .rh-theme-item; .rh-rail__theme no longer exists" with the following. The current main.min.261102-102115.css (39 rh-rail classes) and script.min.261102-102115.js contain no rh-rail__theme. The logged-out navbar toggles sit in div.navbar-item.rh-theme-item (home.html L359 and L490). The site's only rules for that class are `.rh-theme-item{padding-top:0;padding-bottom:0;display:flex;align-items:center}` and `.rh-theme-item:hover{background-color:transparent!important}`. The rail appears in 0 of 34 snapshots, so its current wrapper class is unverified.

3) Add location RoutineHub_Enhancer.user.js:L411-L413. Its comment still says "Not yet live-verified", which contradicts md L92. This is more evidence that the committed script predates the docs.

4) Add to evidence: the header (L1-L9) has no @updateURL or @downloadURL, so the repo copy and the device copy drift apart silently.

5) "loses alpha24 for good" is overstated. The fix can be rebuilt from md L93 with !important added. What is really lost is the exact code that shipped, because the md snippet cannot be the literal rule that worked.

6) Severity should be medium, not high.

**impact.** 1. Severity high -&gt; medium. The confirmed harm is docs and tracker that disagree with the source of truth. Any visible effect is logged-in only and unverified. Logged out (F9, every snapshot) there is no visible difference: the toggle wrappers sit on the surface-2 navbar.

2. Replace "The wrapper is now .rh-theme-item; .rh-rail__theme no longer exists" with the verified version:
- css/main.min.261102-102115.css has 0 `rh-rail__theme` selectors.
- Its only `.rh-theme-item` rules are `{padding-top:0;padding-bottom:0;display:flex;align-items:center}` and `:hover{background-color:transparent!important}`.
- The logged-out HTML has 2 `div.navbar-item.rh-theme-item` per page (e.g. home.html L359, L490), both in the navbar.
- Rail markup is unverified because no snapshot contains `rh-rail`.
- md L338 places the toggle in `.rh-rail__bottom` and never names `.rh-rail__theme`, so the docs disagree with each other. The site CSS still has `.rh-rail__bottom{display:flex;...justify-content:space-between}`.

3. Status L83 does not quote the rule. It says "overridden to transparent specifically inside rh-rail, verified live". Attribute the exact selector to md L93 only.

4. Impact: drop "loses alpha24 for good". md L93 fully describes the one-rule fix, so it is recoverable even if the installed copy is lost. Add that the script's rail comment (L398-L412, "Not yet live-verified") also lags the docs (md L92 "Verified rigorously"). The committed file looks older than the documented alpha23 state, at least in its comments.

5. Recommendation:
- Put the override in the unconditional block (L190-L238), not inside `html.rhe-dark`. The `.navbar-item` rule there is unconditional, and with rhe-dark off the rail is native #fff.
- Confirm the logged-in rail markup before choosing selectors. Keeping both `.navbar-item.rh-theme-item` and `.rh-rail .navbar-item` with `!important` is safe on logged-out pages, because the navbar behind them is surface-2.
- A CI @version check is optional for a solo userscript. A manual release checklist or a pre-commit hook comparing @version with the newest table row is enough.

**fix.** Evidence: Status L83 does not quote the selector. It says "Now overridden to transparent specifically inside rh-rail, verified live". The repo has 2 commits across all refs, but main has only 1; 396c0c3 is on an unmerged branch and adds only README.md and LICENSE. Replace ".rh-rail__theme no longer exists" with this: .rh-rail__theme is absent from the 2026-11-02 CSS, the JS and all logged-out pages. The logged-out toggle wrappers are div.navbar-item.rh-theme-item. Logged-in rail markup is not available, so the rail wrapper class is inferred. Supporting point: `.rh-theme-item{padding-top:0;padding-bottom:0}` overrides navbar-item padding, which suggests the partial always carries .navbar-item. Add: the site's `.rh-theme-item:hover{background-color:transparent!important}` (0,2,0) beats L213-L215 (0,1,0) !important, so the patch disappears only on hover. Severity: medium. Recommendation: export, diff and commit is right. If the exported alpha24 lacks !important, its rule never worked. The fallback rule is correct and safe. Both declarations are !important and (0,2,0) beats (0,1,0). The top-bar wrappers sit on the surface-2 .navbar/.navbar-menu, so nothing changes there. Keep it in the first, unconditional GM.addStyle block after L215, not inside html.rhe-dark. The bleed rule is unconditional, and in light mode a teal patch would show on the white native rail. `.rh-rail .navbar-item` is broader than the bug: it would also remove native light-mode backgrounds from any other rail element that carries .navbar-item. Dark mode is unaffected because the html.rhe-dark .rh-rail__* rules have specificity (0,2,1) or more. A tighter option that survives renames and keeps the documented "override, do not narrow" decision: `.navbar-item:has(> .rh-theme-toggle) { background-color: transparent !important; }`. The site's own JS queries .rh-theme-toggle (querySelectorAll), so that class outlived the .rh-rail__theme to .rh-theme-item rename. :has() needs Safari 15.4+, which is below the relaxed-nesting baseline the script already needs (Safari 17.2+). Bump L3 to 1.0.0-alpha24 together with the restored rule. Check logged in, in both themes, before marking it verified again. Tag: the docs in 914913f already claim alpha24, so say in the tag message that the tag marks the script state only. CI: the repo has no CI and no @updateURL/@downloadURL, and installs are manual. A pre-commit hook or a small script that compares L3 @version with the last "| 1.0.0-alphaN |" row (md L66-L93) does the same job with less effort.

</details>

<a id="m-04"></a>
### M-04. One throw aborts every later step, including all theme CSS

**Where.** [RoutineHub_Enhancer.user.js:L166-L190](RoutineHub_Enhancer.user.js#L166-L190); [RoutineHub_Enhancer.user.js:L594-L604](RoutineHub_Enhancer.user.js#L594-L604); [RoutineHub_Enhancer.user.js:L958-L974](RoutineHub_Enhancer.user.js#L958-L974)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** high. **Category.** correctness.

**Evidence.** The script is a single IIFE with no try/catch outside addFreeStatsSummary, and the reorder (L176-L182) runs before the palette and dark CSS (L190, L240). A homepage section with a text-only header, a single child or an emptied header throws TypeError at L179 or L180. Then only 1 of 4 style blocks and 1 of 6 observers exist, and rhe-dark is set with no dark rules behind it. On shortcut-19090 a .rh-hero-header__meta wrapped one level deeper throws NotFoundError at L603 (body and meta are queried separately). That leaves no pitch swap, stats card, reply toggles, collapse-all or observer. L56 calls MediaQueryList.addEventListener unguarded, though it is missing before Safari 14 and the site falls back to addListener. Without a GM object the run stops at L66. Promise.all (L648-L651) turns one failing endpoint into a total failure.

**Impact.** The site ships markup changes often (md L390-L397). A single new homepage section shape switches all theming off and leaves only a console error.

**Fix.** Inject all CSS first, in one place. Wrap the reorder, each feature call (L958-L969) and the observer callback, e.g. const safe = (n, f) =&gt; { try { f(); } catch (e) { console.warn('[RHE]', n, e); } }. Use optional chaining, classList.contains and .rh-section-title text in the reorder. Use meta.parentElement.insertBefore in promoteCreatorLine. Guard addEventListener with an addListener fallback.

<details><summary>Verification notes</summary>

**reproduce.** 1. Throw lines are L179 to L181, not "L179 or L180". A single-child section throws at L180 only when its title does not end in " AI". For "New in AI" or "Popular in AI" it throws at L181 (reproduced at 181:21). A section with no element children throws at L179 (reading firstElementChild of null).

2. On shortcut-19090, "no pitch swap" is wrong. Its Required Apps card has 0 .rh-apps-grid__item, so the pitch is never swapped, even in a clean run (harness: installPitch is 1 before and after). The pitch-swap loss shows on 4448 (installPitch goes from 0 to 1 under the same mutation). The stats card loss applies only to the owner. Losses measured on 19090: .rh-top-comment card styling and flattening (22 to 0), reply toggles (22 to 0), collapse-all (1 to 0), feedback observer (7 to 6). CSS is not affected: L943 runs before L958, so all 4 blocks stay.

3. The L56 item is true but cannot happen in practice, so mark it info. The dark block (L240 to L458) relies on CSS nesting, which needs Safari 16.5+ (17.2+ for bare selectors such as body). Userscript managers on iOS Safari need iOS 15+. So no environment that lacks MediaQueryList.addEventListener could render the theme anyway.

4. Missing GM is not realistic for the documented managers: the README names Tampermonkey and Violentmonkey, and both provide GM.addStyle. A GM object without addStyle (Greasemonkey 4) also fails at L66, with a TypeError. Injecting CSS first does not fix this. Only a plain style-element fallback would.

5. Promise.all is a separate problem that only affects the owner's stats card. addFreeStatsSummary is async, so its errors never stop later steps. Reproduced: a non-anchor .rh-stats-card__btn throws at L620 as an unhandled rejection, and all 22 reply toggles still build. Suggest Promise.allSettled.

6. Recommendation:
- A synchronous safe() wrapper cannot catch the rejection from L964. It needs .catch on the returned promise.
- Only L190 and L240 have to move above L166, because L943 already runs before the feature calls.
- meta.before(creatorSpan) is a simpler equivalent of meta.parentElement.insertBefore.

7. Impact only applies on pathname '/' (L167). What remains is the site's own theme, not an unstyled page: main.min.261102-102115.css has about 1191 html[data-theme=dark] selectors. Reword to "switches all of the script's theming off on the homepage".

**impact.** 1) The throw sites are L179, L180 or L181. L181 is hit when the title ends in " AI" and the section has one child.
2) Impact: only the homepage is affected (L167). After a throw it shows RoutineHub's native theme plus the L66 spacing block. No section moves, and other pages keep full theming. Say that the bug is latent: 35 of 35 current homepage sections match the expected shape, and the harness shows 0 errors on 32 pages.
3) 19090 example: theming is unaffected, because L66, L190, L240 and L943 all run before L958. What is lost: 22 reply toggles, the collapse-all button and the #feedback observer. Drop "pitch swap" for 19090, which has no Required Apps card, and cite 4448 instead. Mark "stats card" as owner-only.
4) Remove the L56, no-GM and Promise.all points from this finding. L56 only matters on engines that cannot render the nested dark block anyway. A missing GM is outside the documented managers. Promise.all runs async, is caught and is documented (md L206). At most it is a separate low item about allSettled.
5) Recommendation: the minimal fix is to move L166-L183 below the last GM.addStyle (after L951) and wrap it in try/catch. That keeps the upstream logic verbatim, as L174-L175 documents. Hardening the filter (querySelector('.rh-section-title')?.textContent, classList.contains) diverges from upstream; F1 already shows that logic is stale, so do it together with F1's fix of the insert target. In promoteCreatorLine, meta.before(creatorSpan) is simpler than parentElement.insertBefore. A synchronous safe() wrapper does not catch async rejections; that is acceptable because they cannot abort later steps. Add L943 to the location as the fourth style block.

</details>

<a id="m-05"></a>
### M-05. No @run-at, so palette and layout changes land after first paint

**Where.** [RoutineHub_Enhancer.user.js:L1-L63](RoutineHub_Enhancer.user.js#L1-L63)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** M. **Confidence.** medium. **Category.** performance.

**Evidence.** Without @run-at, Tampermonkey defaults to document-idle and Violentmonkey and Userscripts to document-end. The site's inline head script sets data-theme before first paint, and all page scripts are defer, so the userscript runs only after they download and execute. Changes that land after paint: the navbar goes from #320832 to #1D424A, dark cards from #1f191f to #0C1311, and OS dark plus site light paints light, then dark. On home the script moves 709 of 2815 elements above the tagline and removes 186 action buttons. On shortcut-4448 the Required Apps card moves from 79% of the HTML to just under the hero. On shortcut-19090, 62 replies get hidden. Userscripts' GM.addStyle is asynchronous. .search beats .has-background-primary-dark only through source order.

**Impact.** Every navigation flashes native colors, then swaps the palette and shifts the layout. This is worst on iPhone over cellular.

**Fix.** Add @run-at document-start. At start, append one combined style element to document.head || documentElement and run initThemeSync. Run the DOM features on DOMContentLoaded and re-append the style element then, so source-order wins still hold. Hide action buttons and pre-hide nested replies with CSS, and toggle a class instead of inline display. Measure on the device.

<details><summary>Verification notes</summary>

**reproduce.** 1) Location: the metadata block is L1-L9. Affected code: L63, GM.addStyle at L66/L190/L240/L943, DOM work at L166-L183 and L958-L974.
2) "All page scripts are defer" is wrong as worded. External first-party scripts are defer (home: jquery-3.5.1, js.cookie-3.0.5, jquery.modal-0.9.1, script.min.261102-102115.js, horizontal-scroll.js; 4448 adds ad.countdown.js, user.feedback.hide.js, download.autoheal.js). gpt.js and .webmcp/bridge.js are async. Full pages run 8 to 15 inline scripts during parsing. changelog-site and shortcut-19090 also load a parser-blocking Cloudflare email-decode.min.js. The conclusion still holds.
3) "709 of 2815" mixes bases. 709 counts descendants of the 5 moved sections after the 18 in-section actions are removed, without the section roots. 2815 counts .rh-container descendants before the script. Consistent figures: 714 of 2629 after the script, or 732 of 2815 before it.
4) "79%" should be 79.8% (byte 135461 of 169662). The card moves out of aside.rh-detail__side.
5) "Changes that land after paint" and "every navigation flashes" overstate it. The flash depends on timing: likely on cold or cellular loads, possibly invisible on fast cached loads and bfcache restores. It was not measured.
6) .search is not the only rule that depends on source order. Three non-important ties on profiles do too: .rh-scroll--stats gap 10px vs .rh-scroll gap:16px, .rh-stat border-radius 10px vs 14px, .rh-stat__label font-size .72rem vs .85rem. So the re-append is needed for more than .search.
7) Recommendation gaps. The homepage section move (L176-L182) and promoteRequiredApps (L683-L693) stay DOM moves at DOMContentLoaded. They can still shift layout after first paint, because CSS cannot move nodes across parents. Guard the handler with a document.readyState check, since injection can arrive late. Move the #feedback observer (L973-L974) into the same handler.

**impact.** Location: the missing directive is in the metadata block, RoutineHub_Enhancer.user.js:L1-L9. Top-level work runs from L62 to L974. The DOM moves are at L166-L183, L692 and L907.

Evidence fixes:
- "All page scripts are defer" is overstated. The site's external scripts are defer: jQuery 3.5.1, js.cookie, jquery.modal, script.min.261102-102115.js and horizontal-scroll.js (home.html L8633-L8788). There are also inline classic scripts and async gpt.js and .webmcp bridge.js. DOMContentLoaded waits for the defer ones.
- Say 709 descendants at move time (727 before the button removal).
- Mark "Userscripts' GM.addStyle is asynchronous" as unverified offline. The source-order caveat applies only to managers that insert style elements.

Impact fixes:
- Write "every full page load", not "every navigation", because bfcache restores are excluded.
- The flash is inferred from load order and has not been observed.
- The light-then-dark case needs OS dark plus site light. That is the F6 behavior and disappears if F6 is fixed.

Recommendation fixes:
- Moving the DOM features to a DOMContentLoaded listener runs them at the same moment as today under Violentmonkey and Userscripts. The home reorder and the Required Apps swap would still jump, so say so or accept it. Only CSS-expressible changes can land before paint: palette, layout tweaks, hidden action buttons, pre-hidden replies.
- Create the style element directly instead of using GM.addStyle, to avoid the Userscripts async path. No snapshot has a CSP meta tag; HTTP headers were not captured.
- Raising specificity on the tie rules (for example html .search) removes the source-order dependency and is simpler than re-appending.
- Add syncThemeClass() at DOMContentLoaded as a safeguard. The site's theme module calls o(i()) at defer time, which triggers the observer, but the code should not depend on that.

</details>

<a id="m-06"></a>
### M-06. Condensed chart sits inside the new stage, so the heatmap legend and 'Tap a square' readout stay visible

**Where.** [RoutineHub_Enhancer.user.js:L153-L164](RoutineHub_Enhancer.user.js#L153-L164); [RoutineHub_Enhancer.user.js:L823-L841](RoutineHub_Enhancer.user.js#L823-L841)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** high. **Category.** live-drift.

**Evidence.** The markup is now .rh-pubgraph__stage &gt; [.rh-pubgraph__scroll &gt; __chart, .rh-pubgraph__foot &gt; (p.rh-pubgraph__readout, .rh-pubgraph__legend)]. The script hides only __scroll (L824), inserts the mini chart before it (L823) and puts the toggle after it (L841). toggles.js gives 'stage &gt; mini &gt; scroll(hidden) &gt; toggle &gt; foot' when condensed and 'stage &gt; mini(hidden) &gt; scroll &gt; toggle &gt; foot' when expanded. The readout ('Hover a square...', on touch 'Tap a square to see that day') and the Less/More legend stay under a chart that has no squares. When expanded, the toggle separates the heatmap from its legend. Bars are capped at max-width 24px with no justify-content, so 13 bars use at most 348px on desktop, contrary to the L153-L158 comment. At 600px and below, scale(0.9) on __chart (L78) inside overflow-x:auto leaves blank scroll space.

**Impact.** The condensed view looks unfinished: a stray legend and instruction, dead space on desktop, and the alpha11 goal of a button under the visible view no longer holds.

**Fix.** Toggle the stage instead: const fullView = card.querySelector('.rh-pubgraph__stage') ?? scrollWrap; call fullView.before(mini), hide fullView, flip it in the handler and call fullView.after(toggle) (verified with toggles.js). Alternatively hide .rh-pubgraph__foot while condensed. Drop the max-width or use justify-content:space-between. Shrink the cells instead of transforming the chart. Once labels render, add .rh-pubgraph__minibar-labels { padding-bottom: 20px; } (Status L301).

<details><summary>Verification notes</summary>

**reproduce.** 1. Condensed order is mini &gt; toggle &gt; foot. The stray readout and legend render below the "Show full year" button, not directly under the bars.
2. Dead space appears only when the stage is wider than 348px, at viewports from about 466px up. On desktop (viewport of 1232px or more) the stage content is 1114px: rh-detail 1200 - 16 padding - 2 border - 44 card padding - 24 stage padding. On a 390px iPhone the stage is 272px, so bars are about 18px each and fill the row. The owner's main device is not affected. The same stale "stretch to fill" claim is also in RoutineHub_Enhancer.user.js:L773-L774, RoutineHub-Reloaded.md:L80 and RoutineHub-Reloaded.md:L259-L260.
3. scale(0.9): add RoutineHub_Enhancer.user.js:L78 to location and mark this part unverified (no layout engine available). The CSS guarantees only this: the transform does not shrink the chart's layout box. That box is about 773x109px (min-width max-content: 31px spacer + 53x14px months; height 10+4 months row + 95 body). So an empty strip of about 11px stays under the scaled heatmap. A blank horizontal scroll tail of about 77px depends on the engine and is not confirmed for WebKit.
4. Recommendation:
- The stage toggle is verified (jsdom, both profiles).
- The "hide .rh-pubgraph__foot" alternative alone fixes only the condensed state. When expanded, the toggle still sits between __scroll and __foot unless it is also moved after the foot or the stage.
- Apply the width fix (drop max-width, or justify-content:space-between) to both .rh-pubgraph__minibar-row and .rh-pubgraph__minibar-labels (L160-L163). Otherwise the date labels misalign under their bars.
5. Add RoutineHub-Reloaded.md:L342 as evidence and as stale docs. It still places .rh-pubgraph__legend inside __chart, which is why hiding __scroll used to hide it, and it has no __stage, __foot or __readout.
6. Side note, not in the finding: the script never themes .rh-pubgraph__stage (native #f4f4f6, dark #282128). Today the bars sit on that unthemed box. The stage fix moves the default view out of it.

**impact.** 1. Evidence. Drop the scale(0.9) sentence, or rewrite it as "leaves an empty band of about 11px under the heatmap in the full-year view at 600px and below". Also drop "Shrink the cells instead of transforming the chart". It conflicts with the decision in md L267-L270 to leave the full-year heatmap native, and the problem is unproven.

2. Make the max-width point its own low item. It affects only viewports from about 466px up, so desktop and tablet, and it is not drift. If it gets fixed:
- Put the same justify-content on both .rh-pubgraph__minibar-row and .rh-pubgraph__minibar-labels, or the date labels drift off their bars.
- Dropping max-width instead gives bars about 83px wide on desktop.

3. Location.
- Add "profile-tojioo: .rh-pubgraph__stage &gt; .rh-pubgraph__foot".
- Add "RoutineHub-Reloaded.md:L342". That selector reference is stale: it still says the legend sits inside __chart.
- Remove L78 from scope.

4. Impact. Replace "the alpha11 goal of a button under the visible view no longer holds" with: "The button still follows the visible chart but is no longer last. The native readout and legend sit below it in both states, and in the expanded view the button splits the heatmap from its readout."

5. Recommendation.
- Option 1 is verified: "mini &gt; stage(hidden) &gt; toggle" condensed, "mini(hidden) &gt; stage &gt; scroll &gt; foot &gt; toggle" expanded. It does move the bars off the stage panel, which loses that panel's padding and background.
- An alternative keeps the bars on the panel. Keep scrollWrap.before(mini), hide and show [scrollWrap, card.querySelector('.rh-pubgraph__foot')] together, and call (card.querySelector('.rh-pubgraph__stage') ?? scrollWrap).after(toggle). Verified in jsdom: "_stage &gt; _mini &gt; _scroll(hidden) &gt; _foot(hidden) &gt; toggle" condensed, "_stage &gt; _mini(hidden) &gt; _scroll &gt; _foot &gt; toggle" expanded.
- "Hide __foot while condensed" alone does not fix the expanded split. The toggle also has to move after the stage.
- Either way, the script never themes .rh-pubgraph__stage, so it stays #f4f4f6, or #282128 under data-theme=dark. That is probably its own theme-drift item.

6. The Status L301 padding item is unrelated to this fix. Keep it as a separate tracker item.

Scripts are in &lt;scratch&gt;\agents\M-06-impact-lens: visible.js, alt.js, toggles.js and ancestors.js.

</details>

<a id="m-07"></a>
### M-07. Publish Activity stage, readout, legend and l1 to l4 cells keep the site's plum and salmon palette

**Where.** profile-tojioo: .rh-pubgraph__stage, .rh-pubgraph__readout, .rh-pubgraph__legend, .rh-pubgraph__cell--l1..l4  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** medium. **Category.** theme-coverage.

**Evidence.** Site rules: .rh-pubgraph__stage is #f4f4f6 (#282128 in dark). html[data-theme=dark] .rh-pubgraph__cell--l1..l4 is #eb9796 (light uses #61124b at opacity .3 to 1). Readout, legend, month, day labels and total use #777 or #8e8e8e. The script re-keys only --l0 (L318). The #777 total sits at 4.20:1 on #0C1311. In the mixed state the stage stays #f4f4f6 inside the dark card. Minibars there reach 1.63:1 and their labels 1.32:1. l0 is forced to #1D424A, so it stands out at 9.9:1 while l4 against l0 is 1.14:1. That inverts the encoding.

**Impact.** In default dark, a plum panel sits inside a teal-black card and salmon cells sit next to teal bars. In the mixed state the chart becomes a light box with an inverted heatmap.

**Fix.** Inside html.rhe-dark, give .rh-pubgraph__stage surface-1. Color the total, month, day-label spans, readout and legend rgba(203,217,215,.65) (about 5.5:1). Decide whether to add .rh-pubgraph__cell--l1..l4 { background: var(--rh-accent) !important }, which keeps the opacity ramp and matches the bars.

<details><summary>Verification notes</summary>

**reproduce.** 1. "The #777 total sits at 4.20:1 on #0C1311" holds only in the mixed state. In default dark the total is #8e8e8e at 5.74:1. Month, day labels, readout and legend are #8e8e8e at 4.79:1 on #282128. Default dark is a palette mismatch, not a contrast failure.
2. The opacity ramp applies in both themes. The dark rule only swaps the background. Suggested wording: "l1..l4 use opacity .3/.55/.8/1 over #61124b, or #eb9796 under html[data-theme=dark]".
3. Per F2, all 13 minibars are 2px and all labels are empty today. The 1.32:1 label figure is latent until F2 is fixed. The 1.63:1 bars are 2px slivers.
4. In the default condensed view the grid is hidden. The salmon or inverted cells next to the bars are the five legend swatches in .rh-pubgraph__foot, inside the stage. Grid cells appear only after "Show full year". Impact should say "legend swatches", and the mixed state "inverted legend, and inverted heatmap after Show full year".
5. Location: add .rh-pubgraph__total, .rh-pubgraph__month and .rh-pubgraph__daylabels span. Also note profile-gluebyte, which has identical values.
6. Context: RoutineHub-Reloaded-Theme-Audit.md:L109-L111 and RoutineHub-Reloaded-Status.json:L272-L275 already list __daylabels, __legend, __month and __total as gaps. They scope them to the full-year view only. That is wrong for __legend and __total, which are always visible. __stage, __readout and the l1..l4 dark rule are not in that 2026-09-11 list.
7. F6 nuance: in the mixed state the site's light option does have a visible effect. Components themed only by the site's data-theme=dark rules, like this stage, revert to light.
8. Recommendation verified:
- Muted rgba(203,217,215,.65) gives 5.53:1 on a surface-1 stage and 5.98:1 for the total on #0C1311.
- On a surface-1 stage, bars are 9.13:1 and labels 11.24:1.
- An accent ramp on l1..l4 vs l0 gives 1.34, 2.47, 4.20 and 6.08. The l1 step is weak, close to the native dark 1.27.
- The stage rule must sit inside html.rhe-dark to cover both states. Its nested specificity (0,2,1) beats the site's :where() rule (0,1,0) even without !important.

**impact.** 1. The 4.20:1 total figure applies only to the mixed state. In default dark the total is #8e8e8e at 5.74:1 on #0C1311. Readout, legend, month and day labels are #8e8e8e at 4.79:1 on #282128. All pass AA.
2. The opacity ramp .3/.55/.8/1 applies in both themes. The dark rule at the end of main.min.261102-102115.css overrides only background.
3. "Plum panel" overstates #282128. It is rgb(40,33,40), a low-saturation gray-purple at 1.20:1 against the card. Plum (#61124b) is the light-theme cell color.
4. Add: in default dark the L318 l0 override cuts l1 vs l0 from 1.69:1 (native #252a31) to 1.27:1.
5. Add: minibars are also 1.63:1 on #f4f4f6 with OS light and site light, because L161 is unconditional.
6. Add: the site now puts the legend and readout in .rh-pubgraph__foot, inside the stage but outside .rh-pubgraph__scroll. So the condensed view (L823-L841) shows a heatmap legend and "Hover a square to see that day" under the bars. RoutineHub-Reloaded.md:L342 still says the legend is inside __chart.
7. Location: add RoutineHub_Enhancer.user.js:L161, L318 and L823-L841.
8. Recommendation: if l1 to l4 become var(--rh-accent) on a surface-1 stage, l1 against an l0 left at surface-2 is only 1.34:1. Take l0 out of the L318 list and set it to var(--rh-border) #17302D. That gives 1.73:1, close to the native light theme's 1.71:1. Also hide .rh-pubgraph__foot while condensed by toggling it together with scrollWrap. The proposed muted text measures 5.53:1 on surface-1 and 5.98:1 on #0C1311.
9. Confidence can be high for the color values. Only how it looks in a real browser is unverified.

</details>

<a id="m-08"></a>
### M-08. New shortcut and changelog components are unthemed: palette clash in dark, white islands in the mixed state

**Where.** shortcut-4448: .rh-alsocard, .rh-hero-header__qr, .rh-pay-sheet__panel, .rh-anchor, .rh-changelog__foot  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** M. **Confidence.** high. **Category.** theme-coverage.

**Evidence.** The script has no rules for .rh-alsocard and its children (9 cards on 4448 and 5870, 6 on 19090 and 26376). The same is true for .rh-hero-header__qr, .rh-health__seg, the fixed phone ad bar .rh-anchor, .rh-pay-sheet__panel, .rh-deal__option, .rh-changelog__foot (134 on changelog-4448), .rh-changelog__latest and the reply border-left. In default dark these keep #1f191f, #2d272d, #392e39 and #3e363e inside the script's teal cards. In the mixed state: .rh-alsocard turns #fff with #00DBAC names at 1.79:1. The QR box and deal panel turn white. Reply borders become 5px #dbdbdb and foot lines #f0f0f0. The 403 .subtitle shows #353535 at 1.53:1, and .rh-description code #37415a on #1D424A at 1.07:1.

**Impact.** The most visible new blocks clash with the palette in dark mode, and several become illegible in the mixed state.

**Fix.** Add to the dark block: .rh-alsocard (surface-1, border) with name, brief, stat, foot and cat tiers. Add the QR box but keep its white quiet zone, and cover the empty .rh-health__seg. Add .rh-anchor and __close, .rh-pay-sheet__panel and .rh-deal__option, and the .rh-changelog__foot border. Also cover .rh-changelog__latest, the .feedback .media .media border-left, the .rh-description .content code color and .subtitle. Decide the theme trigger first.

<details><summary>Verification notes</summary>

**reproduce.** 1. Location: .rh-changelog__foot is on changelog-4448 (134) and changelog-19090 (56). .subtitle is on stats-4448. Neither is on shortcut-4448.
2. .rh-description .content code: 0 matches on all 4 shortcut snapshots, which contain no code element at all. Mark the 1.07:1 as latent. It reproduces only with an injected code element (agents\M-08-reproduce\shortcut-4448-with-code.html).
3. .rh-hero-header__qr has is-hidden-mobile, so it shows on desktop/tablet only and never on the owner's iPhone. .rh-anchor has is-hidden-desktop, which fits "phone ad bar".
4. The deal panel is worse than "turns white". .rh-deal__title, .rh-deal__option (and its title) and .rh-deal__perks use the site's var(--rh-text,#2d2f36). That var resolves to the script's unconditional --rh-text #CBD9D7 (L196), giving 1.45:1 on #fff. The same happens in plain light mode (OS light, rhe-dark off), so dark-block rules alone cannot fix it. Also rename the script's custom properties (for example --rhe-*). The sheet stays [hidden] until the site opens it (data-auto-delay 8000, min views 2, every 7 days).
5. "No rules for .rh-alsocard and its children" holds for class selectors only. The generic a rule (L315-317) colors __name and __author, and that rule causes the 1.79:1. It affects authors as well as names.
6. Empty .rh-health__seg exists only on non-fresh shortcuts. 4448 and 5870 are "old" (3 of 5 empty). 19090 and 26376 are "fresh" (none empty).
7. .rh-changelog__latest is not a mixed-state problem: there it is #2160c4 on #e3eefc, 5.06:1. In default dark it is #2160c4 on #202832, 2.51:1, which is the site's own pill.
8. .subtitle is also on membership: 3 elements (hero subtitle and 2 tier prices), each at 1.53:1 in the mixed state.
9. Reply borders show only after a thread is expanded, because the script collapses replies. Reply counts are 1/0/62/9 on 4448/5870/19090/26376.
10. These are already-listed gaps, not new discoveries. Theme-Audit.md L45-47, L103-104, L112-113 and L144-147, plus Status.json L197-200 and L236-238, already list alsocard, hero-header__qr, changelog__foot/latest and pay-sheet. The finding adds where they render and their colors.

**impact.** 1. Deal sheet cause. The text is not merely unthemed. Site rules .rh-deal__title, __option, __perks, __celebrate and .rh-install-pitch use var(--rh-text,#2d2f36). The script's unconditional :root --rh-text: #CBD9D7 (L196) fills that variable. Results: deal title and options at 1.45:1 on #fff in the mixed state and in plain light (OS light, no rhe-dark). Install pitch text at 1.35:1 in plain light on shortcuts without Required Apps (19090, 26376), where promoteRequiredApps leaves the pitch in place. The same leak hits .rh-modelfacts b on model-detail (var(--rh-text,#111)). Rules in the dark block cannot fix light mode. Rename the script's custom properties (e.g. --rhe-*) or declare them only under html.rhe-dark. This deserves its own finding.
2. Drop .rh-changelog__latest, or argue against the documented decision (md L39, L84, L336). In the mixed state it is legible at 5.06:1. In default dark it shows the site's own #2160c4 on #202832 at 2.51:1, which is the same without the script.
3. Visibility limits.
- .rh-hero-header__qr carries is-hidden-mobile, so it never shows on the owner's iPhone.
- .rh-anchor carries is-hidden-desktop. The site hides it when the anchor ad unit is off or the bar was closed this session.
- .rh-pay-sheet stays hidden until a tap on the pitch, or an auto-open on the 2nd page view after 8 s or 240 px of scroll, at most every 7 days.
4. The .rh-description .content code value of 1.07:1 comes from CSS only. None of the 4 shortcut snapshots has code in its description. Mark it latent.
5. .subtitle is generic Bulma, not a new component. It also hits /membership/ (3 elements, 1.53:1 in the mixed state).
6. Card placement. On 4448 and 5870, 3 cards sit in the "Not updated since ..." .rh-fresher section, the first child of .rh-detail__main above the description. The other 6 are in "People who like ... also like" after the comments. 19090 and 26376 only have the bottom 6.
7. Wording. The surrounding cards are --rh-bg #0C1311, not teal. Empty health segments in the mixed state are #e3e3e3 on dark. They are visible and carry no text, so that is a palette issue only.
8. Optional. In default dark .rh-alsocard__cat is the site's own #3b5bdb on #1b1f2b at 2.90:1. It is a semantic chip, so the left-native precedent applies unless contrast is the goal.

</details>

<a id="m-09"></a>
### M-09. Script surfaces lack a matching text tier, so site grays and the 0.65 tier fall below AA

**Where.** [RoutineHub_Enhancer.user.js:L318-L320](RoutineHub_Enhancer.user.js#L318-L320); [RoutineHub_Enhancer.user.js:L293-L295](RoutineHub_Enhancer.user.js#L293-L295); [RoutineHub_Enhancer.user.js:L333-L336](RoutineHub_Enhancer.user.js#L333-L336)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** M. **Confidence.** high. **Category.** theme-coverage.

**Evidence.** L318 repaints .rh-feed-post, .rh-topcard, code, .textarea and others with surface-2 #1D424A, but the site's dark text colors remain. A data-theme=dark scan finds 628 sub-3:1 texts with script-sourced colors on 22 pages (91 without the script), about 420 of them site muted colors on script surfaces. Examples: .rh-feed-post__handle, __sep and __time #808080 at 2.75:1 (native 4.37:1), 108 each on 5 feed pages; appcard stats in feed posts #727272 at 2.26:1 (128 on /feed/); .rh-heat-detail 2.75:1; inline code #da1038 at 2.13:1. The 0.65 tier gives 6.00:1 on --rh-bg but only 4.15:1 on surface-2: .rh-feed-post__verb 4.16:1, the 'Comment' placeholder 4.16:1 (137 boxes), .rh-rail__search 4.15:1. Alpha 0.70 is the minimum for 4.5:1. Reply textareas lose their boundary (fill 1.50:1, border 1.40:1). html stays #130d14 under body #0C1311, and feed tabs and react pills keep #282128. Docs L33 call feed cards clean.

**Impact.** In the default dark state, feed bylines, timestamps, counts and homepage metadata fail WCAG 1.4.3. Each new native dark color tuned for site surfaces adds more failures.

**Fix.** Whenever a surface is overridden, also set its text tiers. Use at least a 0.75 tier on surface-2, and give explicit colors to the feed handle, separator and time, .rh-heat-detail, .rh-appcard-stats inside surface-2 cards, and code. Or keep text cards on surface-1 and reserve surface-2 for controls. Give .textarea a visible border such as rgba(203,217,215,.45). Set the html background. Optionally map feed tabs and react buttons to surface-1.

<details><summary>Verification notes</summary>

**reproduce.** 1. Appcard stats: 56 on /feed/ at 2.26:1 (28 posts, 2 numbers each), not 128. 128 is every stat number on /feed/. The other 72 sit in .rh-feed-interstitial on --rh-bg at 3.91:1 (3.51 natively).

2. "137 boxes": every reply textarea is inside .reply-container. Site CSS hides it with `.shortcut .feedback article .reply-container{display:none}`. The site JS shows one only after a logged-in user clicks Reply; logged-out users go to #/login. Exposure is on demand, one box at a time. The same applies to the 1.50/1.40 boundary numbers.

3. "Lose their boundary" is wrong. Natively the fill is #1f191f on .rh-card #1f191f (1.00:1). The border is #3e363e from `html[data-theme=dark] textarea` (specificity 0,1,2), at 1.48:1. This is a pre-existing 1.4.11 gap; the script moves the fill to 1.50 and the border to 1.40. The proposed rgba(203,217,215,.45) border gives 3.38:1 over surface-1, so the fix stays valid.

4. Only 426 of the 628 match this mechanism: 418 regressions plus 8 pre-existing (6 pagination ellipses at 2.73, 2.78 natively; 2 model-tag chips at 1.84, 1.87 natively).
- The other 202 come from L315-L317 `html.rhe-dark a{color:var(--rh-accent)!important}`, which outranks the site's `.rh-cta{color:#fff!important}`.
- 193 a.rh-cta.matomo_download show #00DBAC on #3273DC at 2.54:1 (4.54 natively): 190 changelog Download buttons and 3 Get Shortcut CTAs.
- Also affected: .rh-btn-primary and .rh-wall-btn--member on #007AFF (2.24), .rh-platform-chip.is-active on #6366F1 (2.49), .rh-sell-btn--primary on #1F9D55 (1.95), and Sign in to buy on 26376.
- Text tiers do not fix these. Split them into their own finding, or add "exclude filled buttons from the global a color" plus L315-L317.
- Docs L39 says the Download .rh-cta was left native, which is now false.

5. Scope: 628 on 22 pages excludes the notifications snapshot (664 on 23 with it). Comparable totals are 705 sub-3:1 with the script vs 93 without.

6. Missed instance under the cited L333-L336 and L324-L326. .input gets the light --rh-input-bg #C7D6D4 but keeps the site dark text #c5c5c5 (from html[data-theme=dark] input:not(...)) and the script's light 0.65 placeholder.
- Affected: navbar search input#id_q on 31 pages, opened when .search-button toggles .hide.
- Typed text is 1.15:1 and the placeholder 1.02:1 (10.00 and 2.08 natively).
- With OS dark and data-theme=light, typed text is #353535 (8.18) but the placeholder stays at 1.02.
- This alone rates high. Raise it separately, or fold it in at high severity and add an explicit dark text and placeholder color for .input.

7. Recommendation: "keep text cards on surface-1" alone does not reach AA. On #112320, #808080 gives 4.14, #727272 3.40 and #da1038 3.20, so explicit text colors are needed either way. A 0.75 tier on surface-2 gives 4.97 (fine).

8. Minor:
- The same pair is quoted as both 4.16 and 4.15; use 4.15 (8-bit blend) throughout.
- 6.00 is the rounded-blend value; it is 5.98 unrounded.
- .rh-rail__search is computed from CSS only, because .rh-rail is absent when logged out (F9). Add L425-L429 to the location.

**impact.** 1) '128 on /feed/' counts every .rh-appcard-stat on the page. Only 56 (28 feed-post appcards x 2) sit on surface-2 at 2.26:1. The other 72 are inside .rh-feed-interstitial, which L270 paints --rh-bg: 3.91:1, better than native 3.51:1 on #181d26. 2) 202 of the 628 (on 12 pages) come from a different mechanism: script L315 'a' accent color on site button fills. Example: 193x a.rh-cta.matomo_download 'Get Shortcut', #00dbac on #3273dc, 2.54:1. The site's .rh-cta{color:#fff!important} loses to html.rhe-dark a on specificity. The surface mechanism covers 426 items on 12 pages: 324 feed bylines, 56 feed-post appcard numbers, 24 heatseeker numbers, 12 heat-detail, 6 pagination ellipsis, 2 code, 2 inline t-cap. The ellipsis is not a regression (native 2.78:1, script 2.73:1). 3) In the 0.65 tier only the verb regresses (native #ababab 7.51:1, script 4.15:1). The 'Comment' placeholder improves from native 2.07:1 and .rh-rail__search from native 3.53:1. Both still miss 4.5:1. All 137 'Comment' boxes are reply forms hidden by the site rule '.shortcut .feedback article .reply-container{display:none}'. Site JS shows one at a time, only after a logged-in user clicks Reply. .rh-rail__search exists only when logged in. Add RoutineHub_Enhancer.user.js:L425-L429 to location. 4) Reply textareas do not lose a boundary they had. Native fill #1f191f on the #1f191f card is 1.00:1 and the border (#3a323a from .rh-feedback textarea) is 1.39:1. With the script the fill is 1.50:1 against surface-1 and the border is 1.32:1. This is a site weakness that predates the script. Keep the border fix as an improvement: rgba(203,217,215,.45) gives 3.37:1 against surface-1. 5) Inline code appears only twice in 31 snapshots (feed-announcements, agents-listing), and native is already 3.07:1. 6) In the default dark state html #130d14 vs body #0C1311 is 1.02:1, which you cannot see. The visible case is OS dark with site light: rhe-dark stays on and html keeps Bulma's #fff behind the dark body. Put the background declaration on the html.rhe-dark wrapper itself. A nested 'html {}' inside the relaxed-nesting block resolves to 'html.rhe-dark html' and never matches. 7) Feed tabs and react pills have fine contrast (#ababab 6.83:1, #b9b9b9 8.00:1 on #282128). This is a palette mismatch only, low. React pills exist only on .rh-feed-post--text posts. 8) Recommendation: moving text cards to surface-1 alone is not enough. Grey is 4.14:1 there and #727272 is 3.40:1, so explicit text colors are needed either way. The shared L333 rule also styles .input::placeholder on the light --rh-input-bg #C7D6D4 (search placeholder at 1.02:1), so raising the alpha cannot fix that selector. Split the rule.

</details>

<a id="m-10"></a>
### M-10. Always-dark chrome block leaks into light navbar popovers, dropdowns and the theme toggle wrapper

**Where.** [RoutineHub_Enhancer.user.js:L201-L218](RoutineHub_Enhancer.user.js#L201-L218)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** The premise holds for .navbar, .footer, .search and .button.is-dark. But .navbar a{color:accent !important} (0,1,1) beats .rh-meter__cta{color:#fff !important} (0,1,0), so 'Refill now' renders #00DBAC on #f65052 at 1.90:1 in every state. The read meter is #rh-meter.navbar-item inside .navbar-menu, and site JS shows it to logged-out readers on 32 of 34 snapshots. Its white .rh-meter__pop renders the 'Sign in' link #00DBAC on white at 1.79:1 in light mode (native #61124B, 12.38:1). The Sort .dropdown-content is #fff in light mode but turns petrol unconditionally on listings. .navbar-item{background-color:... !important} also paints div.navbar-item.rh-theme-item and the meter. The site declares .rh-theme-item:hover{background-color:transparent !important}. The documented alpha24 fix has no !important and would lose.

**Impact.** Light-mode users get low-contrast links in the read-meter popover and dark dropdowns on light pages. The patch behind the theme toggle wrapper persists.

**Fix.** Exclude .rh-meter__pop and .rh-meter__cta from the navbar link rule, or scope that rule to top-level navbar items. Set .navbar a.rh-meter__cta to #fff. Move the dropdown rules into the dark block. Add .navbar-item.rh-theme-item{background-color:transparent !important} after the .navbar-item rule. Correct docs L118-L121.

<details><summary>Verification notes</summary>

**reproduce.** 1. Dark states: under rhe-dark the CTA and Sign in colors come from L315-L317 `html.rhe-dark a` (0,1,2). That rule also beats the site's #fff !important. Add L315-L317 to the location. Excluding the meter from L216 fixes only the light state. Use `.navbar a.rh-meter__cta { color: #fff !important; }` (0,2,1). It beats both rules in every state, and the !important is required.

2. Sign in "in light mode": the pop is also #fff when the OS is dark and the site theme is light (rhe-dark on, data-theme=light). Sign in is 1.79:1 there too, via L315-L317. With data-theme=dark the pop is #1f191f and Sign in reaches 9.64:1. Fixing that state needs a rule for .rh-meter__pop under html.rhe-dark, or excluding the pop links from L315-L317 as well.

3. "site JS shows it": an inline script right after the meter markup unhides it. The bundle has 0 rh-meter references. The markup sits under the template comment "Links for Non-Authenticated Users", so only logged-out users see it. The pop opens only after a tap on the ring.

4. Theme toggle wrapper: on all 32 logged-out pages, every .navbar-item (288 total) sits inside nav.navbar. The same block paints the navbar #1D424A, so the wrapper and meter paint is invisible there. Hover makes it transparent over the same #1D424A. The visible patch exists only in the logged-in .rh-rail case from docs L93. The snapshots cannot reproduce it, current site CSS has no .rh-rail__theme selector, and the issue overlaps F4. The recommended `.navbar-item.rh-theme-item` misses the rail wrapper if that wrapper lacks .rh-theme-item. Use `.rh-rail .navbar-item, .navbar-item.rh-theme-item { background-color: transparent !important; }`.

5. Sort dropdown: the items stay readable (accent on #1D424A is 6.08:1), so this is cosmetic. The .dropdown-menu wrapper (natively no background, padding-top 4px) also turns petrol. When moving the dropdown rules into the dark block, move `.dropdown-menu a` (L216) and `.dropdown-menu` (L201) too. Otherwise the accent links land on the native white card at 1.79:1.

6. Docs: L118-L121 also omits .dropdown-content and .search. The L93 alpha24 snippet needs !important.

**impact.** Location. Add RoutineHub_Enhancer.user.js:L315-L317. html.rhe-dark a (0,1,2) also beats .rh-meter__cta (0,1,0). It keeps the CTA at 1.90:1 in dark states. It also keeps Sign in at 1.79:1 under OS dark with data-theme=light, because the pop stays white there. Excluding the pop from L216 alone fixes only OS light.

Evidence.
- On all 32 logged-out pages the theme-item and meter-wrapper paint is invisible, petrol on a petrol navbar.
- The visible toggle patch exists only in the logged-in rail described at docs L93. That is unverified and overlaps F4.
- The petrol Sort dropdown in light mode is documented (docs L42, L73, L89) and readable at 6.08:1. The real defect is hover: #00DBAC on #F6D6D6, 1.32:1, when data-theme=light.

Recommendation.
- Use .navbar a.rh-meter__cta{color:#fff !important}. Its specificity (0,2,1) beats both L216 and L315.
- For the pop, key off the site's own theme: html:not([data-theme=dark]) .rh-meter__pop a:not(.rh-meter__cta){color:#61124b !important}, specificity (0,3,2).
- Do not move the dropdown rules into the dark block. That reverses a documented choice and still leaves the hover bug when rhe-dark is on with data-theme=light. Add .dropdown-content a.dropdown-item:hover{background-color:var(--rh-surface-1) !important} instead, which gives 9.12:1.
- For the toggle, use .rh-rail .navbar-item, .navbar-item.rh-theme-item{background-color:transparent !important}. The rail wrapper's class is unverified, and the .rh-rail__theme named in the docs does not appear in the current CSS.
- Correct docs L118-L121. The L93 snippet needs !important.

</details>

<a id="m-11"></a>
### M-11. Unscoped .rh-stat rules will restyle the site's shared stat-tile component

**Where.** [RoutineHub_Enhancer.user.js:L143-L152](RoutineHub_Enhancer.user.js#L143-L152); [RoutineHub_Enhancer.user.js:L301-L306](RoutineHub_Enhancer.user.js#L301-L306)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** medium. **Category.** css.

**Evidence.** The site CSS now ships .rh-stat-grid, .rh-stat__cta{margin-top:auto}, .rh-stat-error, .rh-detail--compact .rh-stat*, .rh-creatorhub .rh-stat__value a and semantic .rh-stat--warn/--danger/--ok/--info/--money .rh-stat__icon colors (#fa0, #ff3860, #48c774, #3273dc; (0,2,0), not !important). .rh-stat{padding:14px 10px !important} beats the compact padding. .rh-stat__icon{font-size:1rem} ties the site's 2rem and wins only by order. html.rhe-dark .rh-stat__icon{color:accent !important} (0,2,1) erases the semantic colors. Order 1 to 3 on icon, value and label pushes a .rh-stat__cta (order 0) to the top. None of these variants appear in public snapshots or in the bundle, so they live on CreatorHub and owner pages.

**Impact.** Warning, danger and success icons on owner dashboards likely render teal and small, and CTA buttons jump to the top of their tiles. Unverified without an owner capture.

**Fix.** Scope the rules to .rh-scroll--stats .rh-stat and .rh-stats-secondary .rh-stat. Apply the same scoping to L301-L306 and to the .rh-stat entries in L318, L321 and L330. Check /shortcut/&lt;id&gt;/stats and CreatorHub while logged in.

<details><summary>Verification notes</summary>

**reproduce.** 1) Evidence: the main padding change is on the base tile: 24px 20px becomes 14px 10px, and border-radius 14px becomes 10px. Compact tiles lose only 2px horizontally (12px to 10px).

2) Impact: compact icons keep the site's 1.35rem, because .rh-detail--compact .rh-stat__icon (0,2,0) beats L150. "Small" applies only to non-compact tiles. L143 and L150-L152 are in the unconditional block (L66-L165), so the CTA reorder and the padding change also happen in light mode. Only the color loss needs rhe-dark.

3) Recommendation, specificity: plain prefix scoping raises L143 to (0,2,0). L143 comes later in the same sheet, so it then overrides L76 (@media max-width:600px, padding 10px 6px !important) and L110-L112 (padding 10px 4px !important, radius 8px). A prefixed L150 also overrides the margin-bottom:0 in L115-L117. Simulated results:
- Phone profile tile: 14px/10px instead of 10px/6px.
- Secondary tile: 14px/10px, radius 10px and icon margin 2px, instead of 10px/4px, 8px and 0.
Fix: use :where(.rh-scroll--stats, .rh-stats-secondary) .rh-stat, and the same for __icon, __value and __label. That keeps specificity at (0,1,0), and the simulated profile output then matches today's.

4) Recommendation, theming: do not scope L301-L303 or the .rh-stat entries in L318, L321 and L330. L274 sets .rh-stat__value to #CBD9D7 !important on every page. With OS dark and site light (F6), a de-themed CreatorHub tile would be #fff with value text at 1.45:1 contrast. Scope only L143, L150-L152 and L304-L306. For the icon color, an alternative is to exclude modifiers: .rh-stat:not([class*="rh-stat--"]) .rh-stat__icon.

5) Contrast of the restored semantic colors on --rh-surface-2 #1D424A: #3273dc 2.39:1, #ff3860 3.10:1, #fa0 5.70:1, #48c774 5.02:1. The info blue needs a lighter dark-mode value to reach 3:1.

**impact.** Location: use "RoutineHub_Enhancer.user.js:L143-L152; RoutineHub_Enhancer.user.js:L304-L306". L301-L303 is the label contrast fix and must stay global.

Evidence:
- The compact padding change is negligible (14px 12px becomes 14px 10px). The real change is on base tiles: 24px 20px becomes 14px 10px.
- Compact icons keep 1.35rem, because .rh-detail--compact .rh-stat__icon (0,2,0) beats L150 (0,1,0). Only base icons shrink from 2rem to 1rem. So "teal and small" holds for base tiles. Compact tiles turn teal only.
- Base labels also shrink from .85rem to .72rem and move below the value.
- "Owner pages" is inference. Only CreatorHub is attributable from the CSS. The public-snapshot check found .rh-stat only on the two profiles, with none of the variants.

Recommendation: do not scope L301-L303, L318, L321 or L330. They are the dark palette for every tile. Scoping them leaves a CreatorHub tile on site colors. In the F6 state (OS dark, data-theme=light) that tile gets a #fff background, while global L274 keeps .rh-stat__value at #CBD9D7, so the value is light text on white. With data-theme=dark it falls back to the site's #1f191f and #8e8e8e.

Scope only L143, L150-L152 and L304-L306, and keep their specificity with :where(). Examples:
- L143: ":where(.rh-scroll--stats, .rh-stats-secondary) .rh-stat { border-radius: 10px; padding: 14px 10px !important; }"
- L150-L152: the same prefix on .rh-stat__icon, .rh-stat__value and .rh-stat__label.
- Dark block: ":where(.rh-scroll--stats, .rh-stats-secondary) .rh-stat__icon { color: var(--rh-accent) !important; }"

The literal ".rh-scroll--stats .rh-stat, .rh-stats-secondary .rh-stat" is (0,2,0) !important and comes after L76 and L110. In the cascade model it overrides the iPhone padding at 390px (10px 6px becomes 14px 10px) and the secondary-tile padding (10px 4px becomes 14px 10px). The :where() version gives the same profile values as the current script at 390px and 1280px. It also restores #fa0 and #ff3860 icons, 2rem icons and 24px 20px padding on non-profile tiles, and keeps those tiles on the script's palette.

</details>

<a id="m-12"></a>
### M-12. .rh-detail margin: 0 !important removes the site's centering on wide screens

**Where.** [RoutineHub_Enhancer.user.js:L67-L71](RoutineHub_Enhancer.user.js#L67-L71)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** The site rule is .rh-detail{max-width:1200px;margin:0 auto;padding:24px 16px}. .rh-detail now wraps shortcut, changelog, profile and AI detail pages inside a full-width main#content.section. L71 sets margin: 0 !important unconditionally. ancestors.js at 1440px shows the content flush left with about 208px empty on the right, about 690px at 1920px. L68 cuts the .rh-section bottom margin from 40px to 8px, and L69 cuts the .rh-section-header margin from 16px to 4px, on every page.

**Impact.** Above roughly 1232px viewport width, shortcut and profile pages sit flush left in both themes. iPhone is unaffected.

**Fix.** Use margin: 0 auto !important, or zero only the vertical margins. Scope L68-L69 to the homepage, e.g. .rh-container &gt; .rh-section. Confirm at 1440px.

<details><summary>Verification notes</summary>

**reproduce.** 1. Evidence: replace "wraps shortcut, changelog, profile and AI detail pages" with "wraps shortcut and profile pages only (6 of 34 snapshots)".
- Changelog pages use main &gt; div.container.rh-container.rh-feed.rh-changelog.
- AI detail pages use main &gt; div.container.rh-container &gt; div.rh-main-content. The rh-detail-header class on agent, prompt, plugin and cherri pages is a different class and does not match .rh-detail.
- The site centers those pages with .container{margin:0 auto}, .rh-feed{margin:0 auto} and the .rh-container rule at 1400px and up. The script touches none of these, so they stay centered.

2. Evidence: "ancestors.js shows" overstates the method. jsdom has no layout, so the numbers are computed:
- 1440 − 2×16 (L67 .section padding) − 1200 = 208. At 1920 this gives 688.
- html{overflow-y:scroll} forces a classic scrollbar on Windows Chromium (about 15px). There the gaps are 193 and 673.
- Measured to the viewport edge, the empty space on the right is 224 at 1440 and 704 at 1920 (overlay scrollbars). The site's centered layout leaves 120 and 360 on each side.
- The threshold is W &gt; 1232 + scrollbar width. Without the script the box becomes centered with side margins only above 1296.

3. Location: the defect is at L71. L67 contributes by cutting main padding from 48 to 16px.

4. L68-L69: the values are correct (40px to 8px, 16px to 4px). However, they do not affect the pages this finding is about: shortcut and profile pages have 0 .rh-section and 0 .rh-section-header. They do apply on 22 of 34 snapshots (home 35 sections, feed 5, search 5, listings, changelog and AI pages 1 each). They are gluebyte's deliberate inherited compaction (L65 comment). Move this to a separate info-level design decision rather than part of this medium defect.

5. Recommendation:
- "Zero only the vertical margins" is the same as deleting `margin: 0 !important`, because the site rule's vertical margins are already 0. The simplest fix is to drop `margin: 0 !important` from L71. `margin: 0 auto !important` also works.
- The suggested scope `.rh-container > .rh-section` is not homepage-only. It matches changelog-4448 and changelog-19090 (1 each), feed (2), each feed channel (1) and search-weather (5).
- On home that selector matches 0 sections before the script runs and only the 5 moved by the reorder afterwards, out of 35.
- Use the homepage's own html class instead (`<html class="home">`), for example `html.home .rh-section`, `html.home .rh-section-header`, `html.home .rh-hero-row`.

**impact.** Location: RoutineHub_Enhancer.user.js:L71-L71 (drop L67-L70). Evidence: replace "wraps shortcut, changelog, profile and AI detail pages" with "wraps shortcut (4/4 snapshots) and profile (2/2) pages only. Changelog (.container.rh-container.rh-changelog) and AI detail pages (.container.rh-container &gt; .rh-main-content, inline max-width:860px;margin:0 auto) are unaffected and stay centered, which makes the shortcut-to-changelog switch inconsistent." Add: "the site's only margin on .rh-detail is 0 auto, so L71 has no effect below the threshold. Logged-out navbar and footer are centered Bulma .container elements (x=48..1392 at 1440px), while .rh-detail spans x=16..1216." Remove the L68-L69 sentence: .rh-section and .rh-section-header do not exist on shortcut or profile pages and are absent from 13 of 34 snapshots. They are gluebyte's documented compaction (RoutineHub-Reloaded.md:L20-L22, L101-L103). Any change belongs to the open "Margin and gap audit" TODO (RoutineHub-Reloaded-Status.json:L105-L108), not to this finding. Impact: "Logged out above about 1232px (plus classic scrollbar width). Logged in at 1024px and up, the .rh-app grid gives the rail a 260px column (76px mini), so the threshold is about 1492px (about 1308px mini); inferred from CSS, not logged-in markup. iPhone unaffected." Recommendation: delete "margin: 0 !important;" from L71 so the site's own margin:0 auto applies, or use "margin: 0 auto !important". Drop the L68-L69 scoping advice. Verify at 1440px logged out or 1920px logged in; 1440px logged in with the full rail shows no difference.

</details>

<a id="m-13"></a>
### M-13. Required Apps promotion puts a 34-icon grid above the description

**Where.** [RoutineHub_Enhancer.user.js:L683-L693](RoutineHub_Enhancer.user.js#L683-L693)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** medium. **Category.** ux-roadmap.

**Evidence.** shortcut-4448 (9.4M downloads) has 34 .rh-apps-grid__item. replaceWith moves the side card into the pitch slot under the hero, above the fresher block, the second ad and the Description. The grid uses repeat(auto-fill,minmax(56px,1fr)) with a 10px gap. On a phone that gives 4 to 5 columns and 7 to 9 rows, roughly 450 to 750px, in place of a pitch of about 60px. This is a CSS estimate, since jsdom has no layout. For the owner, the stats card is inserted above it too.

**Impact.** On popular shortcuts the description starts about one screen lower. Typical lists of 0 to 2 apps are fine.

**Fix.** Promote only small lists (about 8 to 10 items), or show one row plus a 'Show all N' toggle. Otherwise leave the card in the sidebar.

<details><summary>Verification notes</summary>

**reproduce.** 1) Height figures: "450 to 750px" fits the grid alone. The whole card is larger. At 375 to 402px (non-Max iPhones), the grid is 645 to 706px and the card is 724 to 785px, adding 40px padding, 2px border and a 37px title. At 414 to 440px (Plus/Max), the grid is 452 to 488px and the card 531 to 568px. 2) Net push of the Description: the pitch takes about 58px plus 12px/16px margins, about 86px in total. The card adds a 20px bottom margin. Net push is about 700px at 390 to 402px, about one screen. At Max widths it is about 490px, about 0.6 screen. 3) Owner clause: the code path is confirmed (L623-L631, L963-L964). It only applies if the server renders .rh-install-pitch for the owner, which the logged-out snapshots cannot show. The pitch is a membership upsell. If it is absent, promoteRequiredApps does nothing, and both cards stay in the sidebar. 4) "Typical lists of 0 to 2 apps" rests on the 3 other snapshots only. 5870 has 2 items. 19090 and 26376 render no Required Apps card at all. 5) Recommendation: below 1024px, .rh-detail__grid is a single column. On phones, "leave the card in the sidebar" therefore means the very bottom of the page, after Feedback and "also like". That is the reason it was promoted. Middle option for long lists: insert the card after .rh-description, or keep it in the pitch slot with one row plus "Show all N".

**impact.** 1. Heights. Say the grid is about 450 to 705px and the card about 530 to 785px including title and padding. At 375 to 402px width (most current iPhones) the grid is 4 columns by 9 rows and the card about 725 to 785px. At 414 to 440px it is 5 by 7 and about 530 to 570px. The pitch is a 58px box, 86px with margins. The net extra push is about 465 to 720px.
2. Owner stats card. The claim is true (call order L963 then L964; anchor at L623-L631). That placement is documented (L606, MD L206) and only appears for the owner. Do not count it toward the defect. It matters for the fix, though. addFreeStatsSummary anchors on the Required Apps card, so the "leave it in the sidebar" path also moves the owner's Stats card to the bottom of the page on phones, after the comments. If that path is chosen, anchor the stats card to the hero slot explicitly.
3. Context. On 4448 the native page already has these blocks before the Description: a 250px ad above the hero, the hero, the pitch, the 6-item fresher card, and a second 250px ad (.rh-ad-slot--mobile-250.is-hidden-desktop in .rh-detail__main). The Description is already below the fold. The script adds about one more screen.
4. Condition. The move happens only where the site renders .rh-install-pitch. All four logged-out snapshots render it. Whether members see the pitch is unverified.
5. Desktop. At 1024px and up the card leaves the 320px rail and becomes a full-width strip above the grid, about 14 columns by 3 rows, about 270px. This is a minor side effect.
6. Recommendation. Prefer the project's own condense-and-reveal pattern, as in splitStatsOverview L733-L766. Show the first 8 icons (2 rows at 4 columns) plus a "Show all N apps" toggle. The alternative is to promote only when there are 8 items or fewer. Add the call site RoutineHub_Enhancer.user.js:L963 to the location.
7. Confidence. The DOM move and item counts are certain from the snapshot and harness. The pixel figures are CSS arithmetic without a layout engine, so medium stays right for them.

</details>

<a id="m-14"></a>
### M-14. Condensed Publish Activity has no text alternative; bar values live only in title tooltips

**Where.** [RoutineHub_Enhancer.user.js:L780-L842](RoutineHub_Enhancer.user.js#L780-L842)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** M. **Confidence.** high. **Category.** accessibility.

**Evidence.** The bars are bare divs with only bar.title (L810). They have no role, no accessible name and no visible value, and title tooltips do not appear on touch or keyboard. L824 hides .rh-pubgraph__scroll, which contains the site's .rh-pubgraph__body role=img aria-label='Publish activity by day: 31 publishes in the last year'. The site replaced its own tooltips with data-label plus p.rh-pubgraph__readout aria-live=polite, updated on pointerover and pointerdown, with separate idle text for touch. That readout and the legend stay visible and say 'Tap a square' while no squares are shown. Many bars are only 2px tall. Docs L80 present the tooltip as the way to see exact values.

**Impact.** On the owner's iPhone, weekly counts cannot be read. VoiceOver users lose the activity summary until they press 'Show full year'.

**Fix.** Give the mini chart role=img and an aria-label such as '10 publishes in the last 13 weeks'. Add or reuse an aria-live=polite readout that the tapped or hovered bar updates. Make each full 48px column the hit target, or print the per-week values. Hide or rewrite the native readout and legend while condensed.

<details><summary>Verification notes</summary>

**reproduce.** 1. Impact: drop "VoiceOver users lose the activity summary". p.rh-pubgraph__total stays visible and readable ("31 publishes in the last year" on tojioo, "89 publishes in the last year" on gluebyte). It sits outside .rh-pubgraph__scroll. The hidden role=img label only repeats that sentence with the prefix "Publish activity by day:". Restate as: screen reader users get the year total but no 13-week or per-week text. Whether VoiceOver reads the bar titles is unverified.

2. "no accessible name" is overstated. title is the accname tooltip fallback, so assistive tech may expose it as a name or a description. Restate as: the only text is a title attribute. The bars have no role, no tabindex, no text content and no visible value, and the title never shows on touch or keyboard.

3. Only the readout says "Tap a square to see that day", and only on (hover: none) devices. Server HTML and desktop show "Hover a square to see that day". The legend reads "Less", 5 heatmap swatches, "More" and is aria-hidden. It describes the l0-l4 scale, which the flat --rh-accent bars do not use.

4. Today 13 of 13 bars on both profiles are 2px with title "0 publishes, week of " and empty date labels. Cause: L794-L795 read cell.title, but the cells carry data-label (F2). With data-label used instead, tojioo has 9 of 13 bars at 2px (10 publishes in 13 weeks, which matches the recommendation's example). Gluebyte has 8 of 13 (16 publishes). Fix together with F2.

5. Recommendation: the site's readout listeners sit on .rh-pubgraph__body, inside the hidden scroll wrapper, and match only .rh-pubgraph__week .rh-pubgraph__cell[data-label]. Taps on bars can never update the readout. Reusing p.rh-pubgraph__readout needs the script's own listener to write its text. Optionally add aria-expanded to the "Show full year" toggle (L826-L835).

6. Related locations: RoutineHub-Reloaded.md:L254-L256 repeat the title parsing. Snapshot profile-tojioo.html:L629 is the role=img element and L2334-L2336 is the readout.

**impact.** Title: replace "has no text alternative" with "exposes weekly values only via title tooltips; site readout and legend left orphaned". The card keeps a text summary in p.rh-pubgraph__total.
Evidence: change "no accessible name" to "no role, no aria-label, no tabindex; title is the only name source". The readout shows "Tap a square to see that day" only where matchMedia('(hover: none)') matches (iPhone). Elsewhere it shows "Hover a square to see that day". The legend shows Less, 5 level swatches and More. It does not say "Tap a square". Change "no squares are shown" to "no day squares are shown". Add: .rh-pubgraph__foot is a sibling of .rh-pubgraph__scroll inside .rh-pubgraph__stage (profile-tojioo.html L622, L2333-L2337), so L824 leaves it visible. Docs L342 still places the legend inside __chart. Add counts: 13/13 bars are 2px today (F2). After a data-label fix, 9/13 stay 2px on tojioo and 8/13 on gluebyte.
Impact: drop the VoiceOver claim. p.rh-pubgraph__total (profile-tojioo.html L619-L620) stays visible, and only the duplicate role=img aria-label is hidden. Keyboard users lose nothing the native chart offered: 0 tabindex on the page, and the readout is pointer-only. Restate as: on iPhone the default view gives no way to read weekly counts, tapping bars does nothing, and the visible hint asks the user to tap squares that are hidden.
Location: add "profile-tojioo: .rh-pubgraph__stage &gt; .rh-pubgraph__foot".
Recommendation: ship this with the F2 data-label fix. Otherwise any readout or label shows "0 publishes, week of ". While condensed, hide .rh-pubgraph__legend and set the readout to a bar-specific hint. Restore data-idle/data-idle-touch on expand. Update docs L80, L254-L262 and L342.

</details>

<a id="m-15"></a>
### M-15. Some wins depend on injection order and origin, which may differ on the iPhone manager

**Where.** [RoutineHub_Enhancer.user.js:L87-L164](RoutineHub_Enhancer.user.js#L87-L164); [RoutineHub_Enhancer.user.js:L223-L225](RoutineHub_Enhancer.user.js#L223-L225)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** medium. **Category.** compatibility.

**Evidence.** In ten ties the script wins only because its &lt;style&gt; comes after the site &lt;link&gt; (run-losses.js): .search !important vs .has-background-primary-dark !important (both (0,1,0)), .rh-stat radius 10px vs 14px, .rh-stat__label .72rem vs .85rem, .rh-stat__icon 1rem vs 2rem and .rh-scroll--stats gap 10px vs 16px. Tampermonkey 5.4.1 and the browser-check skill both append an author-origin &lt;style&gt;. From memory of its source, Userscripts' GM.addStyle uses tabs.insertCSS with cssOrigin 'user' (not verified). In that case every non-!important script rule loses to any site rule, and user !important beats site !important regardless of specificity, so md L363-L373 would not apply there.

**Impact.** If confirmed, the iPhone shows a maroon search bar and site-sized stat tiles, unlike the desktop checks, and future non-!important tweaks silently fail on iOS.

**Fix.** Check once in Safari Web Inspector. A &lt;style&gt; element in the DOM means author origin; a 'User Style Sheet' entry means user origin. Add one notch of specificity to the tie-dependent rules (.search.has-background-primary-dark, .rh-scroll--stats .rh-stat). If the origin is user, mark competing declarations !important or inject an own &lt;style&gt;. Record the result under Recurring patterns.

<details><summary>Verification notes</summary>

**reproduce.** 1. Evidence: "ten ties" means 10 longhands from 6 declarations. Add the missing one: L150 .rh-stat__icon margin-bottom 2px vs site 4px.

2. Impact: split it by model. The maroon (#320832) search bar appears only when the sheet is author origin and ordered before the site's (model AB). That model flips exactly the 10 tie longhands: the overlay on all 32 pages and the primary tiles on both profiles. Under user origin the search bar stays themed, so the current text contradicts its own user-origin reasoning. User origin flips 9 visible declarations, all on profiles:
- the 5 tie declarations (L91, L143, L150 x2, L152)
- L112 .rh-stats-secondary .rh-stat radius 8px to 14px
- L117 secondary icon margin-bottom 0 to 4px
- L133 secondary label margin
- L164 .rh-pubgraph-toggle margin-top .75em to 0 (loses to button{margin:0})

   L948-L949 .rh-toggle-replies also flips, with no visible change.

3. Add evidence and raise confidence. md L82 (alpha13) and the L139-L141 comment record a flush toggle on the real device. With today's CSS only user origin explains that. The L139-L141 diagnosis ("Bulma .button rules tie or beat this") is wrong: no .button margin rule matches. Extend the location with md L82 and L139-L141.

4. Recommendation: a cheaper check is possible in the device console (md L90 says the owner has one):
- document.querySelectorAll('style').length: no script style elements means the manager used insertCSS.
- On a profile, getComputedStyle(document.querySelector('.rh-stat__icon')).fontSize: 16px means author-after; 32px means user origin or AB.
- With search open, getComputedStyle(document.querySelector('.search')).backgroundColor: rgb(29, 66, 74) means author-after or user origin; rgb(50, 8, 50) means AB.

   Specificity bumps help only in AB. Under user origin, !important must cover all 9 declarations, not only the ties.

5. md L363-L373 does not apply in any model today. The site's .search .button.is-dark{background-color:#61124b} (@276802) is not !important, so L226-L230 already wins.

**impact.** 1) Evidence: write "10 longhand ties from 5 rules (L91, L143, L150, L152, L224)". Only .search is site-wide. Under user origin the losses go beyond the ties. Add L112 radius (8px becomes 14px), L117 icon margin (0 becomes 4px) and L164 margin-top (.75em becomes 0, from Bulma button{margin:0} at (0,0,1)). 2) Impact: under user origin the search overlay stays themed, because user !important beats author !important. Maroon #320832 appears only if the manager injects an author sheet ordered before the page sheets. Correct the user-origin impact to: profile stat icons 32px instead of 16px, labels .85rem, radius 14px, gap 16px, the "Show full year" button sitting directly on the bar labels, and every future non-!important rule on a site-styled element. 3) Add md L82 (alpha13) as evidence: a device-only margin loss that only user origin reproduces (agents/M-15-impact/alpha13.js). Raise confidence to medium-high. Note that the comment at L139-141 and md L82 name the wrong cause. 4) Recommendation: a missing &lt;style&gt; element does not separate user origin from an injected author sheet. Measure on the device instead. On /user/tojioo, a marginTop of 0px on .rh-pubgraph-toggle means user origin. The fontSize of .rh-scroll--stats .rh-stat__icon is 16px with an appended &lt;style&gt; and 32px with user origin or a before-site author sheet. With search open, a .search background of rgb(50, 8, 50) means a before-site author sheet. Preferred fix: append the script's own &lt;style&gt; elements to document.head instead of calling GM.addStyle. Then the iPhone, Tampermonkey and browser-check all share one cascade. Specificity bumps help only in the before-site case. If GM.addStyle stays and the origin is user, add !important at L91, L112, L117, L143, L150, L152 and L164. Then rewrite md L363-L373 and the comment at L139-141. Location: RoutineHub_Enhancer.user.js:L91-L164 (L91, L112, L117, L139-L143, L150-L152, L164); RoutineHub_Enhancer.user.js:L223-L225; RoutineHub-Reloaded.md:L82; RoutineHub-Reloaded.md:L363-L373.

</details>

<a id="m-16"></a>
### M-16. Docs and comments teach cascade mechanics that do not match the current CSS

**Where.** [RoutineHub-Reloaded.md:L363-L373](RoutineHub-Reloaded.md?plain=1#L363-L373)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** high. **Category.** docs.

**Evidence.** (a) The site's .search .button.is-dark{background-color:#61124b} is no longer !important, so the script's !important rule already wins and L236-L238 are redundant. The Recurring patterns section (L363-L373) and the alpha10 row (L79) suggest that an !important override can lose to a more specific normal rule, which is wrong. (b) Comment L139-L141 claims Bulma rules compete with .rh-stats-toggle, but the only competitor is button{margin:0} (0,0,1). (c) The alpha24 row (L93) documents a non-!important override that cannot work, and the wrapper is now .rh-theme-item. (d) L109 says surface-1 is for cards, but cards use --rh-bg (L270). (e) Audit L184 skips 57 plain html[data-theme=dark] selectors, including the ones that fight the script: inputs, .field-new-control, hr, the toggle and pubgraph cells. (f) L148-L160 leave out the +(0,1,1) nesting shift that flipped .rh-cta. (g) L342 still describes the old pubgraph structure.

**Impact.** Future fixes will add specificity where importance already decides, or ship non-!important overrides that silently lose.

**Fix.** Rewrite the patterns entry in cascade order: origin and importance, then specificity, then source order. Delete L236-L238. Change the alpha24 note to .rh-theme-item with !important. Extend the audit regex to plain html[data-theme=dark] selectors.

<details><summary>Verification notes</summary>

**reproduce.** File prefixes: L139-L141, L231-L238 and L270 are in RoutineHub_Enhancer.user.js. L79, L93, L109, L148-L160, L342 and L363-L373 are in RoutineHub-Reloaded.md. L184 is in the audit doc (the sentence runs L183-L185).
(a) Change "no longer !important" to "not !important in the 261102 CSS". The alpha10-era CSS is gone, so whether the rule was ever !important cannot be checked. L79 does not claim that a normal rule beats !important. Limit that point to L365-L366 and L369-L373. The stale comment is L231-L235, not only the rule.
Recommendation: deleting L236-L238 as written would remove the "}`);" terminator on L238 and break the script. Delete L231-L238 and make L230 "}`);". In the cascade-order rewrite, add the style-attribute step between importance and specificity, since the script relies on inline styles (L750, L487). The site CSS has no @layer.
(c) .rh-theme-item is confirmed only for the logged-out navbar. The logged-in rail markup was not captured. The site already has `.rh-theme-item:hover{background-color:transparent!important}` at (0,2,0). A working fix is `.rh-theme-item{background-color:transparent!important}` placed after L213-L215 (same specificity, later rule wins).
(e) Only 3 of the 5 named rule groups actually compete with script declarations:
- Inputs: #6435 sets color #c5c5c5 over the script's #C7D6D4 input background, about 1.15:1 when data-theme=dark.
- .field-new-control: #6442 `.field-new-control .transparent-control .input{background-color:transparent!important}` at (0,4,1) beats the script's .input rule at (0,2,1). That leaves the dark label from L312-L314 on surface-2, about 1.7:1. No snapshot contains .field-new-control.
- hr: #6437 competes, and the script wins by importance.
The toggle rules #5870-#5873 duplicate the script's own values. #6458 (cells l1-l4) does not overlap the script's l0-only rule. A class-presence diff also cannot see type selectors (input, select, textarea, hr), so the audit has to diff element selectors too, not just widen the regex.
(f) The flip is shown by arithmetic only, not rendered. It affects Get Shortcut (shortcut-4448), Sign in to buy (shortcut-26376) and 134 Download links (changelog-4448). md L77, L84, L172 and script L409-L410 still describe .rh-cta as native.
(g) L342 should read: card &gt; __total + __stage &gt; (__scroll &gt; __chart &gt; (__months [__daylabel-spacer + 53 __month] + __body [__daylabels + 53 __week x 7 cells with data-label]) + __foot &gt; (__readout + __legend)).

**impact.** 1. (a) Replace the claim that L79 and L363-L373 say a normal rule can beat !important. L79 and L363-L368 state the both-!important case correctly. The defects are:
- the stale example (the site rule now has no !important);
- code comment L231-L235;
- L370-L373, which omits "check whether the competing rule is itself !important".
   Mark "no longer" as inferred from L79.

2. (e) Count is 57 plain selectors plus `html:where([data-theme=dark])`. Limit "fight" to inputs and .field-new-control, and note that .field-new-control markup is absent from all snapshots. hr, the toggle and cells l1..l4 are overlap or gap, not fights.

3. (f) Add the consequence. The nested `a` (0,1,2) !important beats `.rh-cta{color:#fff!important}` (0,1,0) and `.rh-meter__cta`. Get Shortcut becomes #00DBAC on #3273dc at 2.54:1. Docs L77, L84 and L172, plus script L409-L410, are now false.

4. (c) Qualify: wrapper verified as `div.navbar-item.rh-theme-item` in logged-out markup only.

5. Recommendation changes:
- Keep the both-!important case in the rewritten pattern, with a current example: `.rh-theme-item:hover` or `.transparent-control .input`.
- Fix or drop comment L231-L235 together with L236-L238.
- Add a note on nesting specificity (+0,1,1) at L132-L137 and L148-L160.
- Fix L109: cards use --rh-bg; surface-1 is used for the footer, the top comment and rail hover states.
- Update L342 for __stage, __foot, __readout, the legend location and data-label.
- Fix comment L139-L141: no Bulma rule competes.
- Leave the alpha24 history row and add a correction note; the code fix belongs to F4.
- Extend the audit to plain and html:where() forms, and state that a class-presence diff cannot see property conflicts.

6. Location: add RoutineHub_Enhancer.user.js:L139-L141 and L231-L238; RoutineHub-Reloaded.md:L79, L93, L109, L148-L160 and L342; RoutineHub-Reloaded-Theme-Audit.md:L184.

</details>

<a id="m-17"></a>
### M-17. Docs for login, register, feed, /new/ and search describe a site that no longer exists

**Where.** [RoutineHub-Reloaded.md:L36-L50](RoutineHub-Reloaded.md?plain=1#L36-L50); [RoutineHub-Reloaded.md:L332-L339](RoutineHub-Reloaded.md?plain=1#L332-L339); [RoutineHub-Reloaded-Status.json:L251-L262](RoutineHub-Reloaded-Status.json#L251-L262)  
**Check.** Confirmed by 1 skeptic check (reproduce).  
**Effort.** S. **Confidence.** high. **Category.** docs.

**Evidence.** md L37-L38, L50 and L332 and Status L251-L262 treat /login/ and /register/ as pages. Both are 1.3 KB redirects, to /#/login and /#/register. AuthModal handles #/login, #/signin, #/register, #/signup, #/forgot, #/verify and #/otp. It loads /login/?modal=true (fallback ?fallback=1) or /register/?modal=true into #modal-template-page #modal-content. .field-new-control occurs in 0 of 32 snapshots. L86 keeps the harmful dark label. L36, L87 and L333 call /new/ inline-styled and auth-gated, but it returns HTTP 200 with BEM classes. L50 lists a Discover tab. The live tabs are Home, Shortcuts Help, Feed, Announcements, General and New & Updated. L339 calls .rh-feed-interstitial unknown. It is the Fresh & Popular strip. L92 and Status L88 say search moved to .rh-rail__search. That is a button without an input, and the bundle still opens .search and .rh-browse. L39 and L172 call .rh-cta and badges native. Status still lists rh-checkin__btn and --done (both gone) and rh-endless-* (listing pages only), and marks Shortcut Feed and Shortcuts Help as never visited.

**Impact.** The next pass would test dead URLs, keep a harmful label rule and look for search in the wrong component.

**Fix.** Merge Login and Register into one 'Auth modal' entry: open any page with #/login, fragment /login/?modal=true. Capture the fragment and mark the entry needs_recheck. Rewrite the Upload New and feed rows and the alpha17 and alpha23 conclusions. Add a column for logged-out reachability.

<details><summary>Verification notes</summary>

**reproduce.** 1. ".field-new-control occurs in 0 of 32 snapshots": the count is 0 of 34 page files (32 without the two stubs). The absence proves little. The form comes from the uncaptured /login/?modal=true fragment. The site CSS still has 19 .field-new-control rules (20 matches), including html[data-theme=dark] variants. Base "harmful" on the cascade instead (transparent !important input, script container #1D424A at L318, script label #0C1311 at L312-L314, 1.73:1). Cite RoutineHub_Enhancer.user.js:L312-L314 and mark it unrendered.
2. Hash list: add #/forget. #/verify and #/otp are matched but are no-ops (break). #/forgot loads /password_reset/?modal=true. The register URL may append &wall=1.
3. /new/: L36 says inline-styled and unclassed but not auth-gated. Only L87 and L333 say auth-gated. L50 contradicts them by listing Upload New as reachable without login. The script comments at L347-L352 and L363-L368 repeat the inline-style rationale. The selectors still match, so only the rationale is stale.
4. .rh-feed-interstitial: feed.html has three of them. They are Fresh & Popular (sort=weekly_new), Most Liked This Week (weekly_liked) and Trending this week (weekly_downloaded). It is a reusable shortcut-strip section (div.rh-section.rh-feed-interstitial &gt; .rh-scroll &gt; .rh-appcard), not one strip.
5. "Button without an input" is inferred from CSS only. .rh-rail__search has font:inherit, text-align:left and cursor:pointer, and no descendant input rule exists. No .rh-rail markup appears in any snapshot. Say it is inferred.
6. Drop "L39 and L172 call .rh-cta and badges native". Those lines are still accurate. Primary .rh-cta keeps #3273dc/#fff with no dark variant. The changelog Download button is still "rh-cta matomo_download" (134x in changelog-4448). The Latest badge is still .rh-changelog__latest.
7. Status L155-L160: rename the channel to "New & Updated" (live tab and channel head). The rh-checkin__btn/--done absence rests on CSS only, because no logged-out page shows the check-in. Add RoutineHub-Reloaded-Theme-Audit.md:L89-L98 to location, since it repeats rh-checkin__btn and calls rh-endless-* feed infrastructure.
8. Recommendation: also list /login/?fallback=1, /register/?fallback=1 and /password_reset/?modal=true as auth surfaces. Track the L312-L314 label rule as a code fix, not only a doc rewrite.

</details>

<a id="m-18"></a>
### M-18. Profile docs, tracker and README describe markup and behavior that no longer exist

**Where.** [RoutineHub-Reloaded.md:L227-L276](RoutineHub-Reloaded.md?plain=1#L227-L276); [RoutineHub-Reloaded.md:L333-L343](RoutineHub-Reloaded.md?plain=1#L333-L343); [RoutineHub-Reloaded-Status.json:L267-L308](RoutineHub-Reloaded-Status.json#L267-L308)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact).  
**Effort.** S. **Confidence.** high. **Category.** docs.

**Evidence.** md L342 places the legend inside __chart and knows no __stage, __foot or __readout. L255-L256 parse counts from each cell's title. L229 and L238 list 7 stats, and L235-L236 claim unmapped labels are skipped. L333 calls the /new/ glyphs canonical. L341 has no .rh-num[data-rh-num] wrappers and no profile_* ids. L343 knows only .rh-price--free. Status L267 and L269 date the last check 2026-09-10 and call the page 'most rigorously verified'. L283 says 'Show 4 more stats', L288-L289 mark the condensed chart implemented, and the gaps at L270-L276 omit stage, readout, foot, l1-l4 and appcard-stats. Audit L40-L44 calls rh-segmented relevant to the Authored switcher, but all 16 of its rules are .membership-scoped. Audit L109-L111 says the pubgraph gaps matter only if the heatmap renders, and it does. Comments L99-L100, L727, L774-L776 and L845 and README L40-L41 are also stale.

**Impact.** The selector reference sends the next session to parse title and to look for the legend in __chart. The tracker reports a broken feature as implemented.

**Fix.** Update the selector rows. Cover stage, foot and readout, and the data-label formats ('No publishes on', '1 publish on', 'N publishes on'). Add the --future cell, the .rh-num wrappers and profile_* ids, Agents, the conditional Favorites and the paid .rh-price markup. Set the profile entry to needs_recheck with a dated note and mark the chart open_todo. Change the label to 'Show N more stats' and add the new gaps. Note that rh-segmented is membership-only. Recheck the README line after the fix.

<details><summary>Verification notes</summary>

**reproduce.** 1. Line refs. The title-parsing text is md L254-L256. The 7-stat list is md L228-L230; L229 alone names only 5.

2. Status L268 already reads colors_styling 'needs_recheck', set by the 2026-09-13 reset. Do not 'set' it again. Replace the L269 note and update last_checked (L267) with a dated note.

3. Drop 'foot' from the omitted gaps. .rh-pubgraph__foot has only a layout rule (display:flex) and no dark-theme rule in main.min.261102-102115.css. The other four are valid:
- stage has a dark rule (background #282128).
- readout has dark rules (color #8e8e8e, strong #dcdcdc).
- appcard-stats has a dark rule (color #727272) and is present on both Authored grids.
- l1-l4 have a dark rule (background #eb9796), but it uses plain html[data-theme=dark], not :where(...). The audit's documented regex would miss it.

4. rh-segmented. The CSS has 12 rule blocks (16 selector occurrences), not 16 rules. All are .membership-scoped. The same Authored-switcher suggestion is repeated at Status L32 and L298; update those too.

5. Do not 'add the --future cell'. L342 already lists '--l0..l4|future'. What is missing:
- The future cell has no data-label; 370 of the 371 week cells have one.
- The 5 legend swatches also carry .rh-pubgraph__cell, so a card-wide query returns 376.
- The months row starts with .rh-pubgraph__daylabel-spacer.

6. L235-L236. The skip itself still happens: the code inserts no icon. The wrong part is 'rather than left iconless-but-broken'. splitStatsOverview moves the unmapped Agents and Favorites tiles into the label-hidden secondary grid, where they show as bare numbers.

7. L333. The four Share glyphs still match /new/: fa-bolt, fa-terminal, fa-scroll, fa-puzzle-piece. The stale parts are:
- Cherri is now an inline SVG .rh-cherri-glyph, and fa-code has 0 hits.
- 0 of 16 .rhnew-card carry inline style.
- The spans now have classes: rhnew-card__icon, __body, __name, __desc.
- /new/ loads logged out.
- /new/ has no Agents card, so it offers no glyph for the Agents stat.

8. Paid .rh-price. Neither profile's Authored grid has a paid card: tojioo has 9 of 9 and gluebyte 18 of 18 as .rh-price--free. Document the paid form as seen in search-weather.html (L2886, L3293, L3570) and on 26376, and mark it unverified on a profile.

9. Add these stale spots:
- md L41 (Pages covered table) says 'Show 4 more stats'.
- Status L279-L280 marks stat icons 'implemented' while Agents and Favorites have none.

10. The README exists only on origin/claude/github-repo-documentation-7o6b3u, not on main.

**impact.** 1. Evidence L333: the canonical claim still holds. /new/ still uses fa-bolt, fa-terminal, fa-scroll and fa-puzzle-piece, matching addStatIcons. The stale parts of L333 (and of L36, L87 and L334) are these:
- The cards are no longer inline-styled: 0 [style] attributes inside .rhnew-wrap.
- The spans and heading now have classes: .rhnew-card__name, .rhnew-card__desc, h1.rhnew-title, p.rhnew-sub.
- /new/ returns 200 when logged out.
- Cherri now uses an inline SVG .rh-cherri-glyph, not fa-code.
- /new/ has no Agent card. The site uses fa-robot for Agents (homepage .rh-ai-tile--agent, and 18 times on /agents/).
2. Evidence L235-L236: the line accurately describes the code. Restate it as: the docs omit that skipped tiles (Agents, Favorites) land in .rh-stats-secondary, where labels are visually hidden (L128-L138), so they show as a bare number.
3. Evidence rh-segmented: say "16 selectors in 12 rule blocks", not "16 rules". Add that Status L32 and L298 repeat the suggestion.
4. Recommendation, --future: drop "Add the --future cell", because L342 already lists --l0..l4|future. Instead document two things: the future cell has no data-label, and the 5 legend swatches also carry .rh-pubgraph__cell. Cell queries must therefore be scoped to .rh-pubgraph__week, as the site's own JS does.
5. Recommendation, needs_recheck: drop "Set the profile entry to needs_recheck", because Status L268 already is. Update last_checked and colors_note only.
6. Recommendation, gaps: drop "foot" from the new gaps, because it has no dark-theme rule. The dark-theme gaps missing from Status L270-L276 are:
- rh-pubgraph__stage (#f4f4f6 light, #282128 dark)
- __readout
- __cell--l1 to --l4
- rh-appcard-stats (already listed at Audit L99-L100)
7. Recommendation, pubgraph row: add that __foot sits outside __scroll and stays visible in the condensed view.
8. Location: add these entries:
- RoutineHub-Reloaded-Theme-Audit.md:L40-L44 and L109-L111
- RoutineHub-Reloaded-Status.json:L32 and L298
- RoutineHub_Enhancer.user.js:L99-L100, L727, L774-L776 and L845
9. README: it lives on the unmerged branch origin/claude/github-repo-documentation-7o6b3u. It is accurate once F2 is fixed, so it only needs a recheck.

</details>

## Low findings

<a id="l-01"></a>
### L-01. splitStatsOverview hides all stats when no primary label matches, despite the documented no-op

**Where.** [RoutineHub_Enhancer.user.js:L742-L746](RoutineHub_Enhancer.user.js#L742-L746)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** correctness.

**Evidence.** The primary set filters on exact label text. The only early exit is !secondary.length (L744). md L247-L248 promises a no-op when none of the primary labels are found. jsdom on profile-tojioo and profile-gluebyte with Followers, Following and Downloads renamed: 0 primary tiles, all 8 or 9 tiles hidden, toggle reads 'Show 8 more stats' or 'Show 9 more stats'. Renaming a single label demotes that stat without notice.

**Impact.** A label rename on the site leaves Author Overview empty behind a toggle. The site has already changed this strip twice.

**Fix.** Return before setting rhSplit when primary.length !== PRIMARY_LABELS.length, or at least when it is 0.

<a id="l-02"></a>
### L-02. Search results page and the overlay browse panel keep the site's own palette

**Where.** search-weather: .rh-search-form, .rh-creator-card, .rh-pill--creator, .rh-pf-label; all pages: #rh-browse .rh-browse__card  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** M. **Confidence.** medium. **Category.** theme-coverage.

**Evidence.** search-weather uses 59 rh- classes. The script references 13 of them, and 20 unreferenced ones carry site dark rules. In dark, .rh-search-form, its input and .rh-creator-card keep #1f191f on the #0C1311 page. .rh-pill--creator stays #2b241c with #c2410c text at 2.96:1 (site-native). In the mixed state, the form and cards turn #fff and the pill #fff7ed. .rh-pf-label renders #555 on #0C1311 at 2.52:1 (15 on search, 18 each on /skills/ and /agents/), and .rh-search__summary reaches 3.89:1. #rh-browse is built from /nav/browse.json at runtime: .rh-browse__card is #fff or #1f191f, and .rh-browse__sections #fafafb or #231d23. a.rh-browse__row turns teal via L315, 1.79:1 on white. No script rule mentions rh-browse or rh-search.

**Impact.** Search is a primary flow. In dark mode it shows purple-gray boxes inside the teal theme. In the mixed state its labels fall below 3:1.

**Fix.** Add .rh-search-form, .rh-creator-card and .rh-browse__card to the card surface and border rules. Put .rh-browse__sections and __hints on surface-2. Put .rh-search__summary, .rh-pf-label, .rh-browse__title and __kind in the muted tier, and .rh-creator-card__name and .rh-browse__row in the text tier. Verify the panel in a rendered session.

<a id="l-03"></a>
### L-03. No update channel or stable identity, so fixes cannot reach installed copies

**Where.** [RoutineHub_Enhancer.user.js:L1-L9](RoutineHub_Enhancer.user.js#L1-L9); README.md (branch):L28-L31  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** M. **Confidence.** high. **Category.** packaging.

**Evidence.** The header declares only @name, @version, @license, @author, @description, @match and @grant. It has no @namespace, @downloadURL, @updateURL, @homepageURL, @supportURL, @noframes or @icon, and no repo file holds an install URL. Tampermonkey updates only scripts installed from a URL; pasted or file-imported copies never update. Userscripts checks only scripts that declare @updateURL or @downloadURL. The branch README links ./RoutineHub_Enhancer.user.js, which opens the GitHub blob page that managers do not intercept. It names only Tampermonkey and Violentmonkey, while the owner uses a Safari manager. Raw URLs do not follow renames, and RoutineHub has no listing type for userscripts.

**Impact.** Every fix, the XSS fix included, needs a manual reinstall on each device, the owner's iPhone too. Once an update URL exists, anyone who can push to it can run code in an origin that offers wallet key export.

**Fix.** Freeze the final file name first. Then add @namespace https://github.com/Tojioo/RoutineHub-Reloaded, @homepageURL, @supportURL, @noframes, and @downloadURL/@updateURL pointing at the raw file on a protected release branch or tag (the repo must be public). Avoid release-asset links for iOS. Link the raw URL in the README and add iOS (Userscripts) and Chrome MV3 (Developer Mode or Allow User Scripts) steps. Bump @version on every change and keep @grant minimal. Enable 2FA and branch protection. Test one in-place update on the iPhone. A GreasyFork mirror is optional.

<a id="l-04"></a>
### L-04. Planned 1.0 rename creates a second script identity, and double runs are not guarded

**Where.** [RoutineHub_Enhancer.user.js:L2](RoutineHub_Enhancer.user.js#L2); [RoutineHub_Enhancer.user.js:L166-L183](RoutineHub_Enhancer.user.js#L166-L183); [RoutineHub-Reloaded.md:L3-L5](RoutineHub-Reloaded.md?plain=1#L3-L5)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** packaging.

**Evidence.** Docs plan to rename @name to RoutineHub Reloaded at 1.0.0. There is no @namespace. Tampermonkey 5.4.1 (getUidsByName), Violentmonkey and Userscripts identify a script by name plus namespace or by filename, so the rename installs a second entry. Running the script twice (probe.js, double-install-probe.js) reorders the homepage to Recently Updated, Heatseekers, Best Sellers, Top Shortcuts, New Shortcuts. It also doubles style tags (4 to 8), observers (6 to 12, or 7 to 14 on shortcut pages) and debug lines (2 to 10). Other features stay single because of their dataset guards. gluebyte's v1.2 contains the same reorder, so anyone still running it gets the double reorder today. The name is spelled four ways: @name, file name, docs L404, repo/README.

**Impact.** At 1.0.0 every tester runs the old and new copies side by side: scrambled homepage, doubled CSS and observers, and no visible error.

**Fix.** Change the identity once: new @name, @namespace, final file name (e.g. RoutineHub-Reloaded.user.js), class prefix and update URLs in one release. Optional bridge: one release under the old name that only adds update URLs pointing at the final path. Add a run-once guard (document.documentElement.dataset.rheLoaded) and mark the container after reordering. README: tell users to remove RoutineHub Enhancer and Dark Mode RoutineHub first.

<a id="l-05"></a>
### L-05. 1.0.0-alphaN misorders across managers, and the version table starts with 1.0.0

**Where.** [RoutineHub_Enhancer.user.js:L3](RoutineHub_Enhancer.user.js#L3); [RoutineHub-Reloaded.md:L70-L93](RoutineHub-Reloaded.md?plain=1#L70-L93)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** packaging.

**Evidence.** Tampermonkey 5.4.1's comparator orders the alphas correctly. Semver comparison (Violentmonkey, npm semver) puts alpha10 below alpha9 and alpha23 below alpha3. Integer-per-part comparison (Userscripts style) treats all alphas as equal and never offers an update, not even to 1.0.0. The table's first two rows (L70-L71) are labeled 1.0.0 ('no version bump'), which outranks every alpha, and then run from 1.0.0-alpha3 to alpha24. alpha1 and alpha2 are missing, and no row has a date. @version says alpha23 while the table ends at alpha24. 1.0.0-beta.1 and 1.0.1 compare as newer in all three schemes.

**Impact.** This is harmless until an update URL exists. After that, Violentmonkey users stop updating past alpha9, Userscripts users (the owner's iPhone) get nothing, and anyone on the original 1.0.0 sees every alpha as a downgrade. The history also cannot be matched to dated site changes.

**Fix.** Drop pre-release suffixes, or use dot-separated counters such as 1.0.0-beta.1. Prefer plain MAJOR.MINOR.PATCH if the iPhone manager compares naively, and make the first release with an update URL 1.0.1 or require one reinstall. Rename the first two rows to alpha1 and alpha2 or 'fork baseline', and date every row. Never reuse a version. Have CI fail any script change without a version bump.

<a id="l-06"></a>
### L-06. gluebyte's MIT copyright notice is missing; main and the installed file carry no license text

**Where.** [RoutineHub_Enhancer.user.js:L1-L14](RoutineHub_Enhancer.user.js#L1-L14); LICENSE (branch claude/github-repo-documentation-7o6b3u):L3-L5  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** license.

**Evidence.** The header has @license MIT, @author Tojioo and 'Based on Dark Mode RoutineHub by gluebyte (MIT)' linked to his profile. It has no copyright line and no permission text. main (914913f) has no LICENSE or README. The branch LICENSE reads 'Copyright (c) 2026 Tojioo' and mentions gluebyte without his copyright line. README L8-L10, L58-L59 and md L20 credit only v1.1. Yet L168-L175 port v1.2 code verbatim, and alpha17 adopted v1.2 selectors. The README link points to a profile that lists no such item. The upstream source could not be checked offline.

**Impact.** MIT requires the original notice in all copies or substantial portions. Installed copies never carry a LICENSE file, so derived code ships without either notice.

**Fix.** Copy gluebyte's copyright line verbatim from the upstream header into LICENSE above Tojioo's. If upstream has only @author, use 'Copyright (c) &lt;year&gt; gluebyte'. Add both copyright lines and the MIT permission text to the script header. Credit v1.1 and v1.2, link the real upstream source, confirm v1.2 is still MIT, and merge to main.

<a id="l-07"></a>
### L-07. README and LICENSE sit on an unmerged branch and need fixes before merge

**Where.** git: origin/claude/github-repo-documentation-7o6b3u 396c0c3; README.md:L28-L38  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** repo-process.

**Evidence.** git diff main..branch shows README +59 and LICENSE +23, authored 2026-09-22. main has neither file. README L28-L31 links the blob page instead of a raw install URL and names no iOS manager. L37-L38 calls the owner-only stats endpoints public. The LICENSE omits gluebyte's copyright line. The README contains 3 em dashes. The branch commit uses a personal email, while main uses the GitHub noreply address.

**Impact.** main shows no license and has no landing page. Merging as is would publish a broken install link and a personal email.

**Fix.** Fix these on the branch. Then squash-merge through the GitHub UI under the noreply identity and delete the branch. Use the raw link or the final @downloadURL, list iOS managers, describe the endpoints as owner-only, add gluebyte's copyright line and rephrase the em dashes.

<a id="l-08"></a>
### L-08. No CI, lint or tests; the one documented check fails

**Where.** [RoutineHub-Reloaded.md:L399-L405](RoutineHub-Reloaded.md?plain=1#L399-L405); repo root  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** M. **Confidence.** high. **Category.** repo-process.

**Evidence.** Doc L404 runs node --check on 'RoutineHub Enhancer.user.js', which fails with MODULE_NOT_FOUND; the real file passes. The repo has no .github, package.json, tests, lint config, .gitattributes, .editorconfig or .gitignore, and all 4 files are i/lf w/crlf. The harness and the audit extractor live outside the repo. A prototype jsdom suite over 32 fixtures (about 10 s) fails 9 of 17 checks on known live defects: debug output, theme, toggles, icons, pubgraph, XSS and reorder idempotence. jsdom cannot parse the nested dark block, so CSS checks need a browser engine. A cascade contrast scan found every contrast regression in this review in under 2 minutes. Screenshots missed the alpha22 .rh-cta flip and the native-dark label and input breaks. Status plans more API rendering. Three constant innerHTML writes remain (L553, L630, L905) and would break under Trusted Types. The site has shipped at least 5 CSS builds since 2026-09-05.

**Impact.** Site drift and regressions stay unnoticed until a manual review. A refactor could bring back an HTML sink unnoticed.

**Fix.** Add package.json (eslint, eslint-plugin-no-unsanitized, eslint-plugin-userscripts, jsdom, @playwright/test) and a CI workflow with four steps. (1) node --check. (2) ESLint with no-unsanitized/property and /method plus no-console. (3) The jsdom suite on scrubbed fixtures, including an XSS probe. (4) Playwright Chromium and WebKit computed-style and contrast checks in all 4 OS x data-theme states. Add a weekly drift job over 5 public pages, 3 s apart, that counts a Cloudflare challenge as skipped. Generate markup through one el(tag, cls, text) helper. Add .gitattributes (* text=auto eol=lf), .editorconfig and .gitignore. Fix the L404 command.

<a id="l-09"></a>
### L-09. Dark block depends on relaxed CSS nesting; older engines drop all or most of it

**Where.** [RoutineHub_Enhancer.user.js:L240-L458](RoutineHub_Enhancer.user.js#L240-L458)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** compatibility.

**Evidence.** The dark block is one html.rhe-dark { } rule with 41 nested rules and no top-level semicolons. Three nested rules start with a type selector: L270 body, L274 body strong and L315 a. nesting-sim.js shows: relaxed nesting (Chrome/Edge 120+, Safari/iOS 17.2+, Firefox 117+) keeps all 41. Strict nesting (Chrome 112 to 119, Safari 16.5 to 17.1) keeps only the 4 toggle rules, because L270 parses as a declaration and swallows the rest of the block. Engines without nesting (Chrome 109 on Windows 7/8.1, Firefox ESR 115, Safari 16.4 and older) keep none. md L153-L160 rejected &-prefixing for convenience. The browser-check skill renders current engines with an iOS 17.0 UA, so it cannot reproduce this. Old engines were not tested.

**Impact.** On these engines dark mode fails silently. With strict nesting the toggle looks dark while the page stays native.

**Fix.** Flatten the block by prefixing every selector with 'html.rhe-dark '. Specificity stays the same and it works everywhere. Minimum fix: '& ' before L270, L274 and L315. State the supported browser versions in the README.

<a id="l-10"></a>
### L-10. Theme audit is stale, not reproducible, and blind to plain selectors and cascade conflicts

**Where.** [RoutineHub-Reloaded-Theme-Audit.md:L3-L21](RoutineHub-Reloaded-Theme-Audit.md?plain=1#L3-L21); [RoutineHub-Reloaded-Theme-Audit.md:L180-L186](RoutineHub-Reloaded-Theme-Audit.md?plain=1#L180-L186)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** M. **Confidence.** high. **Category.** docs.

**Evidence.** The audit ran on 2026-09-11 against main.min.260911-200127.css. The live build is 261102-102115. The doc and Status stylesheet_audit (L8-L28) report 675/71/395/209. Reruns give 868 to 885 classes, overlap 87 to 99 and an rh- gap of 524 to 537. 175 unreferenced rh- classes (89 blocks) appear in no doc. Examples: rh-earn-* (57 to 59), moderation states (15), rh-intent and rh-keep (14), rh-apps-card (12), rh-ad-overlay (12), achievements (9 to 10). Several of these are live: rh-wall-* (8), creator search (8), deal sheet (7), pubgraph rework (6), rh-qr, rh-health__seg and rh-anchor (6). rh-checkin__btn and its --done modifier no longer exist but are still listed (doc L89, Status L121-L122). The noise bucket hides creator forms: shortcut-create* (26), version-form* (14), rhb-* (34) and the live rhnew-* (7). The :where-only regex misses 57 plain html[data-theme=dark] selectors, 17 of whose classes appear nowhere else, the toggle parts and pubgraph l1-l4 among them. It also misses 22 element-only rules (html, body, a, input, hr, img, ::selection). It cannot see cascade conflicts such as the 7 native !important dark declarations. No script or class list is committed, and L185-L186 says to ask for a rerun.

**Impact.** Planning relies on a September picture. Creator forms are filed as noise, and cascade breakage such as the CTA and label cases stays invisible.

**Fix.** Commit the extractor (e.g. tools/theme-audit.py) and make it cover both selector forms and element-only rules. Save a class list per build (theme-audit/&lt;build&gt;.txt) so diffs are exact. Flag native !important rules that compete with a script !important on the same element and property. Add a live-presence column from the snapshots. Rerun whenever the CSS build name changes and date each run. Split vendor classes from site classes and drop the rh-checkin__btn entries.

<a id="l-11"></a>
### L-11. Status tracker is stale and misses most of the current public site

**Where.** [RoutineHub-Reloaded-Status.json:L4-L353](RoutineHub-Reloaded-Status.json#L4-L353)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** M. **Confidence.** high. **Category.** docs.

**Evidence.** Last reset 2026-09-13. All 15 pages are needs_recheck, and 13 have last_checked null. Profile was last checked 2026-09-10, yet L269 calls it the most rigorously verified page. There are no rows for /skills/, /agents/, the skill, prompt, agent, plugin, model and cherri detail pages, /sell/ (53 classes), /membership/, /changelog/ or /blog. 'Agent', 'Model', 'Favorites' and 'JellyCuts' appear nowhere. L155 'Shortcut Feed channel' is the live tab 'New & Updated'. md L47 and L314 say 'My Orders (beta), Shortcut Sign (beta)', while L5 says 'My Purchases' and 'HubSign'. 'Changelog quick access button' is listed twice (L59-L62, L203-L206). Class diffs show that category pages share the Discover template. Search does not (+24 classes).

**Impact.** The tracker cannot steer work, yet the README still calls it frequently updated.

**Fix.** Run one dated sweep from the snapshots. Add rows for the new content types and listings under the site's own labels. Remove the duplicate entry and record last_checked per page. Settle the channel entries with the class-diff evidence. Add a column marking pages reachable logged out.

<a id="l-12"></a>
### L-12. Homepage docs claim clean coverage and omit the reorder and View removal

**Where.** [RoutineHub-Reloaded.md:L31](RoutineHub-Reloaded.md?plain=1#L31); [RoutineHub-Reloaded.md:L46-L50](RoutineHub-Reloaded.md?plain=1#L46-L50); [RoutineHub-Reloaded.md:L88](RoutineHub-Reloaded.md?plain=1#L88)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** M. **Confidence.** high. **Category.** docs.

**Evidence.** md L31 says the homepage AI tiles and listings are confirmed clean. The tiles fail (see the link rule finding), and Status L97 says the Stories carousel, Build with AI band, .rh-aicard grids and Best Sellers were never checked. All four exist live. L46 and Status L317-L319 say search and category pages share the Discover template; only category does. L50 claims every logged-out page was swept, but /skills/, /agents/, /prompts/, /plugins/, /models/ and /cherri/ appear in no doc. L88 says the current-page highlight is left alone, yet its text turns teal. The reorder (L167-L183) and View removal (L166) appear in no doc, Status or README. The View removal takes home from 18 and 168 labels to 0 and skill-detail from 6 to 0. The README credits v1.1, but the reorder comes from v1.2.

**Impact.** Readers treat the AI band and search page as done and cannot tell whether the reorder result is a regression or the goal.

**Fix.** Bring L31, L34, L46, L50 and L88 in line with the tracker. Add the AI listings and search as separate Status entries. Decide the intended section order and the View removal scope. Then document both in the code docs, version history and README.

<a id="l-13"></a>
### L-13. /new/ is redesigned and public; picker rules, comments and docs rest on old inline-styled markup

**Where.** [RoutineHub_Enhancer.user.js:L347-L374](RoutineHub_Enhancer.user.js#L347-L374); [RoutineHub-Reloaded.md:L333-L334](RoutineHub-Reloaded.md?plain=1#L333-L334)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** live-drift.

**Evidence.** /new/ returns 200 logged out. It uses .rhnew-head &gt; h1.rhnew-title + p.rhnew-sub, 5 h2.rhnew-section__title and 16 cards with .rhnew-card__icon/__body/__name/__desc/__chev, plus .rhnew-card--locked and .rhnew-card__pill. .rhnew-wrap contains no style attributes. Site CSS has 42 .rhnew rules, 8 of them dark. Comments L347-L352 and L363-L368 and md L36, L87 and L333-L334 still describe inline colors, unclassed spans and 'requires auth'. The structural selectors (L357, L372) match only by coincidence. .rhnew-card &gt; span:last-of-type &gt; span paints both name and desc #CBD9D7, while site dark uses #e4e4e4 and #909090. It also erases the muted state of the locked Virtual Machine card. Cards get --rh-bg, so only a 1px border separates them from the page. Cherri uses an inline SVG, not fa-code, JellyCuts an image and VM fa-server. No contrast regression.

**Impact.** Brittle selectors, a flatter hierarchy than native dark, and a misleading selector reference and icon list. Section titles stay unthemed in the mixed state.

**Fix.** Target .rhnew-title, .rhnew-sub, .rhnew-card__name and .rhnew-card__desc (muted tier) and .rhnew-section__title directly. Give cards surface-1 and keep the locked state muted. Rewrite the comments and md lines, remove 'requires auth' and refresh the icon list.

<a id="l-14"></a>
### L-14. README and @description misstate features and cover only desktop install

**Where.** README.md:L37-L43; [RoutineHub_Enhancer.user.js:L6](RoutineHub_Enhancer.user.js#L6)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to low.  
**Effort.** S. **Confidence.** high. **Category.** docs.

**Evidence.** README L37-L38 says the stats come from RoutineHub's 'public endpoints'. The card renders only when the owner-only .rh-stats-card exists (L607-L621, Status L226 'owner only', 0 of 32 snapshots). The fetch sends credentials: 'same-origin', and stats-4448 returns 403 logged out. L42-L43 says the theme is synced to both the OS and the site toggle. The actual rule is an OR, so a dark OS overrides a light choice. L40-L41 advertises the condensed chart, which renders flat. The README omits the Required Apps swap, Free badge removal, homepage reorder and View removal. Install (L28-L31) names only Tampermonkey and Violentmonkey and links the repo file instead of the raw file. @description (L6) and comment L13-L14 list only changelog access and collapsible comments, and there is no @icon. md L404 names the wrong file.

**Impact.** Visitors expect a stats card they will never see and a theme that follows the site toggle. The 'public' claim misstates how sensitive the data is. If the endpoints really were public, that would be a RoutineHub leak to report.

**Fix.** Describe it as an owner-only stats card fed by the endpoints behind RoutineHub's analytics page. Check once while logged out: curl -s -o /dev/null -w '%{http_code}' https://routinehub.co/shortcut/&lt;id&gt;/get-visit-stats. If it returns data, report that privately to RoutineHub. State the theme rule exactly and list every page change. Add an iPhone install line with a raw link. Rewrite @description as one line and add @icon.

<a id="l-15"></a>
### L-15. Reply toggles capture a static list: counts go stale, new replies escape, deep links land nowhere

**Where.** [RoutineHub_Enhancer.user.js:L867-L941](RoutineHub_Enhancer.user.js#L867-L941)  
**Check.** Confirmed by 1 skeptic check (reproduce).  
**Effort.** M. **Confidence.** medium. **Category.** correctness.

**Evidence.** L895 captures a static NodeList. L896 and L873 skip threads already processed, and labels use replies.length. On shortcut-26376 a reply appended to a collapsed thread stayed visible through expand and collapse, sat below the toggle, and the label stayed 'View 4 replies'. The site deletes closest('.media'). After one delete on 19090 the toggle read 'Hide 7 replies' with 6 left. After flattening, deleting reply 44948 removes 1 article where the nested original removed 2. Collapse-all reads its state from its own label (L932). After all 22 threads were expanded by hand, the first click only flipped the label. The toggle is appended after the replies, and one 19090 thread has 15. Nested reply #feedback-44949 is hidden, so a #feedback-&lt;id&gt; link cannot scroll to it (link format unverified). Exposure is small: replies post via a plain form, and archived loads are handled.

**Impact.** After deletes, counts go stale and replies get orphaned until reload. Collapse-all wastes a click, collapsing long threads needs a scroll, and notification deep links may land nowhere.

**Fix.** Query replies at click time and recompute labels in refreshComments. Re-hide new replies of collapsed threads, and re-flatten threads that gain nested articles. Derive the collapse-all state from the toggles and refresh its label. Insert each toggle after .content. Expand the thread that holds location.hash on load and on hashchange.

<a id="l-16"></a>
### L-16. Free stats card fails as a whole, mis-tests empty data and can hang on 'Loading…'

**Where.** [RoutineHub_Enhancer.user.js:L646-L677](RoutineHub_Enhancer.user.js#L646-L677)  
**Check.** Confirmed by 1 skeptic check (reproduce).  
**Effort.** S. **Confidence.** high. **Category.** correctness.

**Evidence.** jsdom with a synthetic .rh-stats-card on shortcut-4448. Engagement OK plus visits 403 shows 'Couldn't load stats.' although hearts and feedback arrived, because of Promise.all. With only direct and internal counts the card is removed, since L662 ignores both. A top_referrers object throws '.slice is not a function' after the try/catch. The rejection goes unhandled and the card stays on 'Loading…'. The feature is owner-only, so none of this is verifiable logged out.

**Impact.** In partial-failure cases the owner sees no stats or a permanent loading state.

**Fix.** Use Promise.allSettled and render whatever arrived. Count all entry fields in the empty test. Check Array.isArray(top_referrers). Keep the rendering inside the try.

<a id="l-17"></a>
### L-17. Temporary debug and navbar observers run on every page, log noise and force style reads

**Where.** [RoutineHub_Enhancer.user.js:L484-L534](RoutineHub_Enhancer.user.js#L484-L534); [RoutineHub_Enhancer.user.js:L959-L960](RoutineHub_Enhancer.user.js#L959-L960)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** repo-process.

**Evidence.** Harness: 2 '[RHE debug]' lines on all 32 pages. Each page has 6 never-disconnected MutationObservers, 7 with #feedback. 5 come from keepNavbarThemedDuringSearch and debugNavbarSearchIssue, which watch navbar, menu, search and body for class and style. Each debug callback logs 2 lines and calls getComputedStyle 3 times. One .search toggle gave 8 lines and 9 reads in jsdom. That count is inflated by identical inline-style rewrites from enforce(), which browsers usually skip; expect about 20 lines and 30 reads per 10 toggles. Triggers include the hamburger, body overflow changes, rh-intent-open and rh-pay-sheet-open. The 3 init reads (L525) run right after 18.2 KB of CSS and force a full style recalc mid-script on every load. md L60 and the alpha23 entry already mark both functions for removal.

**Impact.** Console noise and repeated forced style flushes for diagnostics that cannot find the cause.

**Fix.** Delete debugNavbarSearchIssue and its call. Delete keepNavbarThemedDuringSearch once the backdrop rule lands, leaving 1 or 2 observers. If diagnostics return, gate them behind localStorage.getItem('rheDebug') === '1' and watch body childList.

<a id="l-18"></a>
### L-18. #feedback observer reruns full passes on unrelated mutations and on its own changes

**Where.** [RoutineHub_Enhancer.user.js:L953-L974](RoutineHub_Enhancer.user.js#L953-L974)  
**Check.** Confirmed by 1 skeptic check (reproduce).  
**Effort.** S. **Confidence.** high. **Category.** performance.

**Evidence.** The observer uses childList plus subtree on #feedback and runs a full refreshComments for every batch. That includes updateLabel's own innerHTML (L905) and the site's 'Cancel reply', 'Hide Archived Comments' and hide/unhide text writes. feedback-passes.js timings (jsdom, ms). shortcut-19090 (84 ids): toggle tap 11.8, Reply text 7.5, Expand all 13.8. shortcut-4448 after a simulated 545-comment archived load: 2 passes (385.3 and 61.4, the second a no-op rescan of its own moves). After that load: toggle 65.1, Reply 62.6, Expand all 82.1. A filtered variant costs 0 to 2.5 per interaction and needs 1 load pass for the same result.

**Impact.** Per-tap work grows with loaded comments, about 5x from 84 to 630 articles. On iPhone expect a few ms per tap and tens of ms per archived load.

**Fix.** Act only when an added node is or contains article.media[data-feedback-id]. Disconnect before refreshComments, then call takeRecords and observe again. Optionally process only the added subtree, or use one delegated click listener.

<a id="l-19"></a>
### L-19. No fallback when GM.addStyle is missing, so the script only toggles a class

**Where.** [RoutineHub_Enhancer.user.js:L8](RoutineHub_Enhancer.user.js#L8); [RoutineHub_Enhancer.user.js:L66](RoutineHub_Enhancer.user.js#L66); [RoutineHub_Enhancer.user.js:L190](RoutineHub_Enhancer.user.js#L190); [RoutineHub_Enhancer.user.js:L240](RoutineHub_Enhancer.user.js#L240); [RoutineHub_Enhancer.user.js:L943](RoutineHub_Enhancer.user.js#L943)  
**Check.** Confirmed by 1 skeptic check (reproduce).  
**Effort.** S. **Confidence.** high. **Category.** compatibility.

**Evidence.** The only grant is GM.addStyle, called directly four times. gm-api-probe.js: without a GM object, L66 throws 'GM is not defined'. With a GM object that lacks addStyle (Greasemonkey 4), it throws 'GM.addStyle is not a function'. In both cases only rhe-dark gets set. There are 0 style tags and no changelog button, metadata, reply toggles or stat icons. If GM.addStyle rejects, 4 rejections go unhandled. Tampermonkey exposes both forms. Userscripts exposes only GM.*.

**Impact.** On Greasemonkey 4 and on managers without GM.*, the script is inert.

**Fix.** Add @grant GM_addStyle and a helper. Use GM.addStyle if it is a function, else GM_addStyle, else append a &lt;style&gt; to document.head or documentElement. Attach .catch to returned promises. Wrap each feature call.

<a id="l-20"></a>
### L-20. Runs on every routinehub.co path, including wallet, payment and API key pages

**Where.** [RoutineHub_Enhancer.user.js:L7-L9](RoutineHub_Enhancer.user.js#L7-L9)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** security.

**Evidence.** @match is https://routinehub.co/* (L7). Every feature only checks whether its elements exist (L958-L974). L166 removes elements sitewide. The debug observers attach everywhere: 6 to 7 observers and 2 debug lines on all 32 pages. The same origin serves /wallet/dashboard/, /wallet/export/, /wallet/send/transaction/, /api/v2/payments/*, /settings-api, /forms/settings-api/ and moderation buttons. Theme-Audit L50-L58 lists API key rows (rh-keys) and sandbox SSH panels.

**Impact.** No misbehavior there today. A future sink or selector collision would also run on the key export and payment screens.

**Fix.** Keep CSS sitewide. Gate DOM features by pathname: shortcut features on /^\/shortcut\/\d+\/?$/, profile features on /^\/user\/[^/]+\/?$/. Add @exclude for /wallet/*, /api/*, /forms/* and /settings* unless they need theming, and add @noframes. Remove debugNavbarSearchIssue.

<a id="l-21"></a>
### L-21. Owner analytics are injected expanded at the top of the shortcut page

**Where.** [RoutineHub_Enhancer.user.js:L623-L631](RoutineHub_Enhancer.user.js#L623-L631)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** medium. **Category.** security.

**Evidence.** exp-position.js: on shortcut-4448 the card lands right after the hero CTA row, before the promoted Required Apps. On 26376 the first-.rh-card fallback puts it before Description. The docs verify through screenshots, view-source PDFs and saved authenticated exports (md L47, L92, L386). Page HTML carries a csrfmiddlewaretoken in every reply form; 9 snapshot pages have one even logged out. No session-replay tooling was found, and Matomo tracks page views and links only.

**Impact.** Routine screenshots and exports of the owner's pages show referrer domains and entry counts. These can reveal private sites that link to the shortcut. Exports also carry a CSRF token that likely stays valid until the next login.

**Fix.** Render the card collapsed behind a 'Show stats' button or below the fold. Redact .rh-free-stats and csrfmiddlewaretoken values before sharing an export. Keep exports out of the repo.

<a id="l-22"></a>
### L-22. Skill, Prompt, Agent, Plugin, Model, Cherri, Sell and Membership pages get only generic theming

**Where.** [RoutineHub_Enhancer.user.js:L270-L273](RoutineHub_Enhancer.user.js#L270-L273)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** M. **Confidence.** high. **Category.** theme-coverage.

**Evidence.** rh- classes the script references per page: skill-detail 15 of 93, prompt 8 of 45, agent 7 of 37, plugin 8 of 66, model 6 of 27 and cherri 7 of 36, all generic. No rule covers rh-skill-*, rh-wall-*, rh-platform-badge, rh-detail-header, rh-btn, rh-uwc-*, rh-modelfacts, rh-modeltags or rh-comments. Text on non-palette backgrounds in default dark: skill-detail 57 of 137 (the #1f191f .rh-skill-canvas and the paywall), plugin 21 of 73, sell 24 of 44, membership 28 of 64, changelog-site 376 of 384. On changelog-site, .card gets a shadow and border but no background. Site bugs pass through: .rh-modeltags .t-cap #374151 on #0C1311 at 1.84:1, inline var(--rh-text-secondary,#6b7280) at 3.9:1, and .rhnew-card__pill and .rh-feed-post__type--post #4F46E5 on #1B1F2B at 2.61:1.

**Impact.** The pages stay readable through native dark rules, but they show the plum palette with teal links. The site's own contrast bugs remain.

**Fix.** Add .card, .modal-card-body, .rh-skill-canvas, .rh-wall-card, .rh-pay-sheet__panel, .rh-meter__pop, .rh-browse__card and .rh-checkin-board to the background lists. Set --rh-text-secondary under html.rhe-dark to rgba(203,217,215,.65). Give .t-cap a light color. Rerun the audit.

<a id="l-23"></a>
### L-23. Proof bar text keeps the site's light colors although the docs call it fixed

**Where.** home: .rh-proof-headline, .rh-proof-detail  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** medium. **Category.** theme-coverage.

**Evidence.** md L77 lists the proof bar's hardcoded text colors as fixed. Audit L114-L116 says they work through inheritance. The script targets only .rh-proof-bar (L270, L321, L330, L385-L387). The site sets .rh-proof-headline{color:#14261c} and .rh-proof-detail{color:#4a5c52} and lightens them only under :where(html[data-theme=dark]). In the mixed state the headline renders #14261c on #0C1311, near invisible, and the detail 2.64:1. Status L99-L100 correctly lists both as gaps.

**Impact.** In the mixed state the proof bar headline vanishes, while the docs say it is fixed.

**Fix.** Add both classes to the text rule at L388. Correct md L77 and audit L114-L116.

<a id="l-24"></a>
### L-24. Contact icons keep native circles; teal glyphs drop to 1.57:1 in the mixed state

**Where.** profile-tojioo: .rh-socials &gt; a.rh-social-icon  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** theme-coverage.

**Evidence.** The profile has 3 a.rh-social-icon (reddit, github, globe). Site CSS sets background #f0f0f0 and color #555, and #2d252d with #ababab in dark. No script rule covers them. The glyph takes the accent color from html.rhe-dark a: 8.29:1 on #2d252d, but 1.57:1 on #f0f0f0. Status L305-L307 tracks them as 'maroon circles', which they are not.

**Impact.** In default dark the circles are off-palette plum. With OS dark and site light the glyphs are nearly invisible.

**Fix.** Inside html.rhe-dark, give .rh-social-icon background surface-2 !important (accent 6.08:1) and :hover surface-1. Then mark the status note implemented.

<a id="l-25"></a>
### L-25. Heatseekers cards lose contrast, the growth highlight and the button outline on petrol

**Where.** [RoutineHub_Enhancer.user.js:L226-L230](RoutineHub_Enhancer.user.js#L226-L230); [RoutineHub_Enhancer.user.js:L274-L276](RoutineHub_Enhancer.user.js#L274-L276); [RoutineHub_Enhancer.user.js:L318-L320](RoutineHub_Enhancer.user.js#L318-L320)  
**Check.** Confirmed by 1 skeptic check (reproduce).  
**Effort.** S. **Confidence.** high. **Category.** accessibility.

**Evidence.** L318 sets .rh-topcard to #1D424A. The site's dark .rh-heat-detail #808080 reaches 4.09:1 on its native #251f25 but 2.75:1 on petrol (12 cards, e.g. '299 a week, from 74'). The growth label .rh-heat-growth ('+304%') also carries .rh-topcard-brief, so L274 replaces its orange #d98a00 with #CBD9D7. The 'Follow user' .button.is-dark gets the same #1D424A as the card, and its #17302D border is 1.29:1 against it. The reorder moves this section to third place.

**Impact.** Secondary stats fail AA, the growth cue disappears and the Follow button reads as plain text.

**Fix.** Move .rh-heat-detail and .rh-heat-tagline to the 0.85 tier (5.90:1 on petrol; the 0.65 tier gives 4.16:1). Exempt .rh-heat-growth from the brief rule. Give buttons inside .rh-topcard a surface-1 background or an accent border.

<a id="l-26"></a>
### L-26. Broad text rules flatten semantic colors on listing cards

**Where.** [RoutineHub_Enhancer.user.js:L274-L276](RoutineHub_Enhancer.user.js#L274-L276); [RoutineHub_Enhancer.user.js:L315-L317](RoutineHub_Enhancer.user.js#L315-L317)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** L274 includes .rh-price, which outranks the green .rh-price--free (#16a34a). Every shortcut Free badge turns #CBD9D7: 210 on home, 18 per listing page. AI cards use .rh-aicard-price--free, which the script never touches, so the homepage shows both looks. On /skills/ and /agents/ the platform chips (Claude #D97757, ChatGPT #10A37F, Gemini #4285F4 via --pf) turn teal through L315. Pagination keeps its maroon fill but gets teal text.

**Impact.** Free versus paid and platform cues weaken. The same badge has two looks on one page.

**Fix.** Decide per component. Keep .rh-price--free green (5.71:1 on #0C1311). Let .rh-platform-chip keep var(--pf). Make the current pagination text white.

<a id="l-27"></a>
### L-27. Listing card counts, inline code and section notes sit below 4.5:1

**Where.** listing and profile pages: .rh-appcard-stats; agents-listing: .rh-section-sub code  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** accessibility.

**Evidence.** .rh-appcard-stats (12px download and heart counts) keeps the site's dark #727272. That is 3.91:1 on #0C1311, against 3.99:1 on the site's own background. It appears 18 times per listing page, 60 on home, 80 on search, and 9 and 18 times on the two Authored grids. Status L185-L187 already lists it. Inline code: L318 sets the background to #1D424A but no text color, so #da1038 drops to 2.13:1 (native 3.07:1), e.g. '.claude/agents/' on /agents/. .rh-section-sub on AI listings uses inline #6b7280 at 3.89:1.

**Impact.** In dark mode, counts and notes on every card of every listing fail WCAG AA.

**Fix.** Add .rh-appcard-stats and .rh-section-sub to the 0.65 muted tier (about 6:1 on #0C1311). This fixes every grid at once. Give code an explicit text color such as var(--rh-text).

<a id="l-28"></a>
### L-28. Dead, stale and redundant selectors, including .notification-card and .notification-text

**Where.** [RoutineHub_Enhancer.user.js:L236-L320](RoutineHub_Enhancer.user.js#L236-L320)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** medium. **Category.** css.

**Evidence.** selmatch.js: 62 of the 216 script selectors match nothing in the 32 public snapshots. 28 are rail selectors (auth only), and others target AJAX or auth content. .notification-card (L270) and .notification-text (L274) appear in no page, in neither the site CSS (3,557 classes) nor the JS, so they are dead. Stale: .shortcut .description .content blockquote, because the wrapper is now .rh-description and the bare blockquote in L318 already covers it. Also .shortcut-card, .card-content nav/strong/small, .level-item and .heading. .search .button.is-dark (L236) is redundant. No selector sets the same longhand twice, but each component's dark styling is spread over 3 or 4 lists (L270, L318, L321, L330). Logged out, /notifications/ redirects to the homepage. The current CSS has 27 notification classes, 14 of them dark-gated. The logged-in page is unverified (Status L321-L324).

**Impact.** Review noise. Per-component changes need edits in several lists. The notifications page likely shows mixed palettes.

**Fix.** Look at the logged-in notifications page once, then remove the dead and redundant selectors. Mark auth-only selectors in a comment, and consider grouping dark rules by component. Capture /notifications/ logged in and check .rh-notif-card, .rh-notification__text, __chip and .rh-notif-empty.

<a id="l-29"></a>
### L-29. hr is painted with the light input color in dark mode

**Where.** [RoutineHub_Enhancer.user.js:L324-L326](RoutineHub_Enhancer.user.js#L324-L326)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** html.rhe-dark hr{background-color:#C7D6D4 !important} beats the site's html[data-theme=dark] hr{background-color:rgba(255,255,255,.09)}. The result is 2px near-white rules on #0C1311: 18 in skill-detail markdown, 1 to 4 on each shortcut page.

**Impact.** Harsh separators in skill and prompt content.

**Fix.** Give hr its own rule using the border token, or drop the override and keep the site's native value.

<a id="l-30"></a>
### L-30. Reply toggle stays underlined and its chevron never rotates

**Where.** [RoutineHub_Enhancer.user.js:L943-L951](RoutineHub_Enhancer.user.js#L943-L951)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** The site's a,a:link,a:visited{text-decoration-line:underline;text-underline-offset:5px} beats .rh-toggle-replies{text-decoration:none} (0,1,0): a:link is (0,1,1) and its dark variant (0,2,2). run-losses.js shows the loss on all 28 toggles across shortcut-4448, 19090 and 26376, in every theme state. The is-collapsed class has no CSS, so the chevron always shows ▾, although L951 makes it inline-block.

**Impact.** The toggle shows a faint offset underline, and the chevron does not show its state.

**Fix.** Target .rh-toggle-replies:link and :visited, or add !important. Add .rh-toggle-replies:not(.is-collapsed) .rh-toggle-replies__chevron{transform:rotate(180deg)}.

<a id="l-31"></a>
### L-31. Creator line loses meta typography after promoteCreatorLine

**Where.** [RoutineHub_Enhancer.user.js:L74](RoutineHub_Enhancer.user.js#L74); [RoutineHub_Enhancer.user.js:L602-L603](RoutineHub_Enhancer.user.js#L602-L603)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** The site styles .rh-hero-header__meta with font-size .82rem, color #777 and gap 14px. After the span moves into .rh-hero-header__body, it inherits 1em and the full text color (#CBD9D7 in dark). fontprobe.js confirms this for 'by @r07qxo Creator IS VERIFIED' on shortcut-4448. L74 sets only display and margin.

**Impact.** The creator line grows from about 13px muted text to 16px full-strength text. This may or may not be intended.

**Fix.** Decide whether that is intended. To keep the old look, add font-size:.82rem and the muted color to .rh-creator-line.

<a id="l-32"></a>
### L-32. Rail rules predate the site's tree links and locked states

**Where.** [RoutineHub_Enhancer.user.js:L434-L456](RoutineHub_Enhancer.user.js#L434-L456)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** medium. **Category.** live-drift.

**Evidence.** The current CSS adds .rh-rail__tree--channels, --creatorhub, --creatortools and --moderation, plus .rh-rail__treelink--channel and --locked. Active tree links use background:#1a1a1a;color:#fff, with no dark variant. The script styles only .rh-rail__link.is-active and .rh-rail__sublink.is-active (L441-L444), so an active channel shows a black block instead of the accent pill. L434-L436 force .rh-rail__treelink to --rh-text !important, which overrides the muted --locked color (#747474). None of the site's 115 rail rules is !important. Docs L338 still describe channels as sublinks. All 28 rail selectors are unverifiable logged out.

**Impact.** Logged-in users see inconsistent active states, and locked items no longer look locked.

**Fix.** Add .rh-rail__treelink.is-active to the active rule and .rh-rail__treelink--locked to the muted rule. Refresh the selector table from a logged-in capture.

<a id="l-33"></a>
### L-33. Injected stat icon reuses the site's .rh-stat__icon class and inherits opacity .85

**Where.** [RoutineHub_Enhancer.user.js:L150](RoutineHub_Enhancer.user.js#L150)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** css.

**Evidence.** The site defines .rh-stat__icon{font-size:2rem;opacity:.85;margin-bottom:4px} and .rh-detail--compact .rh-stat__icon{font-size:1.35rem} at (0,2,0). L150 overrides only font-size and margin-bottom. The comment at L144-L149 asks for full-strength accent icons.

**Impact.** Profile icons render at 85% opacity. If profiles ever get .rh-detail--compact, the site rule beats the font-size set at L150.

**Fix.** Add opacity: 1 at L150, or rename the injected class to rhe-stat__icon (L115, L150, L304, L716, L721).

<a id="l-34"></a>
### L-34. Themed .button.is-dark controls have no visible keyboard focus

**Where.** [RoutineHub_Enhancer.user.js:L226-L230](RoutineHub_Enhancer.user.js#L226-L230)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** accessibility.

**Evidence.** The site's .button:focus sets outline:0. Its only focus cue for .button.is-dark is a box-shadow of rgba(50,8,50,.25), which shows at 1.0:1 on --rh-bg. L229 pins border-color, so focus does not change the border either. Affected: .rh-stats-toggle, .rh-pubgraph-toggle, .rh-collapse-all, the search submit and the Sort trigger. The theme toggle keeps the site's white :focus-visible outline.

**Impact.** Desktop keyboard users cannot see which control has focus (WCAG 2.4.7). VoiceOver draws its own ring.

**Fix.** Add html.rhe-dark .button.is-dark:focus-visible, .rh-toggle-replies:focus-visible { outline: 2px solid var(--rh-accent) !important; outline-offset: 2px; } (10.5:1).

<a id="l-35"></a>
### L-35. Disclosure controls expose no expanded state, and the reply toggle is a link

**Where.** [RoutineHub_Enhancer.user.js:L899-L937](RoutineHub_Enhancer.user.js#L899-L937)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** accessibility.

**Evidence.** The reply toggle is an &lt;a href='#'&gt; with no aria-expanded or aria-controls (L899-L901). Space does not activate it, and the chevron becomes part of its name ('▾View 1 reply'). 'Show N more stats' (L756-L764), 'Show full year' (L826-L835) and 'Expand all reply threads' (L927-L937, no type attribute) only swap their label text. In DOM order, the content each control reveals comes before it (L754/L765, L823/L841, L879/L918).

**Impact.** State reaches assistive tech only through label wording. The reply toggle's role and keyboard behavior do not match its function (WCAG 4.1.2).

**Fix.** Make the reply toggle a &lt;button type=button&gt; with aria-expanded and aria-controls. Add aria-expanded to the other three buttons. Wrap the chevron in &lt;span aria-hidden=true&gt;. Add type=button to .rh-collapse-all. Consider placing each toggle before the content it reveals.

<a id="l-36"></a>
### L-36. Injected icons are not hidden from assistive tech, and hero extras lack labels

**Where.** [RoutineHub_Enhancer.user.js:L553](RoutineHub_Enhancer.user.js#L553); [RoutineHub_Enhancer.user.js:L582-L585](RoutineHub_Enhancer.user.js#L582-L585); [RoutineHub_Enhancer.user.js:L720-L722](RoutineHub_Enhancer.user.js#L720-L722)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** medium. **Category.** accessibility.

**Evidence.** The script inserts fa-history (L553), fa-code-branch, fa-mobile-alt and fa-clock (L584) and the stat icons (L720-L722) without aria-hidden. The site marks its own icons aria-hidden=true. The hero extras read 'v4.2', 'iOS 18.0' and a bare date. Only the clock icon tells sighted users that the date is the update date.

**Impact.** Screen readers may announce stray glyphs, and the date is ambiguous.

**Fix.** Add aria-hidden=true to every injected icon. Prefix the date with a visually hidden 'Updated'.

<a id="l-37"></a>
### L-37. Code comments and docs contradict the code or the live site

**Where.** [RoutineHub_Enhancer.user.js:L174-L175](RoutineHub_Enhancer.user.js#L174-L175); [RoutineHub_Enhancer.user.js:L398-L413](RoutineHub_Enhancer.user.js#L398-L413); [RoutineHub_Enhancer.user.js:L591-L603](RoutineHub_Enhancer.user.js#L591-L603); [RoutineHub_Enhancer.user.js:L775-L776](RoutineHub_Enhancer.user.js#L775-L776); [RoutineHub_Enhancer.user.js:L845](RoutineHub_Enhancer.user.js#L845); [RoutineHub_Enhancer.user.js:L971-L972](RoutineHub_Enhancer.user.js#L971-L972)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** docs.

**Evidence.** L775-L776 say counts come from the cell title; they now come from data-label. L727 says seven tiles; there are now 8 or 9. L845 says paid shortcuts 'aren't a thing here yet', yet home shows $1.99, shortcut-26376 shows 'Sign in to buy $1.99', search shows $10.00 and $2.99, and /new/ offers 'Sell an Apple Shortcut'. L971-L972 say the observer covers the changelog card, but only #feedback is observed and the card is server-rendered. L174-L175 say 'Ported verbatim' although the sections' parent changed. L411-L413 call the rail 'not yet live-verified', while md L92 and Status L57 say 'rigorously verified'. L591-L592 and md L195-L196 say the creator moves into a &lt;p&gt;, but the span itself moves. L285-L286 refer to 'six selectors above', but that comment lists four unconfirmed and two confirmed. md L206 places the stats card before Required Apps, but promoteRequiredApps runs first and the ?? .rh-card fallback puts the card before the fresher block or Description. md L39, L84 and L336 say the changelog Download stays native. The Status gaps rh-heart and the QR classes are live, and rh-markdown is absent. Audit L45-L47 lists rh-alsocard's location as unconfirmed; it is the fresher and also-like sections.

**Impact.** Maintenance starts from false premises, such as title parsing and the 'pure repetition' rationale for removing Free badges.

**Fix.** Fix or delete each statement along with the related code fix. Record the new shortcut components in Status.json. Decide whether removing Free badges stays now that paid shortcuts exist.

<a id="l-38"></a>
### L-38. Code documentation map and Tools command drift from the file

**Where.** [RoutineHub-Reloaded.md:L97-L302](RoutineHub-Reloaded.md?plain=1#L97-L302); [RoutineHub-Reloaded.md:L404](RoutineHub-Reloaded.md?plain=1#L404)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** docs.

**Evidence.** The 'Structure, top to bottom' list puts Theme sync third, but it runs first (L46-L63). §1 (L101-L103) credits the first GM.addStyle block to gluebyte, although L80-L164 are project rules. §1 omits L166-L183 and calls the 600px block an aspect-ratio breakpoint, though L75-L79 contain none. §2 L109 assigns surface-1 to cards, but cards use --rh-bg. L118 still mentions the removed media query, and the consumer list omits .dropdown-content, .search and .search-button__label. §11 L225 says 'idempotent via a dataset flag', but addStatIcons checks for an existing icon instead (L716). §12 L297-L298 puts the toggle after the comment body, but it follows the replies (L918). No section covers debugNavbarSearchIssue, the comment CSS (L943-L951) or the run order (L958-L974). L404 runs node --check 'RoutineHub Enhancer.user.js', which fails with Cannot find module.

**Impact.** Readers get a wrong map of the file and a syntax-check command that fails.

**Fix.** Rebuild the section list in file order, one line per block. Change the command to node --check RoutineHub_Enhancer.user.js.

<a id="l-39"></a>
### L-39. Docs mix changelog, tracker, reference and session log, with two disagreeing sources of truth

**Where.** [RoutineHub-Reloaded.md:L26-L405](RoutineHub-Reloaded.md?plain=1#L26-L405); [RoutineHub-Reloaded-Status.json:L3-L7](RoutineHub-Reloaded-Status.json#L3-L7)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** M. **Confidence.** high. **Category.** docs.

**Evidence.** One md file holds goals, page status (L26-L50), to-dos (L52-L62), a narrative changelog, code docs, a selector reference, lessons and tools. The changelog (L66-L93) has 24 undated rows and 24,159 characters, 45% of the file's 7,736 words; its longest row (L80) has 2,355 characters. Page status and to-dos duplicate Status.json and disagree on homepage and Notifications. The Status _readme says the md changes slowly and the tracker constantly, but neither has changed since 2026-09-14. Code comments fill about 294 of 976 lines, with blocks of 27 (L19-L45), 18 and 16 lines and session wording such as 'this session' and 'Cloudflare blocked every attempt'. The docs cite verification, but no harness, fixture or audit script is committed.

**Impact.** Every site change needs edits in three places, which produces the drift found in this review.

**Fix.** Split the docs. README for users. CHANGELOG.md in Keep a Changelog form, dated, newest first. docs/architecture.md for the code map, the selector reference with last-verified dates, and the patterns. docs/history.md for the frozen narrative. Keep one tracker: GitHub Issues with page:*, type:*, needs:live-check and needs:logged-in labels, or a CI-generated file. Cut code comments to 1 to 3 lines of reason. Commit the jsdom harness and fixtures.

<a id="l-40"></a>
### L-40. Open to-dos and internal cross-references are stale or contradictory

**Where.** [RoutineHub-Reloaded.md:L50-L62](RoutineHub-Reloaded.md?plain=1#L50-L62); [RoutineHub-Reloaded.md:L308-L352](RoutineHub-Reloaded.md?plain=1#L308-L352)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** S. **Confidence.** high. **Category.** docs.

**Evidence.** L58 is marked resolved but stays in the open list. L57 (the alpha9 export caveat) was superseded by the live checks in alpha12 and alpha14. L62 says 'No further known issues', which predates the /new/ redesign. L61: six of seven gluebyte selectors now appear logged out (.rh-feed-interstitial, .rh-feed-post--text, .rh-topcard-brief 30 times on home, .rh-feed-post__verb 28 times, .rh-hero-header__meta, .rh-release__date); only .rh-checkin__label is absent. L59-L60: the debug code still ships, and the search overlay can be tested logged out. Other defects: duplicate separators at L345 and L347. 'Hit three times' (L352) lists two cases. 'Confirmed against real page exports' (L308) heads a table with a 'not independently verified' row. L50 still names a 'Discover' tab.

**Impact.** The to-do list no longer shows what is actually open.

**Fix.** Move open items to the tracker and close the resolved ones. Run the logged-out search test, then remove debugNavbarSearchIssue and its call. Fix the cross-references.

<a id="l-41"></a>
### L-41. Docs and comments break the owner's no-em-dash and terse-style rules

**Where.** [RoutineHub-Reloaded.md:L66-L93](RoutineHub-Reloaded.md?plain=1#L66-L93)  
**Check.** Not independently verified. The skeptic check did not run.  
**Effort.** M. **Confidence.** high. **Category.** docs.

**Evidence.** Em dashes (U+2014): 119 on 83 lines in RoutineHub-Reloaded.md (version history 49, code docs 29, key selectors 13, pages covered 10) and 3 in the README (L9, L38, L58). No other file has any, and no file has en dashes. Script comments use ' -- ' as a dash substitute 32 times (L81 to L885), and the referrer list shows a visible ' - ' separator (L661). The version history has a median of 134 words per row, and the alpha11 row has 361. Comments make up about 3,161 of the script's 5,409 words. Session narrative appears 12 times in the md and twice in the script (L413, L476), and L83 uses the first-person 'my fallback'. Status and the audit split compound words ('Re run', 'slide out', 'JS driven') and chain commas (Status L5).

**Impact.** The published docs break the owner's standing rules and are slow to scan.

**Fix.** Rewrite in short main clauses and turn each em dash and ' -- ' into its own sentence. Cut session history and restore normal compound hyphens.

## Observations

Info-level items: decisions, opportunities and roadmap proposals.

<a id="i-01"></a>
### I-01. Decide the theme architecture: overlay native dark instead of stacking a second full theme

**Where.** [RoutineHub_Enhancer.user.js:L19-L458](RoutineHub_Enhancer.user.js#L19-L458)  
**Check.** Confirmed by 2 skeptic checks (reproduce, impact). Severity changed from medium to info.  
**Effort.** L. **Confidence.** medium. **Category.** ux-roadmap.

**Evidence.** The current build has 885 classes in dark-gated selectors (604 rh-). The script touches 87 of them (67 rh-). Since 2026-09-11 the dark theme gained a net 210 classes and the script 16. Dark rules grew from about 731 to 1,111. 1,376 of the 1,409 dark color declarations (97.7%) are hardcoded literals. No --rh-* token layer exists, and only 17 variable names are used site-wide. There are 300 distinct dark literals; the top 80 cover 78% of uses. Two native dark families coexist (#1f191f/#282128/#3e363e and #1e2530/#222935/#292d36). Only 8 site dark declarations use !important, against about 150 in the script. Every failure in this review is a text/background pair broken by that stacking. The 798 untouched classes render native next to teal, e.g. .rh-wall-card, .rh-wall-fade, .rh-health__seg, feed avatars and html #130d14. 134 of the 537 untouched rh- classes appear in logged-out snapshots. Not re-keyed per page: skill-detail 37, shortcut pages 34, plugin 26, feed and /new/ 25, sell 24, home 19, profile 16. A remap proof of concept maps 87% of literal uses mechanically (989 rules, 101 KB raw, 9.4 KB gzip). 112 chromatic uses still need decisions. The stylesheet loads cross-origin without crossorigin, so the script cannot read its CSSOM at runtime.

**Impact.** Hand-written per-class overrides cover about 10% and fall further behind with every build. The result is a patchwork of two or three palettes, and new mismatched pairs keep appearing.

**Fix.** Phase 1: gate the dark block on html[data-theme=dark] (D1) so native dark sits under every script rule. Rename the tokens to a private prefix and feed the three site hooks inside the gate. Then either recolor only surfaces and accent, always setting text and background together per component. Or commit a generator that remaps the current build's dark rules into a flat layer and rerun it with the audit; a stale layer falls back to native dark. For 1.0, re-key only the core surfaces (shortcut, changelog, profile, home, feed, listings, search, chrome, rail) and document the rest as native dark. Decide whether full consistency is worth about 100 KB. Ask RoutineHub whether they plan :root tokens.

<a id="i-02"></a>
### I-02. The site's body-wide observers reprocess every node the script moves

**Where.** [RoutineHub_Enhancer.user.js:L176-L182](RoutineHub_Enhancer.user.js#L176-L182)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** medium. **Category.** performance.

**Evidence.** script.min attaches several observe(document.body,{childList:true,subtree:true}) observers. The RHNumber formatter is always on and runs querySelectorAll plus textContent rewrites for each added element. When RH_ADS.enabled is true (home and shortcut-19090), an ad guard calls getComputedStyle at 0, 60 and 400 ms. Video-capture sweeps and an ad-slot tracker add more. At init the script moves or adds 94 elements on shortcut-19090 and moves 709 elements holding 84 [data-rh-num] on home.

**Impact.** The reorder costs about 84 textContent rewrites. Ad-enabled sessions on shortcut-19090 run about 280 deferred inspections. The cost grows with each feature that moves DOM.

**Fix.** Prefer CSS where it gives the same result: hide instead of removing, collapse with a class. Batch the remaining moves in a DocumentFragment with one insert per feature.

<a id="i-03"></a>
### I-03. Injected CSS is 18.2 KB in 4 style elements, half of it comments

**Where.** [RoutineHub_Enhancer.user.js:L66-L458](RoutineHub_Enhancer.user.js#L66-L458)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** high. **Category.** performance.

**Evidence.** The four blocks are 5,048 + 2,017 + 10,948 + 203 bytes. 9,072 bytes (49%) of that are CSS comments, spread over 81 rule blocks that use !important 93 times. Next to the site's 620 KB stylesheet the parse cost is negligible, but the comments land in the DOM on every page.

**Impact.** Clutters the DOM and devtools, which makes debugging on the device harder.

**Fix.** Move the explanations into JS comments or the docs, and merge the four blocks into one style element. No urgency.

<a id="i-04"></a>
### I-04. Docs branch commit exposes a personal email address

**Where.** git commit 396c0c3 on origin/claude/github-repo-documentation-7o6b3u  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** high. **Category.** repo-process.

**Evidence.** git log --all shows 396c0c3 authored as Tojioo &lt;[email redacted]&gt;. The main commit 914913f uses [email redacted].

**Impact.** If the repo is public now or later, merging puts the address into permanent history. It is already on the remote branch.

**Fix.** Set user.email to the noreply address for this repo. Then either amend with --reset-author and force-push the branch, or squash-merge on GitHub under the noreply identity. Turn on GitHub's setting that blocks pushes exposing the email.

<a id="i-05"></a>
### I-05. Native analytics preview card may duplicate addFreeStatsSummary

**Where.** [RoutineHub_Enhancer.user.js:L617-L678](RoutineHub_Enhancer.user.js#L617-L678)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** medium. **Category.** live-drift.

**Evidence.** Site changelog, Feb. 22, 2026: the stats button became an 'analytics preview card'. The CSS defines .rh-stats-card__title, __label, a 3-column __grid, __num, __num--error, __sub and __btn. The script's gate still matches. stats-4448 returns 403 logged out, and the bundle has 0 references to get-engagement-stats or get-visit-stats.

**Impact.** Owners may see two summaries with overlapping numbers. If the endpoints drift, the only symptom is 'Couldn't load stats.'.

**Fix.** In an owner session, compare the native numbers with the script's card. Drop duplicate rows or move the referrers into the native card. Confirm that both endpoints still return JSON.

<a id="i-06"></a>
### I-06. New shortcut-page components open UX options

**Where.** shortcut-4448: .rh-fresher, .rh-health  
**Check.** Observation. Not checked by skeptics.  
**Effort.** M. **Confidence.** high. **Category.** ux-roadmap.

**Evidence.** On outdated shortcuts (4448, 5870), .rh-detail__main opens with a fresher block titled 'Not updated since &lt;month year&gt;'. It holds 3 alternatives, one of them paid (RHUB Downloader $1.99), and sits above the Description. The Updated item now carries .rh-health with an aria-label such as 'Last updated 22 months ago: old', which addHeroMetadata does not use. Changelog pages list up to 134 entries, each with its own Download button.

**Impact.** On a phone the alternatives come before the description, and freshness shows only near the bottom of the page.

**Fix.** Options: move the fresher block below the Description or collapse it. Append the health word to the hero Updated chip. Collapse changelog entries after the first 10.

<a id="i-07"></a>
### I-07. Native site features now overlap script features: decide keep, adapt or drop

**Where.** [RoutineHub_Enhancer.user.js:L542-L555](RoutineHub_Enhancer.user.js#L542-L555); [RoutineHub_Enhancer.user.js:L683-L714](RoutineHub_Enhancer.user.js#L683-L714); [RoutineHub_Enhancer.user.js:L844-L856](RoutineHub_Enhancer.user.js#L844-L856)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** high. **Category.** ux-roadmap.

**Evidence.** (1) Version history: the native a.rh-cta--secondary 'Version history' is the last child of Latest Release Notes. On a phone it comes after an ad, the hero, the pitch or Required Apps, the fresher block, a second ad and the full Description (43 list items on 4448). It is absent on single-version 26376. The script's clone sits under Get Shortcut on 4448, 5870 and 19090. (2) The fresher card repeats the hero 'Updated' extra. (3) Free badges: the site added premium shortcuts on Feb. 24, 2026 and 'Every card shows Free or its price' on Aug. 30, 2026. Home shows 204 Free badges plus prices from $0.99 to $2.99. cleanAuthoredGrid keeps paid prices ($1.99 kept; 9/9 and 18/18 Free removed), but L845 says paid shortcuts do not exist. No observer is needed, since pagination uses ?page=N links without data-endless-scroll. (4) Icon language: /new/ uses fa-bolt, fa-terminal, fa-scroll and fa-puzzle-piece. Homepage tiles and browse.json use fa-wand-magic-sparkles for Skills, fa-cubes for Plugins, fa-robot for Agents and fa-shapes for Models. /sell/ uses fa-book-open for Skills. Comment L122-L127 and md L333 call the /new/ set canonical and justify hiding secondary captions with it. (5) promoteRequiredApps removes the membership pitch. The site has no native reply collapse.

**Impact.** Duplicates add clutter, and stale premises hide design choices. Stripping monetization UI in a public release may cost goodwill with RoutineHub.

**Fix.** Keep the hero changelog button, which saves several screens on mobile, and reuse the label 'Version history'. Drop the hero Updated extra when the fresher card is present. Keep Free removal as a documented choice. Reword L845 and md L271-L276 and L343 to 'price shown only when paid'. Pick one icon set; the browse.json set is recommended because it drives navigation. Otherwise show captions or title attributes on secondary tiles. Make the pitch swap opt-in, or document it.

<a id="i-08"></a>
### I-08. Planned Authored view switcher can reuse native list and detailed layouts, not rh-segmented

**Where.** [RoutineHub-Reloaded-Status.json:L296](RoutineHub-Reloaded-Status.json#L296)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** M. **Confidence.** medium. **Category.** ux-roadmap.

**Evidence.** All 16 rh-segmented rules are scoped to .membership (pill shape, #eef1f6, aria-pressed #320832), and no snapshot contains its markup. A list layout exists in .rh-feed-post .rh-appcard: a 64px/minmax(0,1fr)/auto grid plus a 599px variant. A detailed card exists in .rh-alsocard, whose __foot shows 'Version 1.00' / 'Updated 2 months ago'. The Authored .rh-appcard holds only name, brief, price, downloads and hearts. The bundle has no listing API. The site changelog documents /api/v1/shortcuts/id/versions/latest with CORS (2019). Pages hold 18 items. md L381-L389 records Cloudflare challenges after 8 to 10 rapid requests.

**Impact.** A Detailed view needs 18 per-item fetches per page. Naive parallel fetching risks a Cloudflare challenge on the owner's session.

**Fix.** Copy the .membership .rh-segmented declarations under an own class with aria-pressed buttons. Build List by re-scoping the feed-post appcard grid. Build Detailed on the .rh-alsocard__foot model. Fetch versions only after Detailed is chosen, 2 or 3 at a time, cached per id in sessionStorage. Verify the endpoint's response shape live before building.

<a id="i-09"></a>
### I-09. Sitewide action-label removal also strips Skill page cards

**Where.** [RoutineHub_Enhancer.user.js:L166](RoutineHub_Enhancer.user.js#L166)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** high. **Category.** live-drift.

**Evidence.** L166 removes .rh-topcard-action and .rh-listrow-action before the pathname check at L167. Harness: skill-detail loses all 6 View labels in its More like this grid (a.rh-topcard.rh-topcard--registry). The homepage loses 18 topcard and 168 listrow actions.

**Impact.** Cosmetic. The cards stay clickable, but new surfaces change without intent.

**Fix.** Decide the scope. If only the homepage tweak was meant, move the line inside the L167 check, or hide the labels with CSS.

<a id="i-10"></a>
### I-10. New site surfaces need a before or after 1.0 scope decision, including the separate AI comment system

**Where.** skill-detail: section#comments.rh-comments.rh-feedback; home: #modal-template-page; new: .rhnew-card  
**Check.** Observation. Not checked by skeptics.  
**Effort.** L. **Confidence.** high. **Category.** ux-roadmap.

**Evidence.** (1) Skill, prompt and plugin pages render comments in section#comments.rh-comments via registry.comments.js, with data-delete-url, data-hide-url and data-unhide-url. They have no #feedback and no article.media[data-feedback-id], so flatten and collapse return early. The CSS carries 19 dark rh-comment* classes. The sampled pages have 0 comments. Skill detail sets local --accent tokens. (2) Paid 26376 shows 'Sign in to buy $1.99', has one version and no changelog link. (3) /login/ and /register/ redirect to hash routes, and AuthModal fills #modal-template-page. OTP styles are new. .field-new-control still has 20 CSS refs. (4) The check-in board has 0 elements logged out. (5) /new/ lists a members-only HubCompute 'Virtual Machine' card, likely the audit's rh-box family. (6) JellyCuts is a new type. (7) #rh-browse loads /nav/browse.json.

**Impact.** Without a scope decision the work stays an open-ended sweep. The login modal and check-in board stay untested until captured.

**Fix.** Before 1.0: the login modal (it renders logged out), the paid CTA row and the search browse panel. After 1.0, in order of owner use: skill detail (37 native-dark classes, and its local tokens allow a cheap accent override), then registry comments (capture a sample with replies, then decide on collapsing), then the other AI detail pages, then the check-in board. Mark the HubCompute VM and moderation tooling out of scope.

<a id="i-11"></a>
### I-11. Homepage and listing class inventory: 31 dark-styled rh- classes the script never references

**Where.** home, listing-top-p4, listing-newest, category-productivity, search-weather, skills-listing, agents-listing  
**Check.** Observation. Not checked by skeptics.  
**Effort.** M. **Confidence.** high. **Category.** theme-coverage.

**Evidence.** inventory.js per page (rh- classes / referenced / unreferenced / unreferenced with dark rules): home 116/28/88/19; listing-top-p4 and listing-newest 37/13/24/9 each; category 40/13/27/10; search 59/13/46/20; skills 46/13/33/12; agents 45/11/34/12; union 143/29/114/31. The 31 include rh-ad-slot, rh-aicard-price, rh-anchor and __close, rh-appcard-stats, rh-heat-*, rh-proof-*, 8 rh-meter__* classes, rh-creator-card*, rh-pill--creator, rh-search-form*, rh-search__summary, rh-pf-label, rh-pf-mark and rh-platform-chip. Layout-only classes need no work. 48 of the script's 178 selectors match these pages. The JS-built rh-browse__* and rh-endless-* classes are absent from the server HTML.

**Impact.** Defines the remaining work for the homepage and listing pass.

**Fix.** Use this as the checklist, ordered by visibility: AI tiles, search overlay input and panel, search page, Heatseekers, stats rows, mobile anchor ad, logged-out meter popover.

<a id="i-12"></a>
### I-12. Open audit and tracker questions can now be answered from public pages

**Where.** [RoutineHub-Reloaded-Theme-Audit.md:L75](RoutineHub-Reloaded-Theme-Audit.md?plain=1#L75)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** medium. **Category.** ux-roadmap.

**Evidence.** rh-comment: section#comments.rh-comments.rh-feedback on skill, prompt and plugin pages, a second comment system. rh-alsocard: the 'Not updated since' alternatives block on shortcut pages. rh-hero-header__qr: a 'Scan to Get' QR on all 4 shortcut pages. rh-meter: a '5 free reads left' meter that renews every 14 days, on all 32 pages inside div.navbar-item.rh-meter, where the .navbar-item rule paints it. rh-box: likely HubCompute (/new/ 'Virtual Machine Members'). rh-sell: the /sell/ page (53 classes). rh-wall: the skill and plugin paywall (27 classes). rh-blog: /blog. rh-topcard--heatseeker: the Heatseekers section (12). rh-skill-* also appears on agent, prompt, plugin and cherri pages.

**Impact.** Several 'unclear' items can be closed. Two of them, AI-item comments and the meter, affect pages users see every day.

**Fix.** Record the answers in the audit and the tracker. Add rows for AI-item comments and the free-reads meter.

<a id="i-13"></a>
### I-13. Triage of every planned and open tracker and doc item

**Where.** [RoutineHub-Reloaded-Status.json:L76-L353](RoutineHub-Reloaded-Status.json#L76-L353); [RoutineHub-Reloaded.md:L44-L62](RoutineHub-Reloaded.md?plain=1#L44-L62)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** S. **Confidence.** high. **Category.** ux-roadmap.

**Evidence.** Status.json lists 15 pages as needs_recheck. Features: 15 implemented, 2 open_todo, 3 planned, 1 note; not_yet_checked has 10 entries. Answers as of 2026-11-06: the search fix (L76) is caused by .rh-browse-backdrop. The 'obsolete?' question (L86) is yes. The homepage margin audit (L105) is affected by .rh-main-layout. The Views entry (L224) has no data source outside the owner-only get-visit-stats. The Authored switcher (L296) has no rh-segmented markup. The minibar padding (L301) is blocked by the data-label bug. The contact icons (L305) are #f0f0f0/#555 with no dark rule, not maroon. Settings, API keys, CreatorHub and orders (L314, L342, L346) are uncaptured. Search and category (L318), skill detail (L326), sell and membership (L334) and the browse panel (L338) now have fixtures. Notifications (L322) redirect when logged out. The blog (L330) is uncaptured. rh-box (L350) is likely the HubCompute VM. md L57, L58, L61 and L62 are superseded or answered.

**Impact.** Most items are blocked by a fixed defect, already answered or out of date. Treating them as open wastes sessions.

**Fix.** Phase 1: search fix, debug removal, minibar padding, token collision, backdrop. Phase 2: margin audit, contact icons, listings, notifications, skill detail, login modal, alpha17 selectors, alpha9 recheck, /new/ sweep, check-in board. Post-1.0: Views entry (drop it, or make it owner-only), Authored switcher, settings pages, blog, stats card polish, registry comments. Close now: the alpha13/14 entry, the Browser Use idea and the rh-box question. Rename in Phase 3.

<a id="i-14"></a>
### I-14. Logged-in capture and scrub workflow to unblock auth-gated checks

**Where.** [RoutineHub-Reloaded.md:L47-L56](RoutineHub-Reloaded.md?plain=1#L47-L56); [RoutineHub-Reloaded-Status.json:L6](RoutineHub-Reloaded-Status.json#L6); [RoutineHub_Enhancer.user.js:L411-L413](RoutineHub_Enhancer.user.js#L411-L413)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** M. **Confidence.** medium. **Category.** repo-process.

**Evidence.** Docs and code name the missing logged-in view as the blocker in at least 6 places. Even the logged-out fixtures hold 457 csrfmiddlewaretoken inputs (9 files), 193 signed download links (/download/&lt;id&gt;/?t=...), Cloudflare __CF$cv$params in all 34 files, and comments from 27 users on shortcut-19090. Logged-in pages add session-bound tokens, the owner's email and settings.

**Impact.** The rail, notifications, check-in board, composer, settings and owner stats stay unverified. Committing raw pages could leak tokens and republish other users' content.

**Fix.** After login, capture the rendered outerHTML in desktop Safari or Chromium into a gitignored captures/raw. Run a committed tools/scrub.py on it. It drops script bodies, csrf inputs, Cloudflare params, signed tokens and emails, and replaces usernames and comment text. Commit only the trimmed subtrees each feature needs, tagged with capture date and CSS build. Replace the Browser Use idea (L56) with this workflow plus Playwright.

<a id="i-15"></a>
### I-15. Phase 0: make the repo the single source of truth

**Where.** git: main 914913f; repo root  
**Check.** Observation. Not checked by skeptics.  
**Effort.** M. **Confidence.** high. **Category.** repo-process.

**Evidence.** This phase closes these gaps: alpha24 and the alpha history are missing from git; README and LICENSE are unmerged; there is no CI and the documented check fails; .gitattributes, .editorconfig and .gitignore are missing; there is no CHANGELOG.

**Impact.** Every later phase needs reproducible checks and a trustworthy baseline. This is the cheapest phase, and it changes nothing on the site.

**Fix.** (1) Recover alpha24 from the iPhone and commit it. Tag v1.0.0-alpha23 and v1.0.0-alpha24. (2) Fix README and LICENSE and squash-merge them. (3) Add .gitattributes, .editorconfig and .gitignore. (4) Start CHANGELOG.md and freeze the narrative table as docs/history.md. (5) Port the jsdom prototype into test/ with scrubbed fixtures. Run CI with node --check, ESLint and the suite. Mark known failures expected-fail and flip each as Phase 1 lands. (6) Commit the capture, audit and scrub tools. (7) Fix the L404 command.

<a id="i-16"></a>
### I-16. Phase 1 (1.0.0-beta.1): fix what is broken on the live site today

**Where.** [RoutineHub_Enhancer.user.js:L19-L922](RoutineHub_Enhancer.user.js#L19-L922)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** M. **Confidence.** high. **Category.** ux-roadmap.

**Evidence.** Each item below has a failing prototype check or a defect reproduced on live snapshots. XSS sinks sit at L584 and L671. Publish Activity reads title, but cells now carry data-label. The theme ignores the light choice and syncs only one of two toggles. The search fix and its debug code have no effect. The token collision breaks light mode. Agents and Favorites have no icons. The homepage reorder lands in the wrong place and is not idempotent. Reply labels go stale.

**Impact.** These defects are visible today or exploitable through page content. The fixes are small and testable, and they remove about 130 lines.

**Fix.** (1) Use textContent in addHeroMetadata and addFreeStatsSummary, and rewrite L905 without innerHTML. (2) Read data-label, falling back to title. (3) Key the dark block on html[data-theme=dark]. (4) Delete the search and debug functions and add the backdrop rule. (5) Give tokens and created classes a private prefix, and set the site tokens only in dark mode. (6) Add fa-robot and fa-heart, and let 5 or 6 tiles wrap cleanly. (7) Rewrite or drop the reorder, and guard it. (8) Wrap each feature in try/catch and inject styles before any DOM work. (9) Recount reply labels on mutation. (10) Bump to 1.0.0-beta.1 with a CHANGELOG entry, tag and release.

<a id="i-17"></a>
### I-17. Phase 2 (beta.2 and later): re-baseline coverage with real engines and logged-in captures

**Where.** [RoutineHub-Reloaded-Status.json:L50-L311](RoutineHub-Reloaded-Status.json#L50-L311); [RoutineHub-Reloaded-Theme-Audit.md:L3-L7](RoutineHub-Reloaded-Theme-Audit.md?plain=1#L3-L7)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** L. **Confidence.** medium. **Category.** ux-roadmap.

**Evidence.** All 15 tracker pages have been needs_recheck since 2026-09-13. The audit numbers refer to a CSS build that no longer exists. jsdom cannot parse the nested dark block. Logged-in surfaces have no capture.

**Impact.** 1.0 needs a known-good baseline for every page it claims to support, and the CSS half can only be verified in a browser engine.

**Fix.** (1) Rerun the committed audit and update the doc. (2) Run Playwright Chromium and WebKit on the core fixtures in all 4 theme states, with screenshot baselines and computed-style asserts. (3) Capture and scrub logged-in pages and add them as fixtures. (4) Apply the core-surface scope and leave the rest native dark. (5) Clear the small items: contact icons, alpha17 selectors, login modal, paid CTA row, browse panel, /new/, and the search and category listings. (6) Apply the native-overlap decisions. (7) Replace the tracker with issues, or generate it from CI.

<a id="i-18"></a>
### I-18. Phase 3 (1.0.0-rc.1): final identity and distribution

**Where.** [RoutineHub_Enhancer.user.js:L1-L14](RoutineHub_Enhancer.user.js#L1-L14); [RoutineHub-Reloaded.md:L3-L5](RoutineHub-Reloaded.md?plain=1#L3-L5)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** M. **Confidence.** medium. **Category.** ux-roadmap.

**Evidence.** The header has no @namespace and no update URLs. A rename is planned for 1.0, but the file is still RoutineHub_Enhancer.user.js. A double install scrambles the homepage. gluebyte's upstream source URL is recorded nowhere; only profile links exist (script L11-L12, README L8). gluebyte's v1.2 was adopted ad hoc (md L86).

**Impact.** Identity and URLs must change once, before there are users to strand. Tracking upstream keeps gluebyte's fixes from arriving by chance.

**Fix.** (1) Set the final @name RoutineHub Reloaded, an @namespace, the file name RoutineHub-Reloaded.user.js and the prefix rhr-. (2) Point @downloadURL and @updateURL at a release branch, and add @homepageURL, @supportURL and optionally @icon. (3) Add a tag workflow that checks @version against the tag and the CHANGELOG, and attaches the .user.js plus a header-only .meta.js. (4) Test an in-place update from beta to rc on the iPhone. (5) Add README install steps for iOS (Userscripts, Tampermonkey for Safari, Stay) and desktop, plus an uninstall note for the old scripts. (6) Optionally mirror on GreasyFork and post in RoutineHub General. (7) Record gluebyte's upstream URL and the last-synced version (v1.2), and contact him to cross-link.

<a id="i-19"></a>
### I-19. Phase 4 (1.0.0): exit criteria, then the post-1.0 backlog

**Where.** [RoutineHub-Reloaded.md:L3-L5](RoutineHub-Reloaded.md?plain=1#L3-L5)  
**Check.** Observation. Not checked by skeptics.  
**Effort.** L. **Confidence.** medium. **Category.** ux-roadmap.

**Evidence.** There is no definition of done. The docs tie 1.0.0 only to the rename, and 23 alphas have shipped so far.

**Impact.** 1.0 is both the rename and the first public release. Checkable criteria stop the alpha series from drifting.

**Fix.** Exit criteria: (1) No open critical, high or medium finding, and a lint rule blocks innerHTML with expressions. (2) CI passes on fixtures captured within 14 days, including one logged-in capture per core page. (3) Playwright Chromium and WebKit pass in all 4 theme states. (4) The owner has checked on the iPhone, in both site themes: home, shortcut (free, paid, single version), changelog, profile, feed, listing and search. (5) data-theme is the only theme trigger, and no private name uses the site's namespace. (6) The identity is final, and one in-place update has been verified. (7) main holds README, LICENSE with both copyright lines, CHANGELOG, a tag and a release. (8) No temporary code remains, comments are trimmed, the tracker is accurate, and the README lists supported pages and known gaps. (9) Opinionated defaults are documented and ideally switchable. Post-1.0 backlog: skill detail, registry comments, the other AI pages, the check-in board, settings, API and CreatorHub pages, the Authored switcher, the Views entry (or drop it), stats card polish, an options UI via GM.getValue/GM.setValue, document-start styles, and the homepage margin audit.

## Docs and tracker corrections

Each linked entry lists the exact edits.

- [M-16](#m-16) Docs and comments teach cascade mechanics that do not match the current CSS. [RoutineHub-Reloaded.md:L363-L373](RoutineHub-Reloaded.md?plain=1#L363-L373)
- [L-10](#l-10) Theme audit is stale, not reproducible, and blind to plain selectors and cascade conflicts. [RoutineHub-Reloaded-Theme-Audit.md:L3-L21](RoutineHub-Reloaded-Theme-Audit.md?plain=1#L3-L21); [RoutineHub-Reloaded-Theme-Audit.md:L180-L186](RoutineHub-Reloaded-Theme-Audit.md?plain=1#L180-L186)
- [L-11](#l-11) Status tracker is stale and misses most of the current public site. [RoutineHub-Reloaded-Status.json:L4-L353](RoutineHub-Reloaded-Status.json#L4-L353)
- [L-12](#l-12) Homepage docs claim clean coverage and omit the reorder and View removal. [RoutineHub-Reloaded.md:L31](RoutineHub-Reloaded.md?plain=1#L31); [RoutineHub-Reloaded.md:L46-L50](RoutineHub-Reloaded.md?plain=1#L46-L50); [RoutineHub-Reloaded.md:L88](RoutineHub-Reloaded.md?plain=1#L88)
- [M-17](#m-17) Docs for login, register, feed, /new/ and search describe a site that no longer exists. [RoutineHub-Reloaded.md:L36-L50](RoutineHub-Reloaded.md?plain=1#L36-L50); [RoutineHub-Reloaded.md:L332-L339](RoutineHub-Reloaded.md?plain=1#L332-L339); [RoutineHub-Reloaded-Status.json:L251-L262](RoutineHub-Reloaded-Status.json#L251-L262)
- [M-18](#m-18) Profile docs, tracker and README describe markup and behavior that no longer exist. [RoutineHub-Reloaded.md:L227-L276](RoutineHub-Reloaded.md?plain=1#L227-L276); [RoutineHub-Reloaded.md:L333-L343](RoutineHub-Reloaded.md?plain=1#L333-L343); [RoutineHub-Reloaded-Status.json:L267-L308](RoutineHub-Reloaded-Status.json#L267-L308)
- [L-14](#l-14) README and @description misstate features and cover only desktop install. README.md:L37-L43; [RoutineHub_Enhancer.user.js:L6](RoutineHub_Enhancer.user.js#L6)
- [L-37](#l-37) Code comments and docs contradict the code or the live site. [RoutineHub_Enhancer.user.js:L174-L175](RoutineHub_Enhancer.user.js#L174-L175); [RoutineHub_Enhancer.user.js:L398-L413](RoutineHub_Enhancer.user.js#L398-L413); [RoutineHub_Enhancer.user.js:L591-L603](RoutineHub_Enhancer.user.js#L591-L603); [RoutineHub_Enhancer.user.js:L775-L776](RoutineHub_Enhancer.user.js#L775-L776); [RoutineHub_Enhancer.user.js:L845](RoutineHub_Enhancer.user.js#L845); [RoutineHub_Enhancer.user.js:L971-L972](RoutineHub_Enhancer.user.js#L971-L972)
- [L-38](#l-38) Code documentation map and Tools command drift from the file. [RoutineHub-Reloaded.md:L97-L302](RoutineHub-Reloaded.md?plain=1#L97-L302); [RoutineHub-Reloaded.md:L404](RoutineHub-Reloaded.md?plain=1#L404)
- [L-39](#l-39) Docs mix changelog, tracker, reference and session log, with two disagreeing sources of truth. [RoutineHub-Reloaded.md:L26-L405](RoutineHub-Reloaded.md?plain=1#L26-L405); [RoutineHub-Reloaded-Status.json:L3-L7](RoutineHub-Reloaded-Status.json#L3-L7)
- [L-40](#l-40) Open to-dos and internal cross-references are stale or contradictory. [RoutineHub-Reloaded.md:L50-L62](RoutineHub-Reloaded.md?plain=1#L50-L62); [RoutineHub-Reloaded.md:L308-L352](RoutineHub-Reloaded.md?plain=1#L308-L352)
- [L-41](#l-41) Docs and comments break the owner's no-em-dash and terse-style rules. [RoutineHub-Reloaded.md:L66-L93](RoutineHub-Reloaded.md?plain=1#L66-L93)

## Verified working

- The harness ran the script on 32 snapshots without a single error.
- Comment flattening and collapsing match the current markup. A simulated archived load is processed. The `#feedback` observer settles after 3 callbacks.
- Changelog button, hero metadata and creator line work on shortcuts 4448, 5870 and 19090.
- The theme toggle re-key values match the site's current rules exactly.
- The `/new/` structural selectors still match after the redesign.
- `node --check` passes.

<details><summary>Raw reviewer notes on what works</summary>

**js-logic**

- Harness: no script error on any of the 32 runnable snapshots; my own run on the login and register stubs also threw nothing. The only jsdom noise is 'Could not parse CSS stylesheet' from the nested CSS.
- Every DOM feature no-ops where its targets are absent. AI detail pages, listings, feeds, changelog pages, /new/, /sell/, membership and the 403 stats page change only through the 'View' label removal.
- L166 removes only 'View' pseudo-buttons inside card links: 336 .rh-listrow-action and 42 .rh-topcard-action across snapshots. Cosmetic and safe.
- addChangelogButton: release-card scoping still works and skips the footer /changelog/ link. The clone keeps the href. No button on single-version 26376. The .rh-changelog-shortcut guard prevents duplicates.
- addHeroMetadata: labels Version, iOS and Updated still match (v10.0, iOS 18, Dec 20, 2024 on 4448). The native meta row holds no version or date, so nothing is duplicated, and the guard blocks repeats. All 190 snapshot versions are plain numbers, so no 'vv' prefix today.
- promoteCreatorLine: 'by @r07qxo Creator IS VERIFIED' is the original span moved together with its .tag badges, as the docs intend ('by @author [tags]'). startsWith('by') holds on all 4 shortcut pages.
- flattenReplyThreads: shortcut-19090 nests up to depth 14 (36 replies deeper than one level); after the script, 0 remain deeper. The site's Reply, Edit and Delete handlers use closest('.media').find(...).first(), which still hits each comment's own elements, because its .content precedes the moved replies.
- Archived comments: #archivedCommentsContainer is inside #feedback (shortcut-4448.html:1057), and the site fills it with jQuery .html(). The subtree observer therefore processes the load and settles after 3 callbacks (F10).
- addCollapseAllControl never inverts a single thread, because it checks each toggle's own state (L934). The button sits after the &lt;hr&gt; and before #toggleArchived, outside any form.
- Theme observer has no feedback loop. It watches only data-theme, while it writes the class on &lt;html&gt; and aria-checked on a button.
- addStatIcons runs before splitStatsOverview, so moved tiles keep their icons, as documented.
- cleanAuthoredGrid still finds the 'Authored' heading and its .rh-grid sibling. It removed 9 and 18 Free badges, scoped to that grid only.
- addFreeStatsSummary is async and not awaited, so its failures cannot abort later features. The AbortController timeout path ends in the 'Couldn't load stats.' state.
- The reorder filter currently selects exactly Best Sellers, New Shortcuts, Recently Updated, Top Shortcuts and Heatseekers. The ' AI' suffix excludes the AI carousels.
- node --check RoutineHub_Enhancer.user.js passes.

**css-cascade**

- Toggle re-key values (L245-L258) still match the site's current html[data-theme=dark] .rh-theme-toggle rules exactly: #3d3a45, translateX(24px), #d8d8dd, the same shadow, translate(-32px,5px) and opacity 1.
- No script selector sets the same longhand twice (dups.js over 80 rules and 216 selectors). Every script-vs-script override is intended precedence, such as .rh-scroll--stats .rh-stat over .rh-stat and .rh-listrow text over the link color.
- .rh-scroll--stats grid override still wins. display:grid and overflow:visible are !important against .rh-scroll{display:flex;overflow-x:auto}. .rh-scroll--stats&gt;.rh-stat{flex:0 0 140px} and scroll-snap-type have no effect on a grid that does not scroll. horizontal-scroll.js loads only on the homepage, so it does not touch profile stats.
- .rh-stats-secondary hidden state works. The inline display:none beats the non-!important display:grid, so the alpha12 fix holds.
- .rh-tagline and .rh-proof-bar background-image:none resets are still needed, because the site uses gradient shorthands, and they still win.
- #feedback .rh-top-comment (1,2,1) and the .rhnew-card rules (inline site styles are non-!important) win on every snapshot where they match.
- The unconditional chrome premise holds for .navbar (#320832), .footer (#220622), .search and .button.is-dark, which are dark in both site themes.
- The site CSS has no prefers-color-scheme queries. data-theme comes from localStorage rh_theme or the OS preference via the head script, and site JS follows OS changes when no choice is stored.
- .rh-hero-header__meta is flex-wrap with gap:14px, so .rh-meta-extra spans are spaced without extra CSS.
- Outright script losses against site rules are limited to three. The .rh-toggle-replies text-decoration loses to a:link. The .field-new-control input background loses to a site !important (0,4,1). On hover, .rh-theme-item:hover and a.has-text-white:hover win, which is harmless.
- nwsapi evaluated every site and script selector except vendor placeholder pseudo-classes and the site's invalid :not-last, which browsers also drop.

**security**

- The sink inventory is complete: 5 innerHTML writes (L553, L584, L630, L671, L905). There is no outerHTML, insertAdjacentHTML, document.write, DOMParser, eval, Function, jQuery html, location write or window.open. L553, L630 and L905 hold only constants and a reply count.
- Attribute and property writes are safe. aria-checked gets String(boolean) (L51). title (L810) is a plain text attribute. className, dataset and style values are constants or computed numbers. All toggle labels use textContent (L759, L763, L829, L834, L930, L936).
- Hero metadata icons and prefixes (L569-L573) are constants. Only the value is tainted.
- The cloned changelog link carries only href and class on 4448, 5870 and 19090, and the script replaces the class, so no handler or id is duplicated. The site binds download handlers only to a.rh-cta[href*="/download/"], so the clone picks up no site behavior. The site's .rh-cta click logger runs only behind its own localStorage debug flag.
- Author content cannot forge the selectors the script trusts. Across the snapshots, author markup keeps only a[href|rel|target] and img[alt|decoding|loading|src|title]. The only other classes seen come from Cloudflare email obfuscation and the site's readmore link. All 194 release-notes blocks contain only &lt;br&gt;, and a plain URL is not turned into a link. So the changelog button source cannot be redirected. .rh-stats-card, .rh-release__version, .rh-info-list__item, #feedback and article.media[data-feedback-id] cannot be injected either.
- The stats fetch is sound. The path is relative and same-origin, the id is limited to digits (L620) and the endpoint names are constants. It is GET only with credentials same-origin (the fetch default). It aborts after 10 s and handles non-OK responses and JSON errors. There is no third-party request. The harness logged 0 fetch calls on all 32 logged-out pages, so the owner gate holds.
- @grant is minimal (GM.addStyle only). Page script has no GM.xmlHttpRequest, @connect or storage API to abuse.
- Comment flattening keeps site actions on the right comment. The site's delegated reply, edit and delete handlers find their target through the closest .media and its first matching descendant. Every comment's reply form also carries its own hidden parent_id.
- The theme toggle interplay is security-neutral. The site derives the next theme from data-theme, stores rh_theme in localStorage and rewrites aria-checked on all toggles itself.
- debugNavbarSearchIssue() logs only class names and computed background colors. It logs no tokens, user data or URLs.
- The Required Apps move relocates site-curated App Store links (itunes.apple.com app ids with proxied icons) without re-parsing them.
- The sitewide removal at L166 only hits decorative View labels: 336 .rh-listrow-action and 42 .rh-topcard-action spans.
- Git history has no secrets. Both commits were scanned for CSRF, session, API key, private key and long token patterns.
- Class names and data flags added by the script collide with nothing in the site CSS, JS bundle or markup today (0 hits each).
- The proposed fix is validated. A patched build using DOM nodes and textContent renders both payloads as inert text with the same card structure (exp-sinks.js patched).

**live-home-listings**

- Harness, all 8 pages: no script error, 4 style tags injected, 6 MutationObservers with 0 callbacks at load, no fetch calls, 2 [RHE debug] lines each (F7 confirmed).
- Listing pages (top-p4, newest, category, skills, agents): only CSS applies. No DOM change besides the navbar inline style. Profile, shortcut and comment features are no-ops (cleanAuthoredGrid needs an 'Authored' heading).
- Category page uses the Discover template with the same 13 referenced classes. Sort trigger .button.is-dark 7.48:1, .dropdown-content items 6.08:1, pagination links 10.50:1, card names and briefs 12.93:1 in dark.
- Homepage selectors the docs rely on still match: .rh-tagline, -title, -sub and .rh-proof-bar (gradient reset works, 12.93:1), .rh-topcard x30, .rh-listrow x168 with name and brief, .rh-appcard-name and -brief x60, .rh-section-title x36.
- View removal (L166) takes 18 .rh-topcard-action and 168 .rh-listrow-action off the homepage. Each sits inside an a card, so no navigation is lost. Heatseeker cards (div) have none.
- Reorder does not break site JS. horizontal-scroll.js binds listeners to .rh-scroll and .rh-topgrid nodes, which survive moves. The site bundle never references rh-main-content, rh-topgrid or rh-scroll. Follow buttons keep their jQuery handlers. .rh-main-layout is display:block, so moved sections keep full width.
- Endless scroll on listings appends cards and inserts .rh-endless-sentinel. Theming is CSS-only, so appended cards are covered. The site code finds nav.pagination through closest('.rh-section'), which the script does not move on listing pages.
- Hero and story overlays keep white text (about 20:1) because the overlay div sets the color, not the a element. AI kind pills and green aicard Free prices (5.71:1) are unaffected.
- Scenario A palette: on the homepage only the mobile .rh-anchor ad bar (and the offscreen .message toast) keep the site's #1f191f. Listing pages show no site-palette surfaces. Other surfaces are script palette, images or brand fills.
- Site CSS facts: no @layer, no native nesting, no prefers-color-scheme queries. Dark theme is 1427 html[data-theme=dark] selector occurrences (1370 inside :where). The inline head script sets data-theme from localStorage rh_theme, else from prefers-color-scheme, so the default follows the OS.
- F6 nuance: the synced first .rh-theme-toggle is the touch one (.rh-theme-item.is-hidden-desktop in .navbar-brand). The unsynced one is the desktop toggle (.is-hidden-touch in .navbar-menu). iPhone shows the synced one.
- Light mode (OS light, site light) on these pages: apart from the variable collision and the logged-out meter CTA, no text drops below 4.5:1 because of the script. The mobile search icon (#f65052 on petrol, 3.21:1) passes the 3:1 non-text bar.
- F9 holds on all 8 pages: no .rh-rail; .navbar, .navbar-menu, .search and .search-button__label present.

**live-shortcut**

- Shortcut hooks exist on all 4 snapshots: .rh-hero-header__cta, __meta and __body (1 each), .rh-info-list__item (5), .rh-install-pitch (1), #feedback (1), article.media[data-feedback-id] (25/8/84/20) and .media-content. #toggleArchived and #archivedCommentsContainer exist on 4448/5870/19090 (541/234/223 archived). 26376 has no archive.
- addChangelogButton follows .rh-release__version to .rh-card to a[href*="/changelog"] and clones the link into the CTA row on 4448/5870/19090. It adds nothing on single-version 26376. The footer /changelog/ link is never picked.
- addHeroMetadata matches the Information card on all 4 pages: v10.0/iOS 18/Dec 20, 2024; v4.3.3/iOS 17/May 29, 2024; v6.3.2/iOS 27/Nov 6, 2026; v1.00/iOS 26/Aug 27, 2026. The new .rh-health widget sits outside .rh-info-list__value and is not copied. None of 18 sampled version strings starts with 'v'.
- promoteCreatorLine moves the 'by @author' span on 4 of 4 pages, including paid 26376.
- promoteRequiredApps moves the card on 4448 (34 apps) and 5870 (2). It leaves the pitch on 19090 and 26376, which have no apps.
- addFreeStatsSummary makes zero fetches logged out. Its gate classes .rh-stats-card and .rh-stats-card__btn still exist in the current CSS.
- Flattening on 19090 reduces 36 deeper-than-one-level replies to 0 and builds 22 toggles. The site's reply, edit and delete handlers (closest('.media').find(...).first()) still resolve each comment's own form after flattening (exp.js: true, true). `.feedback .media .media` still matches all 61 replies.
- Site archived loader: $('#toggleArchived').bind('click') GETs /shortcut/&lt;id&gt;/archived-comments as JSON {html,count} and calls $('#archivedCommentsContainer').html(e.html). The container is inside #feedback, so the childList+subtree observer re-runs refreshComments. Later clicks only call hide()/show(), which needs no re-run.
- Changelog pages have .rh-changelog__entry (134/56), .rh-changelog__subtitle/__ios/__downloads, .rh-release__version/__date/__notes and .text-muted, all covered by the dark block. Shortcut-only features no-op there because no hero CTA exists.
- Paid 26376 shows the CTA 'Sign in to buy $1.99' (a.rh-cta, href #/login). It has no release link, so no clone. Hero meta extras and the creator line still work.
- All 7 pages in my dimension run without script errors in jsdom, the stats-4448 403 page included. The only jsdomError is jsdom failing to parse the script's nested CSS.
- The cloned Changelog button gets the surface-2 background and accent text in dark mode (6.08:1). In light mode it shows the site's #f0f0f0 with #1a1a1a.
- Description card is themed. .rh-description .content gets --rh-text, and the hr, blockquote and pre rules apply. In the site-dark state inline code is #a4aec7 on surface-2 (4.90:1).
- The planned 'Views' entry still has no public data source. Shortcut pages show no view count (0 fa-eye, no views text), so the Status.json note is still accurate.

**live-profile**

- Authored grid markup still matches the docs: h2.rh-section-title 'Authored', then nextElementSibling div.rh-grid &gt; a.rh-appcard (icon wrapper, name, brief, stats with .rh-price and two .rh-appcard-stat). cleanAuthoredGrid removed 9 of 9 (tojioo) and 18 of 18 (gluebyte) Free badges and nothing outside that grid.
- A paid .rh-price badge (real markup from search-weather) survives cleanAuthoredGrid in a jsdom simulation.
- Profile pagination is plain ?page=N links and the Authored grid has no data-endless-scroll, so one pass per page load is enough.
- splitStatsOverview finds Followers, Following and Downloads on both profiles. The toggle text uses the live count. Show and hide verified by jsdom clicks. The inline display:none is not overridden, because .rh-stats-secondary has its own non-!important grid rule.
- The 7 previously known labels still match the icon map exactly. addStatIcons is idempotent through its :scope &gt; .rh-stat__icon check.
- Site .rh-stat is still display:flex column with gap 8px, so the order-based icon/value/label stacking applies. .rh-scroll and .rh-scroll--stats&gt;.rh-stat{flex:0 0 140px} still exist, so the grid override at L87-L93 still targets the carousel it was written for.
- data-label formats are 'No publishes on &lt;date&gt;', '1 publish on &lt;date&gt;' and 'N publishes on &lt;date&gt;'. parseInt reads them correctly, and weekly sums reproduce the page totals 31 and 89.
- .rh-pubgraph__cell--l0 still exists (352 and 290 day cells), so the L318 override still applies.
- Profile-only selectors (.rh-scroll--stats, .rh-pubgraph, the 'Authored' heading) appear only in the two profile snapshots. The shortcut-page functions no-op on profiles. Harness and own runs: no error and no fetch call on either profile.
- Site JS does not rebuild the stats strip, grid or pubgraph after load. It only binds the pubgraph readout and runs RHNumber, which re-formats moved .rh-num nodes idempotently. horizontal-scroll.js is not loaded on profiles.
- html carries class 'profile' on both profile pages, a cheap page gate if one is wanted.
- Font Awesome 6.6.0 from cdnjs is loaded on the profile (L2859), and the site itself renders fa-robot and fa-heart, so the proposed glyphs exist.
- Hero, Contact card and section titles are covered by the existing .rh-card, .rh-hero-header, title and brief rules. The Creator, Member and IS VERIFIED tags stay native, in line with the badge policy.

**live-feed-chrome**

- Toggle re-key values at L245-L258 match the current site CSS exactly: #3d3a45, translateX(24px), #d8d8dd, knob shadow, cloud translate(-32px,5px), stars opacity 1.
- Every feed selector the script targets still exists in main.min.261102-102115.css: rh-feed-login-cta, rh-feed-empty-hint, rh-feed-interstitial, rh-feed-channel-head__title and __desc, rh-feed-post--text, rh-feed-post__body, rh-feed-post__verb, rh-devcard, rh-checkin, rh-checkin__label, rh-feed-composer, __textarea, __submit.
- Feed endless loading (IntersectionObserver on [data-feed-loadmore], insertAdjacentHTML into [data-feed-list]) and the listing .rh-endless-sentinel only append markup; feed theming is pure CSS, so appended posts are styled without any observer.
- /new/ selectors .rhnew-wrap h1, .rhnew-wrap &gt; div &gt; p and .rhnew-card &gt; span:last-of-type &gt; span still match; no contrast regression in light, dark or hybrid state.
- Navbar, menu, footer, .search and .search .button.is-dark rules still apply; the site rule .search .button.is-dark{background-color:#61124b} still exists, so that override is still needed; no site !important competes for .navbar or .navbar-menu backgrounds.
- The site's ad guard and video capture body observers only act on fixed full-screen overlays with foreign iframes or on video players; they do not remove script-added nodes.
- The script runs without errors on all 15 non-stub pages in this dimension (harness: 6 observers created, 0 callbacks).
- Site CSS has no prefers-color-scheme media query and no @layer; its dark theme is purely data-theme driven, so OS light plus data-theme dark renders like OS dark plus data-theme dark.
- Script rail rules win over the site's zero-specificity :where(html[data-theme=dark]) .rh-rail* rules.
- Feed login CTA, empty hint, interstitials and channel heads are readable in every state; no light-mode contrast regression on feed, /new/, sell, membership, changelog-site, Agent, Prompt, Plugin, Cherri or Skill pages beyond the variable-collision items.

**theme-audit-rerun**

- The toggle re-key values at L245-L258 match the current native html[data-theme=dark] .rh-theme-toggle rules exactly (#3d3a45, translateX(24px), #d8d8dd, knob shadow, translate(-32px,5px), stars opacity 1).
- The site CSS has no prefers-color-scheme media queries. Native dark is attribute-only: 1,370 :where(html[data-theme=dark]) selectors, 57 plain html[data-theme=dark], 1 html:where([data-theme=dark]).
- No selector list mixes gated and ungated selectors (0 of 1,111 gated rules), so per-selector class extraction is unambiguous.
- The documented overlap method reproduces: 125 classes in the script's 4 GM.addStyle blocks intersected with all gated selectors gives 87, and 71 without the 16 alpha23 rh-rail classes, matching both earlier runs.
- rh-rail coverage holds: the script styles 16 of 18 native dark rh-rail classes. rh-rail__join is left native on purpose; rh-rail__treelink--locked is new.
- 31 of the 33 classes in the tracker's discovered_gaps still exist in the current CSS.
- The site CSS uses no @layer and the script's styles are unlayered, so plain specificity analysis applies for author-origin injection.
- None of the script's 16 own rh-* class names collides with a site class in the current build.
- The native dark theme only changes colors (1,108 of 1,111 rules), so using it as the base layer brings no layout side effects.
- After the /new/ redesign the structural selectors .rhnew-card &gt; span:last-of-type &gt; span, .rhnew-wrap h1 and .rhnew-wrap &gt; div &gt; p still match (rhnew-card__body &gt; __name/__desc, h1.rhnew-title, .rhnew-head &gt; p.rhnew-sub). The native dark theme now covers these classes itself.
- The remap proof of concept output reparses cleanly: 989 rules, 1,225 selectors, 1,242 declarations, 0 leftover data-theme gates.

**a11y-contrast**

- Palette text pairs pass: --rh-text on --rh-bg 12.93:1, --rh-surface-1 11.24:1, --rh-surface-2 7.48:1.
- Accent links pass on every script surface: --rh-bg 10.50:1, --rh-surface-1 9.13:1, --rh-surface-2 6.08:1, .rh-notification--unread (accent-dim over --rh-bg) 8.47:1.
- 0.65 tier passes on --rh-bg 6.00:1 and --rh-surface-1 5.51:1: .text-muted in comments 5.53:1, .rh-hero-header__meta and hero extras 5.98:1, .rh-release__date, .rhnew-wrap subtitle, .rh-rail__hash/__title/__chev.
- 0.85 tier (.rh-stat__label) passes: 5.90:1 on --rh-surface-2, 9.50:1 on --rh-bg.
- .rh-rail__link.is-active (--rh-bg on --rh-accent) 10.50:1; rail hover accent on --rh-surface-1 9.13:1; .rh-rail__close at opacity .65 is 6.00:1 (computed, rail markup not captured).
- Minibar accent vs .rh-pubgraph__stage #282128 with data-theme=dark 8.76:1 and vs card --rh-bg 10.50:1, so 3:1 for graphics holds in that state.
- Comment area in both dark states: body text 11.24:1 on .rh-top-comment, reply toggle 9.13:1, Expand all button 7.48:1, typed textarea text 7.48:1.
- Theme toggle keeps the site's :focus-visible white outline (10.88:1 on --rh-surface-2) and its prefers-reduced-motion rule; the script adds no animations.
- Stat tile DOM order is label then value, so screen readers read 'Shortcuts 29' despite the CSS order swap; hidden replies use display:none and leave the accessibility tree consistently.
- Injected cards use h2.rh-card__title like their siblings; Required Apps keeps its h2 after the move; the cloned changelog link has no aria-label, so its name 'Changelog' matches the visible text.
- In-text links keep the site's underline (text-decoration-line:underline), so WCAG 1.4.1 is met even though accent vs body text is only 1.23:1; the dark-theme underline itself is faint at 1.55:1.
- .rh-stats-toggle and .rh-pubgraph-toggle set type=button; .rh-collapse-all is not inside a form on shortcut-4448 or 26376, so its missing type is harmless today.
- Search input typed text passes with data-theme=light (#353535 on #C7D6D4 8.18:1); only the dark-theme color and the placeholder fail.

**perf-robustness**

- No observer feedback loops. The theme observer filters data-theme while syncThemeClass writes only class and aria-checked. keepNavbar observes class and writes style. #feedback settles after 2 passes on a 545-comment load and 1 per interaction, consistent with F10.
- Navigation is full page loads. The site uses history.pushState only to strip one-shot URL params (created, logged-out and similar) and replaceState in endless scroll, so one init per page is the right model and no SPA hooks are needed.
- Late content is CSS-only territory. Listing endless scroll ([data-endless-scroll] on agents, category, both shortcut listings, skills) appends server-rendered cards via DOMParser, and the feed load-more uses insertAdjacentHTML. Neither contains .rh-topcard-action or .rh-listrow-action, and no JS feature targets them.
- Comment posting is a full form POST (shortcut-4448 has 26 forms: 1 search, 25 to /feedback/create_update), so new replies arrive with a reload. Archived comments arrive via $.ajax plus .html() and are processed by the observer.
- The site JS never references the elements the script edits once (.rh-hero-header__cta/__meta, .rh-info-list, .rh-install-pitch, .rh-apps-grid, .rh-stats-card, .rh-scroll--stats, .rh-section-title: 0 hits in script.min), so one-shot edits are not overwritten.
- addFreeStatsSummary is async, so a throw in it cannot abort later features. Fetches use 10 s AbortController timeouts cleared in finally, and non-OK statuses are handled.
- On irrelevant pages each feature function short-circuits in 0.25 to 2 ms in jsdom. The fixed per-page cost is dominated by debugNavbarSearchIssue (4 to 9 ms in jsdom) and keepNavbar.
- All 33 full snapshots run without a throw. Synchronous init median in jsdom: home 54 ms, shortcut-19090 101 ms (refreshComments 69 ms), 16 to 25 ms elsewhere.
- Idempotency guards hold under double execution for every feature except the homepage reorder.
- No same-origin iframes in any snapshot, so the missing @noframes has no effect today.
- No [data-rh-num] inside #feedback on 4448, 19090 or 26376, so the site's number formatter does not re-trigger the comment observer.
- The site's toggle reads state from data-theme, not aria-checked, so the script's aria-checked override cannot wedge the site's toggle logic. The theme observer is attribute-filtered and fired 0 times during page work.

**compat-packaging-license**

- The metadata block starts at line 1. The file is ASCII only with no BOM. The git blob uses LF; CRLF exists only in the working tree because of core.autocrlf=true. node --check passes.
- @match https://routinehub.co/* covers every final URL in the snapshot set. The other routinehub.co hosts (blog, academy, feedback, youtube, assets, analytics) are separate products or CDNs. The server HTML contains no iframes, so the missing @noframes does no harm today.
- @grant GM.addStyle is the correct spelling for Userscripts, which only offers the GM.* API. Tampermonkey 5.4.1 honours it and exposes GM_addStyle through the same grant.
- The script currently has no @namespace, so reinstalling under the same @name replaces the existing install in place. Verified in Tampermonkey 5.4.1: getUidsByName matches on the name.
- Tampermonkey's own comparator orders 1.0.0-alphaNN numerically (alpha10 is newer than alpha9) and ranks 1.0.0 above any alpha.
- The JS baseline is ES2020: 28 optional chains, 4 nullish operators, optional catch binding and async/await. It also uses MediaQueryList.addEventListener (Safari 14), AbortController and ChildNode.before/after/replaceWith. There are no ES2021+ APIs. Every engine that supports relaxed nesting supports all of this.
- CSS blocks 1, 2 and 4 use no nesting. Each GM.addStyle call creates a separate sheet, so a parse failure in block 3 cannot affect the others.
- The site CSS has no @layer rules (0 hits), so layered !important rules cannot outrank the script's unlayered !important rules.
- The script's own classes (rhe-dark, rh-meta-extra, rh-free-stats, rh-stats-secondary, rh-pubgraph__minibar*, rh-toggle-replies, rh-collapse-all, rh-top-comment) appear nowhere in the site's CSS, JS or HTML. The only clash is .rh-stat__icon.
- A same-origin fetch with credentials 'same-origin' needs no extra @grant or @connect.
- The file name ends in .user.js, so a raw GitHub URL opens the install page in Tampermonkey, Violentmonkey and Userscripts.
- @license MIT is a valid SPDX identifier, and the branch LICENSE uses the standard MIT wording.

**docs-consistency**

- Theme toggle values re-keyed at L245-258 still equal the site's html[data-theme=dark] .rh-theme-toggle rules in main.min.261102-102115.css (#3d3a45, translateX(24px), #d8d8dd, same box-shadow, translate(-32px,5px), stars opacity 1).
- The palette block in md L107-116 matches code L191-200 exactly.
- Changelog page selectors in md L39, L84 and L336 all exist. changelog-4448 has 134 article.rh-card.rh-release.rh-changelog__entry, each with __ios, __downloads, __foot, .rh-cta.matomo_download and .absolute-time.text-muted, plus one __latest badge. changelog-19090 has 56.
- The scoping in addChangelogButton still holds. The release card has a.rh-cta.rh-cta--secondary 'Version history' and the footer has a sitewide /changelog/ link. Single-version shortcut 26376 has no link and gets no button, as the code intends.
- Hero metadata labels Version, iOS and Updated still exist. Harness output on 4448: v10.0, iOS 18, Dec 20, 2024. The creator span is still the first meta child and starts with 'by'.
- Required Apps and .rh-install-pitch selectors work: 34 apps on 4448, 2 on 5870. The pitch stays on 19090 and 26376, which have no required apps.
- Comment selectors work. Deep nesting is real (jsdom depth up to 14 on 19090), and flattening takes 36 comments nested deeper than one level down to 0. The site bundle still loads /shortcut/&lt;id&gt;/archived-comments into #archivedCommentsContainer from #toggleArchived.
- The search overlay structure (.search.hide.has-background-primary-dark &gt; .search-bar &gt; form) and the site's .search .button.is-dark{background-color:#61124b} rule match md L340 and code L231-237. .search-button__label exists only in the desktop variant, as md L337 says.
- Site CSS still has .rh-scroll--stats&gt;.rh-stat{flex:0 0 140px;scroll-snap-align:start} and the native .rh-stat__label color #777, as md L79-80 says.
- .rh-tagline and .rh-proof-bar still use linear-gradient backgrounds, so the background-image reset in md L351-356 is still needed.
- Author Overview markup still uses &lt;a&gt; for Followers and Following and &lt;div&gt; for the rest (md L341). The Authored grid structure matches md L343, and Free badge removal works (tojioo 9 to 0, gluebyte 18 to 0).
- Feed selectors in md L326-331 exist logged out where expected: .rh-feed-post__body.markdown-content, .rh-feed-channel-head__title/__desc on 4 channels, .rh-feed-login-cta, .rh-feed-empty-hint, and 10 .rh-devcard under 'Trending Coders'.
- The navbar (#320832) and footer (#220622) are still dark in the site's light theme, so styling the chrome dark in every mode (md L118-121) still holds.
- Status.json values match its own allowed values. Audit and tracker counts add up (292+105-2=395; 71+395+209=675; 71+292+206=569).
- Every homepage component named in Status L97 exists live: .rh-stories, section.rh-ai-band 'Build with AI', 36 .rh-aicard, and the Best Sellers .rh-topgrid.
- The tracker note on the planned Views entry still holds. Shortcut pages show no public views count; the only matches are Matomo trackPageView calls.
- `node --check RoutineHub_Enhancer.user.js` passes, and the README install link uses the correct underscore file name.
- The repo working tree is clean, and the docs branch is main plus one commit (README, LICENSE), so it can fast-forward.
- The rail markers that the bundle and CSS still show are consistent with alpha23 (md L338): [data-rail-root], .rh-rail__sub, .rh-rail__tree, and 27 dark rail rules in the gray-purple palette, such as .rh-rail{background:#1f191f}.

**repo-process-roadmap**

- node --check RoutineHub_Enhancer.user.js passes (Node v24.13.0).
- Working tree clean; main equals origin/main; git fsck reports no errors.
- No secrets or tokens in tracked files (grep for api key, token, secret, password, bearer: only the word 'password' in a docs sentence).
- The index stores LF for all 4 files. No trailing whitespace. Tabs indent the code; the 43 space-led lines are block-comment continuations.
- RoutineHub-Reloaded-Status.json parses and uses only its documented status values.
- Prototype R1 and R2: no uncaught error, and all 4 GM.addStyle blocks applied on 32/32 fixtures.
- Prototype R6 and R7: the changelog button appears exactly once where the release card links a changelog and not at all on single-version 26376. Hero meta gains Version, iOS and Updated.
- Prototype R8: on shortcut-19090 (84 comments) no reply nests deeper than one level after processing, and the toggle labels match the reply counts.
- Prototype R12: dataset guards keep shortcut and profile features idempotent under a double run (shortcut-4448, profile-gluebyte).
- The re-keyed toggle values in L245-L258 still equal the site's current html[data-theme=dark] toggle rules.
- The theme-audit extraction method still applies: the current CSS has 1,370 ':where(html[data-theme=dark])' selectors.
- Script-created class names collide with the site only through deliberate reuse (rh-card, rh-cta, rh-cta--secondary) plus rh-stat__icon.
- Shortcut pages have no native reply collapse, and #toggleArchived still exists on 4448 and 19090, so the comment features keep their purpose.
- .field-new-control still has 20 refs in the site CSS, so the login floating-label rule is not dead code.
- The LICENSE body on the branch is the standard MIT text.
- Metadata scope is minimal: one @match host and one @grant (GM.addStyle).

</details>

## Method and limitations

- 13 reviewer agents covered one area each: JS logic, CSS cascade, security, four live-page groups, theme audit, accessibility, performance, packaging and license, docs, repo and roadmap. One merge step reduced 170 raw findings to 86.
- Skeptic checks ran by severity: three for high, two for medium, one for low. Info items were not checked. None of the 86 findings was refuted.
- The usage limit hit twice. 22 low checks and both planned critic passes did not run. Those entries say so.
- Snapshots: 34 pages fetched with curl, logged out, plus the current stylesheet and site JS. Page scripts were not executed.
- A jsdom harness ran the script against every snapshot. jsdom has no layout and no cascade. Contrast figures come from CSS analysis, not rendered pixels.
- Injecting the script into the live page was blocked by the auto-mode classifier. No rendered run on the live site happened.
- Logged-in pages, the rail, the owner stats card, settings and notifications were not checked.
- Verification notes for low findings are omitted to keep the file readable.
- Snapshots, harness and raw agent output live in a temporary folder outside the repo. They are not committed.
