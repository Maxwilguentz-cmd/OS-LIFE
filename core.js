// ============================================================
// LifeOS — core.js (Sistèm Eta Santral ak Pèsistans)
// ============================================================

// Done pa defo (Mock State) si localStorage vid
const defaultState = {
  settings: { language: "ht", theme: "dark" },
  user: { name: "Wilguentz", role: "Antreprenè & Jeni", avatar: "W" },
  missions: [
    { id: 1, title: "Kòde achitekti LifeOS la", category: "Teknoloji", done: true },
    { id: 2, title: "Pran 15 minit meditasyon", category: "Sante", done: false },
    { id: 3, title: "Revize plan finansyè a", category: "Biznis", done: false }
  ],
  goals: [
    { id: 1, title: "Finansman Pwojè Alpha", pct: 75, done: false },
    { id: 2, title: "Lanse MVP an out 2026", pct: 100, done: true }
  ],
  savings: { current: 4500, target: 5000 },
  internetPlan: { provider: "Natcom Fiber", price: "35 USD", totalDays: 30, daysLeft: 12 },
  projects: [
    { id: 1, name: "LifeOS App", pct: 60, color: "#E8B14F" },
    { id: 2, name: "E-Commerce Platform", pct: 25, color: "#8B7FF6" }
  ],
  learning: { topic: "Sistèm Distribiye ak Python", pct: 40, duration: "12h / 30h" },
  weeklyStats: { focusedTime: "32h", tasksCompleted: 14, dailyData: [40, 75, 20, 90, 60, 15, 0] }
};

// Jere Eta a (State Management)
let currentState = JSON.parse(localStorage.getItem("lifeos_state")) || defaultState;
const listeners = new Set();
const middlewares = [];

export const store = {
  getState() {
    return currentState;
  },
  
  // Fonksyon pou chanje eta a epi avèti tout moun ki t ap koute
  setState(actionFn) {
    const nextState = actionFn(currentState);
    
    // Kouri tout middlewares yo anvan nou mete eta a ajou
    middlewares.forEach(mw => mw(nextState));
    
    currentState = nextState;
    listeners.forEach(({ selector, callback, lastSelected }) => {
      const selected = selector(currentState);
      if (JSON.stringify(selected) !== JSON.stringify(lastSelected.value)) {
        lastSelected.value = selected;
        callback(currentState);
      }
    });
  },

  // Koute sèlman si pati nan eta a ki enterese w la chanje
  subscribeSelector(selector, callback) {
    const lastSelected = { value: selector(currentState) };
    const listenerObj = { selector, callback, lastSelected };
    listeners.add(listenerObj);
    return () => listeners.delete(listenerObj);
  },

  // Ajoute middleware
  use(mw) {
    middlewares.push(mw);
  }
};

// Pèsistans Done nan LocalStorage
export const persistence = {
  middleware(nextState) {
    localStorage.setItem("lifeos_state", JSON.stringify(nextState));
  }
};

// Diksyonè pou Tradiksyon (Haitian Creole / English)
const i18n = {
  ht: { overview: "Apèsi jeneral", welcome: "Bonjou ankò," },
  en: { overview: "Dashboard Overview", welcome: "Welcome back," }
};

export function applyLanguage(lang) {
  store.setState(state => ({
    ...state,
    settings: { ...state.settings, language: lang }
  }));
  
  const viewTitle = document.getElementById("viewTitle");
  if (viewTitle) {
    viewTitle.textContent = lang === "ht" ? i18n.ht.overview : i18n.en.overview;
  }
}
