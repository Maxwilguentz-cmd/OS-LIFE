/**
 * LifeOS - Routes Registry & Navigation
 * Jere navigasyon ant diferan modil yo san reload paj la.
 */

import { renderTasksView, bindTasksEvents } from "../modules/tasks/tasksView.js";
import { renderCalendarView, bindCalendarEvents } from "../modules/calendar/calendarView.js";
import { renderFinanceView, bindFinanceEvents } from "../modules/finance/financeView.js";
import { renderProjectsView, bindProjectsEvents } from "../modules/projects/projectsView.js";
import { renderLearningView, bindLearningEvents } from "../modules/learning/learningView.js";
import { renderSettingsView, bindSettingsEvents } from "../modules/settings/settingsView.js";
import { bindGlobalEvents } from "../ui/events.js";
import { renderHabitsView, bindHabitsEvents } from "../modules/habits/habitsView.js";
import { initDashboardBackup, restoreDashboardView } from "../modules/dashboard/dashboardView.js";
import { store } from "../core/store.js";

// Kaptire backup Dashboard orijinal la IMEDYATMAN, pandan mainContent
// toujou gen gri (.grid) ki soti dirèkteman nan index.html.
// Sa a dwe rive anvan nenpòt navigasyon/klik itilizatè a.
initDashboardBackup();

// 1. Lis tout wout (routes) ki disponib nan aplikasyon an
export const routesRegistry = {
  dashboard: {
    id: "dashboard",
    title: "Tableau de Bord",
    init: (state) => {
      restoreDashboardView();
      bindGlobalEvents(); // Re-atache tout koute yo paske innerHTML te detwi yo
    }
  },
  tasks: {
    id: "tasks",
    title: "Tâches & Objectifs",
    init: (state) => {
      renderTasksView(state);
      bindTasksEvents();
    }
  },
  calendar: {
    id: "calendar",
    title: "Calendrier & Routine",
    init: (state) => {
      renderCalendarView(state);
      bindCalendarEvents();
    }
  },
  finance: {
    id: "finance",
    title: "Finances & Budget",
    init: (state) => {
      renderFinanceView(state);
      bindFinanceEvents();
    }
  },
  projects: {
    id: "projects",
    title: "Projets & Notes",
    init: (state) => {
      renderProjectsView(state);
      bindProjectsEvents();
    }
  },
  learning: {
    id: "learning",
    title: "Apprentissage & Suivi",
    init: (state) => {
      renderLearningView(state);
      bindLearningEvents();
    }
  },
  settings: {
    id: "settings",
    title: "Configuration",
    init: (state) => {
      renderSettingsView(state);
      bindSettingsEvents();
    }
  },
  habits: {
    id: "habits",
    title: "Habitudes",
    init: (state) => {
      renderHabitsView(state);
      bindHabitsEvents();
    }
  }
};

/**
 * Navige vè yon modil espesifik
 * @param {string} routeId - ID wout la (pa egzanp: 'dashboard')
 */
export function navigateTo(routeId) {
  // Fallback si wout la pa egziste nan registry a
  let targetRoute = routesRegistry[routeId];
  if (!targetRoute) {
    targetRoute = routesRegistry.dashboard;
  }

  // A. Jere klas 'is-active' sou sidebar la
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("data-route") === targetRoute.id) {
      item.classList.add("is-active");
    } else {
      item.classList.remove("is-active");
    }
  });

  // B. Chanje tit la nan topbar la (#viewTitle) selon tradiksyon lang ki aktif la
  const viewTitleEl = document.getElementById("viewTitle");
  if (viewTitleEl) {
    const currentLang = store.getState().settings?.language || "en";
    const dict = {
      en: {
        dashboard: "Dashboard",
        tasks: "Tasks",
        calendar: "Calendar",
        finance: "Finances",
        projects: "Projects",
        learning: "Learning",
        settings: "Settings",
        habits: "Habits"
      },
      ht: {
        dashboard: "Tablo de Bò",
        tasks: "Tach & Objektif",
        calendar: "Kalandriye & Routine",
        finance: "Finans & Bidjè",
        projects: "Pwojè & Nòt",
        learning: "Aprantisaj",
        settings: "Konfigirasyon",
        habits: "Abitid"
      },
      fr: {
        dashboard: "Tableau de Bord",
        tasks: "Tâches & Objectifs",
        calendar: "Calendrier & Routine",
        finance: "Finances & Budget",
        projects: "Projets & Notes",
        learning: "Apprentissage",
        settings: "Configuration",
        habits: "Habitudes"
      }
    };
        
    // Mete tit la nan lang chwazi a, si li pa jwenn li li pran tit wout la pa defo
    viewTitleEl.textContent = dict[currentLang]?.[targetRoute.id] || targetRoute.title;
  }

  // C. Rele fonksyon init wout la ak state aktyèl store la
  if (typeof targetRoute.init === "function") {
    try {
      targetRoute.init(store.getState());
    } catch (error) {
      console.error(`Erè pandan inisyalizasyon wout ${targetRoute.id}:`, error);
    }
  }
}

// 2. Koute klik sou sidebar a lè DOM nan pare
document.addEventListener("DOMContentLoaded", () => {
  // Koute klik sou tout eleman ki gen atribi data-route
  document.body.addEventListener("click", (e) => {
    const routeTrigger = e.target.closest("[data-route]");
        
    if (routeTrigger) {
      e.preventDefault(); // Anpeche href la reload paj la
      const routeId = routeTrigger.getAttribute("data-route");
      navigateTo(routeId);
      // Fèmen sidebar a ak scrim nan otomatikman apre navigasyon an fin fèt
      const sidebar = document.getElementById("sidebar");
      const sidebarScrim = document.getElementById("sidebarScrim");
      if (sidebar) {
        sidebar.classList.remove("is-open");
      }
      if (sidebarScrim) {
        sidebarScrim.classList.remove("is-active");
      }
    }
  });
});
