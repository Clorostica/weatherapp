import { memo } from "react";
import { useLang } from "./useLang";

const AQI_INFO = {
  1: { en: "Good",      es: "Buena",    color: "#34d399" },
  2: { en: "Fair",      es: "Aceptable",color: "#a3e635" },
  3: { en: "Moderate",  es: "Moderada", color: "#fbbf24" },
  4: { en: "Poor",      es: "Mala",     color: "#fb923c" },
  5: { en: "Very Poor", es: "Muy mala", color: "#f87171" },
};

const POLLUTANTS = [
  { key: "pm2_5", label: "PM2.5", max: 75,  unit: "μg/m³" },
  { key: "pm10",  label: "PM10",  max: 150, unit: "μg/m³" },
  { key: "o3",    label: "O₃",    max: 180, unit: "μg/m³" },
  { key: "no2",   label: "NO₂",   max: 200, unit: "μg/m³" },
];

export const AirQuality = memo(function AirQuality({ airQuality }) {
  const { lang } = useLang();
  const isEs = lang === "es";
  const title = isEs ? "Calidad del aire" : "Air Quality";

  if (!airQuality) {
    return (
      <>
        <p className="section-title">{title}</p>
        <p className="aq-unavailable">{isEs ? "No disponible" : "Not available"}</p>
      </>
    );
  }

  const { aqi, components } = airQuality;
  const info = AQI_INFO[aqi] ?? AQI_INFO[1];

  return (
    <>
      <p className="section-title">{title}</p>

      {/* AQI number + label + scale */}
      <div className="aq-main">
        <span className="aq-number" style={{ color: info.color }}>{aqi}</span>
        <div className="aq-info">
          <span className="aq-label" style={{ color: info.color }}>
            {isEs ? info.es : info.en}
          </span>
          <div className="aq-scale">
            <div className="aq-scale-track" />
            <div className="aq-scale-marker" style={{ left: `${((aqi - 1) / 4) * 100}%` }} />
          </div>
          <div className="aq-scale-labels">
            <span>{isEs ? "Buena" : "Good"}</span>
            <span>{isEs ? "Muy mala" : "Very Poor"}</span>
          </div>
        </div>
      </div>

      <div className="aq-divider" />

      {/* Pollutants */}
      <div className="aq-pollutants">
        {POLLUTANTS.map(({ key, label, max, unit }) => {
          const val = components[key] ?? 0;
          const pct = Math.min((val / max) * 100, 100);
          return (
            <div key={key} className="aq-pollutant">
              <div className="aq-poll-row">
                <span className="aq-poll-name">{label}</span>
                <span className="aq-poll-val">
                  {val.toFixed(1)}&thinsp;<span className="aq-poll-unit">{unit}</span>
                </span>
              </div>
              <div className="aq-poll-track">
                <div className="aq-poll-fill" style={{ width: `${pct}%`, background: info.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});
