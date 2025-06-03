import { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Filter } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SalesTab = () => {
    const { fetchData, loading, error } = useAPI();
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        loadSalesData();
    }, []);

    const loadSalesData = async () => {
        const monthly = await fetchData('/by-month');
        const status = await fetchData('/by-status');

        if (monthly) setMonthlyData(monthly);
        if (status) setStatusData(status);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Analyse des Ventes</h2>
                <button
                    onClick={loadSalesData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Actualiser</span>
                </button>
            </div>

            {error && <ErrorMessage message={error} onRetry={loadSalesData} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Évolution Mensuelle
                    </h3>
                    {loading ? <LoadingSpinner /> : (
                        <div className="space-y-3">
                            {monthlyData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                                    <span className="font-medium text-gray-700">{item.month}</span>
                                    <span className="text-blue-600 font-semibold">
                                        {parseFloat(item.total_weight).toLocaleString('fr-FR')} kg
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-green-600" />
                        Statut des Factures
                    </h3>
                    {loading ? <LoadingSpinner /> : (
                        <div className="space-y-3">
                            {statusData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                    <span className="font-medium text-gray-700 capitalize">{item.status}</span>
                                    <span className="text-green-600 font-semibold">{item.count} factures</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SalesTab;
