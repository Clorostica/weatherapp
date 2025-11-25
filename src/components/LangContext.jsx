import { useState, useMemo, useCallback } from "react";
import { translations } from "./Translations";
import { LangContext } from "./LangContextValue";

let safeTranslations = {
  en: {},
  es: {},
};

try {
  if (translations && translations.en && translations.es) {
    safeTranslations = translations;
  } else {
    console.error("Error: Translations not loaded correctly", translations);
  }
} catch (error) {
  console.error("Error loading translations:", error);
}

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  const switchLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  const contextValue = useMemo(() => {
    try {
      const currentLang = lang || "en";
      const translationsForLang =
        safeTranslations[currentLang] || safeTranslations.en || {};

      return {
        lang: currentLang,
        switchLang,
        t: translationsForLang,
      };
    } catch (error) {
      console.error("Error in LangProvider contextValue:", error);

      return {
        lang: "en",
        switchLang,
        t: safeTranslations.en || {},
      };
    }
  }, [lang, switchLang]);

  if (!children) {
    console.warn("LangProvider: children is undefined");
    return null;
  }

  try {
    return (
      <LangContext.Provider value={contextValue}>
        {children}
      </LangContext.Provider>
    );
  } catch (error) {
    console.error("Error rendering LangProvider:", error);
    return <div>Error loading language context</div>;
  }
};
