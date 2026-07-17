/**
 * LifeOS - Calendar View Module
 * Jere afichaj ak entèraksyon kalandriye a kòm ES Module nan langaj Kreyòl.
 */

import { taskService } from "../../services/taskService.js";
import { store } from "../../core/store.js";
import { TRANSLATIONS, getCurrentLanguage } from "../../core/i18n.js";
// Reyitilize menm mekanis backup dashboard ki nan tasksView.js pou evite konfli
import { restoreDashboardView } from "../tasks/tasksView.js";

export { restoreDashboardView };

// Offset pou navigasyon mwa yo (0 = mwa aktyèl la, -1 = mwa pase, 1 = mwa pwochen)
let currentMonthOffset = 0;

/**
 * Filtre epi jenere HTML lis "Misyon pou jodi a"
 * @param {Array} missions - Lis misyon ki soti nan state la
 * @returns {string} HTML lis misyon yo
 */
function generateDailyMissionsHTML(missions) {
  const dict = TRANSLATIONS[getCurrentLanguage()].calendarPage;

  if (!missions || missions.length === 0) {
    return `<p class="mood-note" style="text-align: center; padding: 16px;">${dict.emptyMissions}</p>`;
  }

  return missions.map(task => {
    const isChecked = task.done ? "checked" : "";
    const doneStyle = task.done ? "style='text-decoration: line-through; color: var(--text-tertiary);'" : "";
    
    return `
      <li class="mission-item card" data-id="${task.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; margin-bottom: 8px; background: var(--glass); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          <input type="checkbox" class="check" data-action="toggle" ${isChecked} style="cursor: pointer;" aria-label="Toggle task status">
          <span class="task-title" ${doneStyle} style="font-weight: 500; font-size: 0.95rem;">${task.title}</span>
        </div>
        <button class="icon-btn" data-action="delete" style="width: 32px; height: 32px; color: var(--accent-coral); border-color: rgba(242, 118, 90, 0.2);" aria-label="Delete task">
          🗑
        </button>
      </li>
    `;
  }).join("");
}

/**
 * Jenere gri kalandriye a pou mwa aktyèl la (ak offset la)
 * @returns {string} HTML gri kalandriye a
 */
function generateCalendarGridHTML() {
  const today = new Date();
  const dict = TRANSLATIONS[getCurrentLanguage()].calendarPage;
  
  // Kalkile mwa ak ane ki koresponn ak offset la
  const targetDate = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();

  // Non mwa yo ak jou yo tradwi dapre lang lan
  const monthNames = dict.monthNames;
  const daysOfWeek = dict.dayNames;

  // Jwenn premye jou nan mwa a (0 = Dimanch, 1 = Lendi, ..., 6 = Samdi)
  const firstDayIndex = new Date(year, month, 1).getDay();
  
  // Jwenn kantite jou ki gen nan mwa sa a
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Jwenn kantite jou nan mwa anvan an pou ranpli espas vid yo
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  
  let gridHTML = `<div class="calendar-grid-container" style="display: flex; flex-direction: column; gap: 16px;">`;
  
  // Header kalandriye a ak bouton navigasyon yo
  gridHTML += `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <h3 style="margin: 0; font-family: var(--font-display); font-size: 1.2rem; color: var(--text-primary);">${monthNames[month]} ${year}</h3>
      <div style="display: flex; gap: 8px;">
        <button class="btn-secondary" id="prevMonthBtn" style="padding: 6px 12px; cursor: pointer;">◀</button>
        <button class="btn-secondary" id="nextMonthBtn" style="padding: 6px 12px; cursor: pointer;">▶</button>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center;">
  `;

  // Afiche non jou yo nan tèt gri a
  daysOfWeek.forEach(day => {
    gridHTML += `<div style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary); padding-bottom: 8px; border-bottom: 1px solid var(--border);">${day}</div>`;
  });

  // 1. Selil pou jou mwa anvan an (padding)
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    gridHTML += `
      <div class="calendar-cell pad" style="padding: 12px 8px; border-radius: var(--radius-sm); background: rgba(255, 255, 255, 0.02); color: var(--text-tertiary); font-size: 0.9rem; opacity: 0.4;">
        ${dayNum}
      </div>
    `;
  }

  // 2. Selil pou jou mwa aktyèl la
  for (let day = 1; day <= totalDays; day++) {
    const isCurrentToday = 
      day === today.getDate() && 
      month === today.getMonth() && 
      year === today.getFullYear();

    const todayClass = isCurrentToday ? "is-today" : "";
    const todayStyle = isCurrentToday 
      ? "background: rgba(0, 242, 195, 0.15); border: 1.5px solid var(--accent-mint); color: var(--accent-mint); font-weight: bold;" 
      : "background: var(--glass); border: 1px solid var(--border); color: var(--text-primary);";

    gridHTML += `
      <div class="calendar-cell ${todayClass}" style="padding: 12px 8px; border-radius: var(--radius-sm); font-size: 0.9rem; transition: all 0.2s var(--ease); ${todayStyle}">
        ${day}
      </div>
    `;
  }

  // 3. Selil pou jou mwa pwochen an (pou konplete gri a si sa nesesè)
  const totalCellsUsed = firstDayIndex + totalDays;
  const remainingCells = totalCellsUsed % 7 === 0 ? 0 : 7 - (totalCellsUsed % 7);
  for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
    gridHTML += `
      <div class="calendar-cell pad" style="padding: 12px 8px; border-radius: var(--radius-sm); background: rgba(255, 255, 255, 0.02); color: var(--text-tertiary); font-size: 0.9rem; opacity: 0.4;">
        ${nextDay}
      </div>
    `;
  }

  gridHTML += `</div></div>`;
  return gridHTML;
}

