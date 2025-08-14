import Search from "./components/Search";
import { useCallback, useState, useEffect } from "react";
import getWeatherIcon from "./components/IconWeather.js";
import { useLang } from "./components/LangContext";

const WeatherApp = ({ setWeatherData }) => {
  const { t, lang } = useLang();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleSearch = useCallback(
    async (cityQuery) => {
      try {
        setCity(cityQuery);

        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=1&appid=${
            import.meta.env.VITE_API_KEY
          }`
        );

        const geoData = await geoRes.json();
        if (!geoData.length) throw new Error("city not found");

        const { lat, lon } = geoData[0];

        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
            import.meta.env.VITE_API_KEY
          }&units=metric&lang=${lang}`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
        setWeatherData(weatherData);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${
            import.meta.env.VITE_API_KEY
          }&units=metric&lang=${lang}`
        );
        const forecastData = await forecastRes.json();

        const dailyForecast = forecastData.list
          .filter((_, i) => i % 8 === 0)
          .map((item) => ({
            date: item.dt_txt.split(" ")[0],
            temp: Math.round(item.main.temp),
            description: item.weather[0].description,
            weatherMain: item.weather[0].main,
          }));

        setForecast(dailyForecast);
      } catch (err) {
        console.error("Error:", err);
        setWeather(null);
        setForecast([]);
      }
    },
    [lang, setWeatherData]
  );

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      handleSearch(savedCity);
    }
  }, [handleSearch]);

  useEffect(() => {
    if (city) {
      localStorage.setItem("lastCity", city);
    }
  }, [city]);

  const formatDateLabel = (dateString) => {
    const forecastDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const normalizeDate = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const normalizedForecastDate = normalizeDate(forecastDate);
    const normalizedToday = normalizeDate(today);
    const normalizedTomorrow = normalizeDate(tomorrow);

    if (normalizedForecastDate.getTime() === normalizedToday.getTime()) {
      return t.today;
    } else if (
      normalizedForecastDate.getTime() === normalizedTomorrow.getTime()
    ) {
      return t.tomorrow;
    } else {
      const options = { weekday: "long" };
      return forecastDate.toLocaleDateString(
        lang === "en" ? "en-US" : "es-ES",
        options
      );
    }
  };

  return (
    <div>
      <Search onSearch={handleSearch} placeholder={t.writeCity} />
      {weather && (
        <div className="weather-card">
          {getWeatherIcon(weather.weather[0].main)}
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(0, 0, 0, 0.85)",
              borderRadius: "8px",
              display: "block",
              color: "white",
            }}
          >
            {weather.name}
          </h2>
          <p
            style={{
              textTransform: "capitalize",
              marginTop: "8px",
              textShadow: "0 0 6px rgba(0, 0, 0, 0.8)",
              borderRadius: "6px",
              display: "block",
              color: "white",
            }}
          >
            {weather.weather[0].description}
          </p>
          <p
            style={{
              fontSize: "55px",
              fontWeight: "900",
              marginTop: "16px",
              textShadow: "0 0 10px rgba(0, 0, 0, 0.9)",
              borderRadius: "10px",
              display: "block",
              color: "white",
            }}
          >
            {Math.round(weather.main.temp)}°C
          </p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-grid">
          {forecast.map(({ date, temp, description, weatherMain }) => (
            <div key={date} className="weather-card">
              {getWeatherIcon(weatherMain)}
              <p
                style={{
                  fontWeight: "600",
                  fontSize: "18px",
                  textShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                }}
              >
                {formatDateLabel(date)}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textShadow: "0 0 8px rgba(0, 0, 0, 0.9)",
                }}
              >
                {temp}°C
              </p>
              <p
                style={{
                  textTransform: "capitalize",
                  marginTop: "6px",
                  textShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
