import { useContext } from "react";
import { LangContext } from "./LangContextValue";

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("❌ useLang must be used inside of a LangProvider");
  }
  return context;
};

