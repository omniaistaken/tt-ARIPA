import { useEffect, useState } from 'react';
import { RefreshCw, Download, Package, DollarSign, Fish, TrendingUp, Users, Ship, Calendar, AlertCircle } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#6366f1', '#a78bfa', '#4ade80', '#facc15', '#f87171', '#06b6d4', '#f97316', '#84cc16'];

const Overview = () => {
    const { fetchData, loading, error } = useAPI();
    const [summary, setSummary] = useState(null);
    const [selectedView, setSelectedView] = useState(null);
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [topSpecies, setTopSpecies] = useState([]);
    const [boatsActivity, setBoatsActivity] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [kpiComparison, setKpiComparison] = useState({});

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        await Promise.all([
            loadSummary(),
            loadMonthlyTrends(),
            loadTopCustomers(),
            loadTopSpecies(),
            loadBoatsActivity()
        ]);
    };

    const loadSummary = async () => {
        const data = await fetchData('/summary');
        if (data) setSummary(data);
    };

    const loadMonthlyTrends = async () => {
        const data = await fetchData('/by-month?timeframe=6m');
        if (data) {
            const enhanced = data.map((item, index) => ({
                ...item,
                monthName: new Date(item.month + '-01').toLocaleDateString('fr-FR', { 
                    month: 'short', 
                    year: 'numeric' 
                }),
                total_weight: parseFloat(item.total_weight) || 0,
                total_amount: parseFloat(item.total_amount) || 0,
                nb_factures: parseInt(item.nb_factures) || 0,
                growth: index > 0 ? 
                    (((parseFloat(item.total_amount) - parseFloat(data[index - 1].total_amount)) / parseFloat(data[index - 1].total_amount)) * 100).toFixed(1)
                    : 0
            }));
            setMonthlyTrends(enhanced);
        }
    };

    const loadTopCustomers = async () => {
        const data = await fetchData('/by-entity');
        if (data) {
            const top5 = data.slice(0, 5).map(customer => ({
                ...customer,
                total_amount: parseFloat(customer.total_amount)
            }));
            setTopCustomers(top5);
        }
    };

    const loadTopSpecies = async () => {
        const data = await fetchData('/by-species');
        if (data) {
            const top5 = data.slice(0, 5).map(species => ({
                ...species,
                total_weight: parseFloat(species.total_weight)
            }));
            setTopSpecies(top5);
        }
    };

    const loadBoatsActivity = async () => {
        const data = await fetchData('/by-boat');
        if (data) {
            const enhanced = data.slice(0, 8).map(boat => ({
                ...boat,
                nb_factures: parseInt(boat.nb_factures),
                total_revenue: parseFloat(boat.total_revenue) || 0,
                total_weight: parseFloat(boat.total_weight) || 0
            }));
            setBoatsActivity(enhanced);
        }
    };

    const handleCardClick = async (type) => {
        let data = null;

        switch (type) {
            case 'entities':
                data = await fetchData('/by-entity');
                break;
            case 'species':
                data = await fetchData('/by-species');
                break;
            case 'boats':
                data = await fetchData('/by-boat');
                break;
            case 'payments':
                data = await fetchData('/by-payment-method');
                break;
            default:
                break;
        }

        if (data) {
            setSelectedView({ type, data });
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {typeof entry.value === 'number' ? 
                                entry.value.toLocaleString('fr-FR') : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Vue d'ensemble</h2>
                    <p className="text-gray-600 mt-1">Tableau de bord ARIPA - Données en temps réel</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={loadAllData}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>Actualiser</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg">
                        <Download className="h-4 w-4" />
                        <span>Exporter</span>
                    </button>
                </div>
            </div>

            {error && <ErrorMessage message={error} onRetry={loadAllData} />}

            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Package}
                    label="Factures totales"
                    value={summary?.nb_factures || 0}
                    subtext="Toutes périodes confondues"
                    color="blue"
                    loading={loading}
                    onClick={() => handleCardClick('invoices')}
                />
                <StatsCard
                    icon={DollarSign}
                    label="Chiffre d'affaires"
                    value={summary ? `${parseFloat(summary.montant_total).toLocaleString('fr-FR')} €` : '0 €'}
                    subtext="Montant total des ventes"
                    color="green"
                    loading={loading}
                    onClick={() => handleCardClick('entities')}
                />
                <StatsCard
                    icon={Fish}
                    label="Quantité totale"
                    value={summary ? `${parseFloat(summary.quantite_totale).toLocaleString('fr-FR')} kg` : '0 kg'}
                    subtext="Poids total vendu"
                    color="purple"
                    loading={loading}
                    onClick={() => handleCardClick('species')}
                />
                <StatsCard
                    icon={TrendingUp}
                    label="Prix moyen/kg"
                    value={summary && summary.quantite_totale !== '0'
                        ? `${(parseFloat(summary.montant_total) / parseFloat(summary.quantite_totale)).toFixed(2)} €`
                        : '0 €'}
                    subtext="Prix de vente moyen"
                    color="orange"
                    loading={loading}
                />
            </div>

            {/* Monthly Trends Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    Tendances Mensuelles (6 derniers mois)
                </h3>
                {loading ? <LoadingSpinner /> : (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyTrends}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="monthName" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="total_amount" 
                                stroke="#6366f1" 
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                                name="Chiffre d'affaires (€)"
                            />
                            <Area 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="total_weight" 
                                stroke="#10b981" 
                                fillOpacity={1} 
                                fill="url(#colorWeight)" 
                                name="Poids total (kg)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Customers */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Users className="h-5 w-5 text-green-600 mr-2" />
                        Top 5 Clients
                    </h3>
                    {loading ? <LoadingSpinner /> : (
                        <div className="space-y-3">
                            {topCustomers.map((customer, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-gray-700 truncate">{customer.name}</span>
                                    </div>
                                    <span className="text-green-600 font-semibold">
                                        {customer.total_amount.toLocaleString('fr-FR')} €
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Species */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Fish className="h-5 w-5 text-purple-600 mr-2" />
                        Top 5 Espèces
                    </h3>
                    {loading ? <LoadingSpinner /> : (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={topSpecies}
                                    dataKey="total_weight"
                                    nameKey="species"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ species, percent }) => `${species} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {topSpecies.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR')} kg`]} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Boats Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Ship className="h-5 w-5 text-cyan-600 mr-2" />
                        Activité Flotte
                    </h3>
                    {loading ? <LoadingSpinner /> : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={boatsActivity} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="boat" type="category" width={60} fontSize={12} />
                                <Tooltip 
                                    formatter={(value, name) => [
                                        name === 'nb_factures' ? `${value} factures` : `${value.toLocaleString('fr-FR')} €`,
                                        name === 'nb_factures' ? 'Factures' : 'Revenus'
                                    ]}
                                />
                                <Bar dataKey="nb_factures" fill="#06b6d4" name="Factures" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {selectedView?.data && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {selectedView.type === 'entities' && 'Ventes par Entité'}
                        {selectedView.type === 'species' && 'Ventes par Espèce'}
                        {selectedView.type === 'boats' && 'Activité par Bateau'}
                        {selectedView.type === 'payments' && 'Méthodes de Paiement'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedView.data.map((item, index) => (
                            <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">
                                        {item.name || item.species || item.boat || item.payment_method}
                                    </span>
                                    <span className="text-blue-600 font-semibold">
                                        {item.total_amount ? `${parseFloat(item.total_amount).toLocaleString('fr-FR')} €` :
                                            item.total_weight ? `${parseFloat(item.total_weight).toLocaleString('fr-FR')} kg` :
                                                item.nb_factures ? `${item.nb_factures} factures` :
                                                    `${item.count} fois`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview;