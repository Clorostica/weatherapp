import { memo, useState, useCallback } from "react";
import { useLang } from "./useLang";
import getWeatherIcon from "./IconWeather.js";

/* ── Search form shown when slot is empty ── */
const EmptySlot = ({ slotLabel, data, isEs, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="wcc-empty">
      <span className="wcc-slot-empty-label">{slotLabel}</span>
      <form className="wcc-slot-form" onSubmit={handleSubmit}>
        <input
          className="wcc-slot-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isEs ? "Buscar ciudad..." : "Search city..."}
          disabled={data.loading}
        />
        <button
          className="wcc-slot-btn"
          type="submit"
          disabled={data.loading || !query.trim()}
          aria-label={isEs ? "Buscar" : "Search"}
        >
          {data.loading ? (
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>…</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </button>
      </form>
      {data.error && <p className="wcc-slot-error">{data.error}</p>}
    </div>
  );
};

/* ── Stat row inside a filled city card ── */
const StatRow = ({ icon, label, value, win }) => (
  <div className={`wcc-stat-row${win ? " wcc-stat-row--win" : ""}`}>
    <span className="wcc-stat-icon">{icon}</span>
    <span className="wcc-stat-label">{label}</span>
    <span className="wcc-stat-value">{value}</span>
    {win && <span className="wcc-stat-crown">👑</span>}
  </div>
);

/* ── Full city card when data is loaded ── */
const CityCard = ({ w, isEs, onClear, wins }) => (
  <div className="wcc-city-card">
    <div className="wcc-city-header">
      <div className="wcc-city-icon">{getWeatherIcon(w.weather[0].main, 36)}</div>
      <div className="wcc-city-title">
        <span className="wcc-slot-city">{w.name}</span>
        <span className="wcc-slot-country">{w.sys?.country}</span>
      </div>
      <button className="wcc-slot-change" type="button" onClick={onClear}>
        {isEs ? "Cambiar" : "Change"}
      </button>
    </div>

    <div className="wcc-city-temp-row">
      <span className="wcc-city-temp">{Math.round(w.main.temp)}°</span>
      <span className="wcc-city-desc">{w.weather[0].description}</span>
    </div>

    <div className="wcc-city-stats">
      <StatRow
        icon="🌡️"
        label={isEs ? "Sensación" : "Feels like"}
        value={`${Math.round(w.main.feels_like)}°`}
        win={wins?.feelsLike}
      />
      <StatRow
        icon="💧"
        label={isEs ? "Humedad" : "Humidity"}
        value={`${w.main.humidity}%`}
        win={wins?.humidity}
      />
      <StatRow
        icon="💨"
        label={isEs ? "Viento" : "Wind"}
        value={`${Math.round(w.wind?.speed ?? 0)} m/s`}
        win={wins?.wind}
      />
      <StatRow
        icon="🌡️"
        label={isEs ? "Máx / Mín" : "High / Low"}
        value={`${Math.round(w.main.temp_max)}° / ${Math.round(w.main.temp_min)}°`}
        win={false}
      />
    </div>
  </div>
);

const EMPTY = { weather: null, loading: false, error: null };

export const WeatherCompare = memo(function WeatherCompare({ apiKey }) {
  const { lang } = useLang();
  const isEs = lang === "es";

  const [slotA, setSlotA] = useState(EMPTY);
  const [slotB, setSlotB] = useState(EMPTY);

  const fetchCity = useCallback(
    async (query, setSlot) => {
      setSlot((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const encoded = encodeURIComponent(query);
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encoded}&limit=1&appid=${apiKey}`,
          { headers: { Accept: "application/json" } }
        );
        const geoData = await geoRes.json();
        if (!geoData?.length)
          throw new Error(isEs ? "Ciudad no encontrada" : "City not found");
        const { lat, lon } = geoData[0];
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${apiKey}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok)
          throw new Error(isEs ? "Error al obtener el clima" : "Failed to fetch");
        const data = await res.json();
        setSlot({ weather: data, loading: false, error: null });
      } catch (err) {
        setSlot((prev) => ({ ...prev, loading: false, error: err.message }));
      }
    },
    [apiKey, lang, isEs]
  );

  const searchA = useCallback((q) => fetchCity(q, setSlotA), [fetchCity]);
  const searchB = useCallback((q) => fetchCity(q, setSlotB), [fetchCity]);
  const clearA  = useCallback(() => setSlotA(EMPTY), []);
  const clearB  = useCallback(() => setSlotB(EMPTY), []);

  const a = slotA.weather;
  const b = slotB.weather;

  /* Which city wins each stat (lower humidity/wind = better; higher temp = warmer) */
  const winsA = a && b ? {
    feelsLike: a.main.feels_like > b.main.feels_like,
    humidity:  a.main.humidity   < b.main.humidity,
    wind:      (a.wind?.speed ?? 0) < (b.wind?.speed ?? 0),
  } : null;

  const winsB = a && b ? {
    feelsLike: b.main.feels_like > a.main.feels_like,
    humidity:  b.main.humidity   < a.main.humidity,
    wind:      (b.wind?.speed ?? 0) < (a.wind?.speed ?? 0),
  } : null;

  return (
    <div className="wcc-card">
      <div className="wcc-section-header">
        <div className="wcc-section-line" />
        <span className="wcc-section-label">{isEs ? "comparar ciudades" : "compare cities"}</span>
        <div className="wcc-section-line" />
      </div>

      <div className="wcc-cities">
        {/* City A */}
        {a ? (
          <CityCard w={a} isEs={isEs} onClear={clearA} wins={winsA} />
        ) : (
          <EmptySlot slotLabel={isEs ? "Ciudad A" : "City A"} data={slotA} isEs={isEs} onSearch={searchA} />
        )}

        {/* VS divider — only when at least one city is set */}
        <div className="wcc-vs-row">
          <div className="wcc-vs-line" />
          <span className="wcc-vs-text">VS</span>
          <div className="wcc-vs-line" />
        </div>

        {/* City B */}
        {b ? (
          <CityCard w={b} isEs={isEs} onClear={clearB} wins={winsB} />
        ) : (
          <EmptySlot slotLabel={isEs ? "Ciudad B" : "City B"} data={slotB} isEs={isEs} onSearch={searchB} />
        )}
      </div>
    </div>
  );
});
