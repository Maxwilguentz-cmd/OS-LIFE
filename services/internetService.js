import { store } from '../core/store.js';

/**
 * internetService.js
 * 
 * Sèvis sa a jere tout lojik ki gen rapò ak plan entènèt (internetPlan).
 * Li respekte achitekti LifeOS: li pa manyen DOM, li pa manyen LocalStorage dirèkteman,
 * epi tout chanjman pase pa store la.
 */
export const internetService = {

  /**
   * Jwenn slice internetPlan an nan store la
   * @returns {Object} Plan entènèt aktyèl la
   */
  getInternetPlan() {
    const state = store.getState();
    return state.internetPlan || {
      provider: "",
      totalGB: 0,
      usedGB: 0,
      monthlyBudget: 0,
      activationDate: null,
      expirationDate: null,
      durationDays: 0,
      isActive: false
    };
  },

  /**
   * Chanje oswa mete non founisè sèvis la (Digicel, Natcom, elatriye)
   * @param {string} provider - Non founisè a
   */
  setProvider(provider) {
    if (!provider || typeof provider !== 'string' || provider.trim() === '') {
      throw new Error("Non founisè a pa ka vid.");
    }

    const currentPlan = this.getInternetPlan();
    
    store.updateState({
      internetPlan: {
        ...currentPlan,
        provider: provider.trim()
      }
    });
  },

  /**
   * Aktive yon nouvo plan entènèt. Li kalkile dat yo otomatikman.
   * @param {Object} data - Done plan an
   * @param {number} data.totalGB - Kantite giga total plan an genyen
   * @param {number} data.durationDays - Kantite jou plan an ap dire (egz: 1, 7, 30)
   */
  activatePlan({ totalGB, durationDays }) {
    if (typeof totalGB !== 'number' || totalGB <= 0) {
      throw new Error("Kantite GB total la dwe yon chif ki pi gwo pase 0.");
    }
    if (typeof durationDays !== 'number' || durationDays <= 0) {
      throw new Error("Kantite jou plan an dwe yon chif ki pi gwo pase 0.");
    }

    const currentPlan = this.getInternetPlan();
    
    const activationDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(activationDate.getDate() + durationDays);

    store.updateState({
      internetPlan: {
        ...currentPlan,
        totalGB: totalGB,
        usedGB: 0, // Reset depi se yon nouvo plan
        durationDays: durationDays,
        activationDate: activationDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        isActive: true
      }
    });
  },

  /**
   * Mete yon valè fiks pou kantite gigabaj (GB) ki konsome
   * @param {number} usedGB - Nouvo valè konsomasyon an
   */
  updateUsage(usedGB) {
    if (typeof usedGB !== 'number' || usedGB < 0) {
      throw new Error("Konsomasyon GB pa ka yon chif negatif.");
    }

    const currentPlan = this.getInternetPlan();
    
    if (usedGB > currentPlan.totalGB) {
      throw new Error(`Konsomasyon (${usedGB} GB) pa ka depase limit plan an (${currentPlan.totalGB} GB).`);
    }

    store.updateState({
      internetPlan: {
        ...currentPlan,
        usedGB: usedGB
      }
    });
  },

  /**
   * Ajoute yon valè sou konsomasyon ki te deja la a
   * @param {number} amountGB - Kantite GB ou vle ajoute sou sa k te konsome deja
   */
  addUsage(amountGB) {
    if (typeof amountGB !== 'number' || amountGB < 0) {
      throw new Error("Valè pou ajoute a pa ka negatif.");
    }

    const currentPlan = this.getInternetPlan();
    const newUsage = currentPlan.usedGB + amountGB;

    if (newUsage > currentPlan.totalGB) {
      throw new Error(`Nouvo konsomasyon an (${newUsage} GB) ap depase limit plan an (${currentPlan.totalGB} GB).`);
    }

    store.updateState({
      internetPlan: {
        ...currentPlan,
        usedGB: newUsage
      }
    });
  },

  /**
   * Remete konsomasyon plan an a zewo (0 GB)
   */
  resetUsage() {
    const currentPlan = this.getInternetPlan();
    
    store.updateState({
      internetPlan: {
        ...currentPlan,
        usedGB: 0
      }
    });
  },

  /**
   * Kalkile kantite GB ki rete nan plan an
   * @returns {number} GB ki rete yo
   */
  calculateRemainingData() {
    const currentPlan = this.getInternetPlan();
    const remaining = currentPlan.totalGB - currentPlan.usedGB;
    return remaining < 0 ? 0 : remaining;
  },

  /**
   * Kalkile pousantaj konsomasyon an pou Dashboard oswa Rapò yo
   * @returns {number} Pousantaj ant 0 ak 100
   */
  calculateUsagePercentage() {
    const currentPlan = this.getInternetPlan();
    if (currentPlan.totalGB === 0) return 0;
    
    const percentage = (currentPlan.usedGB / currentPlan.totalGB) * 100;
    return Math.round(percentage * 100) / 100; // Kenbe 2 desimal
  },

  /**
   * Kalkile kantite jou ki rete anvan plan an ekspire
   * @returns {number} Jou ki rete yo (retounen 0 si l ekspire)
   */
  calculateDaysRemaining() {
    const currentPlan = this.getInternetPlan();
    if (!currentPlan.expirationDate) return 0;

    const today = new Date();
    const expiration = new Date(currentPlan.expirationDate);
    
    const differenceInTime = expiration.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays < 0 ? 0 : Math.ceil(differenceInDays);
  },

  /**
   * Tcheke si plan an ekspire. Si dat la fin pase, li mete plan an "isActive = false"
   * Fonksyon sa a pare pou Scheduler a ka rele l otomatikman.
   * @returns {boolean} True si plan an ekspire, False si l toujou bon
   */
  checkExpiration() {
    const currentPlan = this.getInternetPlan();
    if (!currentPlan.isActive || !currentPlan.expirationDate) return false;

    const today = new Date();
    const expiration = new Date(currentPlan.expirationDate);

    if (today >= expiration) {
      store.updateState({
        internetPlan: {
          ...currentPlan,
          isActive: false
        }
      });
      return true;
    }

    return false;
  },

  /**
   * Mete yon bidjè mansyèl pou depans entènèt (Tracking)
   * @param {number} amount - Kantite lajan atribiye pou entènèt nan mwa a
   */
  setMonthlyBudget(amount) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error("Lajan bidjè a pa ka yon chif negatif.");
    }

    const currentPlan = this.getInternetPlan();

    store.updateState({
      internetPlan: {
        ...currentPlan,
        monthlyBudget: amount
      }
    });
  }
};
