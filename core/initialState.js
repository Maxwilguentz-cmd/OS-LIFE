/**
 * LifeOS - Core State Management (Store)
 * Jere state aplikasyon an, subscriptions, updates ak middleware.
 */

import { INITIAL_STATE } from "./initialState.js";

// Sekirite pou asire structuredClone pa plante si browser a gen limit oswa sou ansyen vèsyon
function safeClone(obj) {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }

  return JSON.parse(JSON.stringify(obj));
}

// Pwoteksyon kont null, paske typeof null === "object"
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item) && item !== null;
}

// deepMerge optimize pou pa kraze Array, sipòte null epi konsève nouvo done yo kòrèkteman
function deepMerge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    // Sekirite: Pwoteksyon kont Prototype Pollution nan nivo fizyon an
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return;
    }

    if (Array.isArray(source[key])) {
      // Si se yon Array, nou ranplase l nèt pou evite fizyone index pa index
      output[key] = safeClone(source[key]);
    } else if (isObject(source[key])) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = safeClone(source[key]);
      }
    } else {
      // Si se yon valè primitif, nou kopye l dirèkteman
      output[key] = source[key];
    }
  });

  return output;
}

// shallowEqual optimize pou pèfòmans maksimòm ak sipò rekisif limite
function shallowEqual(objA, objB, depth = 1) {
  if (Object.is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    
    const valA = objA[key];
    const valB = objB[key];

    if (Object.is(valA, valB)) return true;

    // Si nou gen dwa desann pi fon epi tou de se objè, nou fè konparezon rekisiv limite
    if (depth > 0 && typeof valA === "object" && valA !== null && typeof valB === "object" && valB !== null) {
      return shallowEqual(valA, valB, depth - 1);
    }

    return false;
  });
}


class Store {

  constructor() {
    this.state = safeClone(INITIAL_STATE);
    this.listeners = [];
  }


  // Middleware support (persistence, logger, etc.)
  use(middleware) {
    if (typeof middleware === "function") {
      try {
        middleware(this);
      } catch (error) {
        console.error("Store middleware registration error:", error);
      }
    }
  }


  getState() {
    return safeClone(this.state);
  }


  setState(newState) {
    if (!newState || typeof newState !== "object") return;

    // Fizyone ak `this.state` aktyèl la, pa ak `INITIAL_STATE` pou evite reset done yo
    const mergedState = deepMerge(this.state, newState);

    this.state = {
      ...mergedState,
      meta: {
        ...mergedState.meta,
        updatedAt: new Date().toISOString()
      }
    };

    this._notify();
  }

const nextState = {
  ...updateNested(this.state, pathArray, value)
};
  updateState(path, value) {
    const pathArray = Array.isArray(path) ? path : [path];

    // Validation pou evite kreye path ki pa lojik (eg: path vid)
    if (pathArray.length === 0) {
      console.warn("Store: updateState rele ak yon path vid.");
      return;
    }

    const updateNested = (obj, paths, val) => {
      if (paths.length === 0) {
        // Sekirite: Nou klone valè final la si se yon objè pou evite mutasyon referans
        return typeof val === "object" && val !== null ? safeClone(val) : val;
      }

      const [head, ...tail] = paths;

      // Validation sou kle a pou anpeche Prototype Pollution
      if (head === "__proto__" || head === "constructor" || head === "prototype") {
        throw new Error("Store: Aksyon bloke pou sekirite (Prototype Pollution detekte).");
      }

      let currentValue = obj?.[head];
      if (currentValue === undefined || currentValue === null) {
        // Validation: Si paran an se pa yon objè oswa yon etid, nou pa ka kontinye pi fon
        if (obj !== undefined && obj !== null && typeof obj !== "object") {
          throw new Error(`Store: Imposib pou kreye chemen nested sou yon valè primitif nan nivo "${head}".`);
        }
        // Sipòte endèks nimerik sou fòma string tou pou kreye Array san pwoblèm
        const isNumericIndex = typeof head === "number" || (!isNaN(Number(head)) && !isNaN(parseInt(head, 10)));
        currentValue = isNumericIndex ? [] : {};
      }

      const updatedValue = updateNested(
        currentValue,
        tail,
        val
      );

      if (Array.isArray(obj)) {
        const copy = [...obj];
        copy[head] = updatedValue;
        return copy;
      }

      return {
        ...obj,
        [head]: updatedValue
      };
    };

    try {
      // updateNested ap fè kopi pasyèl (shallow copy) sou nivo n ap modifye yo sèlman pou pèfòmans.
      const nextState = updateNested(this.state, pathArray, value);

      nextState.meta = {
        ...this.state.meta,
        updatedAt: new Date().toISOString()
      };

      this.state = nextState;
      this._notify();
    } catch (error) {
      console.error("Store updateState error:", error);
    }
  }


  subscribe(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }

    this.listeners.push(listener);

    // Retounen yon unsubscribe san danje pou anpeche memory leaks
    return () => {
      this.listeners = this.listeners.filter(
        item => item !== listener
      );
    };
  }


  subscribeSelector(selector, callback) {
    if (
      typeof selector !== "function" ||
      typeof callback !== "function"
    ) {
      return () => {};
    }

    let lastValue = selector(this.getState());

    return this.subscribe(state => {
      const nextValue = selector(state);

      if (!shallowEqual(lastValue, nextValue)) {
        lastValue = nextValue;
        callback(nextValue);
      }
    });
  }


  _notify() {
    const currentState = this.getState();
    // KOREKSYON: Nou fè yon kopi etid lisener yo pou evite sote eleman si yon moun dezabòne pandan bouk la
    const activeListeners = [...this.listeners];

    activeListeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (error) {
        console.error(
          "Store listener error:",
          error
        );
      }
    });
  }

}

export const store = new Store();
