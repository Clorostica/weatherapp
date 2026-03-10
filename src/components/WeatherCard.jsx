import { memo } from "react";
import { useLang } from "./useLang";

const getWindDirection = (deg) => {
  if (deg == null) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

const formatSunTime = (timestamp, lang) =>
  new Date(timestamp * 1000).toLocaleTimeString(
    lang === "es" ? "es-ES" : "en-US",
    { hour: "2-digit", minute: "2-digit" }
  );

const PanelIcon = ({ type }) => {
  const icons = {
    feelsLike: (
      <path d="M12 2a3 3 0 0 1 3 3v7.382l.894 1.789A4 4 0 1 1 8 17.236V5a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v10.764l-.503 1.006A2 2 0 1 0 14 17.764l-.497-.993V5a1 1 0 0 0-1-1z" />
    ),
    humidity: (
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69zM12 5.52L7.76 9.76a6 6 0 1 0 8.48 0L12 5.52z" />
    ),
    wind: (
      <>
        <path d="M9.5 8a2.5 2.5 0 0 1 5 0c0 1.38-1.12 2.5-2.5 2.5H2" />
        <path d="M11.5 16a2.5 2.5 0 0 0 5 0c0-1.38-1.12-2.5-2.5-2.5H2" />
        <path d="M5 12h14" />
      </>
    ),
    visibility: (
      <>
        <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    pressure: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </>
    ),
    clouds: (
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    ),
  };

  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.5, flexShrink: 0 }}
    >
      {icons[type]}
    </svg>
  );
};

export const WeatherCard = memo(function WeatherCard({
  weather,
  getWeatherIcon,
}) {
  const { t, lang } = useLang();
  if (!weather) return null;

  const {
    name,
    sys,
    main,
    wind,
    visibility,
    clouds,
    weather: [{ main: condition, description }],
  } = weather;

  const dewPoint = Math.round(main.temp - (100 - main.humidity) / 5);
  const windDir = getWindDirection(wind?.deg);
  const visKm = visibility != null ? Math.round(visibility / 1000) : null;
  const sunrise = sys?.sunrise ? formatSunTime(sys.sunrise, lang) : null;
  const sunset = sys?.sunset ? formatSunTime(sys.sunset, lang) : null;

  const isEs = lang === "es";

  return (
    <>
      {/* 1. Hero — no container, floats over video */}
      <div className="wc-hero-free">
        <span className="wc-my-location">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {isEs ? "Mi ubicación" : "My Location"}
        </span>
        <h1 className="wc-city">{name}</h1>
        {sys?.country && <span className="wc-country-badge">{sys.country}</span>}
        <div className="wc-temp">{Math.round(main.temp)}°</div>
        <span className="wc-hl">
          {isEs ? "Máx" : "H"}&nbsp;{Math.round(main.temp_max)}°&ensp;·&ensp;
          {isEs ? "Mín" : "L"}&nbsp;{Math.round(main.temp_min)}°
        </span>
      </div>

      {/* 2. Condition + Panels — one container */}
      <div className="container wc-panels-container">
        <span className="wc-condition-text">{description}</span>
        <div className="wc-divider" style={{ margin: "14px 0 16px" }} />
        <div className="wc-grid">

          {/* Feels Like */}
          <div className="wc-panel">
            <div className="wc-panel-label">
              <PanelIcon type="feelsLike" /> {t.feelsLike}
            </div>
            <div className="wc-panel-value">{Math.round(main.feels_like)}°</div>
            <div className="wc-panel-sub">
              {Math.round(main.feels_like) < Math.round(main.temp)
                ? isEs ? "Más frío que la temp. real" : "Feels colder than actual"
                : Math.round(main.feels_like) > Math.round(main.temp)
                ? isEs ? "Más cálido que la temp. real" : "Feels warmer than actual"
                : isEs ? "Similar a la temp. real" : "Similar to the actual temp."}
            </div>
          </div>

          {/* Humidity */}
          <div className="wc-panel">
            <div className="wc-panel-label">
              <PanelIcon type="humidity" /> {t.humidity}
            </div>
            <div className="wc-panel-value">{main.humidity}%</div>
            <div className="wc-panel-sub">
              {isEs ? `Punto de rocío: ${dewPoint}°` : `Dew point: ${dewPoint}°`}
            </div>
          </div>

          {/* Wind */}
          <div className="wc-panel">
            <div className="wc-panel-label">
              <PanelIcon type="wind" /> {t.wind}
            </div>
            <div className="wc-panel-value">
              {Math.round(wind?.speed ?? 0)}{" "}
              <span className="wc-unit">m/s</span>
            </div>
            <div className="wc-panel-sub">
              {windDir && (
                <span className="wc-wind-dir">
                  <svg
                    width="10" height="10" viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                      transform: `rotate(${wind?.deg ?? 0}deg)`,
                      display: "inline-block",
                      marginRight: 3,
                      verticalAlign: "middle",
                    }}
                  >
                    <path d="M12 2l4 10H8z" />
                  </svg>
                  {windDir}
                </span>
              )}
              {wind?.gust ? (
                <span>
                  {" "}· {isEs ? "Ráf." : "Gusts"} {Math.round(wind.gust)} m/s
                </span>
              ) : null}
            </div>
          </div>

          {/* Visibility */}
          <div className="wc-panel">
            <div className="wc-panel-label">
              <PanelIcon type="visibility" />
              {isEs ? "Visibilidad" : "Visibility"}
            </div>
            <div className="wc-panel-value">
              {visKm ?? "—"} <span className="wc-unit">km</span>
            </div>
            <div className="wc-panel-sub">
              {visKm != null
                ? visKm >= 10
                  ? isEs ? "Perfecta" : "Clear"
                  : isEs ? "Reducida" : "Reduced"
                : ""}
            </div>
          </div>

          {/* Pressure */}
          <div className="wc-panel">
            <div className="wc-panel-label">
              <PanelIcon type="pressure" />
              {isEs ? "Presión" : "Pressure"}
            </div>
            <div className="wc-panel-value">
              {main.pressure} <span className="wc-unit">hPa</span>
            </div>
            <div className="wc-panel-sub">
              {main.pressure > 1013
                ? isEs ? "Alta presión" : "High pressure"
                : isEs ? "Baja presión" : "Low pressure"}
            </div>
          </div>

          {/* Sunrise / Sunset */}
          <div className="wc-panel wc-panel--sun">
            <div className="wc-panel-label">
              <PanelIcon type="sun" />
              {isEs ? "Sol" : "Sun"}
            </div>
            <div className="wc-sun-row">
              {sunrise && (
                <div className="wc-sun-item">
                  <span className="wc-sun-arrow">↑</span>
                  <span className="wc-sun-time">{sunrise}</span>
                  <span className="wc-panel-sub">{isEs ? "Amanecer" : "Sunrise"}</span>
                </div>
              )}
              {sunset && (
                <div className="wc-sun-item">
                  <span className="wc-sun-arrow">↓</span>
                  <span className="wc-sun-time">{sunset}</span>
                  <span className="wc-panel-sub">{isEs ? "Atardecer" : "Sunset"}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
});
