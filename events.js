// ============================================================
// LifeOS — events.js (Jesyon tout Evènman ak Entèraksyon)
// ============================================================
import { store, applyLanguage } from "./core.js";

export function bindGlobalEvents() {
  
  // 1. Menu Toggle pou mobil (Sidebar + Scrim)
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  
  // Kreye yon scrim si li pa nan HTML pou evite kraze si eleman an manke
  let scrim = document.querySelector(".sidebar-scrim");
  if (!scrim && sidebar) {
    scrim = document.createElement("div");
    scrim.className = "sidebar-scrim";
    sidebar.parentNode.insertBefore(scrim, sidebar.nextSibling);
  }

  if (menuToggle && sidebar && scrim) {
    const jereMenu = () => {
      const èskeOuvè = sidebar.classList.toggle("is-open");
      scrim.classList.toggle("is-open", èskeOuvè);
      menuToggle.setAttribute("aria-expanded", èskeOuvè);
    };
    menuToggle.addEventListener("click", jereMenu);
    scrim.addEventListener("click", jereMenu);
  }

  // 2. Chanjman Atitid (Mood Buttons)
  const moodButtons = document.querySelectorAll(".mood-btn");
  moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      moodButtons.forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      const moodSelected = btn.getAttribute("data-mood");
      console.log(`[LifeOS Mood]: Imè chanje pou -> ${moodSelected}`);
    });
  });

  // 3. Navigasyon nan Meni an (Sidebar Route Items)
  const navItems = document.querySelectorAll(".nav-item[data-route]");
  const viewTitle = document.getElementById("viewTitle");
  
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      navItems.forEach(i => i.classList.remove("is-active"));
      item.classList.add("is-active");
      
      const pitoWout = item.getAttribute("data-route");
      if (viewTitle) {
        viewTitle.textContent = item.querySelector("span")?.textContent || pitoWout;
      }
      
      // Chanje langaj otomatik si se nan settings li klike
      if (pitoWout === "settings") {
        const lang Kounye a = store.getState().settings?.language || "ht";
        applyLanguage(langKounye a === "ht" ? "en" : "ht");
      }
    });
  });

  // 4. Aksyon sou Bouton Fonksyonèl yo (Modals / Triggers)
  const klikeAksyon = (id, mesaj) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => alert(mesaj));
  };

  klikeAksyon("newTaskBtn", "Kreyasyon nouvo tach ap vini nan pwochen vèsyon an!");
  klikeAksyon("addTransactionBtn", "Ajoute tranzaksyon finansyè yo ap disponib byento!");
  klikeAksyon("managePlanBtn", "Jesyon plan entènèt sa a ap lye ak API founisè a pito!");

  // 5. Chanjman Tèm (Dark / Light Theme Toggle)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const body = document.body;
      const seKounye aNwa = body.style.getPropertyValue("--bg") !== "#ffffff";
      
      if (seKounye aNwa) {
        body.style.setProperty("--bg", "#ffffff");
        body.style.setProperty("--text-primary", "#0A0B0F");
        console.log("[LifeOS Tèm]: Chanje pou Limyè");
      } else {
        body.style.unsetProperty ? body.style.unsetProperty("--bg") : body.style.removeProperty("--bg");
        body.style.unsetProperty ? body.style.unsetProperty("--text-primary") : body.style.removeProperty("--text-primary");
        console.log("[LifeOS Tèm]: Chanje pou Nwa");
      }
    });
  }

  // 6. Chèche nan tout sistèm nan (Search Input)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      console.log(`[LifeOS Search]: Rechèch ap fèt pou -> ${e.target.value}`);
    });
  }

  // 7. Klike sou chèk bwat misyon yo pou wè entèraksyon
  const missionList = document.getElementById("missionList");
  if (missionList) {
    missionList.addEventListener("click", (e) => {
      const tchekeBtn = e.target.closest(".check");
      if (tchekeBtn) {
        const item = tchekeBtn.closest(".mission-item");
        if (item) {
          item.classList.toggle("is-done");
          console.log(`[LifeOS Mission]: Estati misyon ${item.getAttribute("data-id")} chanje.`);
        }
      }
    });
  }
}
