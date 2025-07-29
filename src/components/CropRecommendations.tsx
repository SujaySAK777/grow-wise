import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Thermometer, Droplets, Beaker, CloudRain, Sparkles } from "lucide-react";

interface SoilData {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

interface Crop {
  name: string;
  status: string;
  icon: string;
}

interface CropRecommendationsProps {
  onBack: () => void;
  onCropSelect: (crop: Crop) => void;
}

const CropRecommendations = ({ onBack, onCropSelect }: CropRecommendationsProps) => {
  const [formData, setFormData] = useState<SoilData>({
    N: 90,
    P: 42,
    K: 43,
    temperature: 28,
    humidity: 65,
    ph: 7.2,
    rainfall: 120,
  });

  const [recommendedCrops, setRecommendedCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof SoilData, value: string) => {
    const numValue = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setRecommendedCrops([]);

    try {
      const response = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setRecommendedCrops(result.crops);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message || "Error connecting to server");
    }

    setLoading(false);
  };

  const inputFields = [
    {
      key: "N" as keyof SoilData,
      label: "Nitrogen (N)",
      unit: "mg/kg",
      icon: <Leaf className="w-5 h-5 text-green-600" />,
      description: "Essential for leaf growth and chlorophyll production",
      placeholder: "e.g., 90",
    },
    {
      key: "P" as keyof SoilData,
      label: "Phosphorus (P)",
      unit: "mg/kg",
      icon: <Beaker className="w-5 h-5 text-purple-600" />,
      description: "Important for root development and flowering",
      placeholder: "e.g., 42",
    },
    {
      key: "K" as keyof SoilData,
      label: "Potassium (K)",
      unit: "mg/kg",
      icon: <Beaker className="w-5 h-5 text-orange-600" />,
      description: "Helps with disease resistance and fruit quality",
      placeholder: "e.g., 43",
    },
    {
      key: "temperature" as keyof SoilData,
      label: "Temperature",
      unit: "°C",
      icon: <Thermometer className="w-5 h-5 text-red-600" />,
      description: "Average temperature in your area",
      placeholder: "e.g., 28",
    },
    {
      key: "humidity" as keyof SoilData,
      label: "Humidity",
      unit: "%",
      icon: <Droplets className="w-5 h-5 text-blue-600" />,
      description: "Relative humidity percentage",
      placeholder: "e.g., 65",
    },
    {
      key: "ph" as keyof SoilData,
      label: "pH Level",
      unit: "",
      icon: <Beaker className="w-5 h-5 text-cyan-600" />,
      description: "Soil acidity/alkalinity (7 is neutral)",
      placeholder: "e.g., 7.2",
    },
    {
      key: "rainfall" as keyof SoilData,
      label: "Rainfall",
      unit: "mm",
      icon: <CloudRain className="w-5 h-5 text-indigo-600" />,
      description: "Annual rainfall in your area",
      placeholder: "e.g., 120",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Crop Recommendation System
        </h2>
        <p className="text-xl text-gray-600">
          Provide your soil test results and local conditions to get the best crops to grow
        </p>
      </div>

      <Card className="border-2 border-green-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <span>Soil & Environmental Parameters</span>
          </CardTitle>
          <CardDescription>
            Enter values from your soil test report and local weather data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {inputFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label className="flex items-center space-x-2 text-sm font-medium">
                    {field.icon}
                    <span>{field.label}</span>
                    {field.unit && <span className="text-gray-500">({field.unit})</span>}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="h-12 border-gray-300"
                  />
                  <p className="text-xs text-gray-500">{field.description}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" onClick={onBack} className="px-6 py-3">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {loading ? "Loading..." : "Get Crop Recommendations"}
              </Button>
            </div>

            {error && (
              <div className="text-red-600 text-sm pt-4 text-center">
                ⚠️ {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {recommendedCrops.length > 0 && (
        <Card className="shadow-md border-2 border-emerald-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-emerald-700">
              <Sparkles className="w-6 h-6" />
              <span>Recommended Crops</span>
            </CardTitle>
            <CardDescription>Top 3 crops suitable for your input</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            {recommendedCrops.map((crop, index) => (
              <div
                key={index}
                className="bg-emerald-50 p-4 rounded-lg text-center shadow-sm border flex flex-col items-center justify-between space-y-2"
              >
                <div className="text-3xl">{crop.icon}</div>
                <h4 className="text-lg font-semibold capitalize">{crop.name}</h4>
                <p className="text-sm text-emerald-600">Suitability: {crop.status}</p>

                <Button
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm rounded-md"
                  onClick={() => onCropSelect(crop)}
                >
                  🔍 Check Yield Prediction
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropRecommendations;
