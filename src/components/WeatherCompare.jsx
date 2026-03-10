import { memo, useState, useCallback } from "react";
import { useLang } from "./useLang";
import getWeatherIcon from "./IconWeather.js";

const CompareRow = ({ label, valA, valB, winA, winB }) => (
  <div className="wcc-row">
    <span className={`wcc-val${winA ? " wcc-val--win" : ""}`}>{valA}</span>
    <span className="wcc-label">{label}</span>
    <span className={`wcc-val wcc-val--right${winB ? " wcc-val--win" : ""}`}>{valB}</span>
  </div>
);

/* Returns only content — GlassSurface is the wrapper in the parent */
const CitySlotContent = ({ slotLabel, data, isEs, onSearch, onClear }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  if (data.weather) {
    const w = data.weather;
    return (
      <>
        <div className="wcc-slot-icon">{getWeatherIcon(w.weather[0].main, 40)}</div>
        <span className="wcc-slot-city">{w.name}</span>
        <span className="wcc-slot-country">{w.sys?.country}</span>
        <span className="wcc-slot-temp">{Math.round(w.main.temp)}°</span>
        <span className="wcc-slot-desc">{w.weather[0].description}</span>
        <button className="wcc-slot-change" type="button" onClick={onClear}>
          {isEs ? "Cambiar" : "Change"}
        </button>
      </>
    );
  }

  return (
    <>
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
    </>
  );
};

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
  const clearA = useCallback(() => setSlotA(EMPTY), []);
  const clearB = useCallback(() => setSlotB(EMPTY), []);

  const a = slotA.weather;
  const b = slotB.weather;

  const tempWin =
    a && b && a.main.temp !== b.main.temp
      ? { a: a.main.temp > b.main.temp, b: b.main.temp > a.main.temp }
      : { a: false, b: false };

  const humWin =
    a && b && a.main.humidity !== b.main.humidity
      ? { a: a.main.humidity < b.main.humidity, b: b.main.humidity < a.main.humidity }
      : { a: false, b: false };

  const windWin =
    a && b && (a.wind?.speed ?? 0) !== (b.wind?.speed ?? 0)
      ? {
          a: (a.wind?.speed ?? 0) < (b.wind?.speed ?? 0),
          b: (b.wind?.speed ?? 0) < (a.wind?.speed ?? 0),
        }
      : { a: false, b: false };

  return (
    <div className="wcc-card">
      <div className="wcc-section-header">
        <div className="wcc-section-line" />
        <span className="wcc-section-label">{isEs ? "comparar ciudades" : "compare cities"}</span>
        <div className="wcc-section-line" />
      </div>

      <div className="wcc-slots">
        <div className={`wcc-slot-surface${!slotA.weather ? " wcc-slot-surface--empty" : ""}`}>
          <CitySlotContent
            slotLabel={isEs ? "Ciudad A" : "City A"}
            data={slotA}
            isEs={isEs}
            onSearch={searchA}
            onClear={clearA}
          />
        </div>

        <div className="wcc-vs-badge">
          <div className="wcc-vs-line" />
          <span>VS</span>
          <div className="wcc-vs-line" />
        </div>

        <div className={`wcc-slot-surface${!slotB.weather ? " wcc-slot-surface--empty" : ""}`}>
          <CitySlotContent
            slotLabel={isEs ? "Ciudad B" : "City B"}
            data={slotB}
            isEs={isEs}
            onSearch={searchB}
            onClear={clearB}
          />
        </div>
      </div>

      {a && b && (
        <>
          <div className="wcc-divider" />
          <div className="wcc-table">
            <CompareRow
              label="Temp"
              valA={`${Math.round(a.main.temp)}°`}
              valB={`${Math.round(b.main.temp)}°`}
              winA={tempWin.a}
              winB={tempWin.b}
            />
            <CompareRow
              label={isEs ? "Sensación" : "Feels Like"}
              valA={`${Math.round(a.main.feels_like)}°`}
              valB={`${Math.round(b.main.feels_like)}°`}
              winA={false}
              winB={false}
            />
            <CompareRow
              label={isEs ? "Humedad" : "Humidity"}
              valA={`${a.main.humidity}%`}
              valB={`${b.main.humidity}%`}
              winA={humWin.a}
              winB={humWin.b}
            />
            <CompareRow
              label={isEs ? "Viento" : "Wind"}
              valA={`${Math.round(a.wind?.speed ?? 0)} m/s`}
              valB={`${Math.round(b.wind?.speed ?? 0)} m/s`}
              winA={windWin.a}
              winB={windWin.b}
            />
            <CompareRow
              label={isEs ? "Condición" : "Condition"}
              valA={a.weather[0].description}
              valB={b.weather[0].description}
              winA={false}
              winB={false}
            />
          </div>
        </>
      )}
    </div>
  );
});
