import { memo } from "react";
import { useLang } from "./useLang";

export const WeatherCard = memo(function WeatherCard({
  weather,
  getWeatherIcon,
}) {
  const { t } = useLang();

  if (!weather) return null;

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div className="drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] weather-icon-container">
          {getWeatherIcon(weather.weather[0].main, 120)}
        </div>

        <h1
          className="weather-city-name text-5xl font-bold text-white m-0 tracking-wide"
          style={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {weather.name}
        </h1>

        <p
          className="weather-description capitalize text-xl font-medium text-white/90 m-0"
          style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
        >
          {weather.weather[0].description}
        </p>

        <div className="relative mt-2 weather-temp-container">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150" />
          <h1
            className="relative weather-temp text-8xl font-black text-white m-0 tracking-tighter leading-none"
            style={{ textShadow: "3px 3px 12px rgba(0, 0, 0, 0.85)" }}
          >
            {Math.round(weather.main.temp)}°C
          </h1>
        </div>

        <div className="flex gap-4 mt-4 w-full max-w-md weather-info-cards">
          <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <p
              className="text-white/60 text-sm font-medium mb-1"
              style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
            >
              {t.humidity}
            </p>
            <p
              className="text-white text-2xl font-bold"
              style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
            >
              {weather.main.humidity}%
            </p>
          </div>

          <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <p
              className="text-white/60 text-sm font-medium mb-1"
              style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
            >
              {t.wind}
            </p>
            <p
              className="text-white text-2xl font-bold"
              style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
            >
              {Math.round(weather.wind.speed)} m/s
            </p>
          </div>

          <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <p
              className="text-white/60 text-sm font-medium mb-1"
              style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
            >
              {t.feelsLike}
            </p>
            <p
              className="text-white text-2xl font-bold"
              style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
            >
              {Math.round(weather.main.feels_like)}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
