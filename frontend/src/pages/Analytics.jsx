import { useEffect, useState } from 'react';
import { TrendingUp, Fish, DollarSign, Calendar, Package, AlertTriangle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ComposedChart
} from 'recharts';

const COLORS = ['#6366f1', '#a78bfa', '#4ade80', '#facc15', '#f87171', '#06b6d4', '#f97316', '#84cc16'];

const AnalyticsTab = () => {
    const { fetchData, loading, error } = useAPI();

    // Existing state
    const [paymentData, setPaymentData] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [detailData, setDetailData] = useState([]);
    const [topFishData, setTopFishData] = useState([]);
    const [loadingFish, setLoadingFish] = useState(false);
    const [errorFish, setErrorFish] = useState(null);
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [entityPerformance, setEntityPerformance] = useState([]);
    const [presentationBreakdown, setPresentationBreakdown] = useState([]);
    const [priceAnalysis, setPriceAnalysis] = useState([]);
    const [statusDistribution, setStatusDistribution] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('all');
    const [kpiData, setKpiData] = useState({});

    useEffect(() => {
        loadAnalyticsData();
    }, [selectedTimeframe]);

    const loadAnalyticsData = async () => {
        try {
            const payments = await fetchData('/by-payment-method');
            if (payments) setPaymentData(payments);

            const fish = await fetchData('/top-fish');
            setTopFishData(fish || []);

            const monthly = await fetchData('/by-month');
            if (monthly) {
                // Enhanced monthly data with calculations
                const enhancedMonthly = monthly.map((item, index) => ({
                    ...item,
                    monthName: new Date(item.month + '-01').toLocaleDateString('fr-FR', { 
                        month: 'long', 
                        year: 'numeric' 
                    }),
                    growth: index > 0 ? 
                        ((parseFloat(item.total_weight) - parseFloat(monthly[index - 1].total_weight)) / parseFloat(monthly[index - 1].total_weight) * 100).toFixed(1) 
                        : 0
                }));
                setMonthlyTrends(enhancedMonthly);
            }

            const entities = await fetchData('/by-entity');
            if (entities) {
                const totalAmount = entities.reduce((sum, entity) => sum + parseFloat(entity.total_amount), 0);
                const enhancedEntities = entities.map(entity => ({
                    ...entity,
                    marketShare: ((parseFloat(entity.total_amount) / totalAmount) * 100).toFixed(1),
                    formattedAmount: parseFloat(entity.total_amount).toLocaleString('fr-FR')
                }));
                setEntityPerformance(enhancedEntities);
            }

            const presentations = await fetchData('/by-presentation');
            if (presentations) {
                const enhancedPresentations = presentations.map(p => ({
                    ...p,
                    level: p.presentation.includes('Entier') ? 'Niveau 0' :
                           p.presentation.includes('Éviscéré') ? 'Niveau 1' : 'Niveau 2',
                    percentage: 0 
                }));
                
                const totalWeight = enhancedPresentations.reduce((sum, p) => sum + parseFloat(p.total_weight), 0);
                enhancedPresentations.forEach(p => {
                    p.percentage = ((parseFloat(p.total_weight) / totalWeight) * 100).toFixed(1);
                });
                
                setPresentationBreakdown(enhancedPresentations);
            }

            const status = await fetchData('/by-status');
            if (status) setStatusDistribution(status);

            const summary = await fetchData('/summary');
            if (summary && monthly && entities) {
                const avgOrderValue = parseFloat(summary.montant_total) / parseFloat(summary.nb_factures);
                const avgKgPerOrder = parseFloat(summary.quantite_totale) / parseFloat(summary.nb_factures);
                const avgPricePerKg = parseFloat(summary.montant_total) / parseFloat(summary.quantite_totale);
                
                setKpiData({
                    avgOrderValue: avgOrderValue.toFixed(2),
                    avgKgPerOrder: avgKgPerOrder.toFixed(2),
                    avgPricePerKg: avgPricePerKg.toFixed(2),
                    topClient: entities[0]?.name || 'N/A',
                    totalOrders: summary.nb_factures,
                    totalRevenue: parseFloat(summary.montant_total).toLocaleString('fr-FR')
                });
            }

        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    const handlePaymentClick = async (method) => {
        if (selectedPaymentMethod === method) {
            setSelectedPaymentMethod(null);
            setDetailData([]);
            return;
        }

        setSelectedPaymentMethod(method);
        const details = await fetchData(`/details-payment-method?method=${encodeURIComponent(method)}`);
        
        const formatted = details.map(item => {
            const keys = Object.keys(item);
            return {
                detailKey: item[keys[0]],
                value: Number(item[keys[1]]),
            };
        });

        setDetailData(formatted || []);
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
            {/* Header with KPIs */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Tableau de Bord Analytique</h2>
                    <p className="text-gray-600 mt-1">Analyses détaillées et tendances du marché</p>
                </div>
                <div className="flex space-x-3">
                    <select 
                        value={selectedTimeframe}
                        onChange={e => setSelectedTimeframe(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Toutes périodes</option>
                        <option value="6m">6 derniers mois</option>
                        <option value="3m">3 derniers mois</option>
                        <option value="1m">Dernier mois</option>
                    </select>
                    <button
                        onClick={loadAnalyticsData}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>Actualiser</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Commande Moyenne</p>
                            <p className="text-2xl font-bold">{kpiData.avgOrderValue}€</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm">Poids Moyen/Commande</p>
                            <p className="text-2xl font-bold">{kpiData.avgKgPerOrder} kg</p>
                        </div>
                        <Package className="h-8 w-8 text-emerald-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Prix Moyen/kg</p>
                            <p className="text-2xl font-bold">{kpiData.avgPricePerKg}€</p>
                        </div>
                        <Fish className="h-8 w-8 text-purple-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Meilleur Client</p>
                            <p className="text-lg font-bold truncate">{kpiData.topClient}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {error && <ErrorMessage message={error} onRetry={loadAnalyticsData} />}

            {/* Enhanced Monthly Trends Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                    Évolution Mensuelle des Ventes
                </h3>
                {loading ? <LoadingSpinner /> : (
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={monthlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="monthName" angle={-45} textAnchor="end" height={80} />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="total_weight" 
                                stroke="#6366f1" 
                                fill="#6366f1" 
                                fillOpacity={0.3}
                                name="Poids Total (kg)"
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="growth" 
                                stroke="#f59e0b" 
                                strokeWidth={3}
                                name="Croissance (%)"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Entity Performance & Market Share */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance par Client</h3>
                    {loading ? <LoadingSpinner /> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={entityPerformance.slice(0, 8)} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip 
                                    formatter={(value) => [`${value.toLocaleString('fr-FR')}€`, 'Chiffre d\'affaires']}
                                />
                                <Bar dataKey="total_amount" fill="#6366f1">
                                    {entityPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Parts de Marché</h3>
                    {loading ? <LoadingSpinner /> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={entityPerformance.slice(0, 6)}
                                    dataKey="total_amount"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ marketShare }) => `${marketShare}%`}
                                >
                                    {entityPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR')}€`]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Processing Level Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                    Analyse par Niveau de Transformation
                </h3>
                {loading ? <LoadingSpinner /> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={presentationBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="presentation" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total_weight" name="Poids (kg)">
                                    {presentationBreakdown.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.level === 'Niveau 0' ? '#22c55e' : 
                                                  entry.level === 'Niveau 1' ? '#f59e0b' : '#ef4444'} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-700">Répartition par Niveau</h4>
                            {presentationBreakdown.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div 
                                            className="w-4 h-4 rounded-full"
                                            style={{
                                                backgroundColor: item.level === 'Niveau 0' ? '#22c55e' : 
                                                                item.level === 'Niveau 1' ? '#f59e0b' : '#ef4444'
                                            }}
                                        />
                                        <span className="text-sm font-medium">{item.presentation}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold">{item.percentage}%</div>
                                        <div className="text-xs text-gray-500">{parseFloat(item.total_weight).toLocaleString('fr-FR')} kg</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Existing Payment Methods Section - Enhanced */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    Méthodes de Paiement
                </h3>
                {loading ? <LoadingSpinner /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {paymentData.map((payment, index) => {
                                const isSelected = selectedPaymentMethod === payment.payment_method;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handlePaymentClick(payment.payment_method)}
                                        className={`cursor-pointer p-6 rounded-lg border transition-all duration-300
                                            ${isSelected
                                                ? 'bg-indigo-100 border-indigo-500 shadow-lg scale-105 transform'
                                                : 'bg-gray-50 border-gray-200 hover:shadow-md hover:bg-indigo-50'
                                            }
                                        `}
                                    >
                                        <div className="text-2xl font-bold text-indigo-700 mb-2">{payment.count}</div>
                                        <div className="text-gray-800 font-semibold capitalize">{payment.payment_method}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={paymentData}
                                    dataKey="count"
                                    nameKey="payment_method"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {paymentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Payment Details */}
                {selectedPaymentMethod && detailData.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Détails : {selectedPaymentMethod}
                        </h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={detailData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="detailKey" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Top Fish Section - Enhanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Fish className="h-5 w-5 text-blue-600 mr-2" />
                        Top Espèces
                    </h3>
                    {loadingFish ? <LoadingSpinner /> : (
                        <div className="space-y-3">
                            {topFishData.slice(0, 8).map((fish, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-gray-700">{fish.species}</span>
                                    </div>
                                    <span className="text-blue-600 font-semibold">
                                        {parseFloat(fish.total_weight).toLocaleString('fr-FR')} kg
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                        Statut des Factures
                    </h3>
                    {loading ? <LoadingSpinner /> : (
                        <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {statusDistribution.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={
                                                    entry.status === 'validée' ? '#22c55e' :
                                                    entry.status === 'controlée' ? '#f59e0b' :
                                                    entry.status === 'en attente' ? '#6b7280' : '#ef4444'
                                                } 
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-2">
                                {statusDistribution.map((status, index) => (
                                    <div key={index} className="text-center p-2 bg-gray-50 rounded">
                                        <div className="text-sm font-semibold capitalize">{status.status}</div>
                                        <div className="text-lg text-gray-600">{status.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;