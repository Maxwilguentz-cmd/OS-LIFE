/**
 * LifeOS - Core State Management (Store)
 * Jere tout done aplikasyon an, notifikasyon chanjman yo, ak sipò pou middleware.
 */

import { INITIAL_STATE } from "./initialState.js";

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
    // Kòmanse sèlman ak INITIAL_STATE (Pèsistans ekstèn ap chaje rès yo pita)
    this.state = { ...INITIAL_STATE };
    this.listeners = [];
  }

  // Enskri yon middleware pou kouri sou store la (egzanp: store.use(persistence.middleware))
  use(middleware) {
    if (typeof middleware === "function") {
      middleware(this);
    }
  }

  // Bay eta aktyèl la (Read-Only kopi)
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  // Ranplase tout eta a nèt (Ak Deep Merge pou sekirite done yo)
  setState(newState) {
    if (!newState || typeof newState !== "object") return;
    
    const mergedState = deepMerge(INITIAL_STATE, newState);

    this.state = { 
      ...mergedState,
      meta: {
        ...mergedState.meta,
        updatedAt: new Date().toISOString()
      }
    };
    
    this._notify();
  }

  // Immutability konplè pou mete ajou sèlman yon pati nan eta a (Partial Update)
  updateState(path, value) {
    const updateNested = (obj, pathArray, val) => {
      if (pathArray.length === 0) return val;
      
      const [head, ...tail] = pathArray;
      const currentVal = (obj && typeof obj === 'object') ? obj[head] : undefined;
      
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

    const pathArray = Array.isArray(path) ? path : [path];
    const nextState = updateNested(this.state, pathArray, value);
    
    nextState.meta = {
      ...this.state.meta,
      updatedAt: new Date().toISOString()
    };

    this.state = nextState;
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
