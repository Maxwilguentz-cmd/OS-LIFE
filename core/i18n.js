/**
 * LifeOS - core/i18n.js
 * Jere tradiksyon ak aplikasyon langaj sou koòdone aplikasyon an.
 */
import { store } from "./store.js";

export const TRANSLATIONS = {
  en: {
    dashboard: {
      title: "Dashboard",
      welcomeGreeting: "Let's make today count,",
      missionsCompleted: "You've completed",
      missionItems: "mission items and logged",
      focusedWork: "of focused work so far."
    },
    tasks: "Tasks",
    calendar: "Calendar",
    finance: "Finances",
    projects: "Projects",
    learning: "Learning",
    settings: "Settings",
    newTaskBtn: "New task"
  },
  ht: {
    dashboard: {
      title: "Tablo de Bò",
      welcomeGreeting: "Ann fè jounen jodi a konte,",
      missionsCompleted: "Ou konplete",
      missionItems: "tach nan misyon w yo epi ou pase",
      focusedWork: "nan travay konsantre jiskaprezan."
    },
    tasks: "Tach & Objektif",
    calendar: "Kalandriye & Routine",
    finance: "Finans & Bidjè",
    projects: "Pwojè & Nòt",
    learning: "Aprantisaj",
    settings: "Konfigirasyon",
    newTaskBtn: "Nouvo tach"
  },
  fr: {
    dashboard: {
      title: "Tableau de Bord",
      welcomeGreeting: "Faisons en sorte que chaque instant compte,",
      missionsCompleted: "Vous avez accompli",
      missionItems: "tâches de votre mission et enregistré",
      focusedWork: "de travail ciblé jusqu'à présent."
    },
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
 * Rekipere langaj ki aktif la nan store la
 * @returns {string} Kòd lang lan ("en", "ht", "fr")
 */
export function getCurrentLanguage() {
  const state = store.getState();
  return state.settings?.language || "en";
}

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
    if (routeId) {
      const span = item.querySelector("span");
      if (span) {
        // Piske dashboard se yon objè kounye a, nou asire nou pran sèlman tèks la si se yon objè
        if (routeId === "dashboard") {
          span.textContent = dict.dashboard.title;
        } else if (dict[routeId]) {
          span.textContent = dict[routeId];
        }
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
      if (activeRouteId) {
        if (activeRouteId === "dashboard") {
          viewTitleEl.textContent = dict.dashboard.title;
        } else if (dict[activeRouteId]) {
          viewTitleEl.textContent = dict[activeRouteId];
        }
      }
    }
  }
}
