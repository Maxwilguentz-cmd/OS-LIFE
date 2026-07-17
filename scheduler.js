// ============================================================
// LifeOS — scheduler.js (Sistèm Notifikasyon ak Travay Otomatik)
// ============================================================

export const notify = {
  async requestBrowserPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  },
  
  send(title, options = {}) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    } else {
      console.log(`[LifeOS Alert]: ${title}`, options.body || "");
    }
  }
};

export function runAutomaticChecks(state) {
  console.log("[LifeOS Scheduler]: Chèk otomatik yo ap kouri...");
  
  // Alèt si entènèt la rete mwens pase 5 jou
  if (state.internetPlan && state.internetPlan.daysLeft <= 5) {
    notify.send("Plan Entènèt Prèske Fini", {
      body: `Ou gen sèlman ${state.internetPlan.daysLeft} jou ki rete sou plan ${state.internetPlan.provider} ou an.`,
      icon: "/favicon.ico"
    });
    
    const badge = document.getElementById("notificationBadge");
    if (badge) badge.style.display = "block";
  }
}
