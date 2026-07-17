/**
 * LifeOS - Dashboard View Module
 * Jere sovgad ak restorasyon HTML Dashboard orijinal la.
 */

// Sove kach kadriye dashboard orijinal la pou lè nou tounen sou li
let dashboardBackupHTML = null;

/**
 * Sove mainContent.innerHTML pandan Dashboard orijinal la toujou egziste nan kòmansman
 */
export function initDashboardBackup() {
  const mainContent = document.getElementById("mainContent");
  if (mainContent && !dashboardBackupHTML) {
    dashboardBackupHTML = mainContent.innerHTML;
  }
}

/**
 * Restore dashboard orijinal la si nou gen kopi a
 */
export function restoreDashboardView() {
  const mainContent = document.getElementById("mainContent");
  if (mainContent && dashboardBackupHTML) {
    mainContent.innerHTML = dashboardBackupHTML;
  }
}
