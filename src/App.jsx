import { useState } from "react";
import WeatherApp from "./WeatherApp";
import BackgroundWrapper from "./components/BackgroundWrapper";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { LangProvider, useLang } from "./components/LangContext";
import "./App.css";

const AppContent = () => {
  const { lang, switchLang } = useLang();
  const [weatherData, setWeatherData] = useState(null);

  const getWeatherType = (weatherData) => {
    if (!weatherData) return "sunny";

    const condition = weatherData.weather[0].main.toLowerCase();
    const temp = weatherData.main.temp;

    switch (condition) {
      case "clear":
        return temp > 25 ? "hot" : "sunny";
      case "clouds":
        return "cloudy";
      case "rain":
      case "drizzle":
        return "rainy";
      case "thunderstorm":
        return "stormy";
      case "snow":
        return temp < 5 ? "cold" : "snowy";
      case "mist":
      case "fog":
        return "cloudy";
      default:
        return "sunny";
    }
  };

  return (
    <BackgroundWrapper weatherType={getWeatherType(weatherData)}>
      <LanguageSwitcher currentLanguage={lang} onChangeLanguage={switchLang} />
      <br />
      <WeatherApp setWeatherData={setWeatherData} />
      <footer className="footer">Hecho con ☁️ por Claudia Orostica</footer>
    </BackgroundWrapper>
  );
};

function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}

export default App;
