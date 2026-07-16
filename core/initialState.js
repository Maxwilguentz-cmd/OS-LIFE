/**
 * LifeOS - Initial State
 * Estrikti done default aplikasyon an
 * Optimize pou yon sèl sous verite (Single Source of Truth) san diplekasyon
 */
export const INITIAL_STATE = {
  meta: {
    version: "1.0.0",
    createdAt: "2026-07-16T00:00:00.000Z",
    updatedAt: "2026-07-16T00:00:00.000Z"
  },

  theme: "dark",

  profile: {
    id: "user_01",
    name: "Wilguentz",
    role: "Entrepreneur & Computer Specialist",
    streak: 6,
    location: "Pétionville",
    temp: 29
  },

  mood: {
    current: "okay",
    note: "A neutral day. Pace yourself and take breaks when needed."
  },

  tasks: [
    {
      id: 1,
      title: "Review LifeOS Architecture",
      done: true,
      meta: "Work · done",
      category: "work",
      projectId: "project_01",
      priority: "high",
      createdAt: "2026-07-16T00:00:00.000Z"
    },
    {
      id: 2,
      title: "Implement LocalStorage backup",
      done: false,
      meta: "Learning",
      category: "learning",
      projectId: null,
      priority: "high",
      createdAt: "2026-07-16T00:00:00.000Z"
    },
    {
      id: 3,
      title: "Draft internet monitor module",
      done: false,
      meta: "Project",
      category: "project",
      projectId: "project_01",
      priority: "medium",
      createdAt: "2026-07-16T00:00:00.000Z"
    }
  ],

  goals: {
    year: [],
    month: [],
    week: []
  },

  projects: [
    {
      id: "project_01",
      name: "LifeOS Dashboard",
      description: "Sistèm pèsonèl pou jere pwodiktivite ak analiz done",
      status: "active",
      createdAt: "2026-07-16T00:00:00.000Z",
      updatedAt: "2026-07-16T00:00:00.000Z"
    }
  ],

  finance: {
    savings: {
      current: 1240,
      goal: 3000,
      goalName: "Emergency Fund",
      monthlyContribution: 180,
      targetDate: "Dec 2026"
    },
    transactions: []
  },

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
