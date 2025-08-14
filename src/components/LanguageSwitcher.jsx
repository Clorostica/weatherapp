import { useLang } from "./LangContext";

const LanguageSwitcher = () => {
  const { lang, switchLang } = useLang();

  return (
    <div className="lang-switcher-container">
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
    </div>
  );
};

export default LanguageSwitcher;
