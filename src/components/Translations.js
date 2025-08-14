import enData from "../locals/en.json";
import esData from "../locals/es.json";

export const fallbackEn = {
  today: "Today",
  tomorrow: "Tomorrow",
  writeCity: "Write the city",
};

export const fallbackEs = {
  today: "Hoy",
  tomorrow: "Mañana",
  writeCity: "Escribe la ciudad",
};

export const translations = {
  en: enData || fallbackEn,
  es: esData || fallbackEs,
};
