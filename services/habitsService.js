/**
 * LifeOS - Habits Service (Sèvis Abitid yo)
 * Jere tout lojik pou ajoute, valide, ak mete ajou abitid yo ak kalkil streak la.
 * Tout chanjman fèt sou chemen ['habits'] nan store la.
 */

import { store } from "../core/store.js";

export const habitsService = {
  /**
   * Retounen lis tout abitid ki nan store la
   * @returns {Array} Lis abitid yo
   */
  getHabits() {
    return store.getState().habits || [];
  },

  /**
   * Ajoute yon nouvo abitid nan lis la
   * @param {Object} rawHabit - Done abitid la ({ name })
   * @returns {Object} Abitid ki sove a
   */
  addHabit(rawHabit) {
    if (!rawHabit || !rawHabit.name || typeof rawHabit.name !== "string" || rawHabit.name.trim() === "") {
      throw new Error("Non abitid la obligatwa epi li pa kapab vid.");
    }

    const newHabit = {
      id: Date.now() * 1000 + Math.floor(Math.random() * 1000), // Nimewo inik san kolizyon
      name: rawHabit.name.trim(),
      streak: 0,
      history: [],
      createdAt: new Date().toISOString()
    };

    const currentHabits = this.getHabits();
    const updatedHabits = [...currentHabits, newHabit];

    store.updateState(["habits"], updatedHabits);
    return newHabit;
  },

  /**
   * Make yon abitid kòm fèt pou jodi a
   * @param {number|string} id - ID abitid la
   * @returns {Object|null} Abitid ki modifye a
   */
  markHabitDone(id) {
    if (id === undefined || id === null) return null;

    const todayStr = this._getTodayDateString();
    const currentHabits = this.getHabits();
    let updatedHabit = null;

    const updatedHabits = currentHabits.map(habit => {
      if (habit.id == id) {
        // Ajoute dat la sèlman si li pa t ko la deja pou jodi a
        const hasDoneToday = habit.history.includes(todayStr);
        const newHistory = hasDoneToday ? habit.history : [...habit.history, todayStr];
        
        // Klase istwa a nan lòd pou kalkil la pi fasil
        newHistory.sort();

        updatedHabit = {
          ...habit,
          history: newHistory,
          streak: this._calculateStreak(newHistory)
        };
        return updatedHabit;
      }
      return habit;
    });

    if (updatedHabit) {
      store.updateState(["habits"], updatedHabits);
    }

    return updatedHabit;
  },

  /**
   * Retire mak "fèt" la pou jodi a sou yon abitid
   * @param {number|string} id - ID abitid la
   * @returns {Object|null} Abitid ki modifye a
   */
  unmarkHabitDone(id) {
    if (id === undefined || id === null) return null;

    const todayStr = this._getTodayDateString();
    const currentHabits = this.getHabits();
    let updatedHabit = null;

    const updatedHabits = currentHabits.map(habit => {
      if (habit.id == id) {
        const newHistory = habit.history.filter(dateStr => dateStr !== todayStr);

        updatedHabit = {
          ...habit,
          history: newHistory,
          streak: this._calculateStreak(newHistory)
        };
        return updatedHabit;
      }
      return habit;
    });

    if (updatedHabit) {
      store.updateState(["habits"], updatedHabits);
    }

    return updatedHabit;
  },

  /**
   * Retire yon abitid nèt ak ID li
   * @param {number|string} id - ID abitid pou efase a
   */
  removeHabit(id) {
    if (id === undefined || id === null) return;

    const currentHabits = this.getHabits();
    const updatedHabits = currentHabits.filter(habit => habit.id != id);

    store.updateState(["habits"], updatedHabits);
  },

  /**
   * Jwenn dat jodi a nan fòma ISO lokal (YYYY-MM-DD)
   * @private
   * @returns {string}
   */
  _getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  /**
   * Kalkile konbyen jou konsekitif yon abitid fèt depi jodi a oswa yè
   * @private
   * @param {Array<string>} history - Istwa dat yo (fòma YYYY-MM-DD, triye)
   * @returns {number} Kantite jou konsekitif yo
   */
  _calculateStreak(history) {
    if (!history || history.length === 0) return 0;

    // Kreye yon Set pou rechèch rapid (O(1))
    const historySet = new Set(history);
    
    const today = new Date();
    const todayStr = this._getTodayDateString();

    // Kalkile dat yè a kòm string YYYY-MM-DD
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    let streak = 0;
    let checkDate = new Date(); // Kòmanse tcheke depi jodi a

    // Si abitid la pa fèt ni jodi a, ni yè, streak la kase (0)
    if (!historySet.has(todayStr) && !historySet.has(yesterdayStr)) {
      return 0;
    }

    // Si li pa fèt jodi a men li fèt yè, nou kòmanse tcheke depi yè
    if (!historySet.has(todayStr) && historySet.has(yesterdayStr)) {
      checkDate = yesterday;
    }

    // Bouk pou tounen dèyè nan tan jou pa jou
    while (true) {
      const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
      
      if (historySet.has(checkStr)) {
        streak++;
        // Desann dat la pa yon jou
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break; // Sekans lan kase
      }
    }

    return streak;
  }
};

/**
 * 'Ekspòtasyon fonksyon endividyèl yo pou fasilite enpòtasyon dirèk nan rès sistèm lan
 */
export const { getHabits, addHabit, markHabitDone, unmarkHabitDone, removeHabit } = habitsService;
