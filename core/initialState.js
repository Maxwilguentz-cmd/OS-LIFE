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

  profile: {
    name: "Maxime Wilguentz",
    role: "Entrepreneur & Computer Specialist",
    theme: "dark"
  },

  mood: {
    current: "okay",
    note: "A neutral day. Pace yourself and take breaks when needed."
  },

  tasks: [
    {
      id: "1",
      title: "Review LifeOS Architecture",
      isDone: true,
      category: "work"
    },
    {
      id: "2",
      title: "Implement LocalStorage backup",
      isDone: false,
      category: "learning"
    },
    {
      id: "3",
      title: "Draft internet monitor module",
      isDone: false,
      category: "project"
    }
  ],

  goals: {
    year: [],
    month: [],
    week: []
  },

  projects: [],

  finance: {
    savings: {
      current: 1240,
      goal: 3000
    },
    transactions: []
  },

  internetPlan: {
    provider: "Natcom",
    purchaseDate: null,
    durationDays: 30,
    expirationDate: null,
    gigabytesUsed: 0,
    gigabytesTotal: 10,
    monthlyBudget: 0
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
