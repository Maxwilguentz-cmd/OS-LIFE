/**
 * LifeOS - Finance Service
 * Jere tout lojik biznis pou finans yo: tranzaksyon, ekonomi, bidjè, ak analiz rapò.
 * Sèvis sa a pa touche DOM ditou epi li asire entegrite done yo nan store la.
 */

import { store } from "../core/store.js";

// Lis kategori ki otorize pou evite move done nan baz la
const ALLOWED_CATEGORIES = [
  "salary", "business", "investment", "gift", "other-income", // Incomes
  "food", "rent", "utilities", "transport", "entertainment", "health", "education", "other-expense" // Expenses
];

export const financeService = {
  /**
   * Retounen tranch done finans yo ki nan store la
   * @returns {Object} Done finans yo
   */
  getFinance() {
    return store.getState().finance || { savings: { current: 0, goal: 0 }, transactions: [] };
  },

  /**
   * Jenere yon ID inik pou tranzaksyon yo (Crypto-safe si disponib, oswa timestamp)
   * @private
   */
  _generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  },

  /**
   * Valide estrikti ak done yon tranzaksyon anvan li sove
   * @param {Object} tx - Tranzaksyon pou valide a
   * @throws {Error} Si yon done pa kòrèk
   * @private
   */
  _validateTransaction(tx) {
    if (!tx || typeof tx !== "object") {
      throw new Error("Tranzaksyon an dwe yon objè ki valab.");
    }

    // Validasyon Tip
    if (tx.type !== "income" && tx.type !== "expense") {
      throw new Error("Tip tranzaksyon an dwe 'income' oswa 'expense'.");
    }

    // Validasyon Montan
    const amount = parseFloat(tx.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Montan tranzaksyon an dwe yon chif ki pi gwo pase 0.");
    }

    // Validasyon Kategori
    if (!tx.category || typeof tx.category !== "string") {
      throw new Error("Kategori a se yon champ ki obligatwa.");
    }
    
    const cleanCategory = tx.category.trim().toLowerCase();
    if (!ALLOWED_CATEGORIES.includes(cleanCategory)) {
      throw new Error(`Kategori '${tx.category}' la pa otorize.`);
    }

    // Validasyon Deskripsyon
    if (!tx.description || typeof tx.description !== "string" || tx.description.trim() === "") {
      throw new Error("Deskripsyon an pa kapab vid.");
    }
  },

  /**
   * Ajoute yon nouvo tranzaksyon (ID ak Dat jenere otomatikman)
   * @param {Object} rawTx - Done tranzaksyon an (type, amount, category, description)
   * @returns {Object} Tranzaksyon ki sove a
   */
  addTransaction(rawTx) {
    const cleanTx = {
      id: this._generateUUID(),
      type: rawTx?.type,
      amount: parseFloat(rawTx?.amount),
      category: rawTx?.category?.trim().toLowerCase(),
      description: rawTx?.description?.trim(),
      date: rawTx?.date ? new Date(rawTx.date).toISOString() : new Date().toISOString()
    };

    // Kouri validasyon an premye
    this._validateTransaction(cleanTx);

    const finance = this.getFinance();
    const updatedTransactions = [cleanTx, ...finance.transactions];

    store.updateState(["finance", "transactions"], updatedTransactions);
    return cleanTx;
  },

  /**
   * Retire yon tranzaksyon ak id li
   * @param {string} id - Id tranzaksyon pou efase a
   */
  removeTransaction(id) {
    if (!id || typeof id !== "string") return;
    
    const finance = this.getFinance();
    const updatedTransactions = finance.transactions.filter(t => t.id !== id);

    store.updateState(["finance", "transactions"], updatedTransactions);
  },

  /**
   * Mete ajou valè ekonomi aktyèl la
   * @param {number} amount - Nouvo montan ekonomi an
   */
  updateSavings(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new Error("Montan ekonomi an dwe yon chif pozitif.");
    }

    store.updateState(["finance", "savings", "current"], parsedAmount);
  },

  /**
   * Chanje objektif ekonomi an (savings target)
   * @param {number} goal - Nouvo montan objektif la
   */
  setSavingsGoal(goal) {
    const parsedGoal = parseFloat(goal);
    if (isNaN(parsedGoal) || parsedGoal < 0) {
      throw new Error("Objektif ekonomi an dwe yon chif pozitif.");
    }

    store.updateState(["finance", "savings", "goal"], parsedGoal);
  },

  /**
   * Jwenn Balans aktyèl la (Incomes - Expenses)
   * @returns {number}
   */
  getBalance() {
    const transactions = this.getFinance().transactions || [];
    return transactions.reduce((acc, tx) => {
      return tx.type === "income" ? acc + tx.amount : acc - tx.amount;
    }, 0);
  },

  /**
   * Bay estatistik ak rapò detaye pou Dashboard Finans lan
   * @returns {Object} Rapò finansye yo
   */
  getReports() {
    const transactions = this.getFinance().transactions || [];
    const savings = this.getFinance().savings || { current: 0, goal: 0 };

    const reports = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      savingsProgressPercentage: 0,
      byCategory: {},
      monthlyTrend: {} // Prepare pou graf nan lavni
    };

    // 1. Kalkile Pwogrè Ekonomi
    if (savings.goal > 0) {
      reports.savingsProgressPercentage = Math.min(
        Math.round((savings.current / savings.goal) * 100),
        100
      );
    }

    // 2. Analize tranzaksyon yo
    transactions.forEach(tx => {
      const amount = tx.amount;
      
      // Kalkil jeneral
      if (tx.type === "income") {
        reports.totalIncome += amount;
      } else {
        reports.totalExpense += amount;
      }

      // Distribisyon pa Kategori
      if (!reports.byCategory[tx.category]) {
        reports.byCategory[tx.category] = { income: 0, expense: 0, total: 0 };
      }
      if (tx.type === "income") {
        reports.byCategory[tx.category].income += amount;
      } else {
        reports.byCategory[tx.category].expense += amount;
      }
      reports.byCategory[tx.category].total = reports.byCategory[tx.category].income - reports.byCategory[tx.category].expense;

      // Distribisyon pa Mwa (Format: YYYY-MM)
      const monthKey = tx.date.substring(0, 7);
      if (!reports.monthlyTrend[monthKey]) {
        reports.monthlyTrend[monthKey] = { income: 0, expense: 0 };
      }
      if (tx.type === "income") {
        reports.monthlyTrend[monthKey].income += amount;
      } else {
        reports.monthlyTrend[monthKey].expense += amount;
      }
    });

    reports.balance = reports.totalIncome - reports.totalExpense;
    return reports;
  }
};
