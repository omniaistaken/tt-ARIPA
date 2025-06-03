# 🚀 Backend - API d'Analyse de Données

API REST pour l'analyse statistique des données de facturation.

## 📋 Table des matières

- [Technologies utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Démarrage](#-démarrage)
- [API Endpoints](#-api-endpoints)
- [Structure du projet](#-structure-du-projet)
- [Analyses implémentées](#-analyses-implémentées)

## 🛠 Technologies utilisées

- **Runtime** : Node.js
- **Framework** : Express.js 5.1.0
- **Base de données** : PostgreSQL
- **Client DB** : pg (node-postgres) 8.16.0
- **CORS** : cors 2.8.5
- **Variables d'environnement** : dotenv 16.5.0

## 📦 Installation

```bash
# Cloner le repository (si pas déjà fait)
cd backend

# Installer les dépendances
npm install
```

## ⚙️ Configuration

1. Créer un fichier `.env` à la racine du dossier backend :

```bash
# Base de données PostgreSQL
PGUSER=your_username
PGPASSWORD=your_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=test_technique_aripa

# Serveur
PORT=3000
```

2. Assurez-vous que PostgreSQL est installé et que la base de données est créée :

```bash
# Créer la base de données
createdb test_technique_aripa

# Importer les données (depuis le dossier database/)
cd ../database
./db.sh
```

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start

# Tests
npm test
```

Le serveur démarre sur `http://localhost:3000` (port par défaut)

## 📡 API Endpoints

### 🔍 Endpoints disponibles

```http
GET /
```
Page d'accueil de l'API - Status et information

```http
GET /api/stats/*
```
Routes statistiques principales (voir détails ci-dessous)

### 📊 Analyses statistiques

```http
GET /api/analytics/revenue
```
Analyse du chiffre d'affaires
- Évolution mensuelle/annuelle
- Total et moyenne
- Tendances

```http
GET /api/analytics/customers
```
Analyse des clients
- Top clients par CA
- Fréquence d'achat
- Segmentation

```http
GET /api/analytics/products
```
Analyse des produits/services
- Produits les plus vendus
- Performance par catégorie
- Marges

```http
GET /api/analytics/dashboard
```
Données du tableau de bord
- KPIs principaux
- Métriques en temps réel
- Résumé exécutif

### 📈 Endpoints spécialisés

```http
GET /api/analytics/trends/:period
```
Analyse des tendances par période (monthly, quarterly, yearly)

```http
GET /api/analytics/compare/:startDate/:endDate
```
Comparaison entre deux périodes

## 🏗 Structure du projet

```
backend/
├── server.js           # Point d'entrée principal Express
├── index.js            # Configuration et connexion PostgreSQL
├── routes/
│   └── stats.js        # Routes des statistiques
├── .env                # Variables d'environnement
├── .env.template        # Exemple de configuration
├── package.json
└── README.md
```

## 📊 Analyses implémentées

### 💰 Analyse financière
- **Chiffre d'affaires total** : Calcul sur différentes périodes
- **Évolution temporelle** : Tendances mensuelles/trimestrielles
- **Moyenne des factures** : Ticket moyen et médiane
- **Répartition par mois** : Saisonnalité des ventes

### 👥 Analyse clientèle
- **Top clients** : Classement par CA généré
- **Segmentation** : Clients occasionnels vs réguliers
- **Analyse de la fidélité** : Fréquence d'achat
- **Géolocalisation** : Répartition géographique (si applicable)

### 📦 Analyse produits
- **Produits bestsellers** : Classement par volume/CA
- **Performance par catégorie** : Si catégories disponibles
- **Analyse des marges** : Rentabilité par produit
- **Corrélations** : Produits souvent achetés ensemble

### 📈 KPIs calculés
- Croissance du CA (MoM, YoY)
- Nombre de factures par période
- Panier moyen
- Taux de récurrence client
- Évolution du nombre de clients actifs

## 🔧 Scripts disponibles

```bash
# Démarrer le serveur
npm start
# ou
node server.js

# Mode développement avec nodemon (à installer)
npm install -g nodemon
nodemon server.js
```

**Note** : Ajoutez ces scripts à votre `package.json` :
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## 📞 Support

Si il y a un problème quelconque lors du lancment contatez svp : [leslye1.jeannin@epitech.eu]