# LIFEOS — SPÉCIFICATION COMPLÈTE DU PROJET

## Présentation

LifeOS se yon aplikasyon web modèn ki sèvi kòm yon "Operating System" pèsonèl pou ede itilizatè a òganize lavi li, objektif li, finans li, aprantisaj li, pwojè li yo ak pwodiktivite li nan yon sèl dashboard.

Objektif la se pa kreye yon senp To-Do App, men yon sant kontwòl pèsonèl kote itilizatè a ka wè pwogrè li nan tout aspè enpòtan nan lavi li.

---

# Vision du projet

Lè itilizatè a ouvri LifeOS li dwe kapab wè:

* Ki travay li gen pou fè jodi a
* Konbyen travay li deja fini
* Kijan li santi li jodi a
* Konbyen lajan li ekonomize
* Eta plan entènèt li
* Pwojè li yo
* Aprantisaj li yo
* Estatistik semèn nan
* Objektif li yo
* Notifikasyon ak rapèl yo

Tout done yo dwe dinamik epi estoke lokalman.

---

# Design souhaité

Style la dwe:

* Premium
* Futuriste
* Minimaliste
* Moderne
* Responsive
* Dark Mode par défaut
* Animations fluides
* Glassmorphism léger
* Cartes élégantes
* Interface inspirée de Notion, Linear, Arc Browser et Apple

---

# Architecture technique

Technologies :

* HTML
* CSS
* JavaScript Vanilla (ES Modules)

Pa itilize framework tankou React, Vue oswa Angular.

Structure :

LifeOS/
│
├── index.html
├── dashboard.css
├── main.js
│
├── store/
│ ├── initialState.js
│ ├── store.js
│ └── persistence.js
│
├── core/
│ ├── router.js
│ ├── registry.js
│ └── utils.js
│
├── modules/
│ ├── dashboard/
│ ├── tasks/
│ ├── calendar/
│ ├── finance/
│ ├── projects/
│ ├── learning/
│ ├── habits/
│ ├── reports/
│ └── settings/
│
└── assets/

---

# Fonctionnalités principales

## 1. Dashboard

Page principale.

Li dwe montre:

### Welcome Section

* Salitasyon dinamik
* Non itilizatè
* Travay fini
* Tan konsantrasyon
* Streak
* Progression jounen an

---

### Mood Tracker

Itilizatè a ka chwazi:

* Great
* Good
* Okay
* Low

Mood la dwe sove otomatikman.

---

### Daily Mission

Lis objektif prensipal jounen an.

Fonksyon:

* Ajouter
* Modifier
* Supprimer
* Marquer comme terminé

Progression otomatik.

---

### Savings Tracker

Montre:

* Montan aktyèl
* Objektif ekonomi
* Pourcentage reyalizasyon
* Estimasyon tan ki rete

Egzanp:

Objectif : 1000 G
Actuel : 450 G
Progression : 45 %

---

### Internet Plan Tracker

Pou itilizatè ki depanse anpil nan entènèt.

Montre:

* Fournisseur
* Prix
* Date renouvellement
* Jours restants
* Consommation

Egzanp:

Digicel
1000 G
15 jours restants

---

### Projects Tracker

Montre pwojè aktyèl yo.

Egzanp:

* LifeOS
* BoukStream
* AI Assistant
* Python Learning
* Blender Journey

Pou chak pwojè:

* Nom
* Description
* Pourcentage
* Date création
* Date limite

---

### Learning Tracker

Pou swiv konpetans yo.

Egzanp:

Python → 60 %
JavaScript → 45 %
Blender → 25 %
Video Editing → 50 %
AI Development → 20 %

Fonksyon:

* Ajouter compétence
* Modifier progression
* Historique

---

### Weekly Statistics

Montre:

* Heures de travail
* Tâches terminées
* Progression
* Tendances

Graphiques:

* Jour par jour
* Semaine
* Mois

---

# 2. Tasks Module

Sistèm travay avanse.

Fonksyon:

* Ajouter tâche
* Modifier tâche
* Supprimer tâche
* Catégories
* Priorité
* Date limite
* Statut
* Recherche

Priorités:

* Low
* Medium
* High
* Critical

---

# 3. Calendar Module

Fonksyon:

* Vue mensuelle
* Vue hebdomadaire
* Vue journalière

Evènements:

* Ajouter
* Modifier
* Supprimer

Connexion avec Tasks.

---

# 4. Finance Module

Gestion financière complète.

Fonksyon:

### Savings

* Objectifs
* Historique

### Revenus

* Ajouter revenus

### Dépenses

* Ajouter dépenses

Catégories:

* Internet
* Nourriture
* Transport
* Études
* Autres

### Statistiques

* Revenus mensuels
* Dépenses mensuelles
* Solde

---

# 5. Habits Module

Suivi d’habitudes.

Exemples:

* Lire
* Étudier
* Sport
* Méditation
* Programmation

Fonksyon:

* Streak
* Historique
* Statistiques

---

# 6. Goals Module

Objectifs long terme.

Exemples:

* Acheter un PC
* Économiser 10 000 G
* Apprendre Python
* Lancer BoukStream

Pour chaque objectif:

* Description
* Deadline
* Progression

---

# 7. Reports Module

Rapports automatiques.

Rapport:

* Journalier
* Hebdomadaire
* Mensuel

Montre:

* Productivité
* Économie
* Habitudes
* Apprentissage

---

# 8. Notifications

Notifications internes.

Exemples:

* Tâche en retard
* Objectif atteint
* Renouvellement internet
* Économie complétée

---

# 9. Search System

Recherche globale.

Recherche dans:

* Tasks
* Projects
* Learning
* Goals
* Notes

Résultats instantanés.

---

# 10. Theme System

Modes:

* Dark
* Light

Sauvegarde automatique.

---

# 11. Data Storage

Utiliser:

localStorage

Les données doivent survivre après fermeture du navigateur.

---

# 12. Future AI Assistant

Version future.

Assistant intelligent intégré.

Fonctions:

* Résumé quotidien
* Conseils personnalisés
* Analyse de productivité
* Suggestions d’objectifs
* Détection de mauvaises habitudes
* Planification automatique

---

# État actuel du projet

Déjà réalisé :

✅ Structure HTML Dashboard
✅ Sidebar
✅ Topbar
✅ Responsive Layout
✅ Welcome Card
✅ Mood Section
✅ Mission Section
✅ Savings Section
✅ Internet Section
✅ Projects Section
✅ Learning Section
✅ Weekly Stats Section
✅ Navigation de base

À terminer :

🔲 Store global
🔲 Persistence
🔲 Render dynamique
🔲 Events système
🔲 Finance Module
🔲 Calendar Module
🔲 Habits Module
🔲 Reports Module
🔲 AI Assistant

---

# Objectif final

Créer le meilleur tableau de bord personnel possible pour aider l’utilisateur à gérer sa vie, son argent, ses objectifs, ses projets, ses habitudes et son apprentissage dans une seule application moderne et élégante.
