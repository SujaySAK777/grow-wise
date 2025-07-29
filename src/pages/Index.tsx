import { useState } from "react";
import FarmDashboard from "@/components/FarmDashboard";
import CropRecommendations from "@/components/CropRecommendations";
import YieldPredictor from "@/components/YieldPredictor";
import FloatingChatBot from "@/components/FloatingChatBot";

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Static location info for yield prediction
  const farmLocation = {
    latitude: 12.9716,
    longitude: 77.5946,
    address: "Bangalore Rural, Karnataka, India"
  };

  const handleFindCrops = () => {
    setCurrentView('crops');
  };

  const handlePredictYield = () => {
    // If no crop selected, do nothing (recommend user to select from CropRecommendations)
    if (!selectedCrop) return;
    setCurrentView('yield');
  };

  const handleCropSelect = (crop: any) => {
    setSelectedCrop(crop);
    setCurrentView('yield');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleBackToCrops = () => {
    setCurrentView('crops');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <FarmDashboard 
            location={farmLocation}
            onFindCrops={handleFindCrops}
            onPredictYield={handlePredictYield}
          />
        )}

        {currentView === 'crops' && (
          <CropRecommendations 
            onCropSelect={handleCropSelect}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'yield' && selectedCrop && (
          <YieldPredictor 
            crop={selectedCrop}
            location={farmLocation}
            onBack={handleBackToCrops}
          />
        )}
      </div>

      {/* Floating Chatbot */}
      {currentView === 'yield' && <FloatingChatBot />}
    </div>
  );
};

export default Index;
