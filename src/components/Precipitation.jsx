import { memo } from "react";
import { useLang } from "./useLang";

const formatHour = (timestamp, lang) =>
  new Date(timestamp * 1000).toLocaleTimeString(
    lang === "es" ? "es-ES" : "en-US",
    { hour: "2-digit" }
  );

export const Precipitation = memo(function Precipitation({ hourly }) {
  const { lang } = useLang();
  const isEs = lang === "es";

  if (!hourly?.length) return null;

  const data = hourly.slice(0, 8).map(e => ({
    dt:   e.dt,
    pop:  e.pop  || 0,
    rain: e.rain?.["3h"] || 0,
    snow: e.snow?.["3h"] || 0,
  }));

  const maxPop    = Math.max(...data.map(d => d.pop), 0.01);
  const totalRain = data.reduce((s, d) => s + d.rain, 0);
  const totalSnow = data.reduce((s, d) => s + d.snow, 0);

  return (
    <>
      <p className="section-title">{isEs ? "Precipitación" : "Precipitation"}</p>

      {/* Probability bar chart */}
      <div className="precip-chart">
        {data.map(d => (
          <div key={d.dt} className="precip-col">
            <span className="precip-pop">
              {d.pop > 0 ? `${Math.round(d.pop * 100)}%` : "—"}
            </span>
            <div className="precip-bar-track">
              <div
                className="precip-bar-fill"
                style={{ height: `${(d.pop / maxPop) * 100}%` }}
              />
            </div>
            <span className="precip-time">{formatHour(d.dt, lang)}</span>
          </div>
        ))}
      </div>

      <div className="aq-divider" />

      {/* Summary */}
      <div className="precip-summary">
        {totalRain > 0 && (
          <div className="precip-stat">
            <span className="precip-stat-label">{isEs ? "Lluvia" : "Rain"}</span>
            <span className="precip-stat-val">{totalRain.toFixed(1)} <span className="wc-unit">mm</span></span>
          </div>
        )}
        {totalSnow > 0 && (
          <div className="precip-stat">
            <span className="precip-stat-label">{isEs ? "Nieve" : "Snow"}</span>
            <span className="precip-stat-val">{totalSnow.toFixed(1)} <span className="wc-unit">mm</span></span>
          </div>
        )}
        {totalRain === 0 && totalSnow === 0 && (
          <p className="precip-none">
            {isEs ? "Sin precipitación esperada" : "No precipitation expected"}
          </p>
        )}
      </div>
    </>
  );
});
