// ============================================================
// LifeOS — events.js (Koute ak Jere Tout Evènman Global Yo)
// ============================================================

import { store, applyLanguage } from "./core.js";
import { getDaysFromType } from "./planLogic.js";
/**
 * Konfigirasyon ak koute tout evènman entèraksyon nan LifeOS
 */
export function bindGlobalEvents() {
  // 1. Jere Sidebar sou Mobil (Meni Louvri / Fèmen)
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarScrim = document.getElementById("sidebarScrim");

  if (menuToggle && sidebar && sidebarScrim) {
    const toggleSidebarObj = () => {
      sidebar.classList.toggle("is-open");
      sidebarScrim.classList.toggle("is-open");
      const èskeLouvri = sidebar.classList.contains("is-open");
      menuToggle.setAttribute("aria-expanded", èskeLouvri ? "true" : "false");
    };

    menuToggle.addEventListener("click", toggleSidebarObj);
    sidebarScrim.addEventListener("click", toggleSidebarObj);
  }

  // 2. Jere Navigasyon (Chanje Route / View aktif)
  const navItems = document.querySelectorAll(".nav-item[data-route]");
  const viewTitle = document.getElementById("viewTitle");

  navItems.forEach(elt => {
    elt.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Retire klas aktif sou ansyen an epi mete l sou sa ki klike a
      navItems.forEach(item => item.classList.remove("is-active"));
      elt.classList.add("is-active");

      // Chanje tit paj la selon route la
      const routKounyeA = elt.getAttribute("data-route");
      if (viewTitle) {
        const tèksMeni = elt.querySelector("span")?.textContent || routKounyeA;
        viewTitle.textContent = tèksMeni;
      }
    });
  });

  // 3. Jere Atitid (Mood Tracker)
  const moodButtons = document.querySelectorAll(".mood-btn");
  const moodTag = document.getElementById("moodTag");

  moodButtons.forEach(elt => {
    elt.addEventListener("click", () => {
      moodButtons.forEach(btn => btn.classList.remove("is-selected"));
      elt.classList.add("is-selected");

      const chwaMood = elt.getAttribute("data-mood");
      const labelMood = elt.getAttribute("data-label");

      if (moodTag) {
        moodTag.textContent = labelMood;
      }

      // Mete ajou eta a nan store la pou lòt konpozan ka wè l
      store.setState(state => ({
        ...state,
        userMood: chwaMood
      }));
    });
  });

  // 4. Jere Klike sou Misyon (Toche Done / Pa Done) via Delegasyon Evènman
  const missionList = document.getElementById("missionList");
  if (missionList) {
    missionList.addEventListener("click", (e) => {
      // Tcheke si klike a fèt sou bwat check la oswa sou tèks misyon an
      const tchekeElt = e.target.closest(".check") || e.target.closest(".mission-item");
      if (!tchekeElt) return;

      const misyonItem = tchekeElt.closest(".mission-item");
      if (!misyonItem) return;

      const misyonId = parseInt(misyonItem.getAttribute("data-id"), 10);
      if (!misyonId) return;

      // Modifye eta a san nou pa rele render dirèkteman
      store.setState(state => {
        const misyonYoMeteAjou = state.missions.map(m => {
          if (m.id === misyonId) {
            return { ...m, done: !m.done };
          }
          return m;
        });
        return {
          ...state,
          missions: misyonYoMeteAjou
        };
      });
    });
  }

  // 5. Jere Chanjman Tèm (Theme Toggle)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      store.setState(state => {
        const nouvoTèm = state.settings.theme === "dark" ? "light" : "dark";
        
        // Aplike klas la dirèkteman sou dokiman an
        if (nouvoTèm === "dark") {
          document.documentElement.classList.add("dark-theme");
        } else {
          document.documentElement.classList.remove("dark-theme");
        }

        return {
          ...state,
          settings: { ...state.settings, theme: nouvoTèm }
        };
      });
    });
  }

  // 6. Koute Aksyon sou Lòt Bouton ki nan Tablo Bò a
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) {
    newTaskBtn.addEventListener("click", () => {
      console.log("Aksyon: Kreye yon nouvo tach");
    });
  }

  const addTransactionBtn = document.getElementById("addTransactionBtn");
  if (addTransactionBtn) {
    addTransactionBtn.addEventListener("click", () => {
      console.log("Aksyon: Ajoute yon tranzaksyon finansyè");
    });
  }

  const managePlanBtn = document.getElementById("managePlanBtn");
  if (managePlanBtn) {
    managePlanBtn.addEventListener("click", () => {
      console.log("Aksyon: Manaje plan entènèt la");
    });
  }

  // 7. Jere Chèche nan Sistèm nan (Search Input)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const tèksChèche = e.target.value.toLowerCase();
      console.log(`Rechèch LifeOS: ${tèksChèche}`);
    });
  }
  // 8. Jere Fòm Plan Entènèt (Sidebar)
  const internetPlanForm = document.getElementById("internetPlanForm");
  if (internetPlanForm) {
    internetPlanForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const provider = document.getElementById("networkSelect").value;
      const planType = document.getElementById("planTypeSelect").value;
      const price = document.getElementById("priceInput").value;
      const totalDays = getDaysFromType(planType);

      // Sove nouvo plan an nan store, dat kòmansman = jodi a
      store.setState(state => {
        const ansyenPlan = state.internetPlan;
        const istorik = state.planHistory || [];

        // Si te gen yon plan avan, mete l nan istorik
        if (ansyenPlan && ansyenPlan.startDate) {
          istorik.push({ ...ansyenPlan, endedAt: new Date().toISOString().split('T')[0] });
        }

        return {
          ...state,
          internetPlan: {
            provider,
            planType,
            price: ansyenPlan?.price || "--",
            startDate: new Date().toISOString().split('T')[0],
            totalDays
          },
          planHistory: istorik
        };
      });
    });
  }
}
