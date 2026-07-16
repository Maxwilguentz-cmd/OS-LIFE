/**
 * LifeOS - Theme Service
 * Jere lojik pou chanje ak rekipere tèm aplikasyon an (light/dark).
 * Sèvis sa a asire entegrite tèm nan san UI a pa manipile store la dirèkteman.
 */

import { store } from "../core/store.js";

export const themeService = {
  /**
   * Retounen tèm aktyèl ki nan store la
   * @returns {string} "dark" | "light"
   */
  getTheme() {
    return store.getState().theme || "dark";
  },

  /**
   * Chanje tèm nan ant "dark" ak "light" epi mete store la ajou
   */
  toggleTheme() {
    const currentTheme = this.getTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    store.updateState(["theme"], nextTheme);
  }
};
