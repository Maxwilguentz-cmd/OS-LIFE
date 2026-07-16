/**
 * LifeOS - Routes Registry & Navigation
 * Jere navigasyon ant diferan modil yo san reload paj la.
 */
import { renderTasksView, bindTasksEvents, restoreDashboardView } from "../modules/tasks/tasksView.js";
import { store } from "../core/store.js";

// 1. Lis tout wout (routes) ki disponib nan aplikasyon an
export const routesRegistry = {
  dashboard: {
    id: "dashboard",
    title: "Tableau de Bord",
    init: (state) => {
      restoreDashboardView();
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
    init: () => {}
  },
  finance: {
    id: "finance",
    title: "Finances & Budget",
    init: () => {}
  },
  projects: {
    id: "projects",
    title: "Projets & Notes",
    init: () => {}
  },
  learning: {
    id: "learning",
    title: "Apprentissage & Suivi",
    init: () => {}
  },
  settings: {
    id: "settings",
    title: "Configuration",
    init: () => {}
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

  // B. Chanje tit la nan topbar la (#viewTitle)
  const viewTitleEl = document.getElementById("viewTitle");
  if (viewTitleEl) {
    viewTitleEl.textContent = targetRoute.title;
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
    }
  });
});
