/* ==========================================================================
   LifeOS — Finance View Component (ES Modules)
   ========================================================================== */

import { store } from "../../core/store.js";
import { TRANSLATIONS, getCurrentLanguage } from "../../core/i18n.js";
import { financeService, ALLOWED_CATEGORIES } from "../../services/financeService.js";

/**
 * Rann koòdone Modil Finans lan
 */
export function renderFinanceView() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  const state = store.getState();
  const lang = getCurrentLanguage();
  const t = TRANSLATIONS[lang].financePage;

  // Rekipere done yo nan branch respektif yo nan store la
  const financeState = state.finance || { transactions: [] };
  const transactions = financeState.transactions || [];
  const savings = state.savings || { current: 0, goal: 1, goalName: "", monthlyContribution: 0 };

  // Kalkile balans, revni ak depans total yo
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount) || 0;
    if (tx.type === "income") {
      totalIncome += amount;
    } else if (tx.type === "expense") {
      totalExpense += amount;
    }
  });

  const balance = totalIncome - totalExpense;
  const progressPercent = Math.min(100, Math.round((savings.current / Math.max(1, savings.goal)) * 100));

  mainContent.innerHTML = `
    <div class="finance-container">
      <!-- 1. Rezime Finansye (Balans, Revni, Depans) -->
      <div class="finance-card">
        <div class="finance-summary">
          <div class="summary-item">
            <span class="summary-label">${t.balanceLabel}</span>
            <span class="summary-value ${balance >= 0 ? 'positive' : 'negative'}">
              $${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">${t.totalIncomeLabel}</span>
            <span class="summary-value positive">
              +$${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">${t.totalExpenseLabel}</span>
            <span class="summary-value negative">
              -$${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div class="finance-grid">
        <!-- Kolòn Goch: Fòm ak Ekonomi -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- 2. Fòm pou ajoute Tranzaksyon -->
          <div class="finance-card">
            <h3>${t.newTxTitle}</h3>
            <form id="addTxForm" class="finance-form">
              <div class="form-group">
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" name="txType" value="income" checked>
                    ${t.incomeLabel}
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="txType" value="expense">
                    ${t.expenseLabel}
                  </label>
                </div>
              </div>

              <div class="form-group">
                <input type="text" id="txDesc" class="finance-input" placeholder="${t.descriptionPlaceholder || ''}" required>
              </div>

              <div class="form-group">
                <input type="number" id="txAmount" class="finance-input" step="0.01" placeholder="${t.amountPlaceholder || '0.00'}" required>
              </div>

              <div class="form-group">
                <label for="txCategory">${t.categoryPlaceholder || 'Category'}</label>
                <select id="txCategory" class="finance-select">
                  ${ALLOWED_CATEGORIES.map(cat => {
                    const label = (t.categoryLabels && t.categoryLabels[cat]) ? t.categoryLabels[cat] : cat;
                    return `<option value="${cat}">${label}</option>`;
                  }).join("")}
                </select>
              </div>

              <button type="submit" class="finance-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                ${t.addTxBtn}
              </button>
            </form>
          </div>

          <!-- 3. Seksyon Savings (Fòm konplè ak 4 Chan) -->
          <div class="finance-card">
            <h3>${t.savingsTitle}</h3>
            <div class="progress-container">
              <div class="progress-info">
                <span>${t.progressLabel} ${savings.goalName ? `(${savings.goalName})` : ""}</span>
                <strong>${progressPercent}%</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${progressPercent}%;"></div>
              </div>
              <div class="progress-meta">
                ${t.currentPlaceholder || 'Current'}: <strong>$${savings.current.toLocaleString("en-US")}</strong> sou yon objektif <strong>$${savings.goal.toLocaleString("en-US")}</strong>
              </div>
            </div>

            <form id="savingsForm" class="finance-form">
              <div class="form-group">
                <label for="savingsGoalName">${t.goalNameLabel}</label>
                <input type="text" id="savingsGoalName" class="finance-input" value="${savings.goalName || ""}" placeholder="e.g. New Laptop">
              </div>

              <div class="form-group">
                <label for="savingsCurrent">${t.currentPlaceholder}</label>
                <input type="number" id="savingsCurrent" class="finance-input" step="0.01" value="${savings.current || 0}">
              </div>

              <div class="form-group">
                <label for="savingsGoal">${t.goalLabel}</label>
                <input type="number" id="savingsGoal" class="finance-input" step="0.01" value="${savings.goal || 0}">
              </div>

              <div class="form-group">
                <label for="savingsMonthly">${t.monthlyContributionLabel}</label>
                <input type="number" id="savingsMonthly" class="finance-input" step="0.01" value="${savings.monthlyContribution || 0}">
              </div>

              <button type="submit" class="finance-btn">${t.updateBtn}</button>
            </form>
          </div>
        </div>

        <!-- Kolòn Dwat: Istorik Tranzaksyon -->
        <div class="finance-card" style="display: flex; flex-direction: column;">
          <h3>${t.historyTitle}</h3>
          <div class="tx-list" id="txListContainer">
            ${transactions.length === 0 ? `
              <p style="color: var(--text-tertiary); font-size: 0.85rem; text-align: center; margin: 40px 0;">
                ${t.emptyTx}
              </p>
            ` : transactions.map(tx => {
              const categoryName = (t.categoryLabels && t.categoryLabels[tx.category]) ? t.categoryLabels[tx.category] : tx.category;
              return `
                <div class="tx-item ${tx.type}">
                  <div class="tx-details">
                    <p>${tx.description}</p>
                    <span class="tx-category">${categoryName}</span>
                  </div>
                  <div class="tx-actions">
                    <span class="tx-amount ${tx.type}">
                      ${tx.type === 'income' ? '+' : '-'}$${parseFloat(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <button class="btn-delete-tx" data-id="${tx.id}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Atache tout evènman yo sou nouvo eleman DOM lan apre klonaj
 */
export function bindFinanceEvents() {
  let mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Ranplase eleman an nèt pou debarase nou de ansyen listeners yo (garbage collection)
  mainContent.replaceWith(mainContent.cloneNode(true));

  // Rekipere referans pwòp la pou nou travay
  const newMainContent = document.getElementById("mainContent");
  if (!newMainContent) return;

  // 1. Soumèt fòm pou ajoute tranzaksyon
  const addTxForm = newMainContent.querySelector("#addTxForm");
  if (addTxForm) {
    addTxForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const type = newMainContent.querySelector('input[name="txType"]:checked').value;
      const description = newMainContent.querySelector("#txDesc").value.trim();
      const amount = parseFloat(newMainContent.querySelector("#txAmount").value);
      const category = newMainContent.querySelector("#txCategory").value;

      if (!description || isNaN(amount) || amount <= 0) return;

      // Sèvi ak kouch sèvis la pito pou modifye store la
      financeService.addTransaction({
        type,
        description,
        amount,
        category
      });

      // Rann koòdone a ankò epi re-atache evènman yo
      renderFinanceView();
      bindFinanceEvents();
    });
  }

  // 2. Soumèt fòm ekonomi (Mete ajou 4 chan yo)
  const savingsForm = newMainContent.querySelector("#savingsForm");
  if (savingsForm) {
    savingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const goalName = newMainContent.querySelector("#savingsGoalName").value.trim();
      const current = parseFloat(newMainContent.querySelector("#savingsCurrent").value) || 0;
      const goal = parseFloat(newMainContent.querySelector("#savingsGoal").value) || 0;
      const monthlyContribution = parseFloat(newMainContent.querySelector("#savingsMonthly").value) || 0;

      // Mizajou atravè financeService pou kenbe lojik la pwòp
      financeService.setSavingsGoalName(goalName);
      financeService.updateSavings(current);
      financeService.setSavingsGoal(goal);
      financeService.setMonthlyContribution(monthlyContribution);

      renderFinanceView();
      bindFinanceEvents();
    });
  }

  // 3. Klike pou efase yon tranzaksyon
  const txListContainer = newMainContent.querySelector("#txListContainer");
  if (txListContainer) {
    txListContainer.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".btn-delete-tx");
      if (!deleteBtn) return;

      const txId = deleteBtn.getAttribute("data-id");
      if (!txId) return;

      // Mandat konfimasyon anvan efase (nou itilize confirmDelete ki deja nan i18n)
      const lang = getCurrentLanguage();
      const confirmMsg = TRANSLATIONS[lang].financePage.confirmDelete || "Are you sure?";
      if (!confirm(confirmMsg)) return;

      // Retire tranzaksyon an atravè sèvis la
      financeService.removeTransaction(txId);

      renderFinanceView();
      bindFinanceEvents();
    });
  }
}
