import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { translations } from "./translations";

const LangContext = createContext(null);

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  const switchLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  const contextValue = useMemo(
    () => ({
      lang,
      switchLang,
      t: translations[lang],
    }),
    [lang]
  );

  return (
    <LangContext.Provider value={contextValue}>{children}</LangContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("❌ useLang must be used inside of a LangProvider");
  }
  return context;
};
