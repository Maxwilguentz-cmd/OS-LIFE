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

  // 2. Jere Navigasyon (Chanje Route / View aktif) — "plan" jere apa (modal), pa route
  const navItems = document.querySelectorAll(".nav-item[data-route]:not([data-route='plan'])");
  const viewTitle = document.getElementById("viewTitle");

  navItems.forEach(elt => {
    elt.addEventListener("click", (e) => {
      e.preventDefault();
      navItems.forEach(item => item.classList.remove("is-active"));
      elt.classList.add("is-active");

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
      const tchekeElt = e.target.closest(".check") || e.target.closest(".mission-item");
      if (!tchekeElt) return;

      const misyonItem = tchekeElt.closest(".mission-item");
      if (!misyonItem) return;

      const misyonId = parseInt(misyonItem.getAttribute("data-id"), 10);
      if (!misyonId) return;

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

  // 7. Jere Chèche nan Sistèm nan (Search Input)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const tèksChèche = e.target.value.toLowerCase();
      console.log(`Rechèch LifeOS: ${tèksChèche}`);
    });
  }

  // 8. Jere Fòm Plan Entènèt (nan modal la)
  const internetPlanForm = document.getElementById("internetPlanForm");
  if (internetPlanForm) {
    internetPlanForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const provider = document.getElementById("networkSelect").value;
      const planType = document.getElementById("planTypeSelect").value;
      const price = document.getElementById("priceInput").value;
      const totalDays = getDaysFromType(planType);

      store.setState(state => {
        const ansyenPlan = state.internetPlan;
        const istorik = state.planHistory || [];

        if (ansyenPlan && ansyenPlan.startDate) {
          istorik.push({ ...ansyenPlan, endedAt: new Date().toISOString().split('T')[0] });
        }

        return {
          ...state,
          internetPlan: {
            provider,
            planType,
            price,
            startDate: new Date().toISOString().split('T')[0],
            totalDays
          },
          planHistory: istorik,
          // Nouvo plan = nouvo sik alèt; retire ansyen alèt ki te asosye ak plan pase a
          planAlerts: []
        };
      });
    });
  }

  // 9. Modal Plan Entènèt — bouton "konektyon Entènèt" nan sidebar la ouvri l,
  //    epi bouton X ak klike-deyò fèmen l (koreksyon bug fèmti a)
  const planNavItem = document.querySelector('.nav-item[data-route="plan"]');
  const planModal = document.getElementById("planPage");
  const planModalBackdrop = document.getElementById("planModalBackdrop");
  const planModalClose = document.getElementById("planModalClose");

  function ouvriPlanModal() {
    planModal?.classList.add("is-open");
    planModalBackdrop?.classList.add("is-open");
  }
  function fèmenPlanModal() {
    planModal?.classList.remove("is-open");
    planModalBackdrop?.classList.remove("is-open");
  }

  if (planNavItem) {
    planNavItem.addEventListener("click", (e) => {
      e.preventDefault();
      ouvriPlanModal();
    });
  }
  const managePlanBtn = document.getElementById("managePlanBtn");
  if (managePlanBtn) {
    managePlanBtn.addEventListener("click", ouvriPlanModal);
  }
  planModalClose?.addEventListener("click", fèmenPlanModal);
  planModalBackdrop?.addEventListener("click", fèmenPlanModal);

  // 10. Modal Alèt (Kloch Notifikasyon)
  const notificationBtn = document.getElementById("notificationBtn");
  const alertsModal = document.getElementById("alertsModal");
  const alertsModalBackdrop = document.getElementById("alertsModalBackdrop");
  const alertsModalClose = document.getElementById("alertsModalClose");

  function ouvriAlètsModal() {
    alertsModal?.classList.add("is-open");
    alertsModalBackdrop?.classList.add("is-open");
    // Make tout alèt yo kòm "li" lè itilizatè a gade yo
    store.setState(state => ({
      ...state,
      planAlerts: (state.planAlerts || []).map(a => ({ ...a, read: true }))
    }));
  }
  function fèmenAlètsModal() {
    alertsModal?.classList.remove("is-open");
    alertsModalBackdrop?.classList.remove("is-open");
  }

  if (notificationBtn) {
    notificationBtn.addEventListener("click", ouvriAlètsModal);
  }
  alertsModalClose?.addEventListener("click", fèmenAlètsModal);
  alertsModalBackdrop?.addEventListener("click", fèmenAlètsModal);

  // 11. Fèmen nenpòt modal ak tous Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fèmenPlanModal();
      fèmenAlètsModal();
    }
  });
}
