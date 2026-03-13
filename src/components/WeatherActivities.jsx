import { memo, useState } from "react";
import { useLang } from "./useLang";

/* ── Normalize city name for matching ── */
const norm = (s) =>
  s.toLowerCase()
    .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u").replace(/ñ/g, "n")
    .replace(/\s+/g, " ").trim();

/* ── Curated places per city ── */
const PLACES = {
  "paris":         { out: ["🗼 Eiffel Tower","🌳 Luxembourg Gardens","🚶 Montmartre Walk","🏰 Palace of Versailles"], ind: ["🖼️ Louvre Museum","🎨 Musée d'Orsay","☕ Le Marais Cafés","🏛️ Centre Pompidou"] },
  "london":        { out: ["🌉 Tower Bridge","🌳 Hyde Park","🚢 Thames Walk","🏰 Buckingham Palace"], ind: ["🏛️ British Museum","🎨 National Gallery","🎭 West End","☕ Borough Market"] },
  "new york":      { out: ["🗽 Statue of Liberty","🌳 Central Park","🌉 Brooklyn Bridge","🏙️ High Line"], ind: ["🎨 MoMA","🏛️ Metropolitan Museum","🎭 Broadway","☕ Chelsea Market"] },
  "tokyo":         { out: ["⛩️ Senso-ji Temple","🌸 Shinjuku Gyoen","🗼 Tokyo Tower","🏮 Asakusa"], ind: ["🎨 teamLab Planets","🛍️ Shibuya","🍣 Tsukiji Market","🎌 Tokyo National Museum"] },
  "barcelona":     { out: ["⛪ Sagrada Família","🌊 Barceloneta Beach","🌳 Park Güell","🚶 Las Ramblas"], ind: ["🎨 Picasso Museum","🛍️ La Boqueria","🏛️ MNAC","☕ El Born Cafés"] },
  "rome":          { out: ["🏛️ Colosseum","⛲ Trevi Fountain","🌳 Villa Borghese","🚶 Roman Forum"], ind: ["🏛️ Vatican Museums","🎨 Borghese Gallery","☕ Espresso Bars","🛍️ Campo de' Fiori"] },
  "amsterdam":     { out: ["🌷 Keukenhof Gardens","🚴 Vondelpark","🚢 Canal Cruise","🌉 Jordaan Walk"], ind: ["🎨 Rijksmuseum","🖼️ Van Gogh Museum","🏛️ Anne Frank House","☕ Brown Cafés"] },
  "dubai":         { out: ["🏙️ Burj Khalifa View","🏖️ Jumeirah Beach","🚢 Dubai Creek","🌃 Dubai Marina"], ind: ["🛍️ Dubai Mall","🏛️ Dubai Museum","🎢 IMG Worlds","☕ Café Culture"] },
  "singapore":     { out: ["🌿 Gardens by the Bay","🌊 Sentosa Island","🚶 Marina Bay Walk","🌳 MacRitchie Reservoir"], ind: ["🛍️ Orchard Road","🏛️ National Museum","🎨 National Gallery","🍜 Hawker Centers"] },
  "istanbul":      { out: ["🕌 Hagia Sophia","🌉 Bosphorus Cruise","🛍️ Grand Bazaar","🚶 Galata Walk"], ind: ["🏛️ Topkapi Palace","☕ Turkish Tea Houses","🎨 Istanbul Modern","🛍️ Spice Bazaar"] },
  "bangkok":       { out: ["⛩️ Grand Palace","🛶 Chao Phraya","🌳 Lumphini Park","🏮 Wat Pho"], ind: ["🛍️ Chatuchak Market","🏛️ Jim Thompson House","☕ Café Hopping","🎨 BACC"] },
  "sydney":        { out: ["🎭 Opera House","🌊 Bondi Beach","🌉 Harbour Bridge","🌳 Royal Botanic Garden"], ind: ["🏛️ Australian Museum","🎨 Art Gallery NSW","☕ Surry Hills Cafés","🛍️ Queen Victoria Building"] },
  "madrid":        { out: ["🌳 Retiro Park","🏰 Royal Palace","🚶 Gran Vía","🌇 Templo de Debod"], ind: ["🎨 Prado Museum","🏛️ Reina Sofía","☕ Café Gijón","🛍️ Mercado de San Miguel"] },
  "berlin":        { out: ["🏛️ Brandenburg Gate","🌳 Tiergarten","🧱 East Side Gallery","🚶 Museum Island"], ind: ["🏛️ Pergamon Museum","🎨 Hamburger Bahnhof","☕ Café Culture","🎭 Philharmonie"] },
  "athens":        { out: ["🏛️ Acropolis","🚶 Plaka Walk","⛵ Cape Sounion","🌅 Lycabettus Hill"], ind: ["🏛️ Acropolis Museum","🎨 Benaki Museum","☕ Monastiraki Cafés","🛍️ Athens Market"] },
  "lisbon":        { out: ["🚋 Tram 28","🏰 São Jorge Castle","🌉 25 de Abril Bridge","🚶 Alfama Walk"], ind: ["🏛️ MAAT Museum","☕ Pastéis de Belém","🎨 Berardo Collection","🎭 Fado Show"] },
  "prague":        { out: ["🏰 Prague Castle","🌉 Charles Bridge","🚶 Old Town Walk","🌳 Letná Park"], ind: ["🎨 Mucha Museum","🏛️ National Museum","🍺 Traditional Pub","🎭 Opera House"] },
  "vienna":        { out: ["🌳 Schönbrunn Palace","🚶 Ringstraße Walk","⛲ Belvedere Gardens","🌸 Prater Park"], ind: ["🎨 Kunsthistorisches Museum","🎭 Vienna Opera","☕ Café Sacher","🏛️ Albertina"] },
  "budapest":      { out: ["🏰 Buda Castle","🌉 Chain Bridge","🚶 Danube Walk","🌳 Margaret Island"], ind: ["♨️ Thermal Baths","🏛️ Hungarian Parliament","🎨 National Gallery","☕ Ruin Bars"] },
  "marrakech":     { out: ["🕌 Koutoubia Mosque","🌳 Majorelle Garden","🚶 Medina Walk","🌅 Djemaa el-Fna"], ind: ["🛍️ Souk Shopping","🏛️ Bahia Palace","🎨 Yves Saint Laurent Museum","☕ Traditional Tea"] },
  "buenos aires":  { out: ["🚶 San Telmo Walk","🌳 Bosques de Palermo","🏛️ La Recoleta","🎭 Caminito La Boca"], ind: ["🎨 MALBA","🏛️ Teatro Colón","☕ Café Tortoni","🛍️ Mercado de San Telmo"] },
  "rio de janeiro":{ out: ["🏔️ Christ the Redeemer","🏖️ Copacabana Beach","🌿 Tijuca Forest","🚡 Sugarloaf Mountain"], ind: ["🏛️ National Museum","🎨 Instituto Moreira Salles","☕ Santa Teresa Cafés","🛍️ Shopping Leblon"] },
  "mexico city":   { out: ["🏛️ Zócalo","🌳 Bosque de Chapultepec","🏺 Teotihuacán","🚶 Coyoacán Walk"], ind: ["🏛️ Anthropology Museum","🎨 Frida Kahlo Museum","☕ Café de Tacuba","🛍️ Mercado de Artesanías"] },
  "seoul":         { out: ["🏰 Gyeongbokgung Palace","🌸 Bukhansan Park","🚶 Cheonggyecheon Walk","🌃 N Seoul Tower"], ind: ["🛍️ Myeongdong","🏛️ National Museum","🎨 Leeum Museum","☕ Insadong Tea Houses"] },
  "hong kong":     { out: ["🚡 Victoria Peak","🌊 Stanley Market","🛶 Star Ferry","🌃 Tsim Sha Tsui"], ind: ["🏛️ Heritage Museum","🛍️ Ladies' Market","🎨 M+ Museum","🍜 Dim Sum"] },
  "cape town":     { out: ["⛰️ Table Mountain","🌊 Boulders Beach","🌿 Kirstenbosch Gardens","🏖️ Clifton Beach"], ind: ["🏛️ District Six Museum","🎨 Zeitz MOCAA","☕ V&A Waterfront","🛍️ Cape Quarter"] },
  "bali":          { out: ["🌿 Tegalalang Rice Terraces","🏖️ Seminyak Beach","⛩️ Tanah Lot Temple","🌅 Mount Batur"], ind: ["💆 Spa Treatments","🛍️ Ubud Market","🎨 Neka Art Museum","☕ Ubud Cafés"] },
  "cairo":         { out: ["🏺 Pyramids of Giza","🦁 Great Sphinx","⛵ Nile Cruise","🕌 Khan el-Khalili"], ind: ["🏛️ Egyptian Museum","🎨 Mohamed Mahmoud Khalil Museum","☕ Naguib Mahfouz Café","🛍️ Wekala Bazaar"] },
  "mumbai":        { out: ["🌊 Marine Drive","🏛️ Gateway of India","🚶 Colaba Walk","🌅 Juhu Beach"], ind: ["🏛️ Chhatrapati Shivaji Museum","🎨 Jehangir Art Gallery","🛍️ Crawford Market","☕ Irani Cafés"] },
  "toronto":       { out: ["🗼 CN Tower View","🌳 High Park","🚶 Distillery District","🌊 Toronto Islands"], ind: ["🏛️ Royal Ontario Museum","🎨 Art Gallery of Ontario","☕ Kensington Market","🎭 TIFF Lightbox"] },
  "los angeles":   { out: ["🌴 Venice Beach","🌟 Hollywood Walk","🌳 Griffith Park","🏖️ Santa Monica Pier"], ind: ["🎨 LACMA","🏛️ Getty Museum","🎬 The Grove","☕ Silver Lake Cafés"] },
  "miami":         { out: ["🏖️ South Beach","🌊 Ocean Drive Walk","⛵ Biscayne Bay","🌴 Wynwood Walls"], ind: ["🎨 Pérez Art Museum","🏛️ History Miami","☕ Little Havana Cafés","🛍️ Bayside Marketplace"] },
  "chicago":       { out: ["🌆 Millennium Park","🚶 Riverwalk","⛵ Lake Michigan","🏛️ Lincoln Park Zoo"], ind: ["🎨 Art Institute of Chicago","🏛️ Museum of Science","☕ Logan Square Cafés","🎭 Chicago Theater"] },
};

