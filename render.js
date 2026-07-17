// ============================================================
// LifeOS — render.js (Afichaj Dinamik nan UI a)
// ============================================================

export function renderAll(state) {
  if (!state) return;

  // 1. Enfo Itilizatè
  const user = state.user || { name: "Marvens", role: "Antreprenè", avatar: "M" };
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");
  if (userAvatar) userAvatar.textContent = user.avatar;
  if (userName) userName.textContent = user.name;
  if (userRole) userRole.textContent = user.role;

  // 2. Dat jodi a
  const todayLabel = document.getElementById("todayLabel");
  if (todayLabel) {
    const opsyon = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    todayLabel.textContent = new Date().toLocaleDateString(state.settings?.language === "en" ? "en-US" : "ht-HT", opsyon);
  }

  // 3. Welcome Card tèks ak kalkil lè (Day Arc)
  const welcomeTitle = document.getElementById("welcomeTitle");
  const lang = state.settings?.language || "ht";
  const doneMissions = state.missions ? state.missions.filter(m => m.done).length : 0;
  
  if (welcomeTitle) {
    welcomeTitle.textContent = lang === "ht" 
      ? `Bonjou ankò, ${user.name} — ou pare pou domine jounen an?`
      : `Welcome back, ${user.name} — ready to dominate the day?`;
  }
  
  const welcomeDoneCount = document.getElementById("welcomeDoneCount");
  if (welcomeDoneCount) {
    welcomeDoneCount.textContent = lang === "ht"
      ? `Ou konplete ${doneMissions} misyon jodi a.`
      : `You completed ${doneMissions} missions today.`;
  }

  // Kalkil Day Arc (Lè ak minit aktyèl)
  const kounyeA = new Date();
  const minitPase = (kounyeA.getHours() * 60) + kounyeA.getMinutes();
  const pousantajJounen = (minitPase / 1440) * 100;
  const arcFill = document.querySelector(".arc-fill");
  const arcTime = document.querySelector(".arc-time");
  
  if (arcTime) {
    arcTime.textContent = kounyeA.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  if (arcFill) {
    // Dasharray total se 427 nan CSS la
    const offset = 427 - (427 * pousantajJounen) / 100;
    arcFill.style.strokeDashoffset = offset;
  }

  // 4. Misyon yo (Mission List)
  const missionList = document.getElementById("missionList");
  if (missionList && state.missions) {
    missionList.innerHTML = state.missions.map(m => `
      <li class="mission-item ${m.done ? 'is-done' : ''}" data-id="${m.id}">
        <button class="check" aria-label="Mete ajou misyon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="mission-copy">
          <span class="mission-title">${m.title}</span>
          <span class="mission-meta">${m.category}</span>
        </div>
      </li>
    `).join('');
  }

  // 5. Objektif yo (Goals List)
  const goalsList = document.getElementById("goalsList");
  if (goalsList && state.goals) {
    goalsList.innerHTML = state.goals.map(g => `
      <li class="goal-item ${g.done ? 'is-done' : ''}">
        <div class="goal-copy">
          <span class="goal-title">${g.title}</span>
        </div>
        <span class="goal-pct">${g.pct}%</span>
      </li>
    `).join('');
  }

  // 6. Ekonomi (Savings Ring)
  const savings = state.savings || { current: 0, target: 100 };
  const savingsPctVal = Math.min(Math.round((savings.current / savings.target) * 100), 100);
  const savingsPct = document.getElementById("savingsPct");
  const savingsRing = document.getElementById("savingsRing");
  
  if (savingsPct) savingsPct.textContent = `${savingsPctVal}%`;
  if (savingsRing) {
    // Dasharray total se 314 nan CSS la
    const ringOffset = 314 - (314 * savingsPctVal) / 100;
    savingsRing.style.strokeDashoffset = ringOffset;
  }
  
  const savingsAmountText = document.querySelector(".savings-amounts");
  if (savingsAmountText) {
    savingsAmountText.innerHTML = `$${savings.current} <span>/ $${savings.target}</span>`;
  }

  // 7. Plan Entènèt (Internet Plan)
  const plan = state.internetPlan;
  if (plan) {
    const planProvider = document.querySelector(".plan-provider");
    const planPrice = document.querySelector(".plan-price");
    const planDaysLeft = document.getElementById("planDaysLeft");
    const planBarFill = document.getElementById("planBarFill");
    
    if (planProvider) planProvider.textContent = plan.provider;
    if (planPrice) planPrice.textContent = plan.price;
    if (planDaysLeft) planDaysLeft.textContent = `${plan.daysLeft} jou ki rete`;
    
    if (planBarFill) {
      const planPct = ((plan.totalDays - plan.daysLeft) / plan.totalDays) * 100;
      planBarFill.style.width = `${planPct}%`;
    }
  }

  // 8. Pwojè yo (Projects List)
  const projectList = document.getElementById("projectList");
  if (projectList && state.projects) {
    projectList.innerHTML = state.projects.map(p => `
      <div class="project-row">
        <div class="project-icon" style="--pc: ${p.color}">${p.name.substring(0,2).toUpperCase()}</div>
        <div class="project-info">
          <div class="project-top">
            <span class="project-name">${p.name}</span>
            <span class="project-pct">${p.pct}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${p.pct}%; --pc: ${p.color}"></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 9. Aprantisaj (Learning Block)
  const learningList = document.getElementById("learningList");
  if (learningList && state.learning) {
    learningList.innerHTML = `
      <div class="learning-info">
        <span class="learning-name">${state.learning.topic}</span>
        <span class="learning-pct">${state.learning.pct}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${state.learning.pct}%; --pc: var(--accent-violet)"></div>
      </div>
      <small class="learning-meta">${state.learning.duration}</small>
    `;
  }

  // 10. Estatistik chak semèn (Weekly Stats & Bar Chart)
  const statFocusedTime = document.getElementById("statFocusedTime");
  const weeklyBars = document.getElementById("weeklyBars");
  
  if (statFocusedTime && state.weeklyStats) {
    statFocusedTime.textContent = state.weeklyStats.focusedTime;
  }
  
  if (weeklyBars && state.weeklyStats?.dailyData) {
    const jouYo = ["L", "M", "M", "J", "V", "S", "D"];
    const jodiEndeks = (new Date().getDay() + 6) % 7; // Konvèti pou Lendi kòmanse kòm 0
    
    weeklyBars.innerHTML = state.weeklyStats.dailyData.map((dataVal, i) => `
      <div class="bar-col">
        <div class="bar-track">
          <div class="bar-fill ${i === jodiEndeks ? 'is-today' : ''}" style="height: ${dataVal}%"></div>
        </div>
        <span class="bar-day ${i === jodiEndeks ? 'is-today' : ''}">${jouYo[i]}</span>
      </div>
    `).join('');
  }
}
