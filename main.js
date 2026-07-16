import { store } from './core/store.js';
import { notify } from './core/notify.js';
import { runAutomaticChecks } from './core/scheduler.js';
import { renderAll, renderDayArc } from './ui/render.js';
import { bindGlobalEvents } from './ui/events.js';

const DAY_ARC_REFRESH_MS = 60 * 1000;       // keep the clock/arc live
const NOTIFICATION_CHECK_MS = 5 * 60 * 1000; // re-evaluate automatic alerts periodically

function init() {
  renderAll(store.getState());
  bindGlobalEvents();

  // Every future write to the store (from any domain module, any
  // future feature) automatically re-renders the whole dashboard.
  store.subscribe(state => renderAll(state));

  notify.requestBrowserPermission();
  runAutomaticChecks(store.getState());

  setInterval(renderDayArc, DAY_ARC_REFRESH_MS);
  setInterval(() => runAutomaticChecks(store.getState()), NOTIFICATION_CHECK_MS);
}

document.addEventListener('DOMContentLoaded', init); me nouvo a 
