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
    const temp = weatherData.main.temp;

    let weatherType;

    // Prioridad: temperatura primero
    if (temp < 0) {
      weatherType = "snowy";
    } else if (temp > 20) {
      weatherType = "hot";
    } else {
      // Si la temperatura está entre 0 y 20, usar la condición del clima
      switch (condition) {
        case "clear":
          weatherType = "sunny";
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
          weatherType = "snowy";
          break;
        case "mist":
        case "fog":
          weatherType = "cloudy";
          break;
        default:
          weatherType = "sunny";
      }
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
      <footer
        className="mt-10 mb-16 footer-description text-center"
        style={{ marginBottom: "80px" }}
      >
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
