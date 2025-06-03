import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Fish } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAPI from '../hooks/useAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SpeciesTab = () => {
    const { fetchData, loading, error } = useAPI();
    const [speciesData, setSpeciesData] = useState([]);
    const [presentationData, setPresentationData] = useState([]);

    const [filterSearch, setFilterSearch] = useState('');
    const [filterPoidsMin, setFilterPoidsMin] = useState('');
    const [filterPoidsMax, setFilterPoidsMax] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        loadSpeciesData();
    }, []);

    const loadSpeciesData = async () => {
        const species = await fetchData('/by-species');
        const presentation = await fetchData('/by-presentation');

        if (species) setSpeciesData(species);
        if (presentation) setPresentationData(presentation);
    };

    const filteredSpecies = useMemo(() => {
        return speciesData.filter(species => {
            if (filterSearch && !species.species.toUpperCase().includes(filterSearch.toUpperCase())) {
                return false;
            }
            if (filterPoidsMin && species.total_weight < Number(filterPoidsMin)) {
                return false;
            }
            if (filterPoidsMax && species.total_weight > Number(filterPoidsMax)) {
                return false;
            }
            return true;
        });
    }, [speciesData, filterSearch, filterPoidsMin, filterPoidsMax]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Catalogue Espèces</h2>
                <button
                    onClick={loadSpeciesData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                    <Fish className="h-4 w-4" />
                    <span>Actualiser</span>
                </button>
            </div>

            {error && <ErrorMessage message={error} onRetry={loadSpeciesData} />}

            {/* Filtres */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
                {/* Recherche texte libre */}
                <div className="flex flex-col max-w-sm">
                    <label htmlFor="searchSpecies" className="font-semibold text-gray-700 mb-1">Rechercher une espèce :</label>
                    <input
                        type="text"
                        id="searchSpecies"
                        value={filterSearch}
                        onChange={e => setFilterSearch(e.target.value)}
                        placeholder="Tapez un nom d'espèce..."
                        className="border border-gray-300 rounded-md px-3 py-2 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                </div>

                <div>
                    <label className="font-semibold mr-2">Poids min (kg):</label>
                    <input
                        type="number"
                        value={filterPoidsMin}
                        onChange={e => setFilterPoidsMin(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-20"
                        min={0}
                    />
                </div>

                <div>
                    <label className="font-semibold mr-2">Poids max (kg):</label>
                    <input
                        type="number"
                        value={filterPoidsMax}
                        onChange={e => setFilterPoidsMax(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-20"
                        min={0}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Espèces</h3>
                    {loading ? <LoadingSpinner /> : (
                        <div className="space-y-4">
                            {filteredSpecies.map((species, index) => (
                                <div key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                                                <Fish className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="font-medium text-gray-700">{species.species}</span>
                                        </div>
                                        <span className="text-purple-600 font-semibold">
                                            {parseFloat(species.total_weight).toLocaleString('fr-FR')} kg
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {filteredSpecies.length === 0 && <p>Aucune espèce ne correspond aux filtres.</p>}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Présentations</h3>
                    {loading ? <LoadingSpinner /> : (
                        <div className="space-y-4">
                            {presentationData.map((presentation, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(`/analytics?presentation=${encodeURIComponent(presentation.presentation)}`)}
                                    className="cursor-pointer bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-100 hover:shadow-md transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">{presentation.presentation}</span>
                                        <span className="text-teal-600 font-semibold">
                                            {parseFloat(presentation.total_weight).toLocaleString('fr-FR')} kg
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpeciesTab;
