🧠 Analyse de Données de Facturation – Projet Fullstack

    Application complète de visualisation et d’analyse de données issues de factures : KPIs, tendances, analyses clients/produits, dashboards interactifs.

📁 Structure du projet

.
├── backend/        # API Express + PostgreSQL pour les analyses statistiques
├── frontend/       # Interface React pour la visualisation des données
├── database/       # Scripts d'import/export de données
└── README.md       # (ce fichier)

🚀 Stack technique
Côté Backend	Côté Frontend
Node.js + Express	React + Vite
PostgreSQL	Tailwind, Chart.js
pg, dotenv, cors	Axios, Context API
🧩 Fonctionnalités principales
📊 Dashboard global

    Chiffre d'affaires global + évolution mensuelle

    KPIs clés : croissance, panier moyen, clients actifs

👥 Analyse Clients

    Top clients par CA

    Fréquence, segmentation, fidélité

📦 Analyse Produits

    Produits les plus vendus

    Marges, catégories, corrélations

📈 Tendances et comparaisons

    Comparaison entre périodes

    Vue temporelle : Mois, Trimestre, Année

⚙️ Installation rapide
1. Cloner le projet

git clone <git@github.com:omniaistaken/tt-ARIPA.git>

cd tt-ARIPA

2. Backend

cd backend
cp .env.template .env   # Modifier avec vos infos
npm install
npm start

    ⚠️ PostgreSQL doit être installé + base créée via createdb + script d’import database/db.sh

3. Frontend

cd ../frontend
cp .env.example .env     # Modifier l’URL si besoin
npm install
npm run dev


📁 Dossiers principaux
Dossier	Description
backend/	Serveur Node.js / Express - fournit les données
frontend/	App React avec dashboard, graphiques interactifs
database/	Script SQL d’import initial (db.sh, .sql)
👨‍💻 Développement

    Mode dev backend : npm start (port 3000)

    Mode dev frontend : npm run dev (port 5173)

    Hot-reload, séparé par service

✅ Prêt pour déploiement

    .env prêts à l’emploi

    Structure modulaire

    API REST sécurisée

    UI responsive avec thème clair/sombre

📞 Contact / Support

Pour toute question, contactez :
📩 leslye1.jeannin@epitech.eu