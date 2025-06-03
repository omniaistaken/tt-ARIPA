import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import OverviewPage from './pages/Overview.jsx';
import SalesPage from './pages/Sales.jsx';
import SpeciesPage from './pages/Species.jsx';
import BoatsPage from './pages/Boats.jsx';
import AnalyticsPage from './pages/Analytics.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col min-h-screen
        bg-white text-gray-900
        dark:bg-gray-900 dark:text-gray-300
      `}
    >
      {/* Passe la fonction de toggle au NavBar pour qu’il puisse changer le mode */}
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/species" element={<SpeciesPage />} />
          <Route path="/boats" element={<BoatsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>

      <footer className="bg-gradient-to-r from-blue-900 to-cyan-900 text-white py-4 mt-12
        dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-200 dark:text-gray-400">© 2025 ARIPA - Système de gestion maritime</p>
        </div>
      </footer>
    </div>
  );
}

export default App;