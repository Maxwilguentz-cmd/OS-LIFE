# LifeOS — Architecture

## Important caveat first

I only had `dashboard.css`, `dashboard.html`, and the old `main.js` to work
from — `core/store.js`, `core/notify.js`, `core/scheduler.js`,
`ui/render.js`, and `ui/events.js` weren't provided, so I couldn't literally
"audit" the existing `store.js`. What's here is a from-scratch implementation
that preserves the API your old `main.js` was calling
(`store.getState()`, `store.subscribe()`, `notify.requestBrowserPermission()`,
`runAutomaticChecks(state)`, `renderAll(state)`, `renderDayArc`,
`bindGlobalEvents()`) so it's a drop-in replacement rather than a rewrite of
call sites you haven't shown me. If your real `store.js` already did some of
this differently, tell me what it looked like and I'll reconcile the two
instead of guessing further.

## Folder layout

```
lifeos/
  main.js                  composition root — the only file that wires everything together
  core/
    store.js                state container: slices, immutable updates, selector subscriptions
    initialState.js          default shape for every slice / future page
    persistence.js            localStorage autosave (debounced) + schema migrations
    backup.js                  manual JSON export/import
    notify.js                    browser Notification API + in-app queue
    scheduler.js                   runs each service's checkAlerts() on an interval
  services/
    taskService.js, moodService.js, goalsService.js, financeService.js,
    internetService.js, learningService.js, habitsService.js
  ui/
    render.js               one render function per slice
    events.js                 DOM listeners → service calls (never touch state or DOM directly)
  routes/
    registry.js              metadata for every planned page (built: true/false), no UI
```

## The core patterns

**State lives in one place, split into slices.** `store.getState()` returns
`{ tasks, mood, goals, finance, internet, projects, learning, habits,
weeklyStats, notifications, meta }`. Every future page reads one or two of
these slices — nothing reaches into another slice's internals.

**Services are the only thing allowed to call `store.update()`.** A service
is a small factory — `createFinanceService(store)` — that returns named
actions (`addTransaction`, `setBudget`, ...). UI code calls
`financeService.addTransaction(...)`; it never calls `store.update('finance', ...)`
directly. That's what makes "prepare the architecture for a Finance page"
mostly free — the page's UI just calls the same service functions the
dashboard card already does.

**Selective rendering replaces `renderAll()` on every change (requirement
5).** `store.subscribeSelector(selector, callback)` shallow-compares the
selected slice(s) before firing, so:

```js
store.subscribeSelector(s => s.tasks, renderTasks);
```

only re-renders the mission card when `tasks` actually changes — toggling a
mood face doesn't touch it. `renderAll()` still exists, but it's now only
used once, for first paint.

**Persistence is middleware, not a store feature.** `store.use(persistence.middleware)`
means `store.js` has zero `localStorage` calls in it — you can unit test the
store in Node with no DOM. Saves are debounced 400ms so rapid updates (e.g.
several `store.update()` calls in one user action) collapse into one write.
`core/persistence.js` also carries a `migrations` map keyed by
`SCHEMA_VERSION`, so bumping the version and adding a migration function is
the whole upgrade path when a slice's shape changes later.

**Backup is separate from autosave.** `core/backup.js` is the user-facing
"download my data" / "restore from file" pair — validates the file has all
required top-level slices before handing it to `store.updateMany()`, and
rejects with a readable message instead of throwing a raw JSON parse error.

## What's *not* done (on purpose)

- No new UI. `ui/render.js` targets markup that already exists in
  `dashboard.html` (by `id` where there is one, by scoped class lookup
  otherwise) — it doesn't add cards, buttons, or copy.
- No actual Tasks/Goals/Finance/... pages — `routes/registry.js` is metadata
  only (`built: false` for all but Dashboard). Building one is now "add a
  page that imports the matching service and a couple of render functions,"
  not a new architecture.
- `weeklyStats.days` has no real time-tracking source yet — `main.js` seeds
  it with placeholder minutes so the chart isn't empty; swap that for a real
  source (habitsService, or a dedicated timeTrackingService) whenever that
  data exists.

## Adding the next page (e.g. Finance)

1. Confirm `finance` slice shape in `initialState.js` is enough — extend it there.
2. Add any new actions to `services/financeService.js` (same factory pattern).
3. Write `ui/pages/finance.js` with its own render function(s); subscribe with
   `store.subscribeSelector(s => s.finance, renderFinancePage)` in `main.js`.
4. Flip `built: false → true` for `finance` in `routes/registry.js`.

No changes to `core/store.js` are needed for this — that's the point of the
slice/service split.
