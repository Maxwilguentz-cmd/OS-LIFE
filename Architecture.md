lifeos/
├── ARCHITECTURE.md          # Dokimantasyon teknik sou fason modil yo kominike
├── main.js                  # Pwen antre prensipal (Inisyalizasyon aplikasyon an)
│
├── core/                    # Kè sistèm nan (Logiciel, Done, ak Pèsistans)
│   ├── store.js             # State Manager santralize. Jere eta aplikasyon an, imutabilite, subscriptions, ak middleware (store.use). Pa jere LocalStorage dirèkteman.
│   ├── initialState.js      # Done ak estrikti pa defo pou chak tranche (slice)
│   ├── persistence.js       # Middleware pou otomatikman chaje ak sove done nan LocalStorage. Jere schema version ak migrasyon done.
│   ├── backup.js            # Lojik pou Enpòte / Espòte fichye backup JSON
│   ├── scheduler.js         # Planifikatè travay otomatik (cron-like pou chanjman jou, alèt, verifikasyon)
│   └── notify.js            # Sistèm alèt ak notifikasyon entèn
│
├── services/                # Kouch sèvis yo (Business Logic)
│   ├── taskService.js       # Sèvis pou jere travay (tasks)
│   ├── goalsService.js      # Sèvis pou jere objektif (goals)
│   ├── moodService.js       # Sèvis pou swiv imè ak emosyon (mood)
│   ├── habitsService.js     # Sèvis pou jere abitid chak jou (habits)
│   ├── financeService.js    # Sèvis pou jere tranzaksyon ak bidjè (finance)
│   ├── internetService.js   # Sèvis pou swiv konsomasyon plan entènèt (internet)
│   └── learningService.js   # Sèvis pou swiv kou ak tan aprantisaj (learning)
│
├── routes/                  # Kouch routage pou navigasyon ant modil yo
│   └── registry.js          # Rejis ki deklare tout paj/modil ki disponib yo
│
└── ui/                      # Kouch koòdone grafik (San renderAll total)
    ├── render.js            # Rann pasyèl ak dinamik konpozan yo selon chanjman nan store
    └── events.js            # Koutè evènman pou aksyon itilizatè yo sou ekran an


## Data Flow

UI
 ↓
Services
 ↓
Store
 ↓
Persistence Middleware
 ↓
LocalStorage


## Store Architecture

- store.js se sèl sous verite pou tout done aplikasyon an.
- Tout sèvis yo kominike ak done yo atravè store la.
- UI pa modifye store dirèkteman.
- Services yo fè chanjman nan done yo.
- store.use() pèmèt konekte middleware tankou persistence.
- Persistence responsab pou sove ak chaje done yo.


## Persistence System

- LocalStorage pa dwe itilize dirèkteman nan store.js.
- persistence.js jere tout operasyon sove/chaje.
- Sistèm nan sipòte schema version pou migrasyon pita.
- Backup JSON rete separe ak persistence otomatik la.
