
import { useState } from "react";
import { MapPin, Navigation, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
}

const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualLocation, setManualLocation] = useState("");

  const handleAutoDetect = () => {
    setIsDetecting(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Simulate address lookup
          setTimeout(() => {
            setIsDetecting(false);
            onLocationSelect({
              latitude,
              longitude,
              address: `Field Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
            });
          }, 1500);
        },
        (error) => {
          setIsDetecting(false);
          console.error("Geolocation error:", error);
          // Fallback to demo location
          onLocationSelect({
            latitude: 12.9716,
            longitude: 77.5946,
            address: "Demo Field, Karnataka, India"
          });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setIsDetecting(false);
      // Fallback for browsers without geolocation
      onLocationSelect({
        latitude: 12.9716,
        longitude: 77.5946,
        address: "Demo Field, Karnataka, India"
      });
    }
  };

  const handleManualSubmit = () => {
    if (manualLocation.trim()) {
      // Simulate geocoding for demo
      onLocationSelect({
        latitude: 12.9716,
        longitude: 77.5946,
        address: manualLocation.trim()
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Where is your field?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Let's start by identifying your farm location to provide personalized crop recommendations
          </p>
        </div>
      </div>

      {/* Location Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Auto-detect GPS */}
        <Card className="group relative overflow-hidden border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="text-center relative z-10 pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Navigation className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Auto-Detect Location</CardTitle>
            <CardDescription className="text-lg text-gray-600 leading-relaxed">
              Use GPS to automatically find your current location with precision
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button 
              onClick={handleAutoDetect}
              disabled={isDetecting}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Detecting Location...
                </>
              ) : (
                <>
                  <Navigation className="mr-3 h-6 w-6" />
                  Find My Location
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Input */}
        <Card className="group relative overflow-hidden border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="text-center relative z-10 pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-3">Enter Manually</CardTitle>
            <CardDescription className="text-lg text-gray-600 leading-relaxed">
              Type your village, district, or pin code to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <Input
              placeholder="e.g., Mysore, Karnataka or 570001"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="h-14 text-lg border-2 focus:border-blue-400 transition-colors duration-200"
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <Button 
              onClick={handleManualSubmit}
              disabled={!manualLocation.trim()}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MapPin className="mr-3 h-6 w-6" />
              Use This Location
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-4">Why do we need your location?</h3>
                <ul className="text-gray-700 space-y-3 text-lg">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Get real-time soil and weather data for your area
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Provide crop recommendations specific to your region
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Access local agricultural market information
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationSelector;
