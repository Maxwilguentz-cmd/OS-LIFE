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
  note: "A neutral day. Pace yourself and take breaks when needed.",
  lastUpdated: "2026-07-16T00:00:00.000Z"
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
    progress: 15,
    tasksCount: {
      total: 3,
      completed: 1
    },
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
    { day:"Mon", hours:4.2 },
    { day:"Tue", hours:5.1 },
    { day:"Wed", hours:3.4 },
    { day:"Thu", hours:4.8 },
    { day:"Fri", hours:5.6 },
    { day:"Sat", hours:2.1 },
    { day:"Sun", hours:2.3 }
  ],

  focusedHours: 27.5,
  tasksDone: 12,
  comparisonPct: "+8%",

  days:[
    { label:"Mon", value:60 },
    { label:"Tue", value:75 },
    { label:"Wed", value:45 },
    { label:"Thu", value:70 },
    { label:"Fri", value:90 },
    { label:"Sat", value:35 },
    { label:"Sun", value:40 }
  ],

  totalHoursThisWeek:27.5,
  averageHoursPerDay:3.9
},

  notifications: [],
  reports: {},
settings:{
  syncIntervalMinutes:15,
  enableNotifications:true,
  backupOnExit:true
}
};
