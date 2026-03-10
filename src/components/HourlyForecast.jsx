import { memo } from "react";
import { useLang } from "./useLang";

const formatHour = (timestamp, lang) =>
  new Date(timestamp * 1000).toLocaleTimeString(
    lang === "es" ? "es-ES" : "en-US",
    { hour: "2-digit", minute: "2-digit" }
  );

export const HourlyForecast = memo(function HourlyForecast({ hourly, getWeatherIcon }) {
  const { lang } = useLang();
  if (!hourly?.length) return null;

  return (
    <div className="container">
      <p className="section-title">{lang === "es" ? "Por hora" : "Hourly"}</p>
      <div className="hourly-scroll">
        {hourly.map((entry) => (
          <div key={entry.dt} className="hourly-item">
            <span className="hourly-time">{formatHour(entry.dt, lang)}</span>
            <div className="hourly-icon">{getWeatherIcon(entry.weather[0].main, 26)}</div>
            {entry.pop > 0 && (
              <span className="hourly-pop">{Math.round(entry.pop * 100)}%</span>
            )}
            <span className="hourly-temp">{Math.round(entry.main.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
});
