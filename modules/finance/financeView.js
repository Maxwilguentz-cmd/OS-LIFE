/**
 * LifeOS — Finance View Module
 * Jere koòdone ak evènman pou modil Finans ak Bidjè a.
 */

import { financeService } from "../../services/financeService.js";
import { store } from "../../core/store.js";

// Sove kòd HTML dashboard la pou lè nou bezwen tounen sou li
let dashboardBackup = null;

const ALLOWED_CATEGORIES = [
  "salary", "business", "investment", "gift", "other-income",
  "food", "rent", "utilities", "transport", "entertainment", "health", "education", "other-expense"
];

/**
 * Rann paj finans lan nan #mainContent
 * @param {Object} state - State aktyèl store la
 */
export function renderFinanceView(state) {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Fè backup dashboard la si se premye fwa n ap kite l
  if (!dashboardBackup) {
    dashboardBackup = mainContent.innerHTML;
  }

  // Rekipere done finans ak ekonomi yo nan sèvis la
  const financeData = financeService.getFinance();
  const savingsData = financeService.getSavings();
  
  // Rekipere kalkil rapò yo pou afichaj la
  const reports = financeService.getReports() || {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    savingsProgressPercentage: 0
  };

  const transactions = financeData.transactions || [];
  // Triye tranzaksyon yo pou dènye sa ki ajoute yo parèt anlè (ID ou timestamp ki pi gwo)
  const sortedTransactions = [...transactions].reverse();

  // Jenere opsyon pou seleksyon kategori yo
  const categoryOptions = ALLOWED_CATEGORIES.map(cat => 
    `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
  ).join("");

  mainContent.innerHTML = `
    <div class="finance-container" style="display: flex; flex-direction: column; gap: 20px; padding: 10px;">
      
      <!-- REZIME RAPÒ -->
      <div class="finance-summary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div class="card glass" style="padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <h4 style="margin: 0; font-size: 14px; opacity: 0.8;">Balance</h4>
          <h2 style="margin: 5px 0 0 0; color: ${reports.balance >= 0 ? '#4caf50' : '#f44336'};">${reports.balance} HTG</h2>
        </div>
        <div class="card glass" style="padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <h4 style="margin: 0; font-size: 14px; opacity: 0.8;">Total Income</h4>
          <h2 style="margin: 5px 0 0 0; color: #4caf50;">+${reports.totalIncome} HTG</h2>
        </div>
        <div class="card glass" style="padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <h4 style="margin: 0; font-size: 14px; opacity: 0.8;">Total Expense</h4>
          <h2 style="margin: 5px 0 0 0; color: #f44336;">-${reports.totalExpense} HTG</h2>
        </div>
      </div>

      <div class="finance-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        
        <!-- EKONOMI (SAVINGS) -->
        <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <h3>Épargne & Objectifs</h3>
          <div style="margin-bottom: 15px;">
            <p style="margin: 5px 0;"><strong>Objektif:</strong> ${savingsData.goalName || 'General Savings'}</p>
            <p style="margin: 5px 0;"><strong>Pwogrè:</strong> ${savingsData.current} / ${savingsData.goal} HTG (${reports.savingsProgressPercentage}%)</p>
            <div style="width: 100%; background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden; margin-top: 5px;">
              <div style="width: ${Math.min(reports.savingsProgressPercentage, 100)}%; background: #4caf50; height: 10px;"></div>
            </div>
          </div>
          
          <form id="savingsForm" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; gap: 10px;">
              <input type="number" id="savingsCurrentInput" placeholder="Kach aktyèl" value="${savingsData.current}" required style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
              <button type="submit" class="btn-primary" style="padding: 8px 15px; cursor: pointer;">Mete ajou</button>
            </div>
          </form>
        </div>

        <!-- FÒM TRANZAKSYON -->
        <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <h3>Nouvo Tranzaksyon</h3>
          <form id="transactionForm" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 10px;">
              <label style="flex: 1; color: white;"><input type="radio" name="txType" value="income" checked /> Antre (+)</label>
              <label style="flex: 1; color: white;"><input type="radio" name="txType" value="expense" /> Depans (-)</label>
            </div>
            
            <input type="number" id="txAmount" placeholder="Montan (HTG)" required style="padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
            
            <select id="txCategory" required style="padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;">
              <option value="" disabled selected>Chwazi yon kategori</option>
              ${categoryOptions}
            </select>
            
            <input type="text" id="txDescription" placeholder="Deskripsyon" required style="padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;" />
            
            <button type="submit" class="btn-primary" style="padding: 10px; cursor: pointer; border-radius: 4px;">Ajoute Tranzaksyon</button>
          </form>
        </div>

      </div>

      <!-- LIS TRANZAKSYON YO -->
      <div class="card glass" style="padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">
        <h3>Istorik Tranzaksyon</h3>
        <div id="transactionsList" style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
          ${sortedTransactions.length === 0 ? '<p style="opacity: 0.6; text-align: center;">Pa gen okenn tranzaksyon ki fèt pou kounye a.</p>' : ''}
          ${sortedTransactions.map(tx => `
            <div class="transaction-item" data-id="${tx.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px; border-left: 4px solid ${tx.type === 'income' ? '#4caf50' : '#f44336'};">
              <div>
                <p style="margin: 0; font-weight: bold;">${tx.description}</p>
                <span style="font-size: 12px; opacity: 0.6; text-transform: uppercase;">${tx.category}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-weight: bold; color: ${tx.type === 'income' ? '#4caf50' : '#f44336'};">
                  ${tx.type === 'income' ? '+' : '-'}${tx.amount} HTG
                </span>
                <button class="btn-delete-tx" style="background: transparent; border: none; color: #f44336; cursor: pointer; font-size: 16px; padding: 5px;">✕</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;
}

/**
 * Atache event listeners yo sou eleman yo atravè delegasyon sou #mainContent
 */
export function bindFinanceEvents() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Retire vye koute evènman pou evite kopi (Idempotency)
  mainContent.replaceWith(mainContent.cloneNode(true));
  
  // Rekipere nouvo referans lan apre clone a
  const newMainContent = document.getElementById("mainContent");

  // Jere submit fòm yo ak klike sou bouton yo nan yon sèl kote (Event Delegation)
  newMainContent.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Kreyasyon nouvo tranzaksyon
    if (e.target.id === "transactionForm") {
      const type = e.target.querySelector('input[name="txType"]:checked').value;
      const amount = Number(document.getElementById("txAmount").value);
      const category = document.getElementById("txCategory").value;
      const description = document.getElementById("txDescription").value;

      if (!amount || !category || !description.trim()) return;

      financeService.addTransaction({
        type,
        amount,
        category,
        description: description.trim(),
        date: new Date().toISOString().split('T')[0]
      });

      // Rann paj la ankò ak nouvo done yo
      renderFinanceView(store.getState());
      bindFinanceEvents();
    }

    // 2. Mizajou Savings kontan
    if (e.target.id === "savingsForm") {
      const currentAmount = Number(document.getElementById("savingsCurrentInput").value);
      financeService.updateSavings(currentAmount);

      renderFinanceView(store.getState());
      bindFinanceEvents();
    }
  });

  newMainContent.addEventListener("click", (e) => {
    // 3. Efase yon tranzaksyon
    const deleteBtn = e.target.closest(".btn-delete-tx");
    if (deleteBtn) {
      const item = deleteBtn.closest(".transaction-item");
      if (!item) return;

      const txId = item.dataset.id; // Isit la se yon STRING, nou pa mete Number()
      
      if (confirm("Èske ou vle efase tranzaksyon sa a tout bon?")) {
        financeService.removeTransaction(txId);
        
        renderFinanceView(store.getState());
        bindFinanceEvents();
      }
    }
  });
}

/**
 * Restore dashboard la depi nan backup li
 */
export function restoreDashboardView() {
  const mainContent = document.getElementById("mainContent");
  if (mainContent && dashboardBackup) {
    mainContent.innerHTML = dashboardBackup;
  }
}
