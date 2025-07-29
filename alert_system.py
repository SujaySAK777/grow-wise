import requests
from datetime import datetime
from colorama import Fore, Style
from dotenv import load_dotenv
import os

# Load from .env.local
load_dotenv(".env.local")

API_KEY = os.getenv("WEATHER_API_KEY")

def get_location_by_ip():
    try:
        ip_info = requests.get("https://ipinfo.io/json").json()
        loc = ip_info["loc"].split(",")
        return float(loc[0]), float(loc[1]), ip_info["city"]
    except Exception as e:
        print(Fore.RED + f"Failed to get location: {e}" + Style.RESET_ALL)
        return None, None, None

def get_weather_forecast_3hr_from_now(city_name):
    try:
        url = "http://api.weatherapi.com/v1/forecast.json"
        params = {
            "key": API_KEY,
            "q": city_name,
            "days": 3,
            "aqi": "no",
            "alerts": "no"
        }

        response = requests.get(url, params=params)
        if response.status_code != 200:
            print(Fore.RED + f"Failed to fetch weather. Status: {response.status_code}" + Style.RESET_ALL)
            return

        data = response.json()
        forecast_days = data['forecast']['forecastday']

        print(f"\n📍 3-Day Forecast for {city_name} (Every 3 Hours From Now):\n")

        now = datetime.now()

        for day in forecast_days:
            date = day['date']
            printed_date_header = False

            for hour_data in day['hour']:
                forecast_time_str = hour_data['time']
                forecast_time = datetime.strptime(forecast_time_str, "%Y-%m-%d %H:%M")

                if forecast_time >= now and forecast_time.hour % 3 == 0:
                    if not printed_date_header:
                        print(Fore.CYAN + f"\n📅 Date: {date}" + Style.RESET_ALL)
                        printed_date_header = True

                    time = forecast_time.strftime("%H:%M")
                    temp = hour_data['temp_c']
                    rain_mm = hour_data['precip_mm']
                    condition = hour_data['condition']['text']

                    # Alerts based on IMD criteria
                    alert = ""
                    if 64.5 <= rain_mm <= 115.5:
                        alert = Fore.RED + "⚠️ Heavy Rainfall Alert (IMD)" + Style.RESET_ALL
                    elif rain_mm > 115.5:
                        alert = Fore.RED + "⚠️ Very Heavy Rainfall Alert (IMD)" + Style.RESET_ALL
                    elif any(x in condition.lower() for x in ['storm', 'thunder']):
                        alert = Fore.YELLOW + "⚠️ Weather Condition Alert" + Style.RESET_ALL

                    print(f"{time} ⏰ | 🌡️ Temp: {temp}°C | ☔ Rain: {rain_mm}mm | 🌥️ {condition} {alert}")

    except Exception as e:
        print(Fore.RED + f"Error: {e}" + Style.RESET_ALL)

def main():
    lat, lon, city = get_location_by_ip()
    if city:
        print(f"\n🧭 Your Approximate Location: {city} ({lat}, {lon})")
        get_weather_forecast_3hr_from_now(city)
    else:
        print("❌ Unable to determine location.")

if __name__ == "__main__":
    main()
