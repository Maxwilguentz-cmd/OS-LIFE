/**
 * LifeOS - Tasks View Module
 * Jere afichaj ak entèraksyon paj Tasks la kòm ES Module.
 */

import { taskService } from "../../services/taskService.js";
import { store } from "../../core/store.js";

// Sove kach kadriye dashboard orijinal la pou lè nou tounen sou li
let dashboardBackupHTML = null;
let currentFilter = "all"; // Filtre aktyèl la ("all", "active", "done")

/**
 * Filtre epi jenere HTML lis misyon yo dapre filtre aktyèl la
 * @param {Array} missions - Lis misyon ki soti nan state la
 * @returns {string} HTML lis la sèlman
 */
function generateMissionsListHTML(missions) {
  if (!missions || missions.length === 0) {
    return `<p class="mood-note" style="text-align: center; padding: 24px;">Pa gen okenn misyon pou kounye a.</p>`;
  }

  const filtered = missions.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true; // "all"
  });

  if (filtered.length === 0) {
    return `<p class="mood-note" style="text-align: center; padding: 24px;">Pa gen misyon ki koresponn ak filtre sa a.</p>`;
  }

  return filtered.map(task => {
    const isChecked = task.done ? "checked" : "";
    const doneClass = task.done ? "style='text-decoration: line-through; color: var(--text-tertiary);'" : "";
    const metaText = task.meta ? `<span class="user-role" style="display:block; font-size:0.75rem;">${task.meta}</span>` : "";

    return `
      <li class="mission-item card" data-id="${task.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; margin-bottom: 8px; background: var(--glass); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          <input type="checkbox" class="check" data-action="toggle" ${isChecked} style="cursor: pointer;" aria-label="Toggle task status">
          <div>
            <span class="task-title" ${doneClass} style="font-weight: 500; font-size: 0.95rem;">${task.title}</span>
            ${metaText}
          </div>
        </div>
        <button class="icon-btn" data-action="delete" style="width: 32px; height: 32px; color: var(--accent-coral); border-color: rgba(242, 118, 90, 0.2);" aria-label="Delete task">
          🗑
        </button>
      </li>
    `;
  }).join("");
}

/**
 * Jenere HTML konplè pou paj tasks la epi mete li nan #mainContent
 * @param {Object} state - State aktyèl store la
 */
export function renderTasksView(state) {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Sove dashboard la premye fwa si nou poko fè sa
  if (!dashboardBackupHTML && mainContent.querySelector(".grid")) {
    dashboardBackupHTML = mainContent.innerHTML;
  }

  const missions = state.missions || [];

  // Konstriksyon HTML koòdone a
  const html = `
    <div class="tasks-page-container" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- FÒM POU AJOUTE TASK -->
      <section class="card" style="padding: 20px; background: rgba(20, 22, 29, 0.6); border: 1px solid var(--border); border-radius: var(--radius-md);">
        <h3 style="margin-top: 0; margin-bottom: 14px; font-family: var(--font-display); font-size: 1.1rem; color: var(--text-primary);">Ajoute yon nouvo misyon</h3>
        <form id="addTaskForm" style="display: flex; gap: 12px;">
          <input type="text" id="taskInput" placeholder="Kisa w gen pou w fè jodi a?" required style="flex: 1; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--glass); color: var(--text-primary); font-size: 0.9rem; outline: none; transition: border-color 0.18s var(--ease);">
          <button type="submit" class="btn-primary" style="box-shadow: none;">
            <svg viewBox="0 0 24 24" fill="none" style="width:14px; height:14px;"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            Add Task
          </button>
        </form>
      </section>

      <!-- FILTRE AK LIS LA -->
      <section class="card" style="padding: 20px; background: rgba(20, 22, 29, 0.4); border: 1px solid var(--border); border-radius: var(--radius-md);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <h3 style="margin: 0; font-family: var(--font-display); font-size: 1.1rem;">Tout misyon yo</h3>
          
          <!-- Bouton Filtre yo -->
          <div class="filter-group" style="display: flex; gap: 6px; background: var(--glass); padding: 4px; border-radius: 10px; border: 1px solid var(--border);">
            <button class="filter-btn ${currentFilter === "all" ? "is-active" : ""}" data-filter="all" style="background: ${currentFilter === "all" ? "var(--glass-strong)" : "transparent"}; border: none; padding: 6px 12px; border-radius: 8px; color: ${currentFilter === "all" ? "var(--accent-gold)" : "var(--text-secondary)"}; font-size: 0.8rem; font-weight: 500;">All</button>
            <button class="filter-btn ${currentFilter === "active" ? "is-active" : ""}" data-filter="active" style="background: ${currentFilter === "active" ? "var(--glass-strong)" : "transparent"}; border: none; padding: 6px 12px; border-radius: 8px; color: ${currentFilter === "active" ? "var(--accent-gold)" : "var(--text-secondary)"}; font-size: 0.8rem; font-weight: 500;">Active</button>
            <button class="filter-btn ${currentFilter === "done" ? "is-active" : ""}" data-filter="done" style="background: ${currentFilter === "done" ? "var(--glass-strong)" : "transparent"}; border: none; padding: 6px 12px; border-radius: 8px; color: ${currentFilter === "done" ? "var(--accent-gold)" : "var(--text-secondary)"}; font-size: 0.8rem; font-weight: 500;">Done</button>
          </div>
        </div>

        <!-- Veso kote lis la ap jwe a -->
        <ul id="tasksListContainer" style="list-style: none; padding: 0; margin: 0;">
          ${generateMissionsListHTML(missions)}
        </ul>
      </section>

    </div>
  `;

  mainContent.innerHTML = html;
}

