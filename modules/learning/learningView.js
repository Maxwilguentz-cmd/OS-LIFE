/**
 * LifeOS - Learning View Module
 * Jere koòdone, rann HTML ak evènman pou swiv aprantisaj ak konpetans yo.
 */
import { learningService } from "../../services/learningService.js";
import { store } from "../../core/store.js";

// Mekanis backup pou sove dashboard la anvan nou rann nouvo kontni
let dashboardBackup = null;

/**
 * Rann paj aprantisaj la nan #mainContent
 * @param {Object} state - State aktyèl store la
 */
export function renderLearningView(state) {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Sove HTML dashboard la si se premye fwa n ap chanje paj
  if (!dashboardBackup) {
    dashboardBackup = mainContent.innerHTML;
  }

  const skills = learningService.getSkills();

  mainContent.innerHTML = `
    <div class="learning-container" style="display: flex; flex-direction: column; gap: 20px; padding: 10px;">
      
      <!-- GRID POU FÒM AK LIS YO -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        
        <!-- FÒM KREYASYON APRENTISAJ -->
        <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); height: fit-content;">
          <h3 style="margin-top: 0;">Ajoute yon Aprantisaj</h3>
          <form id="learningForm" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Non Konpetans / Matyè *</label>
              <input type="text" id="skillName" placeholder="E.g., Node.js oswa HTML/CSS" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
            </div>

            <div>
              <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Meta / Objektif Tan (Opsyonèl)</label>
              <input type="text" id="skillMeta" placeholder="E.g., 3h / semèn oswa 45 leson" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Pwogrè Enisyal (%)</label>
                <input type="number" id="skillPct" min="0" max="100" value="0" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
              </div>
              <div>
                <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Koulè endikatè</label>
                <select id="skillColor" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;">
                  <option value="var(--accent-gold)">Lò (Gold)</option>
                  <option value="var(--accent-mint)">Mant (Mint)</option>
                  <option value="var(--accent-violet)">Vyolèt (Violet)</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary" style="padding: 10px; cursor: pointer; border-radius: 4px; margin-top: 5px;">Kòmanse Aprann</button>
          </form>
        </div>

        <!-- LIS APRENTISAJ YO (LEARNING LIST) -->
        <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 style="margin-top: 0;">Konpetans m ap Devlope</h3>
          <div id="learningListContainer" style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
            ${skills.length === 0 ? '<p style="opacity: 0.6; text-align: center; padding: 20px;">Pa gen okenn aprantisaj ki anrejistre kounye a.</p>' : ''}
            ${skills.map(skill => `
              <div class="learning-card-item" data-id="${skill.id}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px;">
                
                <!-- ENTÈT KAT LA -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div class="learning-row" style="border: none; padding: 0; background: transparent; width: 100%;">
                    <div class="learning-info" style="flex-grow: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span class="learning-name" style="font-weight: bold; font-size: 16px; color: white;">${skill.name}</span>
                        <span class="learning-pct" style="font-weight: bold; color: ${skill.color};">${skill.pct}%</span>
                      </div>
                      <div class="progress-track" style="margin-top: 5px;"><div class="progress-fill" style="width: ${skill.pct}%; --pc: ${skill.color}"></div></div>
                      ${skill.meta ? `<span class="learning-meta" style="display: inline-block; margin-top: 5px; font-size: 12px; opacity: 0.6;">${skill.meta}</span>` : ''}
                    </div>
                  </div>
                  <button class="btn-delete-skill" style="background: transparent; border: none; color: var(--accent-rose, #f44336); cursor: pointer; font-size: 18px; margin-left: 10px; padding: 0 5px;">✕</button>
                </div>

                <!-- SLIDER POU PWOGRÈ -->
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                  <span style="font-size: 12px; opacity: 0.6; min-width: 85px;">Modifye Pwogrè:</span>
                  <input type="range" class="learning-progress-slider" min="0" max="100" value="${skill.pct}" style="flex: 1; cursor: pointer; height: 4px; border-radius: 2px;" />
                  <input type="number" class="learning-progress-number" min="0" max="100" value="${skill.pct}" style="width: 50px; padding: 2px 4px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white; text-align: center; font-size: 12px;" />
                </div>

              </div>
            `).join("")}
          </div>
        </div>

      </div>

    </div>
  `;
}

/**
 * Atache evènman yo ak delegasyon evènman sou #mainContent
 */
export function bindLearningEvents() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Klone eleman an pou evite double evènman (Idempotency)
  mainContent.replaceWith(mainContent.cloneNode(true));
  const newMainContent = document.getElementById("mainContent");

  // 1. Soumèt fòm pou ajoute yon konpetans
  newMainContent.addEventListener("submit", (e) => {
    if (e.target.id === "learningForm") {
      e.preventDefault();

      const name = document.getElementById("skillName").value;
      const meta = document.getElementById("skillMeta").value;
      const pct = Number(document.getElementById("skillPct").value);
      const color = document.getElementById("skillColor").value;

      learningService.addSkill({ name, meta, pct, color });

      // Re-rann epi re-atache evènman yo
      renderLearningView(store.getState());
      bindLearningEvents();
    }
  });

  // 2. Klik pou efase
  newMainContent.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".btn-delete-skill");
    if (deleteBtn) {
      const card = deleteBtn.closest(".learning-card-item");
      if (!card) return;

      const skillId = card.dataset.id;

      if (confirm("Èske ou vle efase konpetans sa a tout bon vre?")) {
        learningService.removeSkill(skillId);
        
        renderLearningView(store.getState());
        bindLearningEvents();
      }
    }
  });

  // 3. Lojik pou chanje valè a sou plas nan UI an fliyid pandan n ap trennen
  const handleProgressUpdate = (e, className) => {
    const inputElement = e.target.closest(className);
    if (inputElement) {
      const card = inputElement.closest(".learning-card-item");
      if (!card) return;

      const skillId = card.dataset.id;
      const val = Number(inputElement.value);

      learningService.updateSkillProgress(skillId, val);

      // Mete ajou kouch vizyèl la san fòse tout DOM la re-rann
      const pctSpan = card.querySelector(".learning-pct");
      const progressFill = card.querySelector(".progress-fill");
      const slider = card.querySelector(".learning-progress-slider");
      const numInput = card.querySelector(".learning-progress-number");

      if (pctSpan) pctSpan.textContent = `${val}%`;
      if (progressFill) progressFill.style.width = `${val}%`;
      if (slider && slider !== inputElement) slider.value = val;
      if (numInput && numInput !== inputElement) numInput.value = val;
    }
  };

  newMainContent.addEventListener("input", (e) => {
    handleProgressUpdate(e, ".learning-progress-slider");
    handleProgressUpdate(e, ".learning-progress-number");
  });

  newMainContent.addEventListener("change", (e) => {
    // Nou fè yon rann total lè itilizatè a lage slider a pou asire senkronizasyon pafè
    if (e.target.closest(".learning-progress-slider") || e.target.closest(".learning-progress-number")) {
      renderLearningView(store.getState());
      bindLearningEvents();
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
