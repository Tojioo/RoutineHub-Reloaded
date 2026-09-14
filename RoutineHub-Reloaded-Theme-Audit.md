# RoutineHub native dark theme, coverage audit

Regenerated 2026-09-11 against `main.min.260911-200127.css`. The previous
run on 2026-09-10 used `main.min.260905-184801.css`, a file already gone
from the live site. RoutineHub replaces these builds fast, so treat any
single run of this audit as a snapshot, not a stable reference. Re run
whenever it matters.

Method note. This checks whether a class string appears anywhere in the
userscript. A class can show up as a gap even if it already renders fine
in practice, because it inherits correctly from a parent we do style. The
audit tells you where to look, not what is actually broken.

## Numbers, this run compared to the previous run

| metric | 2026-09-10 | 2026-09-11 |
|---|---|---|
| distinct classes in their dark theme | 569 | 675 |
| overlap with classes we already touch | 71 | 71 |
| gap, `rh-` prefixed | 292 | 395 |
| gap, generic or vendor, treated as noise | 206 | 209 |

105 `rh-` prefixed classes appeared that were not in the previous run.
2 classes left the gap, most likely because a rule was removed rather
than because we started covering them, since nothing relevant changed on
our side between the two runs.

## New this run, worth a look

- `rh-checkin-board`, `rh-checkin-board__avatar`, `__days`, `__me`,
  `__more`, `__name`, `__row`, `__row--me`, `__title`, `__window`, plus a
  new `rh-checkin__done` modifier on the existing check in element. Reads
  like a leaderboard or shared board view of check ins across multiple
  users, separate from the single user daily check in card already
  tracked on the Feed page.
- `rh-feed-post__type--cherri`, `--item`, `--jellycut`, `--plugin`,
  `--prompt`, `--shortcut`, `--skill`. Confirms feed posts carry a per
  content type badge. Relevant to the Feed page entry already in the
  tracker.
- `rh-segmented`, `rh-segmented__badge`, `rh-segmented__option`. A native
  segmented control component. Directly relevant to the planned Authored
  view mode switcher, since a Grid, List, Detailed switcher is exactly a
  segmented control. Worth checking what this component actually looks
  like before building a custom one from scratch.
- `rh-alsocard`, `__brief`, `__cat`, `__foot`, `__name`, `__stat`. Reads
  like a related items or also see card, purpose and location
  unconfirmed.
- `rh-meter__bar`, `__big`, `__count`, `__kicker`, `__pop`, `__renews`,
  `__signin`, `__what`. Possibly a usage or subscription meter.
- `rh-keys__fp`, `__row`, `__title`, `__when`. Almost certainly API key
  management, part of the already unchecked API settings page.
- `rh-cancel-option` and `rh-danger-zone` with their children. Account
  cancellation flow, part of the already unchecked Account settings page.
- `rh-box`, `rh-boxes`, and a large family of children covering a clock,
  a confirm dialog, an event log, a feed wait state, metrics, rows, a
  shape, an SSH command panel, and states named creating, queued, ready,
  failed, plus a tomb state. Terminology suggests some kind of sandbox or
  cloud environment with provisioning states and SSH access. Nothing in
  this project has encountered a feature like this before. Flagged as
  unclear rather than guessed at further, worth asking about directly if
  it matters.
- `rh-mod-list` and `rh-mod-tag` variants. More moderation tooling, same
  tier 3, out of scope reasoning as the rest of the `rh-mod` family
  already noted.

-----

## Everything else from the previous run, still valid

The 2026-09-10 run's tier 1, tier 2, and tier 3 findings below are
unchanged in substance, only the counts above were refreshed.

### Tier 1, components on pages already tracked

- `rh-comment`, `rh-comment-thread`, `rh-comment__action`,
  `__action--danger`, `__avatar`, `__body`, `__edit`, `__name`,
  `__name--deleted`, `__react-btn`, `__replies`, `__reply-form`, `__sep`,
  `__time`. Looks like a separate comment system from the one built for
  collapsing and flattening on the shortcut page, `#feedback` and
  `article.media` with a `data-feedback-id` attribute. Needs confirming
  where `rh-comment` actually renders, most likely feed post replies.
- `rh-notification__actor`, `__avatar`, `__badge`, `__chip`, `__obj`,
  `__stat`, `__text`, plus `rh-notif-card` and its children `__brief`,
  `__name`, `__stats`, plus `rh-notif-empty`. Only
  `rh-notification__quote` was ever fixed. The notifications page has far
  more surface than that one element.
- `rh-devcard__avatar`, `__name`, `__stats`. Feed page Trending Coders,
  container fixed, children not.
- `rh-checkin__btn`, `__btn--done`, `__stats`. Feed page daily check in,
  same pattern.
- `rh-feed-post__avatar`, `__avatar-fallback`, `__badge--announce`,
  `__handle`, `__name`, `__react-btn`, `__sep`, `__time`, `__type--post`,
  `__type--update`. Card and body fixed, author line and reaction buttons
  not checked.
- `rh-feed-composer__avatar`, `__foot`, `__hint`.
- `rh-feed-daygroup`, `rh-feed-spinner`, `rh-feed-tab`, `rh-endless-end`,
  `rh-endless-sentinel`, `rh-endless-spinner`. Feed and Discover
  infrastructure, never explicitly checked.
