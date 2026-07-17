/**
 * LifeOS - modules/settings/settingsView.js
 * Jere UI ak evènman pou paj konfigirasyon an.
 */
import { settingsService } from "../../services/settingsService.js";
import { store } from "../../core/store.js";

let dashboardBackup = null;

/**
 * Rann paj Settings la nan #mainContent
 * @param {Object} state - State aktyèl store la
 */
export function renderSettingsView(state) {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Sove HTML dashboard la pou pwochen retou
  if (!dashboardBackup) {
    dashboardBackup = mainContent.innerHTML;
  }

  const currentSettings = settingsService.getSettings();
  const lang = currentSettings.language || "en";
  const notif = currentSettings.notificationsEnabled !== false;

  // Tèks lokalize pou paj Settings la sèlman pandan n ap rann li
  const titles = {
    en: { title: "App Settings", langLabel: "Language", notifLabel: "Enable Notifications" },
    ht: { title: "Konfigirasyon Aplikasyon", langLabel: "Langay", notifLabel: "Aktive Notifikasyon" },
    fr: { title: "Paramètres de l'App", langLabel: "Langue", notifLabel: "Activer les Notifications" }
  };

  const localText = titles[lang] || titles.en;

  mainContent.innerHTML = `
    <div class="settings-container" style="display: flex; flex-direction: column; gap: 20px; padding: 10px; max-width: 600px; margin: 0 auto;">
      
      <div class="card glass" style="padding: 25px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="margin-top: 0; margin-bottom: 20px; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          ${localText.title}
        </h2>

        <form id="settingsForm" style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- SELEKSYON LANG -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label for="languageSelect" style="font-size: 14px; font-weight: bold; opacity: 0.9;">
              ${localText.langLabel}
            </label>
            <select id="languageSelect" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; font-size: 14px; cursor: pointer;">
              <option value="en" ${lang === "en" ? "selected" : ""}>English</option>
              <option value="ht" ${lang === "ht" ? "selected" : ""}>Kreyòl (Haitian Creole)</option>
              <option value="fr" ${lang === "fr" ? "selected" : ""}>Français</option>
            </select>
          </div>

          <!-- NOTIFIKASYON -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05);">
            <label for="notifToggle" style="font-size: 14px; font-weight: bold; opacity: 0.9; cursor: pointer;">
              ${localText.notifLabel}
            </label>
            <input type="checkbox" id="notifToggle" ${notif ? "checked" : ""} style="width: 20px; height: 20px; cursor: pointer;" />
          </div>

        </form>
      </div>

    </div>
  `;
}

/**
 * Atache evènman yo pou modil Settings la (Delegasyon sou #mainContent)
 */
export function bindSettingsEvents() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Evite double koute evènman pa klonaj
  mainContent.replaceWith(mainContent.cloneNode(true));
  const newMainContent = document.getElementById("mainContent");

  // Koute chanjman sou Select Langay la
  newMainContent.addEventListener("change", (e) => {
    if (e.target.id === "languageSelect") {
      const selectedLang = e.target.value;
      settingsService.setLanguage(selectedLang);

      // Re-rann koòdone settings la pou chanje tèks anndan kat la an tan reyèl
      renderSettingsView(store.getState());
      bindSettingsEvents();
    }

    // Koute chanjman sou bwat Notifikasyon an
    if (e.target.id === "notifToggle") {
      const isChecked = e.target.checked;
      settingsService.setNotifications(isChecked);
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
