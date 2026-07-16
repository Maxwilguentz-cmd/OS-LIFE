import { store } from './core/store.js';
import { persistence } from './core/persistence.js';
import { notify } from './core/notify.js';
import { runAutomaticChecks } from './core/scheduler.js';
import { renderAll, renderDayArc } from './ui/render.js';
import { bindGlobalEvents } from './ui/events.js';

const DAY_ARC_REFRESH_MS = 60 * 1000;        // keep the clock/arc live
const NOTIFICATION_CHECK_MS = 5 * 60 * 1000; // re-evaluate automatic alerts periodically

function init() {
  // 1. Konekte pèsistans lan pou chaje ansyen done yo an premye
  store.use(persistence.middleware);

  // 2. Rann eta inisyal la (ki gen done ki sot nan LocalStorage yo kounye a)
  renderAll(store.getState());

  // 3. Mare evènman UI yo
  bindGlobalEvents();

  // Every future write to the store (from any domain module, any
  // future feature) automatically re-renders the whole dashboard.
  store.subscribe(state => renderAll(state));

  notify.requestBrowserPermission();
  runAutomaticChecks(store.getState());

  setInterval(renderDayArc, DAY_ARC_REFRESH_MS);
  setInterval(() => runAutomaticChecks(store.getState()), NOTIFICATION_CHECK_MS);
}

document.addEventListener('DOMContentLoaded', init);
