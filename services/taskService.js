/**
 * LifeOS - Task Service (Sèvis Misyon yo)
 * Jere tout lojik pou ajoute, modifye, epi retire misyon yo nan store la.
 * Tout chanjman fèt sou chemen ['missions'] pou asire korespondans ak rès sistèm lan.
 */

import { store } from "../core/store.js";

export const taskService = {
  /**
   * Retounen lis tout misyon ki nan store la
   * @returns {Array} Lis misyon yo (oswa yon etajè vid si pa genyen)
   */
  getTasks() {
    return store.getState().missions || [];
  },

  /**
   * Jenere yon ID inik pou misyon yo
   * @private
   */
  _generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  },

  /**
   * Ajoute yon nouvo misyon nan lis la
   * @param {Object} rawTask - Done misyon an (title, dueTime, meta)
   * @returns {Object} Misyon ki sove a
   */
  addTask(rawTask) {
    if (!rawTask || !rawTask.title || typeof rawTask.title !== "string" || rawTask.title.trim() === "") {
      throw new Error("Tit misyon an obligatwa epi li pa kapab vid.");
    }

    const newTask = {
      id: this._generateUUID(),
      title: rawTask.title.trim(),
      done: false, // Pa default yon misyon poko fèt
      dueTime: rawTask.dueTime && typeof rawTask.dueTime === "string" ? rawTask.dueTime.trim() : null,
      meta: rawTask.meta && typeof rawTask.meta === "object" ? rawTask.meta : {}
    };

    const currentMissions = this.getTasks();
    const updatedMissions = [...currentMissions, newTask];

    store.updateState(["missions"], updatedMissions);
    return newTask;
  },

  /**
   * Chanje eta yon misyon (si l fèt l ap pase nan pa fèt, si l pa fèt l ap pase nan fèt)
   * @param {string} id - ID misyon pou chanje a
   * @returns {Object|null} Misyon ki modifye a, oswa null si id la pa egziste
   */
  toggleTask(id) {
    if (!id || typeof id !== "string") return null;

    const currentMissions = this.getTasks();
    let updatedTask = null;

    const updatedMissions = currentMissions.map(mission => {
      if (mission.id === id) {
        updatedTask = { ...mission, done: !mission.done };
        return updatedTask;
      }
      return mission;
    });

    if (updatedTask) {
      store.updateState(["missions"], updatedMissions);
    }

    return updatedTask;
  },

  /**
   * Retire yon misyon nan lis la nèt ak ID li
   * @param {string} id - ID misyon pou efase a
   */
  removeTask(id) {
    if (!id || typeof id !== "string") return;

    const currentMissions = this.getTasks();
    const updatedMissions = currentMissions.filter(mission => mission.id !== id);

    store.updateState(["missions"], updatedMissions);
  }
};

/**
 * Ekspòtasyon fonksyon endividyèl yo pou fasilite enpòtasyon dirèk si sa nesesè
 */
export const { getTasks, addTask, toggleTask, removeTask } = taskService;
