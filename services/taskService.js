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
   * Jenere yon ID inik ki se yon NIMEWO pou l ka konpatib ak Number(item.dataset.id) nan events.js
   * @private
   * @returns {number}
   */
  _generateID() {
    return Date.now();
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

    // Jenere lè aktyèl la pou mete nan meta kòm string
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMinute = String(now.getMinutes()).padStart(2, '0');
    const defaultMetaString = `Custom · ${currentHour}:${currentMinute}`;

    // Si rawTask.meta se yon string ki pa vid, nou pran li, sinon nou mete string otomatik la
    const metaValue = rawTask.meta && typeof rawTask.meta === "string" && rawTask.meta.trim() !== ""
      ? rawTask.meta.trim()
      : defaultMetaString;

    const newTask = {
      id: this._generateID(), // Nimewo
      title: rawTask.title.trim(),
      done: false,
      dueTime: rawTask.dueTime && typeof rawTask.dueTime === "string" ? rawTask.dueTime.trim() : null,
      meta: metaValue // Toujou yon string pou evite "[object Object]" nan render.js
    };

    const currentMissions = this.getTasks();
    const updatedMissions = [...currentMissions, newTask];

    store.updateState(["missions"], updatedMissions);
    return newTask;
  },

  /**
   * Chanje eta yon misyon (si l fèt l ap pase nan pa fèt, si l pa fèt l ap pase nan fèt)
   * @param {number|string} id - ID misyon pou chanje a (nou sipòte konparezon san fòse tip strik pou sekirite)
   * @returns {Object|null} Misyon ki modifye a, oswa null si id la pa egziste
   */
  toggleTask(id) {
    if (id === undefined || id === null) return null;

    const currentMissions = this.getTasks();
    let updatedTask = null;

    const updatedMissions = currentMissions.map(mission => {
      // Nou itilize == pou asire konpatibilite si events.js voye ID a kòm string oswa nimewo
      if (mission.id == id) {
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
   * @param {number|string} id - ID misyon pou efase a
   */
  removeTask(id) {
    if (id === undefined || id === null) return;

    const currentMissions = this.getTasks();
    // Nou itilize != pou filtre kòrèkteman kèlkeswa tip la (menm si se yon nimewo)
    const updatedMissions = currentMissions.filter(mission => mission.id != id);

    store.updateState(["missions"], updatedMissions);
  }
};

/**
 * Ekspòtasyon fonksyon endividyèl yo pou fasilite enpòtasyon dirèk si sa nesesè
 */
export const { getTasks, addTask, toggleTask, removeTask } = taskService;
