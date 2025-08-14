import { useState } from "react";

const Search = ({ onSearch }) => {
  const [cityQuery, setCityQuery] = useState("");
  const [warning, setWarning] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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
      <div className="line" />
      <h3 className="search-title">Write the city</h3>

      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          gap: "12px",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1",
          }}
        >
          <input
            className="fancy-input"
            type="text"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              if (warning) setWarning("");
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyPress}
            placeholder="Ej: Madrid, Buenos Aires, Tokio..."
          />
          <div
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.6)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>

        <button
          className="button-search"
          onClick={handleSubmit}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.25))";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "translateY(0)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "translateY(-2px)";
          }}
          aria-label="Write the city"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </button>
      </div>

      {warning && <div className="warning">{warning}</div>}
      <div className="enter">Press enter</div>
    </div>
  );
};

export default Search;
