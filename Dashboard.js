(() => {
  'use strict';

  /* ============================================================
     Utilities
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ============================================================
     Today's date label
     ============================================================ */
  function renderDateLabel() {
    const el = $('#todayLabel');
    if (!el) return;
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
    el.textContent = formatted;
  }

  /* ============================================================
     Day-progress arc (welcome card)
     Shows how much of the 24h day has elapsed.
     ============================================================ */
  function renderDayArc() {
    const fill = $('#dayArcFill');
    const timeEl = $('#arcTime');
    const capEl = $('#arcCaption');
    if (!fill) return;

    const RADIUS = 68;
    const CIRC = 2 * Math.PI * RADIUS;
    fill.style.strokeDasharray = `${CIRC}`;

    const now = new Date();
    const minutesElapsed = now.getHours() * 60 + now.getMinutes();
    const pct = minutesElapsed / (24 * 60);
    const offset = CIRC * (1 - pct);

    requestAnimationFrame(() => {
      fill.style.strokeDashoffset = offset.toFixed(1);
    });

    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (capEl) {
      capEl.textContent = `${Math.round(pct * 100)}% of day used`;
    }
  }

  /* ============================================================
     Mood selector
     ============================================================ */
  function initMood() {
    const buttons = $$('.mood-btn');
    const tag = $('#moodTag');
    const note = $('#moodNote');

    const notes = {
      great: "You're feeling great — a good day to tackle something ambitious.",
      good: "Solid energy today. Keep the momentum going.",
      okay: "A neutral day. Pace yourself and take breaks when needed.",
      low: "Low energy noted. Consider lighter tasks and some rest."
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        const mood = btn.dataset.mood;
        const label = btn.dataset.label;
        if (tag) tag.textContent = label;
        if (note) note.textContent = notes[mood] || '';
      });
    });
  }

  /* ============================================================
     Mission list — toggle complete, update tag + welcome copy
     ============================================================ */
  function initMission() {
    const items = $$('.mission-item');
    const tag = $('#missionTag');
    const welcomeCount = $('#welcomeDoneCount');
    const total = items.length;

    function updateCounts() {
      const done = $$('.mission-item.is-done').length;
      if (tag) tag.textContent = `${done}/${total}`;
      if (welcomeCount) welcomeCount.textContent = `${done} of ${total}`;
    }

    items.forEach(item => {
      const checkBtn = $('.check', item);
      checkBtn.addEventListener('click', () => {
        item.classList.toggle('is-done');
        updateCounts();
      });
    });

    updateCounts();
  }

  /* ============================================================
     Savings ring
     ============================================================ */
  function renderSavingsRing() {
    const ring = $('#savingsRing');
    const pctLabel = $('#savingsPct');
    if (!ring) return;

    const current = 1240;
    const goal = 3000;
    const pct = Math.min(current / goal, 1);

    const RADIUS = 50;
    const CIRC = 2 * Math.PI * RADIUS;
    ring.style.strokeDasharray = `${CIRC}`;
    const offset = CIRC * (1 - pct);

    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = offset.toFixed(1);
    });

    if (pctLabel) pctLabel.textContent = `${Math.round(pct * 100)}%`;
  }

  /* ============================================================
     Internet plan bar
     ============================================================ */
  function renderPlanBar() {
    const fill = $('#planBarFill');
    if (!fill) return;
    const usedGB = 6.2;
    const totalGB = 10;
    const pct = (usedGB / totalGB) * 100;
    requestAnimationFrame(() => {
      fill.style.width = `${pct}%`;
    });
  }

  /* ============================================================
     Progress bars (projects + learning) — animate on load
     ============================================================ */
  function renderProgressBars() {
    const bars = $$('.progress-fill');
    requestAnimationFrame(() => {
      bars.forEach(bar => {
        const val = getComputedStyle(bar).getPropertyValue('--val').trim();
        bar.style.width = val || '0%';
      });
    });
  }

  /* ============================================================
     Weekly statistics bars
     ============================================================ */
  function renderWeeklyBars() {
    const container = $('#weeklyBars');
    if (!container) return;

    const data = [
      { day: 'Mon', hours: 4.2 },
      { day: 'Tue', hours: 5.1 },
      { day: 'Wed', hours: 3.4 },
      { day: 'Thu', hours: 4.8 },
      { day: 'Fri', hours: 5.6 },
      { day: 'Sat', hours: 2.1 },
      { day: 'Sun', hours: 2.3 }
    ];

    const jsDay = new Date().getDay(); // 0 = Sunday
    const todayIndex = jsDay === 0 ? 6 : jsDay - 1; // map to Mon-first array

    const max = Math.max(...data.map(d => d.hours));

    container.innerHTML = data.map((d, i) => {
      const isToday = i === todayIndex;
      const heightPct = Math.round((d.hours / max) * 100);
      return `
        <div class="bar-col">
          <div class="bar-track">
            <div class="bar-fill ${isToday ? 'is-today' : ''}" data-height="${heightPct}"></div>
          </div>
          <span class="bar-day ${isToday ? 'is-today' : ''}">${d.day}</span>
        </div>
      `;
    }).join('');

    requestAnimationFrame(() => {
      $$('.bar-fill', container).forEach(el => {
        el.style.height = `${el.dataset.height}%`;
      });
    });
  }

  /* ============================================================
     Mobile sidebar toggle
     ============================================================ */
  function initSidebarToggle() {
    const sidebar = $('#sidebar');
    const toggle = $('#menuToggle');
    const scrim = $('#sidebarScrim');
    if (!sidebar || !toggle || !scrim) return;

    function open() {
      sidebar.classList.add('is-open');
      scrim.classList.add('is-open');
    }
    function close() {
      sidebar.classList.remove('is-open');
      scrim.classList.remove('is-open');
    }

    toggle.addEventListener('click', () => {
      sidebar.classList.contains('is-open') ? close() : open();
    });
    scrim.addEventListener('click', close);

    $$('.nav-item').forEach(item => item.addEventListener('click', close));
  }

  /* ============================================================
     New task button — lightweight demo interaction
     ============================================================ */
  function initNewTaskButton() {
    const btn = $('#newTaskBtn');
    const list = $('#missionList');
    if (!btn || !list) return;

    btn.addEventListener('click', () => {
      const title = prompt('Quick task title:');
      if (!title) return;

      const li = document.createElement('li');
      li.className = 'mission-item';
      li.dataset.id = String(Date.now());
      li.innerHTML = `
        <button class="check" aria-label="Toggle complete">
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="mission-copy">
          <span class="mission-title">${escapeHTML(title)}</span>
          <span class="mission-meta">Added just now</span>
        </div>
      `;
      list.appendChild(li);

      $('.check', li).addEventListener('click', () => {
        li.classList.toggle('is-done');
        const done = $$('.mission-item.is-done').length;
        const total = $$('.mission-item').length;
        const tag = $('#missionTag');
        const welcomeCount = $('#welcomeDoneCount');
        if (tag) tag.textContent = `${done}/${total}`;
        if (welcomeCount) welcomeCount.textContent = `${done} of ${total}`;
      });
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ============================================================
     Init
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    renderDateLabel();
    renderDayArc();
    initMood();
    initMission();
    renderSavingsRing();
    renderPlanBar();
    renderProgressBars();
    renderWeeklyBars();
    initSidebarToggle();
    initNewTaskButton();

    // Keep the day-arc + clock live
    setInterval(renderDayArc, 60 * 1000);
  });
})();
