import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface YieldPredictorProps {
  crop: {
    name: string;
    icon: string;
    status: string;
    yield_total: number;
    yield_per_ha: number;
  };
  onBack: () => void;
}

const YieldPredictor: React.FC<YieldPredictorProps> = ({ crop, onBack }) => {
  const [fieldSize, setFieldSize] = useState(1); // in acres
  const navigate = useNavigate();

  const fieldSizeInHa = fieldSize * 0.404686;
  const yieldPerHa = crop.yield_per_ha;
  const totalProduction = yieldPerHa * fieldSizeInHa;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="text-5xl mr-4">{crop.icon}</div>
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-1">{crop.name}</h2>
            <p className="text-gray-600 text-sm uppercase tracking-wide">
              Suitability: <span className="font-semibold text-green-600">{crop.status}</span>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            🌿 Select Field Size (in acres)
          </label>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">0.1 acre</span>
            <span className="text-sm text-gray-700 font-semibold">{fieldSize.toFixed(1)} acres</span>
            <span className="text-sm text-gray-500">10 acres</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={fieldSize}
            onChange={(e) => setFieldSize(parseFloat(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-green-50 p-4 rounded-xl">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
            <p className="text-sm text-gray-500">Estimated Yield per Hectare</p>
            <p className="text-xl font-bold text-green-700">
              {yieldPerHa.toFixed(2)} tons
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
            <p className="text-sm text-gray-500">Total Expected Production</p>
            <p className="text-xl font-bold text-green-800">
              {totalProduction.toFixed(2)} tons
            </p>
            <p className="text-xs text-gray-400 mt-1">({fieldSize} acre ≈ {fieldSizeInHa.toFixed(2)} ha)</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          📊 Based on machine learning prediction model
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
          >
            ← Back to Recommendations
          </button>

          <button
            onClick={() => navigate("/weather-details")}
            className="px-6 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
          >
            📡 Analyze Detailed Weather
          </button>
        </div>
      </div>
    </div>
  );
};

export default YieldPredictor;
