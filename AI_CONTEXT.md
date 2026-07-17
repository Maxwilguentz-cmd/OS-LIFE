# AI_CONTEXT.md

# Memwa ofisyèl aplikasyon an pou tout AI

==================================================

1. INFORMASYON JENERAL SOU PROJÈ A
   ==================================================

Non aplikasyon:
LifeOS

Vèsyon aktyèl:
En devlopman

Objektif aplikasyon an:
Kreye yon sistèm pèsonèl pou jere lavi itilizatè a atravè objektif, travay, finans, abitid, aprantisaj, pwojè ak plan entènèt.

Teknoloji itilize:

* Frontend: HTML, CSS, JavaScript (ES Modules)
* Backend: Okenn pou kounye a
* Database: LocalStorage
* Lòt: Store Architecture, Persistence Layer

Deskripsyon kout:
LifeOS se yon aplikasyon Productivité ak Life Management ki santralize tout done itilizatè a nan yon sèl store epi itilize modil endepandan pou Tasks, Finance, Habits, Learning, Projects, Calendar, Settings ak Dashboard.

==================================================
2. RÒL AI YO NAN PWOJÈ A
========================

GPT:
Wòl:
Project Lead + Technical Architect

Responsablite:

* Pran desizyon teknik.
* Kenbe vizyon jeneral.
* Verifye kalite solisyon.
* Kowòdone lòt AI yo.
* Kenbe AI_CONTEXT.md ajou.

Claude:
Wòl:
Senior Architect + Debugger

Responsablite:

* Analize achitekti.
* Jwenn bug.
* Prepare plan koreksyon.
* Idantifye risk.

Gemini:
Wòl:
Senior Developer

Responsablite:

* Ekri kòd final.
* Modifye fichye yo.
* Retounen fichye konplè.

Meta AI:
Wòl:
Code Reviewer (Opsyonèl)

Responsablite:

* Chèche risk.
* Bay dezyèm opinyon.
* Verifye plan yo.

==================================================
3. ACHITEKTI APLIKASYON AN
==========================

Estrikti pwojè:

lifeos/
├── ARCHITECTURE.md
├── main.js
│
├── core/
│   ├── store.js
│   ├── initialState.js
│   ├── persistence.js
│   ├── backup.js
│   ├── scheduler.js
│   └── notify.js
│
├── services/
│   ├── taskService.js
│   ├── goalsService.js
│   ├── moodService.js
│   ├── habitsService.js
│   ├── financeService.js
│   ├── internetService.js
│   └── learningService.js
│
├── routes/
│   └── registry.js
│
├── modules/
│   ├── dashboard/
│   ├── tasks/
│   ├── calendar/
│   ├── finance/
│   ├── habits/
│   ├── learning/
│   ├── projects/
│   └── settings/
│
└── ui/
├── render.js
└── events.js

Fichye enpòtan yo:

store.js:
Sous verite aplikasyon an.

initialState.js:
Estrikti default state la.

persistence.js:
Save/Load LocalStorage.

scheduler.js:
Travay otomatik ak alèt.

notify.js:
Sistèm notifikasyon.

registry.js:
Navigasyon aplikasyon an.

render.js:
Mizajou UI.

events.js:
Jesyon evènman itilizatè yo.

==================================================
4. RÈG TEKNIK ENPÒTAN
=====================

Règ pou tout AI:

* Pa kraze fonctionnalités ki deja egziste.
* Pa chanje achitekti san rezon solid.
* Chèche pi piti chanjman ki bay pi gwo benefis.
* Verifye depandans avan nenpòt modifikasyon.
* Kenbe menm style kòd la.
* Pa fè gwo refactor si yon ti koreksyon sifi.
* Gemini dwe retounen fichye konplè yo.
* Claude pa ekri kòd final, li analize.
* GPT valide plan yo avan entegrasyon.

==================================================
5. BUG TRACKER
==============

BUG REZOUD:

(Okenn ofisyèlman fèmen pou kounye a)

---

BUG #2

Gravite:
Critique

Status:
FIX READY / PENDING TEST

Deskripsyon:
Dashboard pa t retounen kòrèkteman apre navigasyon.

Root Cause:
Dashboard restoration te depann de tasksView.js.

Solisyon aplike:

* Kreye dashboardView.js
* Deplase dashboard backup la soti nan tasksView.js
* Ajoute initDashboardBackup()
* Ajoute restoreDashboardView()
* Mete registry.js itilize nouvo module la

