import requests
from datetime import datetime
from colorama import Fore, Style

def get_location_by_ip():
    try:
        ip_info = requests.get("https://ipinfo.io/json").json()
        loc = ip_info["loc"].split(",")
        return float(loc[0]), float(loc[1]), ip_info["city"]
    except Exception as e:
        print(Fore.RED + f"Failed to get location: {e}" + Style.RESET_ALL)
        return None, None, None

def get_weather_forecast(lat, lon, city_name):
    try:
        url = f"https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
            "timezone": "auto"
        }

        response = requests.get(url, params=params)
        if response.status_code != 200:
            print(Fore.RED + f"Failed to fetch weather. Status: {response.status_code}" + Style.RESET_ALL)
            return

        data = response.json()
        daily = data['daily']

        print(f"\n📍 5-Day Forecast for {city_name}:\n")
        for i in range(len(daily['time'])):
            date = daily['time'][i]
            max_temp = daily['temperature_2m_max'][i]
            min_temp = daily['temperature_2m_min'][i]
            rain = daily['precipitation_sum'][i]
            weather_code = daily['weathercode'][i]

            alert = ""
            if rain > 20 or weather_code in [61, 63, 65, 95, 96, 99]:
                alert = Fore.RED + "⚠️ Storm/Rain Alert" + Style.RESET_ALL

            print(f"{date}: 🌞 Max: {max_temp}°C | 🌙 Min: {min_temp}°C | ☔️ Rain: {rain}mm {alert}")

    except Exception as e:
        print(Fore.RED + f"Error: {e}" + Style.RESET_ALL)

def main():
    lat, lon, city = get_location_by_ip()
    if lat and lon:
        print(f"\n🧭 Your Approximate Location: {city} ({lat}, {lon})")
        get_weather_forecast(lat, lon, city)
    else:
        print("❌ Unable to determine location.")

if __name__ == "__main__":
    main()