- `rh-appcard-stats`. Download and heart row on Discover and listing
  cards, only `-name` and `-brief` were fixed.
- `rh-heart`. The like toggle icon on shortcut pages and feed posts,
  never explicitly styled.
- `rh-hero-header__qr`, `__qr-title`. A QR code feature on the shortcut
  hero header, existence unknown before this audit.
- `rh-cta`, `rh-cta--disabled`, `rh-cta--warning`. Confirms they theme
  the bare `rh-cta`, the primary blue button left native throughout this
  project. Not necessarily a problem, worth a glance at the disabled and
  warning variants.
- `rh-pubgraph__daylabels`, `__legend`, `__month`, `__total`. Only
  relevant if the Show full year view on the profile page still renders
  their native heatmap rather than the rebuilt weekly bar chart.
- `rh-changelog__foot`, `rh-changelog__latest`. The already known Latest
  badge and an unchecked footer wrapper.
- `rh-proof-detail`, `rh-proof-headline`. Homepage proof bar children,
  already confirmed working via inheritance, they have explicit rules
  too.
- `rh-social-icon`. Profile Contact icons, matches the note already in
  the tracker.
- `rh-topcard--heatseeker`. A trending card variant on the homepage, not
  yet seen.
- `rh-search-form`, `__icon`, `__input`, `rh-search__error`, `__summary`,
  `rh-search-browse__row`, `rh-browse__card`, `__hints`, `__kind`,
  `__row`, `__row--muted`, `__section`, `__sections`, `__title`,
  `__title--results`. The actual search results and category browse
  content, only the outer `.search` overlay container was themed.
- `rh-markdown`. Possibly a more general rendered content wrapper than
  the feed post body specifically.
- `rh-empty-state`. Generic no results component, could appear on any
  list or grid page.

### Tier 2, pages or features that exist and were unknown before this audit

- `rh-skill-actionrow`, `-canvas`, `-footlinks`, `-hero`, `-hero-brief`,
  `-hero-meta`, `-hero-title`, `-lead`, `-source`, `-version-meta`. A
  Skill detail page, structurally parallel to the shortcut detail page
  but for AI Skills as a content type. Probably the single most relevant
  new surface found so far.
- `rh-blog-card__excerpt`, `__image`, `__lock`, `__meta`, `__tag`,
  `rh-blog-content`, `rh-blog-empty`, `rh-blog-header__brief`,
  `rh-blog-pagination__count`, `rh-blog-post__excerpt`, `__hero`, `__meta`,
  `__tag`, `rh-blog-subscribe`, `__error`, `__input`. A Blog section.
- `rh-deal__celebrate`, and the `rh-deal-page` family. A promotional or
  offer page, purpose unconfirmed.
- `rh-wall-door` and children, `rh-pay-sheet__`, `rh-paywall__button`,
  `rh-creator-trial__`, `rh-member-status`, `rh-subs`, `rh-tip`. A
  membership, paywall, and tipping surface. Likely reachable from the
  homepage proof bar Start selling link.
- `rh-sell-*` family. Almost certainly the sell landing page itself.
- `rh-catpick__count`, `__empty`, `__filter`, `__icon`, `__tile`. A
  category picker, location unconfirmed.
- `rh-describe__chip`, `__close`, `__label`, `__note`, `__panel`,
  `__preview`, `__progress`, `__reveal-input`, `__reveal-label`, `__skip`,
  plus `rh-describe-trigger`. Some kind of guided or AI assisted
  description flow.
- `rh-ad-overlay` and `rh-ad-slot`. An ad interstitial, likely shown to
  non members.
- `rh-tzpick__*` family. A timezone picker, presumably in account
  settings.
- `rh-settings`, `rh-settings-file`, `rh-settings-subhead`,
  `rh-avatar-row`, `rh-avatar-remove`, `rh-autosave-hint`. Account
  settings additions beyond what is already listed as unchecked.
- `rh-assist-dash__lede`, `__note`. Unclear, possibly a creator analytics
  or assistant dashboard.
- `rh-score__band`, `__bar`, `__todo-item`. Unclear, possibly a shortcut
  quality score or publishing checklist.
- `rh-unpublished`, `rh-uwc-copy`. Unclear without more context.

### Tier 3, explicitly out of scope

- `rh-mod-row`, `rh-mod-field`, `rh-mod-dropdown`, `rh-mod-report`,
  `rh-mod-count`, `rh-mod-deflist`, `rh-mod-empty`, `rh-mod-filtergroup`,
  `rh-mod-filters`, `rh-mod-guidelines`, `rh-mod-muted`,
  `rh-mod-note--warning`, `rh-mod-prose`, `rh-mod-radio`,
  `rh-mod-subtitle`, `rh-mod-list`, `rh-mod-tag`. Moderation tooling,
  relevant only if the user has moderator permissions, which nothing in
  this project has assumed so far.
- `rh-badge--approved`, `--deletion`, `--muted`, `--pending`,
  `--rejected`, `--review`. Moderation status badges, same reasoning.

## How to use this

Re run this audit again after any future native site update, the file
name has already changed twice during this project. The extraction method
is a regex over `:where(html[data-theme=dark])` selector blocks, diffed
against class references in the userscript. Ask for a re run rather than
doing this by hand if it comes up again.
