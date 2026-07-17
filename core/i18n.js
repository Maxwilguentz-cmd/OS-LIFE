/**
 * LifeOS - core/i18n.js
 * Jere tradiksyon ak aplikasyon langaj sou koòdone aplikasyon an.
 */

export const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    tasks: "Tasks",
    calendar: "Calendar",
    finance: "Finances",
    projects: "Projects",
    learning: "Learning",
    settings: "Settings",
    newTaskBtn: "New task"
  },
  ht: {
    dashboard: "Tablo de Bò",
    tasks: "Tach & Objektif",
    calendar: "Kalandriye & Routine",
    finance: "Finans & Bidjè",
    projects: "Pwojè & Nòt",
    learning: "Aprantisaj",
    settings: "Konfigirasyon",
    newTaskBtn: "Nouvo tach"
  },
  fr: {
    dashboard: "Tableau de Bord",
    tasks: "Tâches & Objectifs",
    calendar: "Calendrier & Routine",
    finance: "Finances & Budget",
    projects: "Projets & Notes",
    learning: "Apprentissage",
    settings: "Configuration",
    newTaskBtn: "Nouvelle tâche"
  }
};

/**
 * Aplike tradiksyon yo sou sidebar la, bouton nouvo tach la ak HTML tag la
 * @param {string} langCode - Kòd lang lan ("en", "ht", "fr")
 */
export function applyLanguage(langCode) {
  const cleanLang = ["en", "ht", "fr"].includes(langCode) ? langCode : "en";
  const dict = TRANSLATIONS[cleanLang];

  // 1. Mete atribi lang lan sou dokiman an
  document.documentElement.lang = cleanLang;

  // 2. Tradwi lyen yo nan sidebar la
  const navItems = document.querySelectorAll(".nav-item[data-route]");
  navItems.forEach(item => {
    const routeId = item.getAttribute("data-route");
    if (routeId && dict[routeId]) {
      const span = item.querySelector("span");
      if (span) {
        span.textContent = dict[routeId];
      }
    }
  });

  // 3. Tradwi bouton "New task" nan topbar la
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) {
    const span = newTaskBtn.querySelector("span");
    if (span && dict.newTaskBtn) {
      span.textContent = dict.newTaskBtn;
    }
  }

  // 4. Mete ajou tit paj aktyèl la si li afiche nan topbar la
  const viewTitleEl = document.getElementById("viewTitle");
  if (viewTitleEl) {
    // Nou chache wout aktyèl la ki gen klas 'is-active'
    const activeNavItem = document.querySelector(".nav-item.is-active");
    if (activeNavItem) {
      const activeRouteId = activeNavItem.getAttribute("data-route");
      if (activeRouteId && dict[activeRouteId]) {
        viewTitleEl.textContent = dict[activeRouteId];
      }
    }
  }
}