/**
 * Atache event listeners sou #mainContent atravè delegation
 */
export function bindTasksEvents() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Evite double binding nan netwaye vye koute yo si sa posib oswa itilize sèlman delegation
  mainContent.onclick = null;
  mainContent.onsubmit = null;

  // 1. Jere Klik sou bouton ak eleman anndan yo (Toggle, Delete, Filtre)
  mainContent.onclick = (e) => {
    // A. Klik sou Filtre
    const filterBtn = e.target.closest("[data-filter]");
    if (filterBtn) {
      currentFilter = filterBtn.getAttribute("data-filter");

      // Mizajou klas aktif yo sou bouton filtre yo nan DOM
      mainContent.querySelectorAll("[data-filter]").forEach(btn => {
        if (btn === filterBtn) {
          btn.style.background = "var(--glass-strong)";
          btn.style.color = "var(--accent-gold)";
        } else {
          btn.style.background = "transparent";
          btn.style.color = "var(--text-secondary)";
        }
      });

      // Re-render lis la sèlman san rele sèvis la
      const tasksListContainer = document.getElementById("tasksListContainer");
      if (tasksListContainer) {
        const state = store.getState();
        tasksListContainer.innerHTML = generateMissionsListHTML(state.missions);
      }
      return;
    }

    // B. Klik sou Checkbox pou chanje eta
    const checkbox = e.target.closest('[data-action="toggle"]');
    if (checkbox) {
      const taskItem = checkbox.closest("[data-id]");
      if (taskItem) {
        const id = Number(taskItem.getAttribute("data-id"));
        taskService.toggleTask(id);
        // Depi store a mete ajou, l ap deklanche rann sistèm nan ankò atravè abònman ou yo
      }
      return;
    }

    // C. Klik sou bouton efase a
    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (deleteBtn) {
      const taskItem = deleteBtn.closest("[data-id]");
      if (taskItem) {
        const id = Number(taskItem.getAttribute("data-id"));
        taskService.removeTask(id);
      }
      return;
    }
  };

  // 2. Jere Submit fòm pou ajoute travay la
  mainContent.onsubmit = (e) => {
    const form = e.target.closest("#addTaskForm");
    if (form) {
      e.preventDefault();
      const input = document.getElementById("taskInput");
      if (input && input.value.trim() !== "") {
        taskService.addTask({ title: input.value.trim() });
        input.value = ""; // Vije chan an apre sa
      }
    }
  };
}

/**
 * Restore dashboard orijinal la lè nou retounen sou li
 */
export function restoreDashboardView() {
  const mainContent = document.getElementById("mainContent");
  if (mainContent && dashboardBackupHTML) {
    mainContent.innerHTML = dashboardBackupHTML;
  }
}

// Abònman sou store a pou mete ajou lis misyon an lè gen chanjman pandan nou sou paj tasks la
store.subscribe((state) => {
  const activeRouteItem = document.querySelector(".nav-item.is-active");
  if (activeRouteItem) {
    const activeRoute = activeRouteItem.getAttribute("data-route");
    if (activeRoute === "tasks") {
      const tasksListContainer = document.getElementById("tasksListContainer");
      if (tasksListContainer) {
        tasksListContainer.innerHTML = generateMissionsListHTML(state.missions);
      }
    }
  }
});
