/**
 * LifeOS - core/i18n.js
 * Jere tradiksyon ak aplikasyon langaj sou koòdone aplikasyon an.
 */
import { store } from "./store.js";

export const TRANSLATIONS = {
  en: {
    dashboard: {
      title: "Dashboard",
      welcomeGreeting: "Let's make today count,",
      missionsCompleted: "You've completed",
      missionItems: "mission items and logged",
      focusedWork: "of focused work so far.",
      moodTitle: "Today's mood",
      moodPlaceholder: "Tap a face to log how you're feeling today.",
      moodNotSet: "Not set",
      missionTitle: "Today's mission",
      goalsTitle: "Long-term goals",
      savingsTitle: "Savings progress",
      savingsGoalDefault: "Savings Goal",
      savingsThisMonth: "this month · target",
      planTitle: "Active internet plan",
      planUsed: "used",
      planLeft: "left",
      planRenews: "Renews automatically ·",
      planDaysLeft: "days left",
      projectsTitle: "Current projects",
      viewAll: "View all",
      learningTitle: "Learning progress",
      statsTitle: "Weekly statistics",
      focusedTimeLabel: "Focused time",
      tasksDoneLabel: "Tasks done",
      vsLastWeekLabel: "vs last week"
    },
    tasksPage: {
      addTitle: "Add a new mission",
      inputPlaceholder: "What do you have to do today?",
      addBtn: "Add Task",
      allMissionsTitle: "All missions",
      filterAll: "All",
      filterActive: "Active",
      filterDone: "Done",
      emptyState: "No missions for now.",
      emptyFiltered: "No missions match this filter."
    },
    financePage: {
      balanceLabel: "Balance",
      totalIncomeLabel: "Total Income",
      totalExpenseLabel: "Total Expense",
      savingsTitle: "Savings & Goals",
      goalLabel: "Goal:",
      progressLabel: "Progress:",
      currentPlaceholder: "Current cash",
      updateBtn: "Update",
      newTxTitle: "New Transaction",
      incomeLabel: "Income (+)",
      expenseLabel: "Expense (-)",
      amountPlaceholder: "Amount (HTG)",
      categoryPlaceholder: "Choose a category",
      descriptionPlaceholder: "Description",
      addTxBtn: "Add Transaction",
      historyTitle: "Transaction History",
      emptyTx: "No transactions made for now.",
      confirmDelete: "Are you sure you want to delete this transaction?",
      categoryLabels: {
        salary: "Salary",
        business: "Business",
        investment: "Investment",
        gift: "Gift",
        "other-income": "Other Income",
        food: "Food",
        rent: "Rent",
        utilities: "Utilities",
        transport: "Transport",
        entertainment: "Entertainment",
        health: "Health",
        education: "Education",
        "other-expense": "Other Expense"
      }
    },
    tasks: "Tasks",
    calendar: "Calendar",
    finance: "Finances",
    projects: "Projects",
    learning: "Learning",
    settings: "Settings",
    newTaskBtn: "New task"
  },
  ht: {
    dashboard: {
      title: "Tablo de Bò",
      welcomeGreeting: "Ann fè jounen jodi a konte,",
      missionsCompleted: "Ou konplete",
      missionItems: "tach nan misyon w yo epi ou pase",
      focusedWork: "nan travay konsantre jiskaprezan.",
      moodTitle: "Atitid jodi a",
      moodPlaceholder: "Klike sou yon figi pou anrejistre jan w santi w jodi a.",
      moodNotSet: "Pa defini",
      missionTitle: "Misyon jodi a",
      goalsTitle: "Objektif alontèm",
      savingsTitle: "Pwogrè ekonomi",
      savingsGoalDefault: "Objektif Ekonomi",
      savingsThisMonth: "mwa sa a · sib",
      planTitle: "Plan entènèt aktif",
      planUsed: "itilize",
      planLeft: "rann",
      planRenews: "Renouvle otomatikman ·",
      planDaysLeft: "jou ki rete",
      projectsTitle: "Pwojè aktyèl yo",
      viewAll: "Wè tout",
      learningTitle: "Pwogrè aprantisaj",
      statsTitle: "Statistik semèn nan",
      focusedTimeLabel: "Tan konsantre",
      tasksDoneLabel: "Tach fini",
      vsLastWeekLabel: "konpare ak dènye semèn"
    },
    tasksPage: {
      addTitle: "Ajoute yon nouvo misyon",
      inputPlaceholder: "Kisa w gen pou w fè jodi a?",
      addBtn: "Ajoute",
      allMissionsTitle: "Tout misyon yo",
      filterAll: "Tout",
      filterActive: "Aktif",
      filterDone: "Fini",
      emptyState: "Pa gen okenn misyon pou kounye a.",
      emptyFiltered: "Pa gen misyon ki koresponn ak filtre sa a."
    },
    financePage: {
      balanceLabel: "Balans",
      totalIncomeLabel: "Total Antre",
      totalExpenseLabel: "Total Depans",
      savingsTitle: "Ekonomi & Objektif",
      goalLabel: "Objektif:",
      progressLabel: "Pwogrè:",
      currentPlaceholder: "Kach aktyèl",
      updateBtn: "Mete ajou",
      newTxTitle: "Nouvo Tranzaksyon",
      incomeLabel: "Antre (+)",
      expenseLabel: "Depans (-)",
      amountPlaceholder: "Montan (HTG)",
      categoryPlaceholder: "Chwazi yon kategori",
      descriptionPlaceholder: "Deskripsyon",
      addTxBtn: "Ajoute Tranzaksyon",
      historyTitle: "Istorik Tranzaksyon",
      emptyTx: "Pa gen okenn tranzaksyon ki fèt pou kounye a.",
      confirmDelete: "Èske ou vle efase tranzaksyon sa a tout bon?",
      categoryLabels: {
        salary: "Salè",
        business: "Biznis",
        investment: "Envestisman",
        gift: "Kado",
        "other-income": "Lòt Antre",
        food: "Manje",
        rent: "Lwaye",
        utilities: "Sèvis piblik (Dlo/Kouran)",
        transport: "Transpò",
        entertainment: "Divètisman",
        health: "Sante",
        education: "Edikasyon",
        "other-expense": "Lòt Depans"
      }
    },
    tasks: "Tach & Objektif",
    calendar: "Kalandriye & Routine",
    finance: "Finans & Bidjè",
    projects: "Pwojè & Nòt",
    learning: "Aprantisaj",
    settings: "Konfigirasyon",
    newTaskBtn: "Nouvo tach"
  },
  fr: {
    dashboard: {
      title: "Tableau de Bord",
      welcomeGreeting: "Faisons en sorte que chaque instant compte,",
      missionsCompleted: "Vous avez accompli",
      missionItems: "tâches de votre mission et enregistré",
      focusedWork: "de travail ciblé jusqu'à présent.",
      moodTitle: "Humeur du jour",
      moodPlaceholder: "Cliquez sur un émoji pour enregistrer votre humeur.",
      moodNotSet: "Non défini",
      missionTitle: "Mission du jour",
      goalsTitle: "Objectifs à long terme",
      savingsTitle: "Progrès de l'épargne",
      savingsGoalDefault: "Objectif d'Épargne",
      savingsThisMonth: "ce mois-ci · cible",
      planTitle: "Forfait internet actif",
      planUsed: "utilisé",
      planLeft: "restant",
      planRenews: "Renouvellement automatique ·",
      planDaysLeft: "jours restants",
      projectsTitle: "Projets en cours",
      viewAll: "Voir tout",
      learningTitle: "Progrès de l'apprentissage",
      statsTitle: "Statistiques hebdomadaires",
      focusedTimeLabel: "Temps concentré",
      tasksDoneLabel: "Tâches accomplies",
      vsLastWeekLabel: "vs la semaine dernière"
    },
    tasksPage: {
      addTitle: "Ajouter une nouvelle mission",
      inputPlaceholder: "Qu'avez-vous à faire aujourd'hui ?",
      addBtn: "Ajouter",
      allMissionsTitle: "Toutes les missions",
      filterAll: "Tout",
      filterActive: "Actives",
      filterDone: "Terminées",
      emptyState: "Aucune mission pour le moment.",
      emptyFiltered: "Aucune mission ne correspond à ce filtre."
    },
    financePage: {
      balanceLabel: "Solde",
      totalIncomeLabel: "Revenus Totaux",
      totalExpenseLabel: "Dépenses Totales",
      savingsTitle: "Épargne & Objectifs",
      goalLabel: "Objectif :",
      progressLabel: "Progrès :",
      currentPlaceholder: "Épargne actuelle",
      updateBtn: "Mettre à jour",
      newTxTitle: "Nouvelle Transaction",
      incomeLabel: "Revenu (+)",
      expenseLabel: "Dépense (-)",
      amountPlaceholder: "Montant (HTG)",
      categoryPlaceholder: "Choisir une catégorie",
      descriptionPlaceholder: "Description",
      addTxBtn: "Ajouter la Transaction",
      historyTitle: "Historique des Transactions",
      emptyTx: "Aucune transaction pour le moment.",
      confirmDelete: "Voulez-vous vraiment supprimer cette transaction ?",
      categoryLabels: {
        salary: "Salaire",
        business: "Entreprise",
        investment: "Investissement",
        gift: "Cadeau",
        "other-income": "Autre Revenu",
        food: "Nourriture",
        rent: "Loyer",
        utilities: "Factures (Eau/Élec)",
        transport: "Transport",
        entertainment: "Divertissement",
        health: "Santé",
        education: "Éducation",
        "other-expense": "Autre Dépense"
      }
    },
    tasks: "Tâches & Objectifs",
    calendar: "Calendrier & Routine",
    finance: "Finances & Budget",
    projects: "Projets & Notes",
    learning: "Apprentissage",
    settings: "Configuration",
    newTaskBtn: "Nouvelle tâche"
  }
};

