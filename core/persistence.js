/**
 * LifeOS - Persistence Middleware
 * Jere LocalStorage, save otomatik ak migration.
 */

const STORAGE_KEY = "lifeos_app_state";
const VERSION = "1.0.0";


function migrateState(state) {

  if (!state.meta) {
    state.meta = {};
  }

  state.meta.version = VERSION;

  return state;
}



export const persistence = {


  load() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);


      if (!saved) return null;


      const parsed =
        JSON.parse(saved);


      return migrateState(parsed);


    } catch(error) {

      console.error(
        "Persistence load error:",
        error
      );

      return null;
    }

  },



  save(state) {

    try {

      const data = {
        ...state,

        meta: {
          ...state.meta,
          version: VERSION,
          updatedAt:
            new Date().toISOString()
        }
      };


      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );


    } catch(error) {

      console.error(
        "Persistence save error:",
        error
      );

    }

  },



  middleware(store) {


    // Chaje ansyen done yo
    const saved =
      persistence.load();


    if (saved) {

      store.setState(saved);

    }



    // Sove chak chanjman
    store.subscribe(state => {

      persistence.save(state);

    });

  }

};
