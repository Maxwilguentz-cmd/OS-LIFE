/**
 * LifeOS - Projects View Module
 * Jere koòdone, rann HTML ak evènman pou jere pwojè yo.
 */
import { projectService } from "../../services/projectService.js";
import { store } from "../../core/store.js";

// Mekanis backup pou sove dashboard la
let dashboardBackup = null;

/**
 * Rann paj pwojè yo nan #mainContent
 * @param {Object} state - State aktyèl store la
 */
export function renderProjectsView(state) {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Sove HTML dashboard la si se premye fwa n ap chanje paj
  if (!dashboardBackup) {
    dashboardBackup = mainContent.innerHTML;
  }

  const projects = projectService.getProjects();

  mainContent.innerHTML = `
    <div class="projects-container" style="display: flex; flex-direction: column; gap: 20px; padding: 10px;">
      
      <!-- GRID POU FÒM AK LIS PWOJÈ YO -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        
        <!-- FÒM KREYASYON PWOJÈ -->
        <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); height: fit-content;">
          <h3 style="margin-top: 0;">Kreye yon Pwojè</h3>
          <form id="projectForm" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Non Pwojè a *</label>
              <input type="text" id="projectName" placeholder="E.g., Konstriksyon Sit Web" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
            </div>

            <div>
              <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Deskripsyon</label>
              <textarea id="projectDesc" placeholder="Kisa pwojè sa a ye menm..." style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white; resize: vertical; min-height: 80px;"></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Pwogrè Enisyal (%)</label>
                <input type="number" id="projectPct" min="0" max="100" value="0" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
              </div>
              <div>
                <label style="display: block; font-size: 14px; margin-bottom: 5px; opacity: 0.8;">Koulè Pwojè</label>
                <select id="projectColor" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;">
                  <option value="var(--accent-gold)">Lò (Gold)</option>
                  <option value="var(--accent-mint)">Mant (Mint)</option>
                  <option value="var(--accent-violet)">Vyolèt (Violet)</option>
                  <option value="var(--accent-blue)">Ble (Blue)</option>
                  <option value="var(--accent-rose)">Woz (Rose)</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary" style="padding: 10px; cursor: pointer; border-radius: 4px; margin-top: 5px;">Ajoute Pwojè</button>
          </form>
        </div>

        <!-- LIS PWOJÈ YO -->
        <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 style="margin-top: 0;">Lis Pwojè yo</h3>
          <div id="projectsListContainer" style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
            ${projects.length === 0 ? '<p style="opacity: 0.6; text-align: center; padding: 20px;">Pa gen okenn pwojè ki anrejistre kounye a.</p>' : ''}
            ${projects.map(proj => `
              <div class="project-card-item" data-id="${proj.id}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px;">
                
                <!-- ENTÈT KAT LA -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div class="project-row" style="border: none; padding: 0; background: transparent; width: 100%;">
                    <div class="project-icon" style="--pc: ${proj.color}; flex-shrink: 0;">${proj.short || "PR"}</div>
                    <div class="project-info" style="flex-grow: 1;">
                      <div class="project-top" style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="project-name" style="font-weight: bold; font-size: 16px;">${proj.name}</span>
                        <span class="project-pct" style="font-weight: bold; color: ${proj.color};">${proj.pct}%</span>
                      </div>
                      <div class="progress-track" style="margin-top: 5px;"><div class="progress-fill" style="width: ${proj.pct}%; --pc: ${proj.color}"></div></div>
                    </div>
                  </div>
                  <button class="btn-delete-project" style="background: transparent; border: none; color: var(--accent-rose, #f44336); cursor: pointer; font-size: 18px; margin-left: 10px; padding: 0 5px;">✕</button>
                </div>

                <!-- DESKRIPSYON -->
                ${proj.description ? `<p style="margin: 0; font-size: 13px; opacity: 0.7; line-height: 1.4; padding-left: 45px;">${proj.description}</p>` : ''}

                <!-- KONTWÒL PWOGRÈ AK SLIDER -->
                <div style="display: flex; align-items: center; gap: 10px; padding-left: 45px; margin-top: 5px;">
                  <span style="font-size: 12px; opacity: 0.6; min-width: 85px;">Chanje Pwogrè:</span>
                  <input type="range" class="project-progress-slider" min="0" max="100" value="${proj.pct}" style="flex: 1; cursor: pointer; height: 4px; border-radius: 2px;" />
                  <input type="number" class="project-progress-number" min="0" max="100" value="${proj.pct}" style="width: 50px; padding: 2px 4px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white; text-align: center; font-size: 12px;" />
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
 * Atache evènman yo sou eleman yo ak delegasyon evènman sou #mainContent
 */
export function bindProjectsEvents() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Evite kopi koute evènman (Idempotency) lè nou klone eleman an
  mainContent.replaceWith(mainContent.cloneNode(true));
  const newMainContent = document.getElementById("mainContent");

  // 1. Jere fòm soumèt pou kreyasyon pwojè
  newMainContent.addEventListener("submit", (e) => {
    if (e.target.id === "projectForm") {
      e.preventDefault();

      const name = document.getElementById("projectName").value;
      const description = document.getElementById("projectDesc").value;
      const pct = Number(document.getElementById("projectPct").value);
      const color = document.getElementById("projectColor").value;

      projectService.addProject({ name, description, pct, color });

      // Rann paj la ak nouvo done yo epi re-atache evènman yo
      renderProjectsView(store.getState());
      bindProjectsEvents();
    }
  });

  // 2. Jere Chanjman Pwogrè ak klike sou Bouton Efase (Click, Input, Change)
  newMainContent.addEventListener("click", (e) => {
    // Bouton efase pwojè
    const deleteBtn = e.target.closest(".btn-delete-project");
    if (deleteBtn) {
      const card = deleteBtn.closest(".project-card-item");
      if (!card) return;

      const projectId = card.dataset.id; // Nimerik men nou pase l konsa

      if (confirm("Èske ou vle efase pwojè sa a tout bon vre?")) {
        projectService.removeProject(projectId);
        
        renderProjectsView(store.getState());
        bindProjectsEvents();
      }
    }
  });

  // Koute trennen slider oswa modifikasyon input nimewo yo
  const handleProgressUpdate = (e, className) => {
    const inputElement = e.target.closest(className);
    if (inputElement) {
      const card = inputElement.closest(".project-card-item");
      if (!card) return;

      const projectId = card.dataset.id;
      const val = Number(inputElement.value);

      projectService.updateProjectProgress(projectId, val);

      // Pou rann nan pi fliyid san nou pa rann tout paj la pandan itilizatè a ap trennen slider a:
      const pctSpan = card.querySelector(".project-pct");
      const progressFill = card.querySelector(".progress-fill");
      const slider = card.querySelector(".project-progress-slider");
      const numInput = card.querySelector(".project-progress-number");

      if (pctSpan) pctSpan.textContent = `${val}%`;
      if (progressFill) progressFill.style.width = `${val}%`;
      if (slider && slider !== inputElement) slider.value = val;
      if (numInput && numInput !== inputElement) numInput.value = val;
    }
  };

  newMainContent.addEventListener("input", (e) => {
    handleProgressUpdate(e, ".project-progress-slider");
    handleProgressUpdate(e, ".project-progress-number");
  });

  newMainContent.addEventListener("change", (e) => {
    // Lè itilizatè a fin lage slider a oswa li fin chanje nimewo a, nou fè yon rann total pou asire koreksyon
    if (e.target.closest(".project-progress-slider") || e.target.closest(".project-progress-number")) {
      renderProjectsView(store.getState());
      bindProjectsEvents();
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
