import { memo, useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "./useLang";
import GlassSurface from "./GlassSurface";

/* ── Enabled state shared via custom event ── */
const setNotifEnabled = (val) => {
  localStorage.setItem("notif_enabled", String(val));
  window.dispatchEvent(new CustomEvent("notif-enabled-change", { detail: val }));
};

const useNotifEnabled = () => {
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("notif_enabled") !== "false"
  );
  useEffect(() => {
    const handler = (e) => setEnabled(e.detail);
    window.addEventListener("notif-enabled-change", handler);
    return () => window.removeEventListener("notif-enabled-change", handler);
  }, []);
  return enabled;
};

/* ── Alert data ── */
const getAlerts = (weather, isEs) => {
  const code      = weather.weather?.[0]?.id ?? 800;
  const temp      = weather.main?.temp        ?? 20;
  const windSpeed = weather.wind?.speed        ?? 0;
  const hour      = new Date().getHours();
  const isMorning   = hour >= 5  && hour < 10;
  const isAfternoon = hour >= 12 && hour < 18;
  const isNight     = hour >= 20 || hour < 5;

  const alerts = [];

  if (code >= 200 && code <= 232) {
    const isHeavy = [202, 212, 221, 232].includes(code);
    alerts.push({
      emoji: isHeavy ? "🌩️" : "⚡",
      body: isHeavy
        ? (isEs ? "Tormenta con viento fuerte. Asegura objetos sueltos y permanece en interiores." : "Storm with strong wind. Secure loose objects and stay indoors.")
        : (isEs ? "Tormenta eléctrica. Evita salir y mantente alejado de objetos metálicos y árboles." : "Thunderstorm. Avoid going out and stay away from metal objects and trees."),
    });
  }
  if (code >= 300 && code <= 321) {
    alerts.push({ emoji: "🌦️", body: isEs ? "Llovizna esperada. Lleva un paraguas pequeño o impermeable." : "Drizzle expected. Carry a small umbrella or light raincoat." });
  }
  if (code >= 500 && code <= 531) {
    const isHeavy = code >= 502 && code <= 504;
    alerts.push({
      emoji: isHeavy ? "⚠️" : "☔",
      body: isHeavy
        ? (isEs ? "Lluvia fuerte. Maneja con precaución y evita zonas inundables." : "Heavy rain. Drive carefully and avoid flood-prone areas.")
        : (isEs ? "Lluvia en camino. No olvides tu paraguas o impermeable." : "Rain on the way. Don't forget your umbrella or raincoat."),
    });
  }
  if (code >= 600 && code <= 622) {
    const isHeavy = code === 602 || code === 621 || code === 622 || temp < -5;
    alerts.push({
      emoji: isHeavy ? "🥶" : "❄️",
      body: isHeavy
        ? (isEs ? "Nieve intensa y frío extremo. Evita salir y revisa la calefacción." : "Heavy snow and extreme cold. Avoid going out and check home heating.")
        : (isEs ? "Nieve ligera. Ten cuidado al conducir y usa ropa abrigada." : "Light snow. Drive carefully and wear warm clothing."),
    });
  }
  if (code >= 701 && code <= 781) {
    const ctx = isMorning ? (isEs ? " Nieblas matutinas." : " Morning fog.") : isNight ? (isEs ? " Niebla nocturna." : " Nighttime fog.") : "";
    alerts.push({ emoji: "🌫️", body: isEs ? `Niebla.${ctx} Maneja con precaución y usa luces bajas.` : `Fog.${ctx} Drive carefully and use low beam headlights.` });
  }
  if (windSpeed > 10) {
    alerts.push({ emoji: "💨", body: isEs ? "Viento peligroso. Evita zonas con árboles o estructuras inestables." : "Dangerous winds. Avoid areas with trees or unstable structures." });
  } else if (windSpeed > 5) {
    alerts.push({ emoji: "🌬️", body: isEs ? "Viento fuerte. Sujeta sombrillas y objetos sueltos." : "Strong wind. Hold onto umbrellas and loose objects." });
  }
  if (code === 800 || code === 801) {
    if (temp > 35) {
      alerts.push({ emoji: "🔥", body: isEs ? "Calor intenso. Evita actividades físicas prolongadas al aire libre." : "Intense heat. Avoid prolonged outdoor physical activities." });
    } else if (temp > 29) {
      const body = isAfternoon
        ? (isEs ? "Calor extremo esta tarde. Hidrátate y evita el sol directo." : "Extreme afternoon heat. Stay hydrated and avoid direct sun.")
        : isMorning
        ? (isEs ? "Hoy el sol estará muy fuerte. Usa protector solar, gorra y mantente hidratado." : "Strong sun today. Use sunscreen, wear a hat, and stay hydrated.")
        : (isEs ? "El sol está muy fuerte hoy. Usa protector solar, gorra y mantente hidratado." : "The sun is very strong today. Use sunscreen, wear a hat, and stay hydrated.");
      alerts.push({ emoji: "🌞", body });
    }
  }
  return alerts;
};

