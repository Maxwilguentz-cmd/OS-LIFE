/**
 * LifeOS — UI Render Module
 * Okipe aktyalizasyon DOM lan baze sou done ki nan Store la
 */

import { internetService } from "./internetService.js";

export function renderAll(state) {
  if (!state) return;

  // 1. ANBYANS / TEM (Theme light/dark)
  const isDark = state.theme === "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.innerHTML = isDark
      ? `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none"><path d="M20 14.5C18.9 15 17.7 15.3 16.4 15.3C11.8 15.3 8 11.6 8 7C8 5.7 8.3 4.4 8.9 3.3C5.3 4.4 2.7 7.8 2.7 11.7C2.7 16.6 6.7 20.6 11.6 20.6C15.5 20.6 18.8 18.1 20 14.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  }

  // 2. DETAY SOU ITILIZATÈ A (User Profile / Welcome Card)
  if (state.user) {
    const welcomeDoneCount = document.getElementById("welcomeDoneCount");
    const totalMissions = state.missions ? state.missions.length : 0;
    const completedMissions = state.missions ? state.missions.filter(m => m.done).length : 0;

    if (welcomeDoneCount) {
      welcomeDoneCount.textContent = `${completedMissions} of ${totalMissions}`;
    }

    // Mete ajou non ak jeneralite yo
    const welcomeTitle = document.querySelector(".card--welcome h2");
    if (welcomeTitle) {
      welcomeTitle.textContent = `Let's make today count, ${state.user.name || "Wilguentz"}.`;
    }

    const welcomeSub = document.querySelector(".welcome-sub");
    if (welcomeSub) {
      welcomeSub.innerHTML = `You've completed <strong id="welcomeDoneCount">${completedMissions} of ${totalMissions}</strong> mission items and logged <strong>${state.focusedTimeToday || "0h"}</strong> of focused work so far.`;
    }

    const welcomeChips = document.querySelector(".welcome-chips");
    if (welcomeChips) {
      welcomeChips.innerHTML = `
        <span class="chip">🔥 ${state.user.streak || 0}-day streak</span>
        <span class="chip">☀️ ${state.user.temp || "--"}°C · ${state.user.location || "Haiti"}</span>
      `;
    }

    const userAvatar = document.querySelector(".user-avatar");
    if (userAvatar && state.user.name) {
      userAvatar.textContent = state.user.name.charAt(0).toUpperCase();
    }

    const userName = document.querySelector(".user-name");
    if (userName) {
      userName.textContent = state.user.name;
    }

    const userRole = document.querySelector(".user-role");
    if (userRole) {
      userRole.textContent = state.user.role || "Free plan";
    }
  }

  // 3. JADEN ARC TIME (Day progress arc)
  const arcFill = document.getElementById("dayArcFill");
  const arcTime = document.getElementById("arcTime");
  if (arcFill && arcTime) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    arcTime.textContent = `${hours}:${minutes}`;

    // Kalkile pousantaj jounen an ki pase (de 0 a 24h)
    const minutesPassed = (now.getHours() * 60) + now.getMinutes();
    const totalMinutesInDay = 24 * 60;
    const dayPercent = minutesPassed / totalMinutesInDay;

    // Sèk la gen yon reyon R = 68. Sikonferans C = 2 * Math.PI * R = 427.25
    const circumference = 2 * Math.PI * 68;
    // Piske se yon demi-sèk (arc) oswa nou vle l ranpli selon pousantaj la:
    const offset = circumference - (dayPercent * circumference);
    arcFill.style.strokeDasharray = `${circumference}`;
    arcFill.style.strokeDashoffset = `${offset}`;
  }

  // 4. METE MOOD (Today's mood)
  if (state.mood) {
    const moodTag = document.getElementById("moodTag");
    const moodNote = document.getElementById("moodNote");
    if (moodTag) {
      moodTag.textContent = state.mood.current 
        ? state.mood.current.charAt(0).toUpperCase() + state.mood.current.slice(1) 
        : "Not set";
    }
    if (moodNote) {
      moodNote.textContent = state.mood.note || "Tap a face to log how you're feeling today.";
    }

    // Aktive bouton mood ki kòrèk la
    const moodButtons = document.querySelectorAll(".mood-btn");
    moodButtons.forEach(btn => {
      const moodValue = btn.getAttribute("data-mood");
      if (state.mood.current === moodValue) {
        btn.classList.add("is-active");
      } else {
        btn.classList.remove("is-active");
      }
    });
  }

  // 5. MISYON YO (Today's mission)
  const missionList = document.getElementById("missionList");
  const missionTag = document.getElementById("missionTag");
  if (missionList && state.missions) {
    const totalMissions = state.missions.length;
    const completedMissions = state.missions.filter(m => m.done).length;

    if (missionTag) {
      missionTag.textContent = `${completedMissions}/${totalMissions}`;
    }

    missionList.innerHTML = state.missions.map(mission => `
      <li class="mission-item ${mission.done ? 'is-done' : ''}" data-id="${mission.id}">
        <button class="check" aria-label="Toggle complete">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="mission-copy">
          <span class="mission-title">${mission.title}</span>
          <span class="mission-meta">${mission.meta}</span>
        </div>
      </li>
    `).join('');
  }

  // 6. PWOGRÈ SAVINGS (Savings Progress Ring)
  if (state.savings) {
    const savingsRing = document.getElementById("savingsRing");
    const savingsPct = document.getElementById("savingsPct");
    const savingsAmounts = document.querySelector(".savings-amounts");
    const savingsSub = document.querySelector(".savings-sub");
    const savingsGoal = document.querySelector(".savings-goal");

    const current = state.savings.current || 0;
    const goal = state.savings.goal || 1;
    const pct = Math.min(Math.round((current / goal) * 100), 100);

    if (savingsPct) {
      savingsPct.textContent = `${pct}%`;
    }
    if (savingsGoal) {
      savingsGoal.textContent = state.savings.goalName || "Savings Goal";
    }
    if (savingsAmounts) {
      savingsAmounts.innerHTML = `<strong>$${current.toLocaleString()}</strong> <span>of $${goal.toLocaleString()}</span>`;
    }
    if (savingsSub) {
      savingsSub.textContent = `+$${state.savings.monthlyContribution} this month · target ${state.savings.targetDate}`;
    }

    if (savingsRing) {
      // Reyon R = 50. Sikonferans C = 2 * Math.PI * R = 314.16
      const circumference = 2 * Math.PI * 50;
      const offset = circumference - (pct / 100) * circumference;
      savingsRing.style.strokeDasharray = `${circumference}`;
      savingsRing.style.strokeDashoffset = `${offset}`;
    }
  }

  // 7. PLAN ENTÈNÈT (Internet Plan Progress Bar)
  if (state.internetPlan) {
    const planBarFill = document.getElementById("planBarFill");
    const planProvider = document.querySelector(".plan-provider");
    const planPrice = document.querySelector(".plan-price");
    const planStats = document.querySelector(".plan-stats");
    const planRenew = document.querySelector(".plan-renew");
    const planTag = document.querySelector(".card--plan .card-tag");

    const used = state.internetPlan.usedGB || 0;
    const total = state.internetPlan.totalGB || 1;
    const left = Math.max(0, parseFloat((total - used).toFixed(2)));
    const pct = Math.min((used / total) * 100, 100);

    // Kalkil senp pou pri ak dat renouvèlman ki baze sou expirationDate
    const monthlyBudget = state.internetPlan.monthlyBudget || 0;
    const priceText = `$${monthlyBudget}/mo`;
    
    let renewDateText = "Not scheduled";
    if (state.internetPlan.expirationDate) {
      const expDate = new Date(state.internetPlan.expirationDate);
      renewDateText = expDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    const daysLeft = internetService.calculateDaysRemaining();

    if (planBarFill) {
      planBarFill.style.width = `${pct}%`;
    }
    if (planProvider) {
      planProvider.textContent = state.internetPlan.provider;
    }
    if (planPrice) {
      planPrice.textContent = priceText;
    }
    if (planStats) {
      planStats.innerHTML = `<span><strong>${used}GB</strong> used</span> <span><strong>${left}GB</strong> left</span>`;
    }
    if (planRenew) {
      planRenew.textContent = `Renews automatically · ${renewDateText}`;
    }
    if (planTag) {
      planTag.textContent = `${daysLeft} days left`;
    }
  }

  // 8. PWOJÈ YO (Current Projects List)
  const projectList = document.querySelector(".project-list");
  if (projectList && state.projects) {
    projectList.innerHTML = state.projects.map(proj => `
      <div class="project-row" data-id="${proj.id}">
        <div class="project-icon" style="--pc:${proj.color}">${proj.short || "PR"}</div>
        <div class="project-info">
          <div class="project-top">
            <span class="project-name">${proj.name}</span>
            <span class="project-pct">${proj.pct}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="--val:${proj.pct}%; --pc:${proj.color}"></div></div>
        </div>
      </div>
    `).join('');
  }

  // 9. PWOGRÈ LEARNING (Learning Progress List)
  const learningList = document.querySelector(".learning-list");
  if (learningList && state.learning) {
    learningList.innerHTML = state.learning.map(learn => `
      <div class="learning-row">
        <div class="learning-info">
          <span class="learning-name">${learn.name}</span>
          <span class="learning-pct">${learn.pct}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="--val:${learn.pct}%; --pc:${learn.color}"></div></div>
        <span class="learning-meta">${learn.meta}</span>
      </div>
    `).join('');
  }

  // 10. STATISTIK SEMÈN NAN (Weekly statistics bars)
  const weeklyBars = document.getElementById("weeklyBars");
  const statPills = document.querySelectorAll(".stat-pill");
  
  if (state.weeklyStats) {
    if (statPills.length >= 3) {
      statPills[0].innerHTML = `<span class="stat-num">${state.weeklyStats.focusedHours}</span><span class="stat-label">Focused time</span>`;
      statPills[1].innerHTML = `<span class="stat-num">${state.weeklyStats.tasksDone}</span><span class="stat-label">Tasks done</span>`;
      statPills[2].innerHTML = `<span class="stat-num">${state.weeklyStats.comparisonPct}</span><span class="stat-label">vs last week</span>`;
    }

    if (weeklyBars && state.weeklyStats.days) {
      weeklyBars.innerHTML = state.weeklyStats.days.map(day => `
        <div class="bar-col">
          <div class="bar-val" style="--val:${day.value}%">
            <span class="bar-tooltip">${day.value}%</span>
          </div>
          <span class="bar-day">${day.label}</span>
        </div>
      `).join('');
    }
  }
}
