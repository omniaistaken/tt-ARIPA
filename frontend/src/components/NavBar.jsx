import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    DollarSign,
    Fish,
    Ship,
    TrendingUp,
    Waves,
    Anchor,
    Moon,
    Sun
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();

    const [darkMode, setDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark')
    );
    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        }
    };

    const navItems = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3, path: '/' },
        { id: 'sales', label: 'Ventes', icon: DollarSign, path: '/sales' },
        { id: 'species', label: 'Espèces', icon: Fish, path: '/species' },
        { id: 'boats', label: 'Bateaux', icon: Ship, path: '/boats' },
        { id: 'analytics', label: 'Analyses', icon: TrendingUp, path: '/analytics' }
    ];

    return (
        <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 border-b border-blue-700 shadow-xl
                        dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:border-gray-600">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & titre */}
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Waves className="h-8 w-8 text-cyan-300 dark:text-cyan-400" />
                            <Anchor className="h-4 w-4 text-blue-300 absolute -bottom-1 -right-1 dark:text-cyan-300" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white dark:text-gray-200">ARIPA</h1>
                            <p className="text-xs text-blue-200 dark:text-gray-400">Dashboard Maritime</p>
                        </div>
                    </div>

                    {/* Nav + toggle */}
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105
                                            ${isActive
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg dark:from-cyan-700 dark:to-blue-700'
                                                : 'text-blue-200 hover:bg-blue-700/50 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Bouton toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <Sun className="text-yellow-400 w-5 h-5" />
                            ) : (
                                <Moon className="text-gray-900 w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;