/**
 * Rann vizyèl konplè paj kalandriye a nan #mainContent
 * @param {Object} state - State aktyèl store la
 */
export function renderCalendarView(state) {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  const missions = state.missions || [];
  const dict = TRANSLATIONS[getCurrentLanguage()].calendarPage;

  const html = `
    <div class="calendar-page-container" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px;">
      
      <!-- SEKSYON GRI KALANDRIYE A -->
      <section class="card" id="calendarGridWrapper" style="padding: 24px; background: rgba(20, 22, 29, 0.5); border: 1px solid var(--border); border-radius: var(--radius-md);">
        ${generateCalendarGridHTML()}
      </section>

      <!-- SEKSYON LIS MISYON JODI A -->
      <section class="card" style="padding: 24px; background: rgba(20, 22, 29, 0.4); border: 1px solid var(--border); border-radius: var(--radius-md);">
        <h3 style="margin-top: 0; margin-bottom: 20px; font-family: var(--font-display); font-size: 1.15rem; color: var(--text-primary);">
          ${dict.todayMissionsTitle}
        </h3>
        <ul id="calendarMissionsList" style="list-style: none; padding: 0; margin: 0;">
          ${generateDailyMissionsHTML(missions)}
        </ul>
      </section>

    </div>
  `;

  mainContent.innerHTML = html;
}

/**
 * Atache event listeners sou kalandriye a ak delegasyon
 */
export function bindCalendarEvents() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Reyajiste koute yo pou evite doub binding
  mainContent.onclick = null;

  mainContent.onclick = (e) => {
    // A. Navigasyon mwa pase (◀)
    if (e.target.closest("#prevMonthBtn")) {
      currentMonthOffset--;
      const gridWrapper = document.getElementById("calendarGridWrapper");
      if (gridWrapper) {
        gridWrapper.innerHTML = generateCalendarGridHTML();
      }
      return;
    }

    // B. Navigasyon mwa pwochen (▶)
    if (e.target.closest("#nextMonthBtn")) {
      currentMonthOffset++;
      const gridWrapper = document.getElementById("calendarGridWrapper");
      if (gridWrapper) {
        gridWrapper.innerHTML = generateCalendarGridHTML();
      }
      return;
    }

    // C. Toggle Status Misyon (Checkbox)
    const checkbox = e.target.closest('[data-action="toggle"]');
    if (checkbox) {
      const missionItem = checkbox.closest("[data-id]");
      if (missionItem) {
        const id = Number(missionItem.getAttribute("data-id"));
        taskService.toggleTask(id);
      }
      return;
    }

    // D. Efase Misyon (Bouton 🗑)
    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (deleteBtn) {
      const missionItem = deleteBtn.closest("[data-id]");
      if (missionItem) {
        const id = Number(missionItem.getAttribute("data-id"));
        taskService.removeTask(id);
      }
      return;
    }
  };
}

// Abònman sou store a pou mete lis misyon an ajou lè gen chanjman
store.subscribe((state) => {
  const activeRouteItem = document.querySelector(".nav-item.is-active");
  if (activeRouteItem) {
    const activeRoute = activeRouteItem.getAttribute("data-route");
    if (activeRoute === "calendar") {
      const listContainer = document.getElementById("calendarMissionsList");
      if (listContainer) {
        listContainer.innerHTML = generateDailyMissionsHTML(state.missions);
      }
    }
  }
});
