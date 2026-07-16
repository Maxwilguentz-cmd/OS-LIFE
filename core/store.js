/**
 * LifeOS - Internet Service
 * Jere lojik biznis pou fòfè entènèt la: konsomasyon done, dat ekspirasyon, ak bidjè.
 * Sèvis sa a pa touche DOM ditou epi li asire entegrite done yo nan store la.
 */

import { store } from "../core/store.js";

export const internetService = {
  /**
   * Retounen tranch done fòfè entènèt la ki nan store la
   * @returns {Object} Done fòfè a
   */
  getInternetPlan() {
    return store.getState().internetPlan || {
      provider: "",
      totalGB: 0,
      usedGB: 0,
      activationDate: null,
      expirationDate: null,
      monthlyBudget: 0,
      isActive: false
    };
  },

  /**
   * Chanje oswa mete non founisè sèvis la (Provider)
   * @param {string} provider - Non konpayi an (Natcom, Digicel, elatriye)
   */
  setProvider(provider) {
    if (!provider || typeof provider !== "string" || provider.trim() === "") {
      throw new Error("Non founisè a (provider) pa kapab vid.");
    }
    store.updateState(["internetPlan", "provider"], provider.trim());
  },

  /**
   * Aktive yon nouvo fòfè entènèt ak kalkil otomatik pou dat yo
   * @param {Object} data - Done fòfè a (provider, totalGB, durationDays)
   */
  activatePlan(data) {
    const totalGB = parseFloat(data?.totalGB);
    const durationDays = parseInt(data?.durationDays, 10);

    if (!data?.provider || typeof data.provider !== "string" || data.provider.trim() === "") {
      throw new Error("Non founisè a (provider) obligatwa pou aktive fòfè a.");
    }
    if (isNaN(totalGB) || totalGB <= 0) {
      throw new Error("Kantite GB total la dwe yon chif ki pi gwo pase 0.");
    }
    if (isNaN(durationDays) || durationDays <= 0) {
      throw new Error("Kantite jou fòfè a ap dire a dwe yon chif ki pi gwo pase 0.");
    }

    const now = new Date();
    const expiration = new Date();
    expiration.setDate(now.getDate() + durationDays);

    const updatedPlan = {
      provider: data.provider.trim(),
      totalGB: totalGB,
      usedGB: 0,
      activationDate: now.toISOString(),
      expirationDate: expiration.toISOString(),
      isActive: true
    };

    // KORIJE: Nou itilize chemen ['internetPlan'] ak nouvo valè a pou respekte siyati updateState(path, value)
    store.updateState(["internetPlan"], {
      ...this.getInternetPlan(),
      ...updatedPlan
    });
  },

  /**
   * Ranplase konsomasyon aktyèl la ak yon nouvo valè fiks
   * @param {number} usedGB - Nouvo kantite GB ki konsome a
   */
  updateUsage(usedGB) {
    const parsedUsed = parseFloat(usedGB);
    const plan = this.getInternetPlan();

    if (isNaN(parsedUsed) || parsedUsed < 0) {
      throw new Error("Konsomasyon GB a pa kapab yon chif negatif.");
    }
    if (parsedUsed > plan.totalGB) {
      throw new Error(`Konsomasyon an (${parsedUsed} GB) pa kapab depase limit fòfè a (${plan.totalGB} GB).`);
    }

    store.updateState(["internetPlan", "usedGB"], parsedUsed);
  },

  /**
   * Ajoute yon kantite konsomasyon sou sa ki te deja la a
   * @param {number} amountGB - Kantite GB pou ajoute sou konsomasyon an
   */
  addUsage(amountGB) {
    const parsedAmount = parseFloat(amountGB);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new Error("Kantite GB pou ajoute a pa kapab yon chif negatif.");
    }

    const plan = this.getInternetPlan();
    const newUsage = plan.usedGB + parsedAmount;

    if (newUsage > plan.totalGB) {
      throw new Error(`Nouvo konsomasyon sa a ap fè w depase limit fòfè a (${plan.totalGB} GB).`);
    }

    store.updateState(["internetPlan", "usedGB"], newUsage);
  },

  /**
   * Reyisyalize konsomasyon done a pou mete l a 0
   */
  resetUsage() {
    store.updateState(["internetPlan", "usedGB"], 0);
  },

  /**
   * Kalkile kantite done ki rete pou fòfè a fini
   * @returns {number} GB ki rete yo
   */
  calculateRemainingData() {
    const plan = this.getInternetPlan();
    const remaining = plan.totalGB - plan.usedGB;
    return Math.max(0, parseFloat(remaining.toFixed(2)));
  },

  /**
   * Kalkile pousantaj done ki deja konsome
   * @returns {number} Pousantaj ant 0 ak 100
   */
  calculateUsagePercentage() {
    const plan = this.getInternetPlan();
    if (plan.totalGB <= 0) return 0;
    const percentage = (plan.usedGB / plan.totalGB) * 100;
    return Math.min(100, Math.round(percentage));
  },

  /**
   * Kalkile konbyen jou ki rete anvan fòfè a ekspire
   * @returns {number} Kantite jou ki rete (si l ekspire, li retounen 0)
   */
  calculateDaysRemaining() {
    const plan = this.getInternetPlan();
    if (!plan.expirationDate) return 0;

    const diffTime = new Date(plan.expirationDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  },

  /**
   * Verifye si fòfè a ekspire epi mete l "inactive" si se wi
   * @returns {boolean} True si plan an ekspire, false si li toujou bon
   */
  checkExpiration() {
    const plan = this.getInternetPlan();
    if (!plan.isActive) return true;

    if (plan.expirationDate && new Date() > new Date(plan.expirationDate)) {
      store.updateState(["internetPlan", "isActive"], false);
      return true;
    }
    return false;
  },

  /**
   * Defini bidjè chak mwa pou entènèt la
   * @param {number} amount - Montan bidjè a
   */
  setMonthlyBudget(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new Error("Bidjè a dwe yon chif pozitif.");
    }
    store.updateState(["internetPlan", "monthlyBudget"], parsedAmount);
  }
};
