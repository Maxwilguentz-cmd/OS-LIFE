import { store } from './core/store.js';
import { persistence } from './core/persistence.js';
import { notify } from './core/notify.js';
import { runAutomaticChecks } from './core/scheduler.js';
import { renderAll, renderDayArc } from './ui/render.js';
import { bindGlobalEvents } from './ui/events.js';

const DAY_ARC_REFRESH_MS = 60 * 1000;
const NOTIFICATION_CHECK_MS = 5 * 60 * 1000;

function init() {

  // 1. Konekte persistence pou chaje/sove done yo
  store.use(persistence.middleware);

  // 2. Koute tout chanjman store pou mete UI ajou otomatikman
  store.subscribe(state => renderAll(state));

  // 3. Premye render ak done aktyèl yo
  renderAll(store.getState());

  // 4. Konekte aksyon itilizatè yo
  bindGlobalEvents();

  // 5. Sistèm notifikasyon ak scheduler
  notify.requestBrowserPermission();

  runAutomaticChecks(store.getState());

  setInterval(renderDayArc, DAY_ARC_REFRESH_MS);

  setInterval(() => {
    runAutomaticChecks(store.getState());
  }, NOTIFICATION_CHECK_MS);
}

document.addEventListener("DOMContentLoaded", init);
