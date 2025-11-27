import { useState } from "react";
import { useLang } from "../components/useLang";
import GlassSurface from "./GlassSurface";

const Search = ({ onSearch }) => {
  const [cityQuery, setCityQuery] = useState("");
  const [warning, setWarning] = useState("");
  const { t } = useLang();

  const handleSubmit = () => {
    if (cityQuery.trim() === "") {
      setWarning("⚠️ write a city name");
      return;
    }
    setWarning("");
    onSearch(cityQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="search-container">
      <div
        style={{
          position: "relative",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",

            width: "100%",
          }}
        >
          <GlassSurface
            width="100%"
            height="100%"
            style={{
              minHeight: "65px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.6)",
                pointerEvents: "none",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                if (warning) setWarning("");
              }}
              onKeyDown={handleKeyPress}
              placeholder="Write a city name.."
              style={{
                width: "100%",
                height: "100%",
                paddingLeft: "48px",
                paddingRight: "16px",
                paddingTop: "16px",
                paddingBottom: "16px",
                border: "none",
                background: "transparent",
                outline: "none",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              className="search-input"
            />
          </GlassSurface>
        </div>

        <GlassSurface
          width="65px"
          height="65px"
          style={{
            minWidth: "65px",
            minHeight: "65px",
            cursor: "pointer",
          }}
        >
          <button
            onClick={handleSubmit}
            onMouseEnter={(e) => {
              e.currentTarget.parentElement.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.parentElement.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.parentElement.style.transform = "translateY(0)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.parentElement.style.transform =
                "translateY(-2px)";
            }}
            aria-label="Write the city"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "transparent",
              outline: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              style={{
                color: "white",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </button>
        </GlassSurface>
      </div>

      {warning && <div className="warning">{warning}</div>}
      <div className="enter">{t.pressEnter}</div>
    </div>
  );
};

export default Search;
