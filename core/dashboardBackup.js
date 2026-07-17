/* ==========================================================================
   LifeOS — Dashboard Backup Shared Module (ES Modules)
   ========================================================================== */
let dashboardBackupHTML = null;
export function getDashboardBackup() {
  return dashboardBackupHTML;
}
export function setDashboardBackup(html) {
  if (dashboardBackupHTML === null && html) {
    dashboardBackupHTML = html;
  }
}
/**
 * Retabli Dashboard la depi nan backup pataje a
 */
export function restoreDashboardView() {
  const mainContent = document.getElementById("mainContent");
  if (mainContent && dashboardBackupHTML) {
    mainContent.innerHTML = dashboardBackupHTML;
  }
}
