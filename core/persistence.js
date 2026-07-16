/**
 * LifeOS - Core Persistence Module
 * Jere sovgad otomatik nan LocalStorage, vèsyon kòd (schemas), ak migrasyon done.
 */

const STORAGE_KEY = "lifeos_app_state";
const CURRENT_SCHEMA_VERSION = "1.0.0";

// Fonksyon pou migrasyon done si vèsyon yo ta chanje pita
function migrateState(savedState) {
  const savedVersion = savedState?.meta?.version || "0.0.0";

  if (savedVersion === CURRENT_SCHEMA_VERSION) {
    return savedState;
  }

  // Egzanp estrikti pou migrasyon nan lide pou lavni (Future Proof)
  let migratedState = { ...savedState };
  
  // Si vèsyon an te "0.0.0" (pa egzanp) nou ka mete l ajou konsa:
  // if (savedVersion < "1.0.0") { ... }

  if (!migratedState.meta) {
    migratedState.meta = {};
  }
  migratedState.meta.version = CURRENT_SCHEMA_VERSION;
  migratedState.meta.updatedAt = new Date().toISOString();

  return migratedState;
}

export const persistence = {
  /**
   * Chaje done yo depi nan LocalStorage epi kouri migrasyon si sa nesesè
   */
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      return migrateState(parsed);
    } catch (e) {
      console.error("[Persistence] Erreur chargement LocalStorage:", e);
      return null;
    }
  },

  /**
   * Sove yon eta (state) dirèkteman nan LocalStorage
   */
  save(state) {
    try {
      if (!state) return;
      const stateToSave = {
        ...state,
        meta: {
          ...state.meta,
          version: CURRENT_SCHEMA_VERSION,
          updatedAt: new Date().toISOString()
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("[Persistence] Erreur sauvegarde LocalStorage:", e);
    }
  },

  /**
   * Netwaye LocalStorage
   */
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("[Persistence] Erreur nettoyage LocalStorage:", e);
    }
  },

  /**
   * Middleware pou store.js kapab otomatikman sove done yo lè yon chanjman fèt
   */
  middleware(storeInstance) {
    // 1. Nou chaje ansyen done yo si yo egziste
    const savedState = persistence.load();
    if (savedState) {
      storeInstance.setState(savedState);
    }

    // 2. Nou koute chak chanjman pou nou sove otomatikman san bloke kòd la
    storeInstance.subscribe((currentState) => {
      persistence.save(currentState);
    });
  }
};
