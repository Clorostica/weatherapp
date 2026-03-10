import { memo } from "react";
import { useLang } from "./useLang";

export const ForecastGrid = memo(function ForecastGrid({
  forecast,
  getWeatherIcon,
  formatDateLabel,
}) {
  const { lang } = useLang();
  if (!forecast?.length) return null;

  return (
    <>
      <p className="section-title">{lang === "es" ? "Pronóstico" : "5-Day Forecast"}</p>
      <div className="fc-list">
        {forecast.map(({ date, tempMin, tempMax, description, weatherMain }) => (
          <div key={date} className="fc-row">
            <span className="fc-row-day">{formatDateLabel(date)}</span>
            <div className="fc-row-icon">{getWeatherIcon(weatherMain, 22)}</div>
            <span className="fc-row-desc">{description}</span>
            <div className="fc-row-temps">
              <span className="fc-row-min">{tempMin}°</span>
              <span className="fc-row-sep">·</span>
              <span className="fc-row-max">{tempMax}°</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