/**
 * Rekipere langaj ki aktif la nan store la
 * @returns {string} Kòd lang lan ("en", "ht", "fr")
 */
export function getCurrentLanguage() {
  const state = store.getState();
  return state.settings?.language || "en";
}

/**
 * Aplike tradiksyon yo sou sidebar la, bouton nouvo` tach la ak HTML tag la
 * @param {string} langCode - Kòd lang lan ("en", "ht", "fr")
 */
export function applyLanguage(langCode) {
  const cleanLang = ["en", "ht", "fr"].includes(langCode) ? langCode : "en";
  const dict = TRANSLATIONS[cleanLang];

  // 1. Mete atribi lang lan sou dokiman an
  document.documentElement.lang = cleanLang;

  // 2. Tradwi lyen yo nan sidebar la
  const navItems = document.querySelectorAll(".nav-item[data-route]");
  navItems.forEach(item => {
    const routeId = item.getAttribute("data-route");
    if (routeId) {
      const span = item.querySelector("span");
      if (span) {
        // Piske dashboard se yon objè kounye a, nou asire nou pran sèlman tèks la si se yon objè
        if (routeId === "dashboard") {
          span.textContent = dict.dashboard.title;
        } else if (dict[routeId]) {
          span.textContent = dict[routeId];
        }
      }
    }
  });

  // 3. Tradwi bouton "New task" nan topbar la
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) {
    const span = newTaskBtn.querySelector("span");
    if (span && dict.newTaskBtn) {
      span.textContent = dict.newTaskBtn;
    }
  }

  // 4. Mete ajou tit paj aktyèl la si li afiche nan topbar la
  const viewTitleEl = document.getElementById("viewTitle");
  if (viewTitleEl) {
    // Nou chache wout aktyèl la ki gen klas 'is-active'
    const activeNavItem = document.querySelector(".nav-item.is-active");
    if (activeNavItem) {
      const activeRouteId = activeNavItem.getAttribute("data-route");
      if (activeRouteId) {
        if (activeRouteId === "dashboard") {
          viewTitleEl.textContent = dict.dashboard.title;
        } else if (dict[activeRouteId]) {
          viewTitleEl.textContent = dict[activeRouteId];
        }
      }
    }
  }
}
