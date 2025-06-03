# 🎨 Frontend - Interface d'Analyse de Données

Interface web moderne pour la visualisation et l'analyse des données de facturation.

## 📋 Table des matières

- [Technologies utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Démarrage](#-démarrage)
- [Fonctionnalités](#-fonctionnalités)
- [Structure du projet](#-structure-du-projet)
- [Composants principaux](#️-composants-principaux)
- [Personnalisation](#-personnalisation)

## 🛠 Technologies utilisées

- **Framework** : React 18+
- **Build Tool** : Vite/Create React App
- **Styling** : CSS Modules / Styled Components / Tailwind CSS
- **Charts** : Chart.js / Recharts / D3.js
- **State Management** : Context API / Redux Toolkit
- **HTTP Client** : Axios
- **UI Components** : Material-UI / Ant Design / Custom
- **Icons** : React Icons / Lucide React
- **Date Handling** : date-fns / moment.js

## 📦 Installation

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install
```

## ⚙️ Configuration

1. Créer un fichier `.env` à la racine du dossier frontend :

```bash
# API Backend
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_TIMEOUT=10000

# Environnement
REACT_APP_ENV=development

# Configuration des graphiques (optionnel)
REACT_APP_CHART_THEME=light
REACT_APP_DEFAULT_LOCALE=fr-FR
```

2. Assurez-vous que le backend est démarré sur le port configuré

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

```

L'application est accessible sur `http://localhost:3000`

## ✨ Fonctionnalités

### 📊 Dashboard Principal
- **Vue d'ensemble** : KPIs principaux en temps réel
- **Graphiques interactifs** : Évolution du CA, trends, comparaisons
- **Filtres temporels** : Sélection de périodes personnalisées
- **Export de données** : PDF, Excel, CSV

### 📈 Analyses Avancées

#### 💰 Module Financier
- Graphique d'évolution du chiffre d'affaires
- Répartition mensuelle/trimestrielle
- Comparaison année sur année
- Prévisions basiques

#### 👥 Module Clients
- Top clients par chiffre d'affaires
- Analyse de la fidélité client
- Segmentation (nouveaux vs récurrents)
- Cartographie géographique (si données disponibles)

#### 📦 Module Produits
- Bestsellers et produits phares
- Performance par catégorie
- Analyse des marges
- Recommandations

### 🎛 Fonctionnalités Utilisateur
- **Interface responsive** : Optimisée mobile/tablette/desktop
- **Thème sombre/clair** : Basculement dynamique
- **Sauvegarde des filtres** : Persistance des préférences utilisateur
- **Notifications** : Alertes et mises à jour en temps réel
- **Recherche avancée** : Filtrage multi-critères


## 🧩 Composants principaux

### 📊 Composants de visualisation

```jsx
// Exemple d'utilisation des composants charts
<LineChart 
  data={revenueData} 
  title="Évolution du CA"
  xAxis="month"
  yAxis="revenue"
  color="#3B82F6"
/>

<BarChart 
  data={topClients} 
  title="Top 10 Clients"
  horizontal={true}
/>

<PieChart 
  data={productCategories}
  title="Répartition par catégorie"
  showLegend={true}
/>
```

### 🎛 Composants de contrôle

```jsx
// Filtres de date
<DateRangePicker 
  startDate={startDate}
  endDate={endDate}
  onChange={handleDateChange}
/>

// Sélecteurs multiples
<MultiSelect 
  options={clientList}
  placeholder="Sélectionner des clients"
  onChange={handleClientFilter}
/>
```

### 📱 Composants UI

```jsx
// Cartes de métriques
<MetricCard 
  title="Chiffre d'affaires"
  value="€125,400"
  change="+12.5%"
  trend="up"
/>

// Tables interactives
<DataTable 
  data={invoicesData}
  columns={tableColumns}
  sortable={true}
  filterable={true}
  exportable={true}
/>
```

## 🎨 Personnalisation

### Thèmes
```css
/* Variables CSS pour la personnalisation */
:root {
  --primary-color: #3B82F6;
  --secondary-color: #1F2937;
  --accent-color: #10B981;
  --background-color: #F9FAFB;
  --text-color: #111827;
  --border-radius: 8px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Configuration des graphiques
```javascript
// Thèmes prédéfinis pour les graphiques
export const chartThemes = {
  default: {
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    backgroundColor: '#FFFFFF',
    gridColor: '#E5E7EB'
  },
  dark: {
    colors: ['#60A5FA', '#34D399', '#FBBF24', '#F87171'],
    backgroundColor: '#1F2937',
    gridColor: '#374151'
  }
};
```

## 📱 Responsive Design

L'interface s'adapte automatiquement :
- **Desktop** (>1024px) : Vue complète avec sidebar
- **Tablet** (768px-1024px) : Sidebar collapsible
- **Mobile** (<768px) : Navigation en bas, cartes empilées

## 🔧 Scripts disponibles

```bash
# Démarrer le serveur de développement
npm run dev``
