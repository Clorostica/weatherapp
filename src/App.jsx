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

  const currentWeatherType = useMemo(() => {
    if (!weatherData) return "sunny";

    const condition = weatherData.weather[0].main.toLowerCase();
    const temp      = weatherData.main.temp;
    const now       = Date.now() / 1000;
    const sunrise   = weatherData.sys?.sunrise ?? 0;
    const sunset    = weatherData.sys?.sunset  ?? 0;
    const isNight   = sunrise && sunset
      ? (now < sunrise || now > sunset)
      : (new Date().getHours() < 6 || new Date().getHours() >= 20);

    // Night always takes priority when no extreme conditions
    if (isNight && condition !== "thunderstorm" && temp >= 0) return "night";
    if (temp < 0 || condition === "snow")                      return "snowy";
    if (condition === "thunderstorm")                          return "stormy";
    if (condition === "rain" || condition === "drizzle")       return "rainy";
    if (condition === "mist" || condition === "fog" || condition === "haze" || condition === "smoke") return "fog";
    if (temp > 25)                                             return "hot";
    if (condition === "clouds")                                return "cloudy";
    return "sunny";
  }, [weatherData]);

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
