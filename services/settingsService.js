/**
 * LifeOS - services/settingsService.js
 * Jere konfigirasyon ak chanjman langaj yo nan store la.
 */
import { store } from "../core/store.js";
import { applyLanguage } from "../core/i18n.js";

export const settingsService = {
  /**
   * Rekipere tout konfigirasyon yo nan store la
   * @returns {Object} Konfigirasyon yo
   */
  getSettings() {
    return store.getState().settings || { language: "en", notificationsEnabled: true };
  },

  /**
   * Sove yon nouvo lang nan store la epi aplike li sou koòdone a
   * @param {string} langCode - "en", "ht" oswa "fr"
   */
  setLanguage(langCode) {
    const allowedLanguages = ["en", "ht", "fr"];
    if (!allowedLanguages.includes(langCode)) {
      console.error(`Lang sa a pa sipòte: ${langCode}`);
      return;
    }

    // Mete sèlman kle langaj la ajou nan nivo settings la
    store.updateState(["settings", "language"], langCode);

    // Aplike tradiksyon yo nan tout aplikasyon an
    applyLanguage(langCode);
  },

  /**
   * Aktive oswa dezaktive notifikasyon yo
   * @param {boolean} enabled 
   */
  setNotifications(enabled) {
    store.updateState(["settings", "notificationsEnabled"], !!enabled);
  }
};
