from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import requests
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(".env.local")
API_KEY = os.getenv("WEATHER_API_KEY")

app = Flask(__name__)
CORS(app)

# Load models
crop_model = joblib.load("crop_classifier.pkl")
yield_model = joblib.load("yield1.pkl")
encoder = joblib.load("encoder1.pkl")

crop_labels = crop_model.classes_

# Crop icon mapping
crop_icons = {
    "rice": "🍚", "maize": "🌽", "chickpea": "🌰", "kidneybeans": "🥘",
    "pigeonpeas": "🥜", "mothbeans": "🌾", "mungbean": "🌱", "blackgram": "💅",
    "lentil": "🥣", "pomegranate": "🍎", "banana": "🍌", "mango": "🥭",
    "grapes": "🍇", "watermelon": "🍉", "muskmelon": "🍈", "apple": "🍏",
    "orange": "🍊", "papaya": "🍍", "coconut": "🥥", "cotton": "🤵",
    "jute": "🪢", "coffee": "☕", "potato": "🥔", "onion": "🧅",
    "tomato": "🍅", "broccoli": "🥦", "cabbage": "🥬", "carrot": "🥕",
    "beetroot": "🦒"
}

DEFAULT_YIELD = 25.3  # in tons/ha
DEFAULT_SEASON = "Rabi"
DEFAULT_AREA = 1000  # hectares

@app.route("/", methods=["GET"])
def home():
    return "✅ Crop Recommendation + Yield Prediction API Running"

@app.route("/api/recommend", methods=["POST"])
def recommend_crop_and_yield():
    data = request.json
    try:
        features = [
            data["N"], data["P"], data["K"],
            data["temperature"], data["humidity"],
            data["ph"], data["rainfall"]
        ]
        features_array = np.array([features])
        probabilities = crop_model.predict_proba(features_array)[0]
        top3_indices = probabilities.argsort()[-3:][::-1]

        recommendations = []
        for idx, i in enumerate(top3_indices):
            crop_name = crop_labels[i]
            crop_lower = crop_name.lower().strip()
            icon = crop_icons.get(crop_lower, "🌾")

            try:
                encoded_input = encoder.transform([[DEFAULT_SEASON, crop_lower]])
                final_input = np.hstack((encoded_input.toarray(), [[DEFAULT_AREA]]))
                yield_pred = yield_model.predict(final_input)[0]
                yield_per_ha = yield_pred / DEFAULT_AREA
            except:
                yield_pred = DEFAULT_YIELD
                yield_per_ha = DEFAULT_YIELD

            recommendations.append({
                "name": crop_name,
                "status": ["best", "good", "fair"][idx],
                "icon": icon,
                "yield_total": round(yield_pred, 2),
                "yield_per_ha": round(yield_per_ha, 2)
            })

        return jsonify({"crops": recommendations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/weather", methods=["GET"])
def get_weather():
    try:
        ip_info = requests.get("https://ipinfo.io/json").json()
        loc = ip_info["loc"].split(",")
        city = ip_info["city"]
        now = datetime.now()

        url = "https://api.weatherapi.com/v1/forecast.json"  # ✅ Use HTTPS
        params = {
            "key": API_KEY,
            "q": city,
            "days": 3,
            "aqi": "no",
            "alerts": "no"
        }

        res = requests.get(url, params=params)
        forecast_data = res.json()

        forecast = []
        for day in forecast_data['forecast']['forecastday']:
            for hour in day['hour']:
                forecast_time = datetime.strptime(hour['time'], "%Y-%m-%d %H:%M")
                if forecast_time >= now and forecast_time.hour % 3 == 0:
                    rain_mm = hour['precip_mm']
                    condition = hour['condition']['text']
                    
                    # 🌧️ IMD Alert Logic
                    alert = ""
                    if 64.5 <= rain_mm <= 115.5:
                        alert = "⚠️ Heavy Rainfall Alert (IMD)"
                    elif rain_mm > 115.5:
                        alert = "⚠️ Very Heavy Rainfall Alert (IMD)"
                    elif any(x in condition.lower() for x in ['storm', 'thunder']):
                        alert = "⚠️ Thunderstorm Alert"

                    forecast.append({
                        "time": hour['time'],
                        "temp": hour['temp_c'],
                        "rain": rain_mm,
                        "condition": condition,
                        "alert": alert
                    })

        return jsonify({
            "city": city,
            "forecast": forecast
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
