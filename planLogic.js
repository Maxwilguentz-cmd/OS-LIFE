// ============================================================
// LifeOS — planLogic.js (Lojik Kalkil Plan Entènèt)
// ============================================================
/**
 * Retounen kantite jou total yon plan bay selon tip li
 * @param {string} planType - Kalite plan an (24h, 5j, semèn, mwa)
 * @returns {number} Kantite jou nominal
 */
export function getDaysFromType(planType) {
  switch (planType) {
    case "24h": return 1;
    case "5j": return 5;
    case "semèn": return 7;
    case "mwa": return 30;
    default: return 30; // Valè sekirite pa defo
  }
}

/**
 * Kalkile tout detay yon plan an tan reyèl pa rapò ak dat jodi a
 * @param {Object} plan - Objè plan an ki soti nan store la (internetPlan)
 * @returns {Object} { daysLeft, daysUsed, pct, renewDate, status }
 */
export function calculatePlanStatus(plan) {
  if (!plan || !plan.startDate) {
    return { daysLeft: 0, daysUsed: 0, pct: 0, renewDate: null, status: "Pa gen plan" };
  }
  const jodiA = new Date();
  const datKomanse = new Date(plan.startDate);

  const milisgondNanYonJou = 24 * 60 * 60 * 1000;
  const renewDateTime = datKomanse.getTime() + (plan.totalDays * milisgondNanYonJou);
  const renewDate = new Date(renewDateTime);

  const diferansMilisgond = renewDateTime - jodiA.getTime();

  let daysLeft = Math.ceil(diferansMilisgond / milisgondNanYonJou);

  if (daysLeft > plan.totalDays) daysLeft = plan.totalDays;
  const afichajDaysLeft = daysLeft < 0 ? 0 : daysLeft;
  const daysUsed = plan.totalDays - afichajDaysLeft;

  const pct = Math.min(Math.round((daysUsed / plan.totalDays) * 100), 100);

  let status = "Aktif";
  if (daysLeft <= 0) {
    status = "Ekspire";
  } else if (daysLeft <= 2) {
    status = "Prèske fini";
  }

  return {
    daysLeft: afichajDaysLeft,
    daysUsed,
    pct,
    renewDate: renewDate.toISOString().split('T')[0],
    status
  };
}
