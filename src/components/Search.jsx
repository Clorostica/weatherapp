import { useState } from "react";
import { useLang } from "../components/useLang";
import GlassSurface from "./GlassSurface";

const Search = ({ onSearch }) => {
  const [cityQuery, setCityQuery] = useState("");
  const [warning, setWarning]     = useState("");
  const { t } = useLang();

  const handleSubmit = () => {
    if (cityQuery.trim() === "") { setWarning("⚠️ write a city name"); return; }
    setWarning("");
    onSearch(cityQuery);
  };

  return (
    <div className="search-container">
      {/* One glass surface wrapping the entire input row */}
      <GlassSurface width="100%" style={{ minHeight: "50px" }} backgroundOpacity={0.1}>
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
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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

      {warning && <div className="warning">{warning}</div>}
      <div className="enter">{t.pressEnter}</div>
    </div>
  );
};

export default Search;
