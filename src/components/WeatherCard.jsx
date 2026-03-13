import { memo, lazy, Suspense } from "react";
import { useLang } from "./useLang";

const CaelChar = lazy(() => import("./Cael").then((m) => ({ default: m.Cael })));

const formatSunTime = (timestamp, lang) =>
  new Date(timestamp * 1000).toLocaleTimeString(
    lang === "es" ? "es-ES" : "en-US",
    { hour: "2-digit", minute: "2-digit" }
  );

function getOutfit(weather) {
  const code = weather.weather[0].id;
  const temp = weather.main.temp;
  if (temp < 0 || (code >= 600 && code <= 622)) return "snowy";
  if (temp > 28) return "hot";
  if (code >= 200 && code <= 232) return "stormy";
  if (code >= 300 && code <= 531) return "rainy";
  if (temp < 18) return "cool";
  return "casual";
}

export const WeatherCard = memo(function WeatherCard({ weather }) {
  const { t, lang } = useLang();
  if (!weather) return null;

  const { name, sys, main, wind } = weather;
  const isEs   = lang === "es";
  const outfit = getOutfit(weather);
  const sunrise = sys?.sunrise ? formatSunTime(sys.sunrise, lang) : null;
  const sunset  = sys?.sunset  ? formatSunTime(sys.sunset,  lang) : null;

  return (
    <div className="container wc-hero-card">
      {/* Left column — location + temp + Cael */}
      <div className="wc-hero-left">
        <span className="wc-my-location">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {isEs ? "Mi ubicación" : "My Location"}
        </span>
        <h1 className="wc-city">{name}</h1>
        {sys?.country && <span className="wc-country-badge">{sys.country}</span>}

        {/* Temperature + Cael side by side */}
        <div className="wc-temp-cael">
          <div className="wc-temp">{Math.round(main.temp)}°</div>
          <div className={`cael-wrap cael-wrap--${outfit}`}>
            <Suspense fallback={null}>
              <CaelChar weatherType={outfit} />
            </Suspense>
          </div>
        </div>

        <span className="wc-hl">
          {isEs ? "Máx" : "H"}&nbsp;{Math.round(main.temp_max)}°&ensp;·&ensp;
          {isEs ? "Mín" : "L"}&nbsp;{Math.round(main.temp_min)}°
        </span>
      </div>

      {/* Vertical divider */}
      <div className="wc-vdivider" />

      {/* Right column — stats */}
      <div className="wc-stats-right">
        <div className="wc-stat-row">
          <span className="wc-stat-label">{t.humidity}</span>
          <span className="wc-stat-value">{main.humidity}%</span>
        </div>

        <div className="wc-stat-row">
          <span className="wc-stat-label">{t.wind}</span>
          <span className="wc-stat-value">{Math.round(wind?.speed ?? 0)} <span className="wc-unit">m/s</span></span>
        </div>

        <div className="wc-stat-row">
          <span className="wc-stat-label">{t.feelsLike}</span>
          <span className="wc-stat-value">{Math.round(main.feels_like)}°</span>
        </div>

        {sunrise && (
          <div className="wc-stat-row">
            <span className="wc-stat-label">{isEs ? "Amanecer" : "Sunrise"}</span>
            <span className="wc-stat-value">{sunrise}</span>
          </div>
        )}

        {sunset && (
          <div className="wc-stat-row">
            <span className="wc-stat-label">{isEs ? "Atardecer" : "Sunset"}</span>
            <span className="wc-stat-value">{sunset}</span>
          </div>
        )}
      </div>
    </div>
  );
});
