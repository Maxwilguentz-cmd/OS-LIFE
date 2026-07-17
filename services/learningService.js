/**
 * LifeOS - Learning Service
 * Jere tout lojik biznis ak depo (store) pou konpetans ak aprantisaj yo.
 */
import { store } from "../core/store.js";

const DEFAULT_COLORS = [
  "var(--accent-gold)",
  "var(--accent-mint)",
  "var(--accent-violet)"
];

export const learningService = {
  /**
   * Rekipere lis tout konpetans yo nan store la
   * @returns {Array} Tablo konpetans yo
   */
  getSkills() {
    return store.getState().learning || [];
  },

  /**
   * Ajoute yon nouvo konpetans (skill) nan store la
   * @param {Object} rawSkill - Done yo voye depi nan fòm nan
   * @returns {Object|null} Nouvo konpetans lan oswa null si gen erè
   */
  addSkill(rawSkill) {
    if (!rawSkill || !rawSkill.name || !rawSkill.name.trim()) {
      console.error("Non konpetans lan obligatwa!");
      return null;
    }

    const currentSkills = this.getSkills();
    const cleanName = rawSkill.name.trim();

    // Chwazi yon koulè aza nan lis la si pa gen okenn ki bay
    const randomColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

    const newSkill = {
      id: Date.now() * 1000 + Math.floor(Math.random() * 1000), // ID inik nimerik
      name: cleanName,
      pct: Math.min(Math.max(Number(rawSkill.pct) || 0, 0), 100), // limite ant 0-100
      color: rawSkill.color || randomColor,
      meta: rawSkill.meta ? rawSkill.meta.trim() : ""
    };

    const updatedSkills = [...currentSkills, newSkill];

    // Mete store la ajou sou chemen "learning" an
    store.updateState(["learning"], updatedSkills);

    return newSkill;
  },

  /**
   * Mete pwogrè (%) yon konpetans ajou nan store la
   * @param {number|string} id - ID konpetans lan
   * @param {number} pct - Nouvo pousantaj la (0 a 100)
   */
  updateSkillProgress(id, pct) {
    const currentSkills = this.getSkills();
    const targetId = Number(id);
    const cleanPct = Math.min(Math.max(Number(pct) || 0, 0), 100);

    const updatedSkills = currentSkills.map(skill => {
      if (skill.id === targetId) {
        return { ...skill, pct: cleanPct };
      }
      return skill;
    });

    store.updateState(["learning"], updatedSkills);
  },

  /**
   * Retire yon konpetans nan store la dapre ID li
   * @param {number|string} id - ID konpetans lan
   */
  removeSkill(id) {
    const currentSkills = this.getSkills();
    const targetId = Number(id);

    const updatedSkills = currentSkills.filter(skill => skill.id !== targetId);

    store.updateState(["learning"], updatedSkills);
  }
};
