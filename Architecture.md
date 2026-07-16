lifeos/
├── ARCHITECTURE.md          # Dokimantasyon teknik sou fason modil yo kominike
├── main.js                  # Pwen antre prensipal (Inisyalizasyon aplikasyon an)
│
├── core/                    # Kè sistèm nan (Logiciel, Done, ak Pèsistans)
│   ├── store.js             # State Manager santralize ak imtabilite
│   ├── initialState.js      # Done ak estrikti pa defo pou chak tranche (slice)
│   ├── persistence.js       # Otomatik sovgad ak chajman nan LocalStorage
│   ├── backup.js            # Lojik pou Enpòte / Espòte fichye backup JSON
│   ├── scheduler.js         # Planifikatè travay otomatik (cron-like pou chanjman jou, elatriye)
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
└── ui/                      # Kouch koòdone grafik (San renderAll)
    ├── render.js            # Rann pasyèl ak dinamik konpozan yo selon chanjman nan store
    └── events.js            # Koutè evènman pou aksyon itilizatè yo sou ekran an
