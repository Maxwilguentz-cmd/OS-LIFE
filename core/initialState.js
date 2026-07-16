/**
 * LifeOS - Initial State (State Inisyal)
 * Fichye sa a defini estrikti fondamantal ak valè pa default pou tout aplikasyon an.
 * Li fèt pou anpeche erè nan render.js lè store la ap chaje pou premye fwa.
 */

export const INITIAL_STATE = {
  // Pwofil itilizatè a pou Sidebar ak kat yo
  profile: {
    name: "User",
    role: "Member",
    avatar: "U",
    email: ""
  },

  // Eta imè pou jounen an
  mood: {
    current: null, // "great" | "good" | "okay" | "low" | null
    lastUpdated: null,
    history: [] // Istorik imè yo { date, value }
  },

  // Lis travay (Tasks) pou rann nan kat "Today's mission" ak paj "Tasks" la
  tasks: [],

  // Objektif jeneral itilizatè a
  goals: [],

  // Pwojè aktif ak pwogrè yo
  projects: [],

  // Depatman finans, ekonomi ak tranzaksyon yo
  finance: {
    savings: {
      current: 0,
      goal: 0,
      goalName: "General Savings",
      currency: "HTG"
    },
    transactions: [], // Istorik tranzaksyon yo { id, type, amount, category, date }
    monthlyBudget: 0
  },

  // Plan entènèt aktif la (Jan sa te ye nan index.html la)
  internetPlan: {
    provider: "Unknown Provider",
    totalGB: 0,
    usedGB: 0,
    activationDate: null,
    expirationDate: null,
    monthlyBudget: 0,
    isActive: false
  },

  // Swivi sou sa k ap aprann yo (Learning path)
  learningProgress: [],

  // Abitid chak jou (Habits)
  habits: [],

  // Estatistik pou graf ak analiz chak semèn
  weeklyStats: {
    focusedTime: "0h",
    tasksDone: 0,
    trend: "+0%", // Konparasyon ak semèn pase
    dailyDistribution: [0, 0, 0, 0, 0, 0, 0] // Lendi pou Dimanch
  },

  // Notifikasyon sistèm yo
  notifications: [],

  // Rapò estatistik yo
  reports: [],

  // Anviwònman ak konfigirasyon aplikasyon an (Theme, kreyòl/franse, etc.)
  settings: {
    theme: "dark", // "dark" | "light"
    language: "en",
    notificationsEnabled: true
  },

  // Meta-done sistèm lan pou versioning ak middleware persistence la
  meta: {
    version: "1.0.0",
    updatedAt: new Date().toISOString()
  }
};
