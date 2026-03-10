import { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "./useLang";

const WeatherRadar = ({ lat, lon }) => {
  const { t } = useLang();
  const iframeRef = useRef(null);

  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const filterRadarMessages = (args) => {
      if (!args || args.length === 0) return false;
      const message = String(args[0] || "");
      return (
        message.includes("isInApp") ||
        message.includes("wrVersion") ||
        message.includes("platform desktop") ||
        message.includes("WetterOnline is hiring") ||
        message.includes("++++++++") ||
        message.includes("using deprecated parameters") ||
        message.includes("worker-HIAQ3F4P") ||
        message.includes("main-EVSXJGB4") ||
        message.includes("dynamic-imports") ||
        message.includes("chunk-")
      );
    };

    console.log = (...args) => { if (!filterRadarMessages(args)) originalLog.apply(console, args); };
    console.warn = (...args) => { if (!filterRadarMessages(args)) originalWarn.apply(console, args); };
    console.error = (...args) => { if (!filterRadarMessages(args)) originalError.apply(console, args); };
    console.info = (...args) => { if (!filterRadarMessages(args)) originalInfo.apply(console, args); };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem("radarPreferences");
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  };

  const savedPrefs = loadPreferences();
  const [zoom, setZoom] = useState(savedPrefs?.zoom || 8);
  const [radarType, setRadarType] = useState(savedPrefs?.radarType || "rr");
  const [isAnimated, setIsAnimated] = useState(savedPrefs?.isAnimated || false);

  useEffect(() => {
    localStorage.setItem("radarPreferences", JSON.stringify({ zoom, radarType, isAnimated }));
  }, [zoom, radarType, isAnimated]);

  const buildRadarUrl = useCallback(() => {
    const baseUrl = "https://radar.wo-cloud.com/desktop";
    const coordinates = lat && lon ? `${lat},${lon}` : "50.93,13.45";
    const params = new URLSearchParams({ wrx: coordinates, wrm: zoom.toString() });
    if (radarType === "rr") params.append("wrl", "compact");
    if (isAnimated) params.append("wrz", "1");
    const radarPath = radarType === "rr" ? "rr/compact" : `${radarType}/compact`;
    return `${baseUrl}/${radarPath}?${params.toString()}`;
  }, [lat, lon, zoom, radarType, isAnimated]);

  const [radarUrl, setRadarUrl] = useState(buildRadarUrl());

  useEffect(() => { setRadarUrl(buildRadarUrl()); }, [buildRadarUrl]);

  const handleZoomChange = (newZoom) => setZoom(Math.max(1, Math.min(12, newZoom)));

  const handleReset = () => { setZoom(8); setRadarType("rr"); setIsAnimated(false); };

  const formatCoord = (val, posLabel, negLabel) => {
    const abs = Math.abs(val).toFixed(2);
    return `${abs}° ${val >= 0 ? posLabel : negLabel}`;
  };

  return (
    <div className="container">

      {/* ── Header: title + coordinates chip ── */}
      <div className="radar-header">
        <p className="section-title">{t.weatherRadar}</p>
        {lat && lon && (
          <div className="radar-coords-chip">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{formatCoord(lat, "N", "S")}</span>
            <span className="radar-coords-dot">·</span>
            <span>{formatCoord(lon, "E", "W")}</span>
          </div>
        )}
      </div>

      {/* ── Controls toolbar ── */}
      <div className="radar-toolbar">

        {/* Type selector */}
        <select
          className="radar-ctrl radar-select"
          value={radarType}
          onChange={(e) => setRadarType(e.target.value)}
          aria-label="Radar type"
        >
          <option value="rr">{t.precipitation}</option>
          <option value="cloud">{t.clouds}</option>
          <option value="temp">{t.temperature}</option>
          <option value="wind">{t.wind}</option>
        </select>

        {/* Zoom stepper */}
        <div className="radar-zoom-pill">
          <button
            className="radar-zoom-btn"
            onClick={() => handleZoomChange(zoom - 1)}
            disabled={zoom <= 1}
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="radar-zoom-val">{zoom}×</span>
          <button
            className="radar-zoom-btn"
            onClick={() => handleZoomChange(zoom + 1)}
            disabled={zoom >= 12}
            aria-label="Zoom in"
          >
            +
          </button>
        </div>

        {/* Animation toggle */}
        <button
          className={`radar-ctrl${isAnimated ? " radar-ctrl--active" : ""}`}
          onClick={() => setIsAnimated(!isAnimated)}
          aria-label="Toggle animation"
        >
          {isAnimated ? "⏸" : "▶"}&nbsp;{isAnimated ? t.pause : t.animation}
        </button>

        {/* Reset */}
        <button className="radar-ctrl radar-ctrl--icon" onClick={handleReset} aria-label="Reset radar">
          ↻
        </button>

      </div>

      {/* ── Iframe ── */}
      <div className="radar-frame">
        <iframe
          ref={iframeRef}
          src={radarUrl}
          className="w-full h-full border-none"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="no-referrer"
          title="Weather Radar"
          allow="geolocation"
          style={{ isolation: "isolate" }}
          data-origin="https://radar.wo-cloud.com"
        />
      </div>

    </div>
  );
};

export default WeatherRadar;
