/**
 * LifeOS - Goals Service (Sèvis Objektif yo)
 * Jere tout lojik pou kreye, modifye, swiv pwogrè, epi retire objektif yo nan store la.
 * Tout aksyon yo fèt sou chemen ['goals'] nan store la pou asire konsistans.
 */

import { store } from "../core/store.js";

export const goalsService = {
  /**
   * Retounen lis tout objektif ki nan store la
   * @returns {Array} Lis objektif yo (oswa yon etajè vid si pa genyen)
   */
  getGoals() {
    return store.getState().goals || [];
  },

  /**
   * Jenere yon ID inik ki se yon NIMEWO pou l ka fasil konpatib ak konparezon ID yo nan events.js pita
   * @private
   * @returns {number}
   */
  _generateID() {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
  },

  /**
   * Ajoute yon nouvo objektif nan lis la
   * @param {Object} rawGoal - Done objektif la (title, targetDate, progress, category)
   * @returns {Object} Objektif ki sove a
   */
  addGoal(rawGoal) {
    if (!rawGoal || !rawGoal.title || typeof rawGoal.title !== "string" || rawGoal.title.trim() === "") {
      throw new Error("Tit objektif la obligatwa epi li pa kapab vid.");
    }

    // Valide pwogrè si li bay nan kreyasyon an
    let initialProgress = parseInt(rawGoal.progress, 10);
    if (isNaN(initialProgress) || initialProgress < 0) {
      initialProgress = 0;
    } else if (initialProgress > 100) {
      initialProgress = 100;
    }

    const newGoal = {
      id: this._generateID(), // Nimewo inik san kolizyon
      title: rawGoal.title.trim(),
      targetDate: rawGoal.targetDate ? new Date(rawGoal.targetDate).toISOString() : null,
      progress: initialProgress,
      done: initialProgress >= 100, // Otomatikman vre si pwogrè a kòmanse nan 100%
      category: rawGoal.category && typeof rawGoal.category === "string" ? rawGoal.category.trim() : null
    };

    const currentGoals = this.getGoals();
    const updatedGoals = [...currentGoals, newGoal];

    store.updateState(["goals"], updatedGoals);
    return newGoal;
  },

  /**
   * Mete ajou pwogrè yon objektif epi chanje eta 'done' li otomatikman si li rive nan 100%
   * @param {number|string} id - ID objektif pou modifye a
   * @param {number} progress - Nouvo valè pwogrè a (0-100)
   * @returns {Object|null} Objektif ki modifye a, oswa null si li pa jwenn li
   */
  updateGoalProgress(id, progress) {
    if (id === undefined || id === null) return null;

    let parsedProgress = parseInt(progress, 10);
    if (isNaN(parsedProgress)) {
      throw new Error("Pwogrè a dwe yon chif ki valab.");
    }

    // Limitasyon ant 0 ak 100
    parsedProgress = Math.max(0, Math.min(100, parsedProgress));

    const currentGoals = this.getGoals();
    let updatedGoal = null;

    const updatedGoals = currentGoals.map(goal => {
      if (goal.id == id) {
        updatedGoal = { 
          ...goal, 
          progress: parsedProgress,
          // Otomatikman mete 'done' kòm true si progress rive nan 100%
          done: parsedProgress >= 100 ? true : goal.done
        };
        return updatedGoal;
      }
      return goal;
    });

    if (updatedGoal) {
      store.updateState(["goals"], updatedGoals);
    }

    return updatedGoal;
  },

  /**
   * Chanje eta yon objektif manyèlman (menm jan ak taskService.toggleTask)
   * @param {number|string} id - ID objektif pou chanje a
   * @returns {Object|null} Objektif ki modifye a, oswa null si li pa jwenn li
   */
  toggleGoal(id) {
    if (id === undefined || id === null) return null;

    const currentGoals = this.getGoals();
    let updatedGoal = null;

    const updatedGoals = currentGoals.map(goal => {
      if (goal.id == id) {
        const nextDoneState = !goal.done;
        updatedGoal = { 
          ...goal, 
          done: nextDoneState,
          // Si nou make l kòm fini manyèlman, nou fòse progress la ale nan 100% tou
          progress: nextDoneState ? 100 : goal.progress
        };
        return updatedGoal;
      }
      return goal;
    });

    if (updatedGoal) {
      store.updateState(["goals"], updatedGoals);
    }

    return updatedGoal;
  },

  /**
   * Retire yon objektif nan lis la nèt ak ID li
   * @param {number|string} id - ID objektif pou efase a
   */
  removeGoal(id) {
    if (id === undefined || id === null) return;

    const currentGoals = this.getGoals();
    const updatedGoals = currentGoals.filter(goal => goal.id != id);

    store.updateState(["goals"], updatedGoals);
  }
};

/**
 * Ekspòtasyon fonksyon endividyèl yo pou fasilite enpòtasyon dirèk si sa nesesè
 */
export const { getGoals, addGoal, updateGoalProgress, toggleGoal, removeGoal } = goalsService;