Fichye afekte:

* modules/dashboard/dashboardView.js
* modules/tasks/tasksView.js
* routes/registry.js

Tès ki rete:

* Dashboard → Finance → Dashboard
* Dashboard → Tasks → Dashboard
* Dashboard → Projects → Dashboard
* Dashboard → Habits → Dashboard

---

BUG KI RETE:

BUG #1

Gravite:
Critique

Deskripsyon:
Calendar kraze paske TRANSLATIONS[lang].calendarPage pa egziste.

Fichye afekte:

* core/i18n.js
* modules/calendar/calendarView.js

---

BUG #3

Gravite:
Important

Deskripsyon:
Theme Toggle ajoute plizyè event listener chak fwa Dashboard chaje.

Fichye afekte:

* ui/events.js
* routes/registry.js

---

BUG #4

Gravite:
Important

Deskripsyon:
Event listeners akimile ant modil yo.

Fichye afekte:

* financeView.js
* habitsView.js
* learningView.js
* projectsView.js
* settingsView.js
* tasksView.js
* calendarView.js

---

BUG #5

Gravite:
Important

Deskripsyon:
render.js itilize internetPlan.renewDate ki pa egziste.

Fichye afekte:

* render.js
* initialState.js
* internetService.js

---

BUG #6

Gravite:
Important

Deskripsyon:
Mood note rete an Anglè apre premye seleksyon.

Fichye afekte:

* moodService.js
* render.js

---

BUG #7

Gravite:
Moyen

Deskripsyon:
todayLabel pa janm mete ajou.

Fichye afekte:

* index.html
* render.js

---

BUG #8

Gravite:
Moyen

Deskripsyon:
addTransactionBtn ak managePlanBtn pa konekte.

Fichye afekte:

* index.html
* ui/events.js

---

BUG #9

Gravite:
Moyen

Deskripsyon:
notificationBadge pa janm aktive.

Fichye afekte:

* scheduler.js
* render.js

---

BUG #10

Gravite:
Moyen

Deskripsyon:
projectService.js pa swiv menm konvansyon ak lòt sèvis yo.

Fichye afekte:

* projectService.js

---

BUG #11

Gravite:
Minè

Deskripsyon:
focusedTimeToday pa egziste.

Fichye afekte:

* render.js

---

BUG #12

Gravite:
Minè

Deskripsyon:
searchInput prezan men pa konekte.

Fichye afekte:

* index.html

---

BUG #13

Gravite:
Minè

Deskripsyon:
Event binding pa inifòm atravè modil yo.

==================================================
6. NOUVO FONKSYONALITE
======================

Fonksyonalite ajoute:

Dashboard Backup System (Pending Validation)

Dat:
2026-07-17

Deskripsyon:
Nouvo module dedye pou restore Dashboard san depandans sou Tasks.

==================================================
7. DESIZYON TEKNIK
==================

Dat:
2026-07-17

Desizyon:
Dashboard pa dwe depann de tasksView.js.

Rezon:
Tasks module pa dwe posede Dashboard HTML.

Efè:

* Achitekti pi pwòp.
* Mwens coupling.
* Navigasyon pi estab.

==================================================
8. DEPANDANS ANT FICHYE YO
==========================

UI
↓
Services
↓
Store
↓
Persistence

events.js
↓
Services
↓
Store

render.js
↓
Store Subscribers

registry.js
↓
Modules

==================================================
9. BAGAY KI PA DWE CHANJE
=========================

* store.js dwe rete sèl sous verite.
* Services yo dwe modifye state la, pa UI dirèkteman.
* Store pa dwe kominike dirèkteman ak LocalStorage.
* Persistence dwe pase atravè middleware.
* Gemini dwe retounen fichye konplè.
* GPT valide achitekti avan merge.

==================================================
10. DÈNYE AKSYON YO
===================

Dènye travay fèt:
Refactor Dashboard Restoration System.

AI ki fè li:
Claude (Analyse)
Gemini (Implementation)
GPT (Validation)

Dat:
2026-07-17

Pwochen etap:

1. Teste BUG #2.
2. Si tès pase → BUG #2 = FIXED.
3. Kòmanse BUG #1 (Calendar Crash).
4. Verifye BUG #3 (Theme Toggle Listener Leak).