/* ── Main component ── */
export const WeatherNotifications = memo(function WeatherNotifications({ weather }) {
  const { lang } = useLang();
  const isEs    = lang === "es";
  const enabled = useNotifEnabled();
  const dropdownRef = useRef(null);
  const shownKeyRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [open,    setOpen]    = useState(false);

  /* Accumulate alerts silently into history when city changes */
  useEffect(() => {
    if (!weather || !enabled) return;
    const key = `${weather.name}-${weather.coord?.lat}`;
    if (shownKeyRef.current === key) return;
    shownKeyRef.current = key;

    const alerts = getAlerts(weather, isEs);
    if (!alerts.length) return;

    const timestamp = new Date().toLocaleTimeString(
      lang === "es" ? "es-ES" : "en-US",
      { hour: "2-digit", minute: "2-digit" }
    );
    const city = weather.name;
    const newItems = alerts.map((a, i) => ({ ...a, id: Date.now() + i, city, timestamp }));
    setHistory((prev) => [...newItems, ...prev]);
  }, [weather, enabled, isEs, lang]);

  /* Clear history when disabled */
  useEffect(() => { if (!enabled) setHistory([]); }, [enabled]);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const count = enabled ? history.length : 0;

  return (
    <div className="notif-controls">
      {/* Toggle switch — GlassSurface style matching LanguageSwitcher */}
      <GlassSurface width="100px" height="40px" style={{ cursor: "pointer" }} backgroundOpacity={0.1}>
        <div
          className="notif-switcher"
          onClick={() => setNotifEnabled(!enabled)}
          role="button"
          tabIndex={0}
          aria-label={enabled ? (isEs ? "Desactivar notificaciones" : "Disable notifications") : (isEs ? "Activar notificaciones" : "Enable notifications")}
        >
          <div className={`notif-indicator ${enabled ? "right" : "left"}`} />
          <span className={`notif-text ${!enabled ? "active" : ""}`}>🔕</span>
          <span className={`notif-text ${enabled ? "active" : ""}`}>🔔</span>
        </div>
      </GlassSurface>

      {/* Bell — only when enabled */}
      {enabled && (
        <div className="notif-bell-wrap" ref={dropdownRef}>
          <button
            className="notif-bell-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label={isEs ? "Ver notificaciones" : "View notifications"}
          >
            <span className="notif-bell-icon">🔔</span>
            {count > 0 && <span className="notif-bell-badge">{count}</span>}
          </button>

          {open && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <p className="notif-dropdown-title">
                  {count > 0
                    ? (isEs ? `${count} notificación${count > 1 ? "es" : ""}` : `${count} notification${count > 1 ? "s" : ""}`)
                    : (isEs ? "Sin notificaciones" : "No notifications")}
                </p>
                {count > 0 && (
                  <button
                    className="notif-dropdown-clear"
                    onClick={() => { setHistory([]); setOpen(false); }}
                  >
                    {isEs ? "Limpiar" : "Clear"}
                  </button>
                )}
              </div>
              {count > 0 && (
                <ul className="notif-dropdown-list">
                  {history.map((a) => (
                    <li key={a.id} className="notif-dropdown-item">
                      <span className="notif-dropdown-emoji">{a.emoji}</span>
                      <div className="notif-dropdown-text">
                        <span className="notif-dropdown-body">{a.body}</span>
                        <span className="notif-dropdown-meta">{a.city} · {a.timestamp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
