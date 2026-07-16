/**
 * LifeOS - Initial State
 * Estrikti done default aplikasyon an
 */
export const INITIAL_STATE = {
  meta: {
    version: "1.0.0",
    createdAt: "2026-07-16T00:00:00.000Z",
    updatedAt: "2026-07-16T00:00:00.000Z"
  },

  // "theme" rete TOP-LEVEL (pa anba profile), paske
  // events.js ak render.js li/ekri l nan state.theme dirèkteman.
  theme: "dark",

  // "profile" se sèl sous done itilizatè a (ranplase "user").
  // streak/location/temp ajoute isit paske welcome card
  // (render.js) bezwen yo pou chips yo (🔥 streak, ☀️ tan/vil).
  profile: {
    name: "Maxime Wilguentz",
    role: "Entrepreneur & Computer Specialist",
    streak: 6,
    location: "Pétionville",
    temp: 29
  },

  mood: {
    current: "okay",
    note: "A neutral day. Pace yourself and take breaks when needed."
  },

  // Kenbe "tasks" (pa "missions"). Chan yo aliyen ak sa
  // render.js/events.js bezwen: id, title, done, meta.
  // "category" rete kòm metadata siplemantè pou pi devan.
  tasks: [
    {
      id: 1,
      title: "Review LifeOS Architecture",
      done: true,
      meta: "Work · done",
      category: "work"
    },
    {
      id: 2,
      title: "Implement LocalStorage backup",
      done: false,
      meta: "Learning",
      category: "learning"
    },
    {
      id: 3,
      title: "Draft internet monitor module",
      done: false,
      meta: "Project",
      category: "project"
    }
  ],

  goals: {
    year: [],
    month: [],
    week: []
  },

  projects: [],

  // Pa touche — deja aliyen ak financeService.js
  finance: {
    savings: {
      current: 1240,
      goal: 3000
    },
    transactions: []
  },

  // Aliyen dirèkteman ak modèl internetService.js (dokiman 1,
  // sa nou kenbe a): provider, totalGB, usedGB, activationDate,
  // expirationDate, monthlyBudget, isActive.
  internetPlan: {
    provider: "Natcom",
    totalGB: 10,
    usedGB: 0,
    activationDate: null,
    expirationDate: null,
    monthlyBudget: 0,
    isActive: false
  },

  learningProgress: [],
  habits: [],

  weeklyStats: {
    data: [
      { day: "Mon", hours: 4.2 },
      { day: "Tue", hours: 5.1 },
      { day: "Wed", hours: 3.4 },
      { day: "Thu", hours: 4.8 },
      { day: "Fri", hours: 5.6 },
      { day: "Sat", hours: 2.1 },
      { day: "Sun", hours: 2.3 }
    ]
  },

  notifications: [],
  reports: {},
  settings: {}
};
