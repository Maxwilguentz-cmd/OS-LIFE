/**
 * LifeOS — UI Events Module
 * Jere tout event listeners yo epi konekte yo ak Store la.
 */

import { store } from "../core/store.js";

export function bindGlobalEvents() {

  // 1. MOOD BUTTONS
  const moodRow = document.getElementById("moodRow");

  if (moodRow) {
    moodRow.addEventListener("click", (e) => {

      const btn = e.target.closest(".mood-btn");
      if (!btn) return;

      const selectedMood = btn.dataset.mood;
      const label = btn.dataset.label;

      store.updateState(["mood"], {
        current: selectedMood,
        note: `You logged feeling ${label} today. Keep focusing on your goals!`
      });

    });
  }


  // 2. THEME TOGGLE
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      const state = store.getState();

      const nextTheme =
        state.theme === "dark"
          ? "light"
          : "dark";


      store.updateState(
        ["theme"],
        nextTheme
      );

    });

  }


  // 3. MOBILE SIDEBAR
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarScrim = document.getElementById("sidebarScrim");


  if (menuToggle && sidebar && sidebarScrim) {

    const toggleSidebar = () => {
      sidebar.classList.toggle("is-open");
      sidebarScrim.classList.toggle("is-active");
    };


    menuToggle.addEventListener(
      "click",
      toggleSidebar
    );


    sidebarScrim.addEventListener(
      "click",
      toggleSidebar
    );

  }



  // 4. MISSION CHECKBOX
  const missionList = document.getElementById("missionList");


  if (missionList) {

    missionList.addEventListener("click", (e) => {

      const check = e.target.closest(".check");

      if (!check) return;


      const item = check.closest(".mission-item");

      if (!item) return;


      const id = Number(item.dataset.id);


      const state = store.getState();


      const missions = state.missions.map(mission => {

        if (mission.id === id) {

          return {
            ...mission,
            done: !mission.done
          };

        }

        return mission;

      });


      store.updateState(
        ["missions"],
        missions
      );


    });

  }



  // 5. NEW TASK BUTTON

  const newTaskBtn = document.getElementById("newTaskBtn");


  if (newTaskBtn) {

    newTaskBtn.addEventListener(
      "click",
      () => {

        const title = prompt(
          "Ki nouvo misyon pou jodi a?"
        );


        if (!title || title.trim() === "") {
          return;
        }


        const state = store.getState();


        const missions = state.missions || [];


        const newId =
          missions.length
            ? Math.max(...missions.map(m => m.id)) + 1
            : 1;



        const newMission = {

          id: newId,

          title: title.trim(),

          meta:
            `Custom · ${new Date().toLocaleTimeString([], {
              hour:"2-digit",
              minute:"2-digit"
            })}`,

          done:false

        };



        store.updateState(
          ["missions"],
          [
            ...missions,
            newMission
          ]
        );


      }
    );

  }

}
