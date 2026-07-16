/**
 * LifeOS - Core State Management (Store)
 * Jere state aplikasyon an, subscriptions, updates ak middleware.
 */

import { INITIAL_STATE } from "./initialState.js";

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function deepMerge(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

function shallowEqual(objA, objB) {
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

  return keysA.every(
    key =>
      Object.prototype.hasOwnProperty.call(objB, key) &&
      Object.is(objA[key], objB[key])
  );
}


class Store {

  constructor() {
    this.state = structuredClone(INITIAL_STATE);
    this.listeners = [];
  }


  // Middleware support (persistence, logger, etc.)
  use(middleware) {
    if (typeof middleware === "function") {
      middleware(this);
    }
  }


  getState() {
    return { ...this.state };
  }


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


  updateState(path, value) {

    const updateNested = (obj, pathArray, val) => {

      if (pathArray.length === 0) {
        return val;
      }

      const [head, ...tail] = pathArray;

      const updatedValue = updateNested(
        obj?.[head],
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


    const pathArray = Array.isArray(path)
      ? path
      : [path];


    const nextState = updateNested(
      this.state,
      pathArray,
      value
    );


    nextState.meta = {
      ...this.state.meta,
      updatedAt: new Date().toISOString()
    };


    this.state = nextState;

    this._notify();
  }



  subscribe(listener) {

    if (typeof listener !== "function") {
      return () => {};
    }


    this.listeners.push(listener);


    return () => {
      this.listeners =
        this.listeners.filter(
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


    let lastValue = selector(
      this.getState()
    );


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


    this.listeners.forEach(listener => {

      try {
        listener(currentState);

      } catch(error) {

        console.error(
          "Store listener error:",
          error
        );

      }

    });
  }

}


export const store = new Store();
