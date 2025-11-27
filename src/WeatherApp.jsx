import { useCallback, useState, useEffect, lazy, Suspense } from "react";
import { useLang } from "./components/useLang";
import getWeatherIcon from "./components/IconWeather.js";
import Search from "./components/Search";

const WeatherCard = lazy(() =>
  import("./components/WeatherCard").then((module) => ({
    default: module.WeatherCard,
  }))
);
const ForecastGrid = lazy(() =>
  import("./components/ForecastGrid").then((module) => ({
    default: module.ForecastGrid,
  }))
);
const WeatherRadar = lazy(() => import("./components/WeatherRadar"));

const WeatherApp = ({ setWeatherData }) => {
  const { t, lang } = useLang();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  const handleSearch = useCallback(
    async (cityQuery) => {
      try {
        if (!OPEN_WEATHER_API_KEY) {
          throw new Error("API key no configurada. Verifica tu archivo .env");
        }

        setCity(cityQuery);
        setHasSearched(true);

        const encodedCity = encodeURIComponent(cityQuery.trim());
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCity}&limit=1&appid=${OPEN_WEATHER_API_KEY}`;

        const geoRes = await fetch(geoUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!geoRes.ok) {
          const errorText = await geoRes.text();
          console.error("Error en geocodificación:", geoRes.status, errorText);
          throw new Error(`Error en la geocodificación: ${geoRes.status}`);
        }

        const geoData = await geoRes.json();
        if (!geoData || !geoData.length) {
          throw new Error("Ciudad no encontrada");
        }

        const { lat, lon } = geoData[0];

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=${lang}`;
        const weatherRes = await fetch(weatherUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!weatherRes.ok) {
          const errorText = await weatherRes.text();
          console.error(
            "Error obteniendo clima:",
            weatherRes.status,
            errorText
          );
          throw new Error(`Error obteniendo el clima: ${weatherRes.status}`);
        }

        const weatherData = await weatherRes.json();
        setWeather(weatherData);
        setWeatherData(weatherData);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=${lang}`;
        const forecastRes = await fetch(forecastUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!forecastRes.ok) {
          const errorText = await forecastRes.text();
          console.error(
            "Error obteniendo pronóstico:",
            forecastRes.status,
            errorText
          );
          throw new Error(
            `Error obteniendo el pronóstico: ${forecastRes.status}`
          );
        }

        const forecastData = await forecastRes.json();
        const dailyForecast = forecastData.list
          .filter((_, i) => i % 8 === 0)
          .slice(0, 5)
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
        alert(err.message);
      }
    },
    [lang, setWeatherData, OPEN_WEATHER_API_KEY]
  );

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      setHasSearched(true);
      handleSearch(savedCity);
    }
  }, [handleSearch, OPEN_WEATHER_API_KEY]);

  useEffect(() => {
    if (city) localStorage.setItem("lastCity", city);
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

    if (normalizedForecastDate.getTime() === normalizedToday.getTime())
      return t.today;
    if (normalizedForecastDate.getTime() === normalizedTomorrow.getTime())
      return t.tomorrow;
    return forecastDate.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
      weekday: "long",
    });
  };

  const containerClass = "w-full max-w-[95%] 2xl:max-w-[2000px] mx-auto";

  return (
    <>
      <div className="search-always-full ">
        <Search onSearch={handleSearch} placeholder={t.writeCity} />
      </div>
      <br />

      {hasSearched && weather && (
        <div className={containerClass}>
          <Suspense fallback={<div style={{ minHeight: "200px" }} />}>
            <WeatherCard weather={weather} getWeatherIcon={getWeatherIcon} />
          </Suspense>
        </div>
      )}

      <br />

      {hasSearched && weather?.coord && (
        <div className={containerClass}>
          <Suspense fallback={<div style={{ minHeight: "400px" }} />}>
            <WeatherRadar lat={weather.coord.lat} lon={weather.coord.lon} />
          </Suspense>
        </div>
      )}

      <br />

      {hasSearched && forecast.length > 0 && (
        <div className={containerClass}>
          <Suspense fallback={<div style={{ minHeight: "200px" }} />}>
            <ForecastGrid
              forecast={forecast}
              getWeatherIcon={getWeatherIcon}
              formatDateLabel={formatDateLabel}
            />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default WeatherApp;