/* ── Match city name to curated places ── */
const getCityPlaces = (cityName, isIndoor) => {
  const n = norm(cityName);
  for (const [key, p] of Object.entries(PLACES)) {
    if (n.includes(key) || key.includes(n)) return isIndoor ? p.ind : p.out;
  }
  return null;
};

/* ── Generic place categories when city not in curated list ── */
const getGenericPlaces = (isIndoor, isEs) => isIndoor
  ? (isEs
    ? ["🏛️ Museos locales","🎨 Galerías de arte","☕ Cafés acogedores","🛍️ Mercados cubiertos"]
    : ["🏛️ Local museums","🎨 Art galleries","☕ Cozy cafés","🛍️ Indoor markets"])
  : (isEs
    ? ["🌳 Parques y jardines","📷 Miradores","🚶 Recorridos a pie","🍽️ Terrazas"]
    : ["🌳 Parks & gardens","📷 Viewpoints","🚶 Walking tours","🍽️ Outdoor dining"]);

/* ── Activities by weather condition ── */
const getActivities = (weather, isEs) => {
  const code = weather.weather?.[0]?.id ?? 800;
  const temp = weather.main?.temp ?? 20;

  if (code >= 200 && code <= 232) return {
    label: isEs ? "🏠 Quédate en casa" : "🏠 Stay inside",
    chips: isEs
      ? [{ i:"🎬", t:"Cine" },{ i:"☕", t:"Café" },{ i:"🎨", t:"Galería" },{ i:"📚", t:"Leer" }]
      : [{ i:"🎬", t:"Movies" },{ i:"☕", t:"Café" },{ i:"🎨", t:"Gallery" },{ i:"📚", t:"Reading" }],
    indoor: true,
  };
  if ((code >= 300 && code <= 321) || (code >= 500 && code <= 531)) return {
    label: isEs ? "🌧️ Planes para la lluvia" : "🌧️ Rainy day plans",
    chips: isEs
      ? [{ i:"🏛️", t:"Museos" },{ i:"☕", t:"Cafés" },{ i:"🎨", t:"Galerías" },{ i:"🛍️", t:"Shopping" }]
      : [{ i:"🏛️", t:"Museums" },{ i:"☕", t:"Cozy cafés" },{ i:"🎨", t:"Galleries" },{ i:"🛍️", t:"Shopping" }],
    indoor: true,
  };
  if (code >= 600 && code <= 622) return {
    label: isEs ? "❄️ Actividades de invierno" : "❄️ Winter activities",
    chips: isEs
      ? [{ i:"⛄", t:"Parques nevados" },{ i:"☕", t:"Chocolate caliente" },{ i:"📷", t:"Fotos de nieve" },{ i:"🏛️", t:"Museos" }]
      : [{ i:"⛄", t:"Snowy parks" },{ i:"☕", t:"Hot chocolate" },{ i:"📷", t:"Snow photos" },{ i:"🏛️", t:"Museums" }],
    indoor: false,
  };
  if (code >= 701 && code <= 781) return {
    label: isEs ? "🌫️ Día con niebla" : "🌫️ Foggy day",
    chips: isEs
      ? [{ i:"📷", t:"Foto atmosférica" },{ i:"☕", t:"Café" },{ i:"🏛️", t:"Museo" },{ i:"🎨", t:"Galería" }]
      : [{ i:"📷", t:"Moody photos" },{ i:"☕", t:"Coffee" },{ i:"🏛️", t:"Museum" },{ i:"🎨", t:"Gallery" }],
    indoor: true,
  };
  if (code === 800 || code === 801) {
    if (temp > 28) return {
      label: isEs ? "🏖️ ¡Día de verano!" : "🏖️ Summer day!",
      chips: isEs
        ? [{ i:"🏊", t:"Piscina / playa" },{ i:"🍦", t:"Heladería" },{ i:"🌊", t:"Actividades acuáticas" },{ i:"🌅", t:"Atardecer" }]
        : [{ i:"🏊", t:"Pool / beach" },{ i:"🍦", t:"Ice cream" },{ i:"🌊", t:"Water sports" },{ i:"🌅", t:"Sunset" }],
      indoor: false,
    };
    return {
      label: isEs ? "☀️ ¡Día perfecto!" : "☀️ Perfect day!",
      chips: isEs
        ? [{ i:"🌳", t:"Parques" },{ i:"📷", t:"Miradores" },{ i:"🚶", t:"Walking tour" },{ i:"🍽️", t:"Terraza" }]
        : [{ i:"🌳", t:"Parks" },{ i:"📷", t:"Viewpoints" },{ i:"🚶", t:"Walking tour" },{ i:"🍽️", t:"Terrace dining" }],
      indoor: false,
    };
  }
  return {
    label: isEs ? "🌤️ Explora la ciudad" : "🌤️ Explore the city",
    chips: isEs
      ? [{ i:"🏛️", t:"Cultura" },{ i:"🚶", t:"Paseo" },{ i:"☕", t:"Café" },{ i:"🛍️", t:"Tiendas" }]
      : [{ i:"🏛️", t:"Culture" },{ i:"🚶", t:"City walk" },{ i:"☕", t:"Coffee" },{ i:"🛍️", t:"Local shops" }],
    indoor: false,
  };
};

/* ── Component ── */
export const WeatherActivities = memo(function WeatherActivities({ weather }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  if (!weather) return null;

  const isEs = lang === "es";
  const cityName = weather.name ?? "";
  const { label, chips, indoor } = getActivities(weather, isEs);

  const curated = getCityPlaces(cityName, indoor);
  const places  = curated ?? getGenericPlaces(indoor, isEs);

  const placesTitle = indoor
    ? (isEs ? `Lugares bajo techo en ${cityName}` : `Indoor places in ${cityName}`)
    : (isEs ? `Mejores lugares hoy en ${cityName}` : `Best places today in ${cityName}`);

  return (
    <div className="container wa-card">
      <button className="wa-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="wa-toggle-label">
          {isEs ? "¿Qué hacer hoy?" : "What to do today?"}
          <span className="wa-toggle-hint">{label}</span>
        </span>
        <span className={`wa-toggle-arrow${open ? " wa-toggle-arrow--open" : ""}`}>›</span>
      </button>

      {open && (
        <div className="wa-body">
          <div className="wa-chips">
            {chips.map((c, i) => (
              <div key={i} className="wa-chip">
                <span className="wa-chip-icon">{c.i}</span>
                <span className="wa-chip-text">{c.t}</span>
              </div>
            ))}
          </div>

          <div className="wa-divider" />

          <p className="wa-section-label">📍 {placesTitle}</p>
          <ul className="wa-places">
            {places.map((p, i) => (
              <li key={i} className="wa-place-item">{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
