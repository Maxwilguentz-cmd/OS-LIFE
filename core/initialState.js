/**
 * LifeOS - Initial State (State Inisyal)
 * Fichye sa a defini estrikti fondamantal ak valè pa default pou tout aplikasyon an.
 * Li fèt pou anpeche erè nan render.js lè store la ap chaje pou premye fwa.
 */

export const INITIAL_STATE = {
  // Tèm nan rasin lan pou match state.theme
  theme: "dark", 

  // Pwofil itilizatè a (Mache ak state.user)
  user: {
    name: "Wilguentz",
    role: "Free plan",
    streak: 0,
    temp: "--",
    location: "Haiti"
  },

  // Eta imè pou jounen an
  mood: {
    current: null, // "great" | "good" | "okay" | "low" | null
    note: ""
  },

  // Lis misyon yo (Mache ak state.missions)
  missions: [],

  // Pwojè aktif yo (Mache ak state.projects)
  projects: [],

  // Swivi sou sa k ap aprann yo (Mache ak state.learning)
  learning: [],

  // Nouvo slice pou objektif yo
  goals: [],

  // Lis abitid pou swiv yo
  habits: [],

  // Depatman finans, ekonomi ak tranzaksyon yo
  finance: {
    transactions: [], // Istorik tranzaksyon yo { id, type, amount, category, date }
    monthlyBudget: 0
  },

  // Savings yo nan rasin lan pou matche state.savings nan render.js 100%
  savings: {
    current: 0,
    goal: 0, // Itilize 'goal' (pa 'target') pou matche financeService.js egzakteman
    goalName: "General Savings",
    monthlyContribution: 0,
    targetDate: ""
  },

  // Plan entènèt aktif la (SÈLMAN chan orijinal internetService.js yo + daysLeft)
  internetPlan: {
    provider: "Unknown Provider",
    totalGB: 0,
    usedGB: 0,
    activationDate: null,
    expirationDate: null,
    monthlyBudget: 0,
    isActive: false,
    daysLeft: 0
  },

  // Estatistik pou graf ak analiz chak semèn (Mache ak state.weeklyStats)
  weeklyStats: {
    focusedHours: "0h",
    tasksDone: 0,
    comparisonPct: "+0%", 
    days: [
      { label: "Mon", value: 0 },
      { label: "Tue", value: 0 },
      { label: "Wed", value: 0 },
      { label: "Thu", value: 0 },
      { label: "Fri", value: 0 },
      { label: "Sat", value: 0 },
      { label: "Sun", value: 0 }
    ]
  },

  // Anviwònman ak konfigirasyon aplikasyon an 
  settings: {
    language: "en",
    notificationsEnabled: true
  },

  // Meta-done sistèm lan pou versioning
  meta: {
    version: "1.0.0",
    updatedAt: new Date().toISOString()
  }
};
