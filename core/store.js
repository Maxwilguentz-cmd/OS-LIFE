/**
 * LifeOS - Core State Management (Store)
 * Jere tout done aplikasyon an, sovgad nan LocalStorage, ak notifikasyon chanjman yo.
 */

// 1. Estrikti Done Default (Initial State)
const DEFAULT_STATE = {
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
    current: "okay", // great, good, okay, low
    note: "A neutral day. Pace yourself and take breaks when needed."
  },
  tasks: [
    { id: "1", title: "Review LifeOS Architecture", isDone: true, category: "work" },
    { id: "2", title: "Implement LocalStorage backup", isDone: false, category: "learning" },
    { id: "3", title: "Draft internet monitor module", isDone: false, category: "project" }
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
      { day: 'Mon', hours: 4.2 },
      { day: 'Tue', hours: 5.1 },
      { day: 'Wed', hours: 3.4 },
      { day: 'Thu', hours: 4.8 },
      { day: 'Fri', hours: 5.6 },
      { day: 'Sat', hours: 2.1 },
      { day: 'Sun', hours: 2.3 }
    ]
  },
  notifications: [],
  reports: {},
  settings: {}
};

const STORAGE_KEY = "lifeos_app_state";

// Fonksyon Helper pou fè yon vrè Deep Merge rekursif
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

// Fonksyon Helper pou fè Shallow Comparison ant de valè
function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

// 2. Klas Store (Pattern Observer pou sekirite ak pèfòmans)
class Store {
  constructor() {
    this.state = this._loadFromStorage();
    this.listeners = [];
  }

  // Chaje done depi nan LocalStorage ak yon Deep Merge rekursif pou evite pèdi nouvo fushye yo
  _loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return deepMerge(DEFAULT_STATE, parsed);
      }
    } catch (e) {
      console.error("Erreur lors du chargement de LocalStorage:", e);
    }
    return { ...DEFAULT_STATE };
  }

  // Sove eta a nan LocalStorage ak tout dat chanjman yo
  _saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Erreur lors de la sauvegarde dans LocalStorage:", e);
    }
  }

  // Bay eta aktyèl la (Read-Only)
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  // Ranplase tout eta a nèt (Itil pou Import JSON / Restore)
  setState(newState) {
    if (!newState || typeof newState !== "object") return;
    
    const updatedMeta = {
      ...DEFAULT_STATE.meta,
      ...newState.meta,
      updatedAt: new Date().toISOString()
    };

    this.state = { 
      ...DEFAULT_STATE, 
      ...newState,
      meta: updatedMeta
    };
    
    this._saveToStorage();
    this._notify();
  }

  // Immutability konplè pou mete ajou sèlman yon pati nan eta a (Partial Update)
  updateState(path, value) {
    const updateNested = (obj, pathArray, val) => {
      if (pathArray.length === 0) return val;
      
      const [head, ...tail] = pathArray;
      const currentVal = (obj && typeof obj === 'object') ? obj[head] : undefined;
      
      // Si se yon etaj oswa yon objè, nou kreye yon nouvo kopi san nou pa mitasyon anyen
      const updatedVal = updateNested(currentVal, tail, val);
      
      if (Array.isArray(obj)) {
        const newArr = [...obj];
        newArr[head] = updatedVal;
        return newArr;
      } else {
        return {
          ...obj,
          [head]: updatedVal
        };
      }
    };

    // Prepare nouvo eta a
    const pathArray = Array.isArray(path) ? path : [path];
    const nextState = updateNested(this.state, pathArray, value);
    
    // Mete ajou lè meta a te chanje
    nextState.meta = {
      ...this.state.meta,
      updatedAt: new Date().toISOString()
    };

    this.state = nextState;
    this._saveToStorage();
    this._notify();
  }

  // Abone pou koute tout chanjman nèt
  subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Abone pou koute SÈLMAN lè yon moso done byen presi chanje (Pèfòmans optimal)
  subscribeSelector(selector, callback) {
    if (typeof selector !== "function" || typeof callback !== "function") return () => {};
    
    let lastSelectedState = selector(this.getState());
    
    return this.subscribe((currentState) => {
      const nextSelectedState = selector(currentState);
      if (!shallowEqual(lastSelectedState, nextSelectedState)) {
        lastSelectedState = nextSelectedState;
        callback(nextSelectedState);
      }
    });
  }

  // Avèti tout koutè yo lè yon chanjman fèt
  _notify() {
    const currentState = this.getState();
    this.listeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (e) {
        console.error("Erreur lors de la notification d'un abonné:", e);
      }
    });
  }

  // Sistèm Backup: Export done yo an JSON
  exportData() {
    return JSON.stringify(this.state, null, 2);
  }

  // Sistèm Backup: Import done yo depi yon JSON
  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      this.setState(parsed);
      return true;
    } catch (e) {
      console.error("Fichier JSON backup sa a pa valab:", e);
      return false;
    }
  }
}

// Enstans inik pou aplikasyon an
export const store = new Store();
