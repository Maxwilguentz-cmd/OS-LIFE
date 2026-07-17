/**
 * LifeOS — Habits View Module
 * Jere koòdone ak evènman pou modil Abitid ak Ritin yo.
 */

import { habitsService } from "../../services/habitsService.js";
import { store } from "../../core/store.js";

// Sove kòd HTML dashboard la pou lè nou bezwen tounen sou li
let dashboardBackup = null;

/**
 * Rann paj abitid yo nan #mainContent
 * @param {Object} state - State aktyèl store la
 */
export function renderHabitsView(state) {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Fè backup dashboard la si se premye fwa n ap kite l
  if (!dashboardBackup) {
    dashboardBackup = mainContent.innerHTML;
  }

  // Rekipere tout abitid yo nan sèvis la
  const habits = habitsService.getHabits() || [];

  mainContent.innerHTML = `
    <div class="habits-container" style="display: flex; flex-direction: column; gap: 20px; padding: 10px;">
      
      <!-- FÒM POU AJOUTE YON ABITID -->
      <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <h3 style="margin-top: 0; margin-bottom: 15px;">Kreyasyon yon nouvo abitid</h3>
        <form id="habitForm" style="display: flex; gap: 10px;">
          <input type="text" id="habitName" placeholder="Kisa ou vle fè chak jou?" required style="flex: 1; padding: 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
          <button type="submit" class="btn-primary" style="padding: 10px 20px; cursor: pointer; border-radius: 4px;">Ajoute</button>
        </form>
      </div>

      <!-- LIS ABITID YO -->
      <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <h3 style="margin-top: 0; margin-bottom: 15px;">Abitid mwen yo</h3>
        <div id="habitsListContainer" style="display: flex; flex-direction: column; gap: 12px;">
          ${habits.length === 0 ? `<p style="opacity: 0.6; text-align: center;">Ou pa gen okenn abitid ki anrejistre pou kounye a.</p>` : ''}
          ${habits.map(habit => {
            return `
              <div class="habit-item" data-id="${habit.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                <div>
                  <h4 style="margin: 0; font-size: 16px;">${habit.name}</h4>
                  <span style="font-size: 13px; opacity: 0.8; display: inline-block; margin-top: 4px;">🔥 ${habit.streak} jou</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <button class="btn-mark-done" style="padding: 6px 12px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Mark done today</button>
                  <button class="btn-unmark" style="padding: 6px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Unmark</button>
                  <button class="btn-delete-habit" style="background: transparent; border: none; color: #f44336; cursor: pointer; font-size: 16px; padding: 5px;">✕</button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

    </div>
  `;
}

/**
 * Atache event listeners yo sou eleman yo atravè delegasyon sou #mainContent
 */
export function bindHabitsEvents() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Retire vye koute evènman pou evite kopi (Idempotency)
  mainContent.replaceWith(mainContent.cloneNode(true));
  
  // Rekipere nouvo referans lan apre clone a
  const newMainContent = document.getElementById("mainContent");

  // Jere submit fòm lan
  newMainContent.addEventListener("submit", (e) => {
    e.preventDefault();

    if (e.target.id === "habitForm") {
      const nameInput = document.getElementById("habitName");
      const name = nameInput.value.trim();

      if (!name) return;

      habitsService.addHabit({ name });

      // Rann paj la ankò ak nouvo done yo
      renderHabitsView(store.getState());
      bindHabitsEvents();
    }
  });

  // Jere klik sou bouton yo ak delegasyon
  newMainContent.addEventListener("click", (e) => {
    // 1. Mark Done
    const markBtn = e.target.closest(".btn-mark-done");
    if (markBtn) {
      const item = markBtn.closest(".habit-item");
      if (item) {
        const id = item.dataset.id;
        habitsService.markHabitDone(id);
        renderHabitsView(store.getState());
        bindHabitsEvents();
      }
      return;
    }

    // 2. Unmark
    const unmarkBtn = e.target.closest(".btn-unmark");
    if (unmarkBtn) {
      const item = unmarkBtn.closest(".habit-item");
      if (item) {
        const id = item.dataset.id;
        habitsService.unmarkHabitDone(id);
        renderHabitsView(store.getState());
        bindHabitsEvents();
      }
      return;
    }

    // 3. Efase abitid
    const deleteBtn = e.target.closest(".btn-delete-habit");
    if (deleteBtn) {
      const item = deleteBtn.closest(".habit-item");
      if (item) {
        const id = item.dataset.id;
        if (confirm("Èske ou vle efase abitid sa a tout bon?")) {
          habitsService.removeHabit(id);
          renderHabitsView(store.getState());
          bindHabitsEvents();
        }
      }
    }
  });
}

/**
 * Restore dashboard la depi nan backup li
 */
export function restoreDashboardView() {
  const mainContent = document.getElementById("mainContent");
  if (mainContent && dashboardBackup) {
    mainContent.innerHTML = dashboardBackup;
  }
}
