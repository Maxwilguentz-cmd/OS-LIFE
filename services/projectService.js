/**
 * LifeOS - Project Service
 * Jere tout lojik biznis ak depo (store) pou pwojè yo nan aplikasyon an.
 */
import { store } from "../core/store.js";

const DEFAULT_COLORS = [
  "var(--accent-gold)",
  "var(--accent-mint)",
  "var(--accent-violet)",
  "var(--accent-blue)",
  "var(--accent-rose)"
];

export const projectService = {
  /**
   * Rekipere lis tout pwojè yo nan store la
   * @returns {Array} Tablo pwojè yo
   */
  getProjects() {
    return store.getState().projects || [];
  },

  /**
   * Ajoute yon nouvo pwojè nan store la
   * @param {Object} rawProject - Done fòm nan voye
   * @returns {Object|null} Pwojè ki ajoute a oswa null si gen erè
   */
  addProject(rawProject) {
    if (!rawProject || !rawProject.name || !rawProject.name.trim()) {
      console.error("Non pwojè a obligatwa!");
      return null;
    }

    const currentState = store.getState();
    const currentProjects = currentState.projects || [];

    // Jenere yon short code (2 premye lèt non an an majiskil)
    const cleanName = rawProject.name.trim();
    const shortCode = cleanName.slice(0, 2).toUpperCase();

    // Chwazi yon koulè aza nan lis la si itilizatè a pa bay yonn
    const randomColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

    // Kreye nouvo objè pwojè a dapre fòma etabli a
    const newProject = {
      id: Date.now() * 1000 + Math.floor(Math.random() * 1000), // ID inik nimerik
      name: cleanName,
      short: shortCode,
      color: rawProject.color || randomColor,
      pct: Math.min(Math.max(Number(rawProject.pct) || 0, 0), 100), // limite ant 0-100
      description: rawProject.description ? rawProject.description.trim() : "",
      createdAt: new Date().toISOString().split('T')[0],
      deadline: rawProject.deadline || ""
    };

    const updatedProjects = [...currentProjects, newProject];
    
    // Mete store la ajou sou chemen projects la
    store.setState({
      ...currentState,
      projects: updatedProjects
    });

    return newProject;
  },

  /**
   * Mete pwogrè (%) yon pwojè ajou nan store la
   * @param {number|string} id - ID pwojè a
   * @param {number} pct - Nouvo pousantaj la (0 a 100)
   */
  updateProjectProgress(id, pct) {
    const currentState = store.getState();
    const currentProjects = currentState.projects || [];
    const targetId = Number(id);

    // Limite pousantaj la ant 0 ak 100
    const cleanPct = Math.min(Math.max(Number(pct) || 0, 0), 100);

    const updatedProjects = currentProjects.map(proj => {
      if (proj.id === targetId) {
        return { ...proj, pct: cleanPct };
      }
      return proj;
    });

    store.setState({
      ...currentState,
      projects: updatedProjects
    });
  },

  /**
   * Retire yon pwojè nan store la dapre ID li
   * @param {number|string} id - ID pwojè pou n retire a
   */
  removeProject(id) {
    const currentState = store.getState();
    const currentProjects = currentState.projects || [];
    const targetId = Number(id);

    const updatedProjects = currentProjects.filter(proj => proj.id !== targetId);

    store.setState({
      ...currentState,
      projects: updatedProjects
    });
  }
};
