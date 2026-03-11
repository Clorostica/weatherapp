import { useState, memo, useMemo } from "react";
import { LangProvider } from "./components/LangContext";
import WeatherApp from "./WeatherApp";
import BackgroundWrapper from "./components/BackgroundWrapper";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ErrorBoundary from "./components/ErrorBoundary";

import "./App.css";
import "./query.css";

const AppContent = memo(() => {
  const [weatherData, setWeatherData] = useState(null);
  const [savedWeatherType, setSavedWeatherType] = useState(() => {
    const saved = localStorage.getItem("lastWeatherType");
    return saved || "sunny";
  });

  const currentWeatherType = useMemo(() => {
    if (!weatherData) return savedWeatherType;

    const condition = weatherData.weather[0].main.toLowerCase();
    const temp      = weatherData.main.temp;
    const now       = Date.now() / 1000;
    const sunrise   = weatherData.sys?.sunrise ?? 0;
    const sunset    = weatherData.sys?.sunset  ?? 0;
    const isNight   = sunrise && sunset
      ? (now < sunrise || now > sunset)
      : (new Date().getHours() < 6 || new Date().getHours() >= 20);

    let weatherType;

    // Night always takes priority when no extreme conditions
    if (isNight && condition !== "thunderstorm" && temp >= 0) {
      weatherType = "night";
    } else if (temp < 0 || condition === "snow") {
      weatherType = "snowy";
    } else if (condition === "thunderstorm") {
      weatherType = "stormy";
    } else if (condition === "rain" || condition === "drizzle") {
      weatherType = "rainy";
    } else if (condition === "mist" || condition === "fog" || condition === "haze" || condition === "smoke") {
      weatherType = "fog";
    } else if (temp > 25) {
      weatherType = "hot";
    } else if (condition === "clouds") {
      weatherType = "cloudy";
    } else {
      weatherType = "sunny";
    }

    if (weatherType !== savedWeatherType) {
      localStorage.setItem("lastWeatherType", weatherType);
      setSavedWeatherType(weatherType);
    }

    return weatherType;
  }, [weatherData, savedWeatherType]);

  return (
    <BackgroundWrapper weatherType={currentWeatherType}>
      <WeatherApp setWeatherData={setWeatherData} />
      <LanguageSwitcher />
      <footer
        className="footer-description"
        style={{ textAlign: "center", padding: "0 20px 80px" }}
      >
        Created with <span style={{ color: "#9333ea" }}>♥</span> by{" "}
        <a
          href="https://github.com/Clorostica"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#9333ea" }}
        >
          Clorostica
        </a>
      </footer>
    </BackgroundWrapper>
  );
});

function App() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <AppContent />
      </LangProvider>
    </ErrorBoundary>
  );
}

export default App;
