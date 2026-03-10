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

  const sorted = [...hourly].sort((a, b) => a.dt - b.dt);
  const nowTs = Date.now() / 1000;
  const currentIdx = sorted.reduce((best, e, i) =>
    Math.abs(e.dt - nowTs) < Math.abs(sorted[best].dt - nowTs) ? i : best, 0);

  return (
    <div className="container hourly-container">
      <p className="section-title">{lang === "es" ? "Por hora" : "Hourly"}</p>

      <div className="hourly-track">
        <div className="hourly-scroll">
          {sorted.map((entry, i) => (
            <div key={entry.dt} className={`hourly-item${i === currentIdx ? " hourly-item--now" : ""}`}>
              <span className="hourly-time">
                {i === currentIdx
                  ? (lang === "es" ? "Ahora" : "Now")
                  : formatHour(entry.dt, lang)}
              </span>
              <div className="hourly-icon">{getWeatherIcon(entry.weather[0].main, 26)}</div>
              {entry.pop > 0 && (
                <span className="hourly-pop">
                  <svg width="6" height="8" viewBox="0 0 7 9" fill="currentColor" style={{ marginRight: 2, verticalAlign: "middle" }}>
                    <path d="M3.5 0 C3.5 0 0 4.5 0 6.2 A3.5 3.5 0 0 0 7 6.2 C7 4.5 3.5 0 3.5 0Z" />
                  </svg>
                  {Math.round(entry.pop * 100)}%
                </span>
              )}
              <span className="hourly-temp">{Math.round(entry.main.temp)}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
