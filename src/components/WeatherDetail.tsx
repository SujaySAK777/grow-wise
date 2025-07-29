import React, { useEffect, useState } from "react";
import axios from "axios";

interface ForecastItem {
  time: string;
  temp: number;
  rain: number;
  condition: string;
  alert: string;
}

interface ForecastByDate {
  [date: string]: ForecastItem[];
}

const WeatherDetail = () => {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState<ForecastByDate>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/weather");
        const { city, forecast: rawForecast } = res.data;

        const grouped: ForecastByDate = {};
        rawForecast.forEach((item: ForecastItem) => {
          const date = item.time.split(" ")[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(item);
        });

        setCity(city);
        setForecast(grouped);
        setLoading(false);
      } catch (err) {
        console.error("Weather fetch failed", err);
        setError("Failed to load weather data.");
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getRainColor = (mm: number) => {
    if (mm > 115) return "text-red-600 font-semibold";
    if (mm > 64.5) return "text-orange-500 font-semibold";
    if (mm > 20) return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-10 text-center">
          🌦️ Weather Forecast for <span className="text-blue-700">{city}</span>
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading forecast...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : Object.keys(forecast).length === 0 ? (
          <p className="text-center text-gray-600">No forecast data available.</p>
        ) : (
          Object.entries(forecast).map(([date, items]) => (
            <div key={date} className="mb-12">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4 border-b pb-1">
                📅 {date}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition duration-200"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        ⏰ {item.time.split(" ")[1]}
                      </span>
                      {item.alert && (
                        <span className="text-sm text-red-600 font-medium">
                          {item.alert}
                        </span>
                      )}
                    </div>

                    <p className="text-xl font-bold text-blue-700 mb-1">
                      🌡️ {item.temp}°C
                    </p>
                    <p className={`text-sm ${getRainColor(item.rain)}`}>
                      ☔ Rainfall: {item.rain} mm
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      🌥️ {item.condition}
                    </p>
                  </div>

                ))}
              </div>
            </div>
          ))
        )}
        <div className="text-center mt-10">
  <a
    href="/"
    className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
  >
    ← Back to Dashboard
  </a>
</div>

      </div>
    </div>
    
  );
};

export default WeatherDetail;
