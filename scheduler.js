// ============================================================
// LifeOS — scheduler.js (Sistèm Notifikasyon ak Travay Otomatik)
// ============================================================
import { store } from "./core.js";
import { calculatePlanStatus } from "./planLogic.js";

const ALERT_THRESHOLDS = [3, 2, 1];

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

function buildAlertMessage(daysLeft, plan) {
  return daysLeft === 1
    ? `Plan ${plan.provider} ou a ekspire demen.`
    : `Plan ${plan.provider} ou a ekspire nan ${daysLeft} jou.`;
}

export function runAutomaticChecks(state) {
  console.log("[LifeOS Scheduler]: Chèk otomatik yo ap kouri...");

  const plan = state.internetPlan;
  if (!plan || !plan.startDate) return;

  const { daysLeft, renewDate } = calculatePlanStatus(plan);
  if (!ALERT_THRESHOLDS.includes(daysLeft)) return;

  // Anpeche double alèt pou menm nivo a ak menm dat renouvèlman an
  const alertsAktyèl = state.planAlerts || [];
  const dejaAlète = alertsAktyèl.some(a => a.level === daysLeft && a.renewDate === renewDate);
  if (dejaAlète) return;

  const nouvoAlèt = {
    id: `plan-${renewDate}-${daysLeft}`,
    level: daysLeft,
    renewDate,
    provider: plan.provider,
    message: buildAlertMessage(daysLeft, plan),
    createdAt: new Date().toISOString(),
    read: false
  };

  notify.send("Plan Entènèt Prèske Fini", {
    body: nouvoAlèt.message,
    icon: "/favicon.ico"
  });

  // Sa a deklanche re-render otomatik (main.js koute chanjman store la)
  store.setState(s => ({
    ...s,
    planAlerts: [...(s.planAlerts || []), nouvoAlèt]
  }));
}
