import { useLang } from "./useLang";
import GlassSurface from "./GlassSurface";

const LanguageSwitcher = () => {
  const { lang, switchLang } = useLang();

  return (
    <div className="lang-switcher-container">
      <GlassSurface
        width="140px"
        height="40px"
        style={{
          cursor: "pointer",
        }}
      >
        <div className="lang-switcher" onClick={switchLang}>
          <div
            className={`lang-indicator ${lang === "en" ? "left" : "right"}`}
          ></div>
          <span className={`lang-text ${lang === "en" ? "active" : ""}`}>
            English
          </span>
          <span className={`lang-text ${lang === "es" ? "active" : ""}`}>
            Español
          </span>
        </div>
      </GlassSurface>
    </div>
  );
};

export default LanguageSwitcher;
