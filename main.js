import "./routes/registry.js";
import { store } from "./core/store.js";
import { persistence } from "./core/persistence.js";
import { notify } from "./core/notify.js";
import { runAutomaticChecks } from "./core/scheduler.js";
import { applyLanguage } from "./core/i18n.js";
import { renderAll } from "./ui/render.js";
import { bindGlobalEvents } from "./ui/events.js";


const DAY_ARC_REFRESH_MS = 60000;
const NOTIFICATION_CHECK_MS = 300000;


// Selektè pou evite re-render initil lè se sèlman meta.updatedAt ki chanje
const selectRenderableState = (state) => {
    const { meta, ...rest } = state;
    return rest;
};


function init(){

    // Persistence middleware
    store.use(persistence.middleware);


    // Initial UI render
    renderAll(store.getState());


    // React only when renderable state changes
    store.subscribeSelector(
        selectRenderableState,
        (newState)=>{
            renderAll(newState);
        }
    );


    // User interactions
    bindGlobalEvents();


    // Notifications
    notify.requestBrowserPermission();


    // Automatic system checks
    runAutomaticChecks(store.getState());


    // Refresh time arc
    setInterval(()=>{
        renderAll(store.getState());
    }, DAY_ARC_REFRESH_MS);


    // Scheduler
    setInterval(()=>{

        runAutomaticChecks(
            store.getState()
        );

    }, NOTIFICATION_CHECK_MS);

}



document.addEventListener(
    "DOMContentLoaded",
    init
);
