/**
 * LifeOS — UI Events Module
 * Okipe tout koute evènman (event listeners) epi konekte yo ak store ak sèvis yo
 */

import { store } from "../core/store.js";
import { financeService } from "../services/financeService.js";
import { internetService } from "../services/internetService.js";

export function bindEvents() {
  
  // 1. CHWA MOOD (Mood buttons handler)
  const moodRow = document.getElementById("moodRow");
  if (moodRow) {
    moodRow.addEventListener("click", (e) => {
      const btn = e.target.closest(".mood-btn");
      if (!btn) return;

      const selectedMood = btn.getAttribute("data-mood");
      const label = btn.getAttribute("data-label");

      // Nou delege chanjman an bay store la pa lwa dispatch
      store.dispatch({
        type: "SET_MOOD",
        payload: {
          current: selectedMood,
          note: `You logged feeling ${label} today. Keep focusing on your goals!`
        }
      });
    });
  }

  // 2. CHANJE TEM (Theme Toggle)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentState = store.getState();
      const nextTheme = currentState.theme === "dark" ? "light" : "dark";
      
      store.dispatch({
        type: "SET_THEME",
        payload: nextTheme
      });
    });
  }

  // 3. TOOGLE SIDEBAR SOU MOBIL (Sidebar Mobile Toggle)
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarScrim = document.getElementById("sidebarScrim");

  if (menuToggle && sidebar && sidebarScrim) {
    const toggleSidebar = () => {
      sidebar.classList.toggle("is-open");
      sidebarScrim.classList.toggle("is-active");
    };

    menuToggle.addEventListener("click", toggleSidebar);
    sidebarScrim.addEventListener("click", toggleSidebar);
  }

  // 4. CHOCHÒK MISYON YO (Mission Checkboxes)
  const missionList = document.getElementById("missionList");
  if (missionList) {
    missionList.addEventListener("click", (e) => {
      const checkBtn = e.target.closest(".check");
      if (!checkBtn) return;

      const item = checkBtn.closest(".mission-item");
      if (!item) return;

      const missionId = parseInt(item.getAttribute("data-id"), 10);
      const currentState = store.getState();
      
      const updatedMissions = currentState.missions.map(m => {
        if (m.id === missionId) {
          return { ...m, done: !m.done };
        }
        return m;
      });

      store.dispatch({
        type: "UPDATE_MISSIONS",
        payload: updatedMissions
      });
    });
  }

  // 5. KREYE YON NOUVO TASK (New Task Button)
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) {
    newTaskBtn.addEventListener("click", () => {
      const taskTitle = prompt("Ki nouvo misyon pou jodi a?");
      if (!taskTitle || taskTitle.trim() === "") return;

      const currentState = store.getState();
      const newId = currentState.missions.length > 0 
        ? Math.max(...currentState.missions.map(m => m.id)) + 1 
        : 1;

      const newMission = {
        id: newId,
        title: taskTitle.trim(),
        meta: `Custom · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        done: false
      };

      store.dispatch({
        type: "UPDATE_MISSIONS",
        payload: [...currentState.missions, newMission]
      });
    });
  }
}
