import SensorChart from "./SensorChart";
import ChatBot from "./ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  TestTube,
  Zap,
  TrendingUp,
  Target,
  MessageCircle
} from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface FarmDashboardProps {
  location: LocationData;
  onFindCrops: () => void;
  onPredictYield: () => void;
}

const FarmDashboard = ({ location, onFindCrops, onPredictYield }: FarmDashboardProps) => {
  // Mock sensor data - in real app this would come from your IoT sensors
  const sensorData = {
    soilMoisture: 65,
    temperature: 28,
    soilPH: 7.2,
    nitrogen: 45,
    phosphorus: 38,
    potassium: 52
  };

  const getHealthStatus = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return "good";
    if (value >= optimal[0] - 10 && value <= optimal[1] + 10) return "caution";
    return "attention";
  };

  const statusColors = {
    good: "bg-green-100 text-green-800 border-green-200",
    caution: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    attention: "bg-red-100 text-red-800 border-red-200"
  };

  // Mock chart data for visualizations
  const moistureData = [
    { name: "Mon", value: 62 },
    { name: "Tue", value: 68 },
    { name: "Wed", value: 65 },
    { name: "Thu", value: 70 },
    { name: "Fri", value: 65 },
    { name: "Sat", value: 63 },
    { name: "Sun", value: 65 }
  ];

  const temperatureData = [
    { name: "Mon", value: 26 },
    { name: "Tue", value: 29 },
    { name: "Wed", value: 28 },
    { name: "Thu", value: 31 },
    { name: "Fri", value: 28 },
    { name: "Sat", value: 27 },
    { name: "Sun", value: 28 }
  ];

  return (
    <div className="space-y-8">
      {/* Farm Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Raju! 🌱</h1>
            <div className="flex items-center space-x-2 text-green-100">
              <MapPin className="h-4 w-4" />
              <span>{location.address}</span>
            </div>
            <p className="text-green-100 mt-2">Your farm is performing well today</p>
          </div>
          <div className="text-right">
            <div className="text-green-100 text-sm">Last Updated</div>
            <div className="font-semibold">Just now</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer hover-scale"
              onClick={onFindCrops}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Find Best Crops</CardTitle>
            <CardDescription className="text-gray-600">
              Get AI-powered crop recommendations based on your soil conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
              Get Recommendations
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer hover-scale"
              onClick={onPredictYield}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Predict Yield</CardTitle>
            <CardDescription className="text-gray-600">
              Forecast your crop yield potential with current conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
              Calculate Yield
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-semibold">Soil Moisture</CardTitle>
            <Droplets className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{sensorData.soilMoisture}%</div>
            <Badge className={`mt-2 ${statusColors[getHealthStatus(sensorData.soilMoisture, [60, 80])]}`}>
              {getHealthStatus(sensorData.soilMoisture, [60, 80]) === "good" ? "Optimal" : 
               getHealthStatus(sensorData.soilMoisture, [60, 80]) === "caution" ? "Monitor" : "Action Needed"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-semibold">Temperature</CardTitle>
            <Thermometer className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{sensorData.temperature}°C</div>
            <Badge className={`mt-2 ${statusColors[getHealthStatus(sensorData.temperature, [25, 30])]}`}>
              {getHealthStatus(sensorData.temperature, [25, 30]) === "good" ? "Perfect" : 
               getHealthStatus(sensorData.temperature, [25, 30]) === "caution" ? "Warm" : "Too Hot"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-semibold">Soil pH</CardTitle>
            <TestTube className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{sensorData.soilPH}</div>
            <Badge className={`mt-2 ${statusColors[getHealthStatus(sensorData.soilPH, [6.5, 7.5])]}`}>
              {getHealthStatus(sensorData.soilPH, [6.5, 7.5]) === "good" ? "Balanced" : 
               getHealthStatus(sensorData.soilPH, [6.5, 7.5]) === "caution" ? "Slightly Off" : "Adjust Needed"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* NPK Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span>Soil Nutrients (NPK)</span>
          </CardTitle>
          <CardDescription>Essential nutrients for healthy crop growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sensorData.nitrogen}%</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Nitrogen (N)</div>
              <div className="text-xs text-gray-500">Primary growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sensorData.phosphorus}%</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Phosphorus (P)</div>
              <div className="text-xs text-gray-500">Root development</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{sensorData.potassium}%</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Potassium (K)</div>
              <div className="text-xs text-gray-500">Disease resistance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SensorChart
          title="Soil Moisture Trend"
          data={moistureData}
          color="#3b82f6"
          unit="%"
        />
        <SensorChart
          title="Temperature Trend"
          data={temperatureData}
          color="#f59e0b"
          unit="°C"
        />
      </div>
    </div>
  );
};

export default FarmDashboard;
