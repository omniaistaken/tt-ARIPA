import React from 'react';

const StatsCard = ({ icon: Icon, label, value, subtext, color = 'blue', loading = false, onClick}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-indigo-500 to-purple-500',
    orange: 'from-orange-500 to-amber-500'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-pulse">
        <div className="bg-gray-300 p-6 h-24"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm font-medium">{label}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
          </div>
          <Icon className="h-10 w-10 text-white/80" />
        </div>
      </div>
      {subtext && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
          <span className="text-sm text-gray-600">{subtext}</span>
        </div>
      )}
    </div>
  );
};
export default StatsCard;