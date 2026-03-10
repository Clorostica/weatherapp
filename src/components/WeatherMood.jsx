import { memo } from "react";
import { useLang } from "./useLang";

const getWindNote = (speed, isEs) => {
  if (speed > 10) return { icon: "🌪️", label: isEs ? "Viento fuerte" : "Strong winds", value: `${Math.round(speed)} m/s` };
  if (speed >= 5)  return { icon: "🌬️", label: isEs ? "Viento moderado" : "Breezy",       value: `${Math.round(speed)} m/s` };
  if (speed >= 2)  return { icon: "🍃", label: isEs ? "Brisa ligera" : "Light breeze",     value: `${Math.round(speed)} m/s` };
  return null;
};

const getMoodData = (weather, isEs) => {
  const code      = weather.weather?.[0]?.id   ?? 800;
  const temp      = weather.main?.temp          ?? 20;
  const hour      = new Date().getHours();
  const isNight   = hour < 6 || hour >= 20;
  const isMorning = hour >= 5 && hour < 10;

  /* ── Thunderstorm 200–232 ── */
  if (code >= 200 && code <= 232) {
    const isHeavy = [202, 212, 221, 232].includes(code);
    if (isHeavy) return {
      weatherEmoji: "⛈️", moodEmoji: "🌪️",
      mood: isEs ? "Clima Salvaje" : "Wild Weather",
      vibe: isEs ? "La tormenta manda hoy." : "The storm is in charge today.",
      tip:  isEs ? "Evita salir. Quédate seguro." : "Avoid going out. Stay safe.",
      color: "#c084fc",
    };
    if (isNight) return {
      weatherEmoji: "⛈️", moodEmoji: "🌑",
      mood: isEs ? "Dramático" : "Dramatic",
      vibe: isEs ? "Tormenta nocturna — poderosa y misteriosa." : "Nighttime storm — powerful and mysterious.",
      tip:  isEs ? "Cierra ventanas y relájate en casa." : "Close the windows and relax at home.",
      color: "#818cf8",
    };
    return {
      weatherEmoji: "⛈️", moodEmoji: "⚡",
      mood: isEs ? "Intenso" : "Intense",
      vibe: isEs ? "El clima exterior es poderoso." : "Powerful weather outside.",
      tip:  isEs ? "Quédate en casa — día perfecto para una película." : "Stay indoors — perfect day for a movie.",
      color: "#a78bfa",
    };
  }

  /* ── Drizzle 300–321 ── */
  if (code >= 300 && code <= 321) return {
    weatherEmoji: "🌦️", moodEmoji: "☕",
    mood: isEs ? "Acogedor" : "Cozy",
    vibe: isEs ? "Llovizna suave — perfecto para café." : "Soft drizzle — perfect for coffee.",
    tip:  isEs ? "Un paraguas pequeño te será útil." : "A small umbrella will come in handy.",
    color: "#60a5fa",
  };

  /* ── Rain 500–531 ── */
  if (code >= 500 && code <= 531) {
    if (temp > 22) return {
      weatherEmoji: "🌧️", moodEmoji: "🌴",
      mood: isEs ? "Lluvia Tropical" : "Tropical Rain",
      vibe: isEs ? "Lluvia cálida — refrescante y exótica." : "Warm rain — refreshing and exotic.",
      tip:  isEs ? "Ropa ligera e impermeable." : "Light and waterproof clothing.",
      color: "#34d399",
    };
    if (temp >= 15) return {
      weatherEmoji: "🌧️", moodEmoji: "☕",
      mood: isEs ? "Acogedor" : "Cozy",
      vibe: isEs ? "Clima perfecto para té y quedarse adentro." : "Perfect weather for tea, coffee, and staying inside.",
      tip:  isEs ? "Lleva paraguas y algo impermeable." : "Bring an umbrella and a waterproof layer.",
      color: "#60a5fa",
    };
    if (temp >= 5) return {
      weatherEmoji: "🌧️", moodEmoji: "🎧",
      mood: isEs ? "Nostálgico" : "Nostalgic",
      vibe: isEs ? "Lluvia fría que invita a la reflexión." : "Cold rain that invites reflection.",
      tip:  isEs ? "Abrígate bien y lleva paraguas." : "Bundle up and carry an umbrella.",
      color: "#7dd3fc",
    };
    return {
      weatherEmoji: "🌧️", moodEmoji: "🥶",
      mood: isEs ? "Frío y Húmedo" : "Cold & Wet",
      vibe: isEs ? "Lluvia helada — el frío cala los huesos." : "Icy rain — the cold cuts deep.",
      tip:  isEs ? "Abrigo impermeable, botas y guantes." : "Waterproof coat, boots, and gloves.",
      color: "#93c5fd",
    };
  }

  /* ── Snow 600–622 ── */
  if (code >= 600 && code <= 622) {
    if (temp < -5) return {
      weatherEmoji: "❄️", moodEmoji: "🥶",
      mood: isEs ? "Mundo Congelado" : "Frozen World",
      vibe: isEs ? "El frío extremo paraliza todo." : "Extreme cold freezes everything still.",
      tip:  isEs ? "Capas térmicas, abrigo, botas y guantes. En serio." : "Thermal layers, coat, boots, and gloves. Seriously.",
      color: "#7dd3fc",
    };
    const isHeavy = code === 602 || code === 621 || code === 622;
    if (isHeavy) return {
      weatherEmoji: "⛄", moodEmoji: "⛄",
      mood: "Winter Wonderland",
      vibe: isEs ? "Nieve intensa — el mundo desaparece en blanco." : "Heavy snow — the world fades to white.",
      tip:  isEs ? "Abrigo grueso, botas impermeables y guantes." : "Heavy coat, waterproof boots, and gloves.",
      color: "#93c5fd",
    };
    return {
      weatherEmoji: "❄️", moodEmoji: "✨",
      mood: isEs ? "Mágico" : "Magical",
      vibe: isEs ? "Todo se siente silencioso y mágico." : "Everything feels quiet and magical.",
      tip:  isEs ? "Abrigo, botas y guantes." : "Coat, boots, and gloves.",
      color: "#bfdbfe",
    };
  }

  /* ── Atmosphere 701–781 ── */
  if (code >= 701 && code <= 781) {
    if (code === 741) return {
      weatherEmoji: "🌫️", moodEmoji: "🕵️",
      mood: isEs ? "Misterioso" : "Mysterious",
      vibe: isEs ? "Niebla densa — el mundo desaparece ante ti." : "Dense fog — the world disappears before you.",
      tip:  isEs ? "Conduce despacio y con luces encendidas." : "Drive slow with headlights on.",
      color: "#64748b",
    };
    if (isMorning) return {
      weatherEmoji: "🌫️", moodEmoji: "🌅",
      mood: isEs ? "Soñador" : "Dreamy",
      vibe: isEs ? "Mañana brumosa — tranquila y etérea." : "Misty morning — quiet and ethereal.",
      tip:  isEs ? "Lleva capas, la niebla suele traer frío." : "Layer up, mist usually brings cold.",
      color: "#94a3b8",
    };
    if (isNight) return {
      weatherEmoji: "🌫️", moodEmoji: "🎬",
      mood: isEs ? "Cinematográfico" : "Cinematic",
      vibe: isEs ? "El mundo parece una escena de película." : "The world feels like a movie scene.",
      tip:  isEs ? "Conduce con cuidado y lleva capas." : "Drive carefully and layer up.",
      color: "#475569",
    };
    return {
      weatherEmoji: "🌫️", moodEmoji: "🕵️",
      mood: isEs ? "Misterioso" : "Mysterious",
      vibe: isEs ? "La niebla envuelve todo en misterio." : "The mist wraps everything in mystery.",
      tip:  isEs ? "Conduce con cuidado y lleva capas." : "Drive carefully and layer up.",
      color: "#94a3b8",
    };
  }

  /* ── Clear 800 ── */
  if (code === 800) {
    if (temp > 30) return {
      weatherEmoji: "☀️", moodEmoji: "🏖️",
      mood: isEs ? "Beach Mood" : "Beach Mood",
      vibe: isEs ? "El sol abrasa — es hora de la playa." : "The sun is blazing — beach time.",
      tip:  isEs ? "Ropa muy ligera, FPS 50+ y mucha agua." : "Very light clothes, SPF 50+ sunscreen, and lots of water.",
      color: "#f97316",
    };
    if (temp >= 24) return {
      weatherEmoji: "☀️", moodEmoji: "😎",
      mood: "Summer Vibes",
      vibe: isEs ? "Calor veraniego perfecto para disfrutar." : "Perfect summer heat to enjoy.",
      tip:  isEs ? "Ropa ligera, lentes de sol y protector solar." : "Light clothes, sunglasses, and sunscreen.",
      color: "#f59e0b",
    };
    if (temp >= 18) return {
      weatherEmoji: "☀️", moodEmoji: "😊",
      mood: isEs ? "Feliz" : "Happy Mood",
      vibe: isEs ? "Día soleado y agradable — aprovéchalo." : "Sunny and pleasant — make the most of it.",
      tip:  isEs ? "Ropa cómoda y lentes de sol." : "Comfortable clothes and sunglasses.",
      color: "#fbbf24",
    };
    return {
      weatherEmoji: "☀️", moodEmoji: "🌞",
      mood: isEs ? "Fresco y Brillante" : "Fresh & Bright",
      vibe: isEs ? "Sol fresco que despierta los sentidos." : "Cool sunshine that sharpens the senses.",
      tip:  isEs ? "Chaqueta ligera con los lentes de sol." : "A light jacket with your sunglasses.",
      color: "#34d399",
    };
  }

  /* ── Partly Cloudy 801–802 ── */
  if (code >= 801 && code <= 802) {
    if (temp > 25) return {
      weatherEmoji: "🌤️", moodEmoji: "🌴",
      mood: isEs ? "Verano Tranquilo" : "Chill Summer",
      vibe: isEs ? "Nubecitas que alivian el calor." : "Clouds that soften the summer heat.",
      tip:  isEs ? "Ropa ligera. El sol saldrá y se irá." : "Light clothing. Sun will come and go.",
      color: "#34d399",
    };
    if (temp >= 15) return {
      weatherEmoji: "🌤️", moodEmoji: "⚖️",
      mood: isEs ? "Equilibrado" : "Balanced",
      vibe: isEs ? "Clima equilibrado. Buen día para concentrarse." : "Nice balanced weather. Good day to focus.",
      tip:  isEs ? "Una chaqueta ligera por si refresca." : "A light jacket just in case.",
      color: "#6ee7b7",
    };
    return {
      weatherEmoji: "🌤️", moodEmoji: "🌬️",
      mood: isEs ? "Fresco y Ventoso" : "Breezy",
      vibe: isEs ? "Fresco y algo ventoso — revitalizante." : "Cool and a bit breezy — revitalizing.",
      tip:  isEs ? "Chaqueta y quizás una bufanda." : "Jacket and maybe a scarf.",
      color: "#93c5fd",
    };
  }

  /* ── Cloudy 803–804 ── */
  if (code >= 803 && code <= 804) {
    if (temp > 20) return {
      weatherEmoji: "☁️", moodEmoji: "😴",
      mood: isEs ? "Día Perezoso" : "Lazy Day",
      vibe: isEs ? "Nubes cálidas que invitan a la calma." : "Warm clouds inviting you to slow down.",
      tip:  isEs ? "Ropa cómoda — día perfecto para tomarlo con calma." : "Comfy clothes — perfect day to take it easy.",
      color: "#a8a29e",
    };
    if (temp >= 10) return {
      weatherEmoji: "☁️", moodEmoji: "📖",
      mood: isEs ? "Reflexivo" : "Reflective",
      vibe: isEs ? "Un día tranquilo para pensar o leer." : "A calm day for thinking or reading.",
      tip:  isEs ? "Un suéter ligero es suficiente." : "A light sweater is all you need.",
      color: "#94a3b8",
    };
    return {
      weatherEmoji: "☁️", moodEmoji: "🧥",
      mood: isEs ? "Acogedor" : "Cozy",
      vibe: isEs ? "Frío y nublado — perfecto para estar en casa." : "Cold and grey — perfect to stay home.",
      tip:  isEs ? "Abrigo, bufanda y ropa de abrigo." : "Coat, scarf, and warm layers.",
      color: "#78716c",
    };
  }

  /* ── Fallback ── */
  return {
    weatherEmoji: "🌡️", moodEmoji: "🌈",
    mood: isEs ? "Variable" : "Variable",
    vibe: isEs ? "El clima tiene sus propias reglas hoy." : "Weather has its own rules today.",
    tip:  isEs ? "Viste en capas, por si acaso." : "Layer up, just in case.",
    color: "#cbd5e1",
  };
};

export const WeatherMood = memo(function WeatherMood({ weather }) {
  const { lang } = useLang();
  if (!weather) return null;

  const isEs     = lang === "es";
  const windNote = getWindNote(weather.wind?.speed ?? 0, isEs);
  const { weatherEmoji, moodEmoji, mood, vibe, tip, color } = getMoodData(weather, isEs);

  return (
    <div className="container wm-card">
      <div className="wm-accent" style={{ background: color }} />
      <div className="wm-content">
        <div className="wm-header">
          <span className="wm-emoji">{weatherEmoji}</span>
          <div>
            <p className="wm-eyebrow">
              {isEs ? "Estado de ánimo del día" : "Mood of the day"}
            </p>
            <h2 className="wm-mood" style={{ color }}>
              {mood} <span className="wm-mood-icon">{moodEmoji}</span>
            </h2>
          </div>
        </div>

        <p className="wm-vibe">"{vibe}"</p>

        <div className="wm-bottom">
          <div className="wm-tip">
            <span className="wm-tip-icon">👔</span>
            <span className="wm-tip-text">{tip}</span>
          </div>

          {windNote && (
            <div className="wm-wind">
              <span className="wm-wind-icon">{windNote.icon}</span>
              <span className="wm-wind-label">{windNote.label}</span>
              <span className="wm-wind-val">{windNote.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
