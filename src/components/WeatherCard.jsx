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
        {/* Icono con efecto glow */}
        <div className="drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
          {getWeatherIcon(weather.weather[0].main, 120)}
        </div>

        {/* Ciudad */}
        <h1 className="text-5xl font-bold text-white m-0 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          {weather.name}
        </h1>

        {/* Descripción */}
        <p className="capitalize text-xl font-medium text-white/90 m-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          {weather.weather[0].description}
        </p>

        <div className="relative mt-2">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150" />

          <h1 className="relative text-8xl font-black text-white m-0 tracking-tighter leading-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            {Math.round(weather.main.temp)}°C
          </h1>
        </div>

        <div className="flex gap-4 mt-4 w-full max-w-md">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-white/60 text-sm font-medium mb-1">
              {t.humidity}
            </p>
            <p className="text-white text-2xl font-bold">
              {weather.main.humidity}%
            </p>
          </div>

          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-white/60 text-sm font-medium mb-1">{t.wind}</p>
            <p className="text-white text-2xl font-bold">
              {Math.round(weather.wind.speed)} m/s
            </p>
          </div>

          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-white/60 text-sm font-medium mb-1">
              {t.feelsLike}
            </p>
            <p className="text-white text-2xl font-bold">
              {Math.round(weather.main.feels_like)}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
