import { useState, useEffect } from 'react';
import { RefreshCw, Ship, FileText } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Boats = () => {
  const { fetchData, loading, error } = useAPI();
  const [boatsData, setBoatsData] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [errorInvoices, setErrorInvoices] = useState(null);

  useEffect(() => {
    loadBoatsData();
  }, []);

  const loadBoatsData = async () => {
    const boats = await fetchData('/by-boat');
    if (boats) setBoatsData(boats);
  };

  const loadInvoices = async (boatName) => {
    setLoadingInvoices(true);
    setErrorInvoices(null);
    setInvoices([]); // Reset avant chargement

    try {
      const response = await fetch(`http://localhost:3000/api/stats/bills-by-boat?boat=${encodeURIComponent(boatName)}`);
      if (!response.ok) {
        throw new Error('Erreur réseau ou serveur');
      }
      const data = await response.json();
      setInvoices(data); // Remplace la liste des factures
    } catch (error) {
      setErrorInvoices(error.message);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleBoatClick = (boatName) => {
    if (selectedBoat === boatName) {
      setSelectedBoat(null);
      setInvoices([]);
    } else {
      setSelectedBoat(boatName);
      loadInvoices(boatName);
    }
  };

  const filteredBoats = boatsData.filter(boat =>
    boat.boat && boat.boat.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Flotte de Bateaux</h2>
        <button
          onClick={loadBoatsData}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Actualiser</span>
        </button>
      </div>

      <input
        type="text"
        placeholder="Filtrer par nom de bateau..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full p-3 mb-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      {error && <ErrorMessage message={error} onRetry={loadBoatsData} />}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Activité par Bateau</h3>

        {loading ? (
          <LoadingSpinner />
        ) : filteredBoats.length === 0 ? (
          <p className="text-gray-500">Aucun bateau trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoats.map((boat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-cyan-50 to-blue-100 p-6 rounded-xl border border-cyan-200 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => handleBoatClick(boat.boat)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Ship className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{boat.boat}</h4>
                    <p className="text-sm text-gray-600">Bateau de pêche</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Factures générées</span>
                    <span className="font-semibold text-cyan-600">{boat.nb_factures}</span>
                  </div>
                </div>

                {selectedBoat === boat.boat && (
                  <div className="mt-4 pt-4 border-t border-cyan-200 text-gray-700">
                    <h5 className="font-semibold mb-2 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-cyan-600" />
                      <span>Factures générées :</span>
                    </h5>

                    {loadingInvoices ? (
                      <LoadingSpinner />
                    ) : errorInvoices ? (
                      <p className="text-red-500">{errorInvoices}</p>
                    ) : invoices.length === 0 ? (
                      <p className="text-gray-500">Aucune facture disponible.</p>
                    ) : (
                      <ul className="list-disc list-inside space-y-1 max-h-40 overflow-auto">
                        {invoices.map((facture) => (
                          <li key={facture.bill_id} className="text-sm">
                            <span className="font-semibold capitalize">{facture.type}</span> —{' '}
                            {facture.billing_date ? new Date(facture.billing_date).toLocaleDateString() : 'Date non précisée'} —{' '}
                            <span className="text-cyan-600 font-semibold">{facture.total} €</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Boats;