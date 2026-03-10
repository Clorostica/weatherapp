import { useCallback, useState, useEffect, lazy, Suspense } from "react";
import { useLang } from "./components/useLang";
import getWeatherIcon from "./components/IconWeather.js";
import Search from "./components/Search";

const WeatherCard = lazy(() =>
  import("./components/WeatherCard").then((m) => ({ default: m.WeatherCard })),
);
const HourlyForecast = lazy(() =>
  import("./components/HourlyForecast").then((m) => ({
    default: m.HourlyForecast,
  })),
);
const ForecastGrid = lazy(() =>
  import("./components/ForecastGrid").then((m) => ({
    default: m.ForecastGrid,
  })),
);
const AirQuality = lazy(() =>
  import("./components/AirQuality").then((m) => ({ default: m.AirQuality })),
);
const Precipitation = lazy(() =>
  import("./components/Precipitation").then((m) => ({
    default: m.Precipitation,
  })),
);
const WeatherRadar = lazy(() => import("./components/WeatherRadar"));

const WeatherApp = ({ setWeatherData }) => {
  const { t, lang } = useLang();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  const handleSearch = useCallback(
    async (cityQuery) => {
      try {
        if (!OPEN_WEATHER_API_KEY)
          throw new Error("API key no configurada. Verifica tu archivo .env");

        setCity(cityQuery);
        setHasSearched(true);

        const encodedCity = encodeURIComponent(cityQuery.trim());
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCity}&limit=1&appid=${OPEN_WEATHER_API_KEY}`,
          { headers: { Accept: "application/json" } },
        );
        if (!geoRes.ok)
          throw new Error(`Error en la geocodificación: ${geoRes.status}`);
        const geoData = await geoRes.json();
        if (!geoData?.length) throw new Error("Ciudad no encontrada");

        const { lat, lon } = geoData[0];
        const base = "https://api.openweathermap.org/data/2.5";
        const units = `units=metric&lang=${lang}&appid=${OPEN_WEATHER_API_KEY}`;

        const [weatherRes, forecastRes, aqRes] = await Promise.all([
          fetch(`${base}/weather?lat=${lat}&lon=${lon}&${units}`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${base}/forecast?lat=${lat}&lon=${lon}&${units}`, {
            headers: { Accept: "application/json" },
          }),
          fetch(
            `${base}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`,
            { headers: { Accept: "application/json" } },
          ),
        ]);

        if (!weatherRes.ok)
          throw new Error(`Error obteniendo el clima: ${weatherRes.status}`);
        if (!forecastRes.ok)
          throw new Error(
            `Error obteniendo el pronóstico: ${forecastRes.status}`,
          );

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        setWeather(weatherData);
        setWeatherData(weatherData);

        // Hourly — first 12 entries (36 h at 3-h intervals)
        setHourlyForecast(forecastData.list.slice(0, 12));

        // Daily — group by date, real min/max per day
        const dayGroups = {};
        forecastData.list.forEach((item) => {
          const date = item.dt_txt.split(" ")[0];
          if (!dayGroups[date]) dayGroups[date] = [];
          dayGroups[date].push(item);
        });
        const dailyForecast = Object.keys(dayGroups)
          .slice(0, 5)
          .map((date) => {
            const items = dayGroups[date];
            const temps = items.map((i) => i.main.temp);
            const rep =
              items.find((i) => i.dt_txt.includes("12:00:00")) ||
              items[Math.floor(items.length / 2)];
            return {
              date,
              tempMin: Math.round(Math.min(...temps)),
              tempMax: Math.round(Math.max(...temps)),
              description: rep.weather[0].description,
              weatherMain: rep.weather[0].main,
            };
          });
        setForecast(dailyForecast);

        // Air quality (non-blocking)
        if (aqRes.ok) {
          const aqData = await aqRes.json();
          if (aqData?.list?.[0]) {
            setAirQuality({
              aqi: aqData.list[0].main.aqi,
              components: aqData.list[0].components,
            });
          }
        } else {
          setAirQuality(null);
        }
      } catch (err) {
        console.error("Error:", err);
        setWeather(null);
        setForecast([]);
        setHourlyForecast([]);
        setAirQuality(null);
        alert(err.message);
      }
    },
    [lang, setWeatherData, OPEN_WEATHER_API_KEY],
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
    const norm = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (norm(forecastDate).getTime() === norm(today).getTime()) return t.today;
    if (norm(forecastDate).getTime() === norm(tomorrow).getTime())
      return t.tomorrow;
    return forecastDate.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
      weekday: "short",
    });
  };

  return (
    <div className="app-layout">
      <div className="search-always-full">
        <Search onSearch={handleSearch} placeholder={t.writeCity} />
      </div>

      {/* ── Current weather ── */}
      {hasSearched && weather && (
        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <WeatherCard weather={weather} getWeatherIcon={getWeatherIcon} />
        </Suspense>
      )}

      {/* ── Hourly strip ── */}
      {hasSearched && hourlyForecast.length > 0 && (
        <div className="hourly-outer">
          <Suspense fallback={<div style={{ minHeight: 80 }} />}>
            <HourlyForecast
              hourly={hourlyForecast}
              getWeatherIcon={getWeatherIcon}
            />
          </Suspense>
        </div>
      )}

      {/* ── Three-column section ── */}
      {hasSearched && forecast.length > 0 && (
        <div className="three-col-grid">
          <Suspense fallback={<div style={{ minHeight: 200 }} />}>
            <div className="container">
              <ForecastGrid
                forecast={forecast}
                getWeatherIcon={getWeatherIcon}
                formatDateLabel={formatDateLabel}
              />
            </div>
          </Suspense>

          <Suspense fallback={<div style={{ minHeight: 200 }} />}>
            <div className="container">
              <AirQuality airQuality={airQuality} />
            </div>
          </Suspense>

          <Suspense fallback={<div style={{ minHeight: 200 }} />}>
            <div className="container">
              <Precipitation hourly={hourlyForecast} />
            </div>
          </Suspense>
        </div>
      )}

      {/* ── Radar ── */}
      {hasSearched && weather?.coord && (
        <div className="radar-outer">
          <Suspense fallback={<div style={{ minHeight: 400 }} />}>
            <WeatherRadar lat={weather.coord.lat} lon={weather.coord.lon} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
