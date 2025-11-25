import { useState, memo, useMemo } from "react";
import WeatherApp from "./WeatherApp";
import BackgroundWrapper from "./components/BackgroundWrapper";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { LangProvider } from "./components/LangContext";
import ErrorBoundary from "./components/ErrorBoundary";

import "./App.css";

const AppContent = memo(() => {
  const [weatherData, setWeatherData] = useState(null);
  const [savedWeatherType, setSavedWeatherType] = useState(() => {
    const saved = localStorage.getItem("lastWeatherType");
    return saved || "sunny";
  });

  const currentWeatherType = useMemo(() => {
    if (!weatherData) return savedWeatherType;

    const condition = weatherData.weather[0].main.toLowerCase();
    const temp = weatherData.main.temp;

    let weatherType;
    switch (condition) {
      case "clear":
        weatherType = temp > 25 ? "hot" : "sunny";
        break;
      case "clouds":
        weatherType = "cloudy";
        break;
      case "rain":
      case "drizzle":
        weatherType = "rainy";
        break;
      case "thunderstorm":
        weatherType = "stormy";
        break;
      case "snow":
        weatherType = temp < 5 ? "cold" : "snowy";
        break;
      case "mist":
      case "fog":
        weatherType = "cloudy";
        break;
      default:
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
      <br />
      <WeatherApp setWeatherData={setWeatherData} />
      <br />
      <footer className="mt-10 footer-description text-center">
        Created with <span style={{ color: "#9333ea" }}>♥</span> by{" "}
        <a
          href="https://github.com/Clorostica"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity no-underline"
          style={{ color: "#9333ea" }}
        >
          Clorostica
        </a>
      </footer>
      <LanguageSwitcher />
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
