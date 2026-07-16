# LifeOS — Architecture

## Project Structure


lifeos/
├── ARCHITECTURE.md # Dokimantasyon teknik sou fason sistèm nan mache
├── main.js # Pwen antre aplikasyon an (init system)
│
├── core/ # Kè aplikasyon an (State, Persistence, System)
│ ├── store.js # State manager santralize (pa jere LocalStorage dirèk)
│ ├── initialState.js # Estrikti done default aplikasyon an
│ ├── persistence.js # Middleware pou LocalStorage + migrations
│ ├── backup.js # Export / Import JSON backup
│ ├── scheduler.js # Tcheke otomatik (dat, deadline, alert)
│ └── notify.js # Sistèm notifikasyon
│
├── services/ # Business Logic
│ ├── taskService.js # Jesyon travay
│ ├── goalsService.js # Jesyon objektif
│ ├── moodService.js # Jesyon imè
│ ├── habitsService.js # Jesyon abitid
│ ├── financeService.js # Jesyon lajan ak bidjè
│ ├── internetService.js # Jesyon plan entènèt
│ └── learningService.js # Jesyon aprantisaj
│
├── routes/
│ └── registry.js # Lis tout paj/modil aplikasyon an
│
└── ui/
├── render.js # Render konpozan yo selon store la
└── events.js # Koutè bouton ak aksyon itilizatè


# Core System

## Store

`core/store.js` se sous verite aplikasyon an.

Li responsab pou:

- Kenbe tout state aplikasyon an
- Fè update done yo
- Notifye modil ki bezwen konnen chanjman yo
- Sipòte middleware

Store la **pa dwe janm kominike dirèkteman ak LocalStorage**.

Persistence fèt atravè:


store
|
| middleware
↓
persistence.js
|
↓
LocalStorage


---

# Data Flow


User Action

 ↓

UI Events

 ↓

Service Layer

 ↓

Store Update

 ↓

Subscribers

 ↓

UI Render


Egzanp:


User ajoute depans

↓
financeService.addExpense()

↓
store.updateState()

↓
finance data chanje

↓
Finance UI refresh


---

# State Management

Tout done aplikasyon an rete nan yon sèl store:


state
├── profile
├── mood
├── tasks
├── goals
├── projects
├── finance
├── internetPlan
├── learningProgress
├── habits
├── weeklyStats
├── notifications
├── reports
└── settings


Chak kategori se yon "slice".

---

# Rendering System

Sistèm nan pa itilize:


renderAll()


pou chak ti chanjman.

Li itilize:


subscribeSelector()


pou sèlman mete ajou pati ki chanje yo.

Egzanp:

Task chanje:


tasks slice
↓
Task UI refresh


Finance pa bezwen rechaje.

---

# Persistence System

`persistence.js` responsab:

- Save otomatik
- Load done
- Version schema
- Migration

Store la rete endepandan.

---

# Backup System

`backup.js` responsab:

- Export JSON
- Import JSON
- Restore done itilizatè

---

# Services Layer

UI pa janm modifye state dirèkteman.

Move:


button
↓
store.updateState()


Bon:


button
↓
service
↓
store


---

# Future Modules

Architecture la pare pou:

- Dashboard
- Tasks
- Goals
- Projects
- Learning
- Finance
- Internet
- Habits
- Reports
- Settings

Ajoute yon nouvo paj vle di:

1. Kreye service li
2. Kreye UI li
3. Konekte li ak store selector
4. Ajoute route la
