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

    console.log = (...args) => {
      if (!filterRadarMessages(args)) {
        originalLog.apply(console, args);
      }
    };

    console.warn = (...args) => {
      if (!filterRadarMessages(args)) {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args) => {
      if (!filterRadarMessages(args)) {
        originalError.apply(console, args);
      }
    };

    console.info = (...args) => {
      if (!filterRadarMessages(args)) {
        originalInfo.apply(console, args);
      }
    };

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
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    return null;
  };

  const savedPrefs = loadPreferences();
  const [zoom, setZoom] = useState(savedPrefs?.zoom || 8);
  const [radarType, setRadarType] = useState(savedPrefs?.radarType || "rr");
  const [isAnimated, setIsAnimated] = useState(savedPrefs?.isAnimated || false);

  useEffect(() => {
    localStorage.setItem(
      "radarPreferences",
      JSON.stringify({ zoom, radarType, isAnimated })
    );
  }, [zoom, radarType, isAnimated]);

  const buildRadarUrl = useCallback(() => {
    const baseUrl = "https://radar.wo-cloud.com/desktop";
    const coordinates = lat && lon ? `${lat},${lon}` : "50.93,13.45";

    const params = new URLSearchParams({
      wrx: coordinates,
      wrm: zoom.toString(),
    });

    if (radarType === "rr") {
      params.append("wrl", "compact");
    }

    if (isAnimated) {
      params.append("wrz", "1");
    }

    const radarPath =
      radarType === "rr" ? "rr/compact" : `${radarType}/compact`;

    const url = `${baseUrl}/${radarPath}?${params.toString()}`;

    // Asegurar que la URL esté limpia y no contenga referencias a localhost
    if (url.includes("localhost")) {
      console.warn("URL contains localhost, cleaning...");
      return url
        .replace(/localhost:\d+/gi, "")
        .replace(/http:\/\/\/+/g, "https://")
        .replace(/\/\/+/g, "/");
    }

    return url;
  }, [lat, lon, zoom, radarType, isAnimated]);

  const [radarUrl, setRadarUrl] = useState(buildRadarUrl());

  useEffect(() => {
    setRadarUrl(buildRadarUrl());
  }, [buildRadarUrl]);

  const handleZoomChange = (newZoom) => {
    const clampedZoom = Math.max(1, Math.min(12, newZoom));
    setZoom(clampedZoom);
  };

  return (
    <div className="container">
      <h2 className="title text-2xl font-semibold ">{t.weatherRadar}</h2>
      {lat && lon && (
        <div className="text-center mb-3 text-white/60 text-xs gap-6">
          {t.coordinates}: {lat.toFixed(2)}, {lon.toFixed(2)} | {t.zoom} {zoom}x
        </div>
      )}
      <div className="radar-controls-container">
        <div className="radar-control-group">
          <label className="radar-control-label">{t.type}</label>
          <select
            value={radarType}
            onChange={(e) => setRadarType(e.target.value)}
          >
            <option value="rr">{t.precipitation}</option>
            <option value="cloud">{t.clouds}</option>
            <option value="temp">{t.temperature}</option>
            <option value="wind">{t.wind}</option>
          </select>
        </div>
        <div className="radar-control-group">
          <label className="radar-control-label">{t.zoom}</label>
          <div className="radar-zoom-controls">
            <button
              onClick={() => handleZoomChange(zoom - 1)}
              disabled={zoom <= 1}
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="radar-zoom-value">{zoom}</span>
            <button
              onClick={() => handleZoomChange(zoom + 1)}
              disabled={zoom >= 12}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsAnimated(!isAnimated)}
          aria-label="Toggle animation"
        >
          {isAnimated ? `⏸ ${t.pause}` : `▶ ${t.animation}`}
        </button>
        <button
          onClick={() => {
            setZoom(8);
            setRadarType("rr");
            setIsAnimated(false);
          }}
          aria-label="Reset radar"
        >
          ↻ {t.reset}
        </button>
      </div>

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
