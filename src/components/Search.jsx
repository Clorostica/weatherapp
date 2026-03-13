import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLang } from "../components/useLang";
import GlassSurface from "./GlassSurface";

const GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";

const Search = ({ onSearch }) => {
  const [cityQuery, setCityQuery]             = useState("");
  const [warning, setWarning]                 = useState("");
  const [suggestions, setSuggestions]         = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownPos, setDropdownPos]         = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const { t } = useLang();

  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  /* Fetch suggestions with debounce */
  useEffect(() => {
    if (cityQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res  = await fetch(`${GEOCODING_URL}?q=${encodeURIComponent(cityQuery)}&limit=6&appid=${apiKey}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setSuggestions(list);
        if (list.length > 0 && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDropdownPos({
            top:   rect.bottom + 6,
            left:  rect.left,
            width: rect.width,
          });
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [cityQuery, apiKey]);

  /* Close on outside click */
  useEffect(() => {
    if (!showSuggestions) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSuggestions]);

  const handleSubmit = () => {
    if (cityQuery.trim() === "") { setWarning("⚠️ write a city name"); return; }
    setWarning("");
    setShowSuggestions(false);
    onSearch(cityQuery.trim());
  };

  const handleSelect = (item) => {
    const name  = item.local_names?.es || item.local_names?.en || item.name;
    const label = `${name}, ${item.country}`;
    setCityQuery(label);
    setSuggestions([]);
    setShowSuggestions(false);
    setWarning("");
    onSearch(label);
  };

  const dropdown = showSuggestions && suggestions.length > 0 && createPortal(
    <ul
      className="search-suggestions"
      style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
    >
      {suggestions.map((item, i) => {
        const name  = item.local_names?.es || item.local_names?.en || item.name;
        const state = item.state ? `${item.state}, ` : "";
        return (
          <li
            key={i}
            className="search-suggestion-item"
            onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
          >
            <span className="search-suggestion-pin">📍</span>
            <span className="search-suggestion-name">{name}</span>
            <span className="search-suggestion-meta">{state}{item.country}</span>
          </li>
        );
      })}
    </ul>,
    document.body
  );

  return (
    <div className="search-container" ref={containerRef}>
      <GlassSurface width="100%" style={{ minHeight: "50px", height: "auto" }}>
        <div className="search-row">
          <div className="search-pin-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>

          <input
            type="text"
            value={cityQuery}
            onChange={(e) => { setCityQuery(e.target.value); if (warning) setWarning(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter")  { setShowSuggestions(false); handleSubmit(); }
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            onClick={() => showSuggestions ? setShowSuggestions(false) : suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={t.writeCity}
            className="search-input"
            style={{
              flex: 1,
              minWidth: 0,
              paddingLeft: "30px",
              paddingRight: "8px",
              paddingTop: "12px",
              paddingBottom: "12px",
              border: "none",
              background: "transparent",
              outline: "none",
              color: "white",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            autoComplete="off"
          />

          <button
            onClick={handleSubmit}
            aria-label="Search city"
            className="search-btn-inner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              style={{ color: "white" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </button>
        </div>
      </GlassSurface>

      {dropdown}

      {warning && <div className="warning">{warning}</div>}
      <div className="enter">{t.pressEnter}</div>
    </div>
  );
};

export default Search;
