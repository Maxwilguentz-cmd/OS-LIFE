/**
 * LifeOS - Mood Service (Sèvis Imè)
 * Jere tout lojik pou chwazi, efase ak swiv imè pou jounen an.
 * Tout chanjman fèt sou chemen ['mood'] pou asire korespondans ak rès sistèm lan.
 */

import { store } from "../core/store.js";

// Lis imè ki otorize nan sistèm nan
const ALLOWED_MOODS = ["great", "good", "okay", "low"];

export const moodService = {
  /**
   * Retounen eta imè aktyèl la ki nan store la
   * @returns {Object} Objè mood la { current, note }
   */
  getMood() {
    return store.getState().mood || { current: null, note: "" };
  },

  /**
   * Enstale oswa modifye imè pou jounen an
   * @param {string} moodValue - Valè imè a ("great", "good", "okay", "low")
   * @param {string} [customNote] - Yon nòt pèsonalize (opsyonèl)
   * @returns {Object} Nouvo eta imè ki sove a
   */
  setMood(moodValue, customNote) {
    if (!moodValue) {
      throw new Error("Valè imè a obligatwa.");
    }

    const cleanMood = moodValue.trim().toLowerCase();

    // Validasyon pou asire imè a nan lis ki otorize a
    if (!ALLOWED_MOODS.includes(cleanMood)) {
      throw new Error(`Valè imè '${moodValue}' la pa otorize nan sistèm nan.`);
    }

    // Si pa gen nòt pèsonalize, nou kreye nòt otomatik la menm jan ak events.js
    const noteValue = customNote && typeof customNote === "string" && customNote.trim() !== ""
      ? customNote.trim()
      : `You logged feeling ${cleanMood} today`;

    const updatedMood = {
      ...this.getMood(), // Nou kenbe lòt pwopriyete (tankou history si l genyen)
      current: cleanMood,
      note: noteValue
    };

    store.updateState(["mood"], updatedMood);
    return updatedMood;
  },

  /**
   * Reyisyalize imè a nan eta inisyal li (current tounen null)
   */
  clearMood() {
    const updatedMood = {
      ...this.getMood(),
      current: null,
      note: ""
    };

    store.updateState(["mood"], updatedMood);
  },

  /**
   * Retounen istorik imè yo si li egziste nan state.mood la
   * @returns {Array} Tablo istorik la, oswa yon tablo vid si li pa egziste
   */
  getMoodHistory() {
    const mood = this.getMood();
    return Array.isArray(mood.history) ? mood.history : [];
  }
};

/**
 * Ekspòtasyon fonksyon endividyèl yo pou fasilite enpòtasyon dirèk si sa nesesè
 */
export const { getMood, setMood, clearMood, getMoodHistory } = moodService;
