import { memo } from "react";
import "./Cael.css";

const S = 4; // px per grid cell — viewBox: 48 × 76 (12 × 19)

/* ── Palette ── */
const SK  = "#FFCBA4"; // skin
const SK2 = "#F0A882"; // shadow skin (ears, neck shadow)
const EY  = "#1A1A1A"; // dark (eyes, brows)
const EY2 = "#5B9BD5"; // iris blue
const MO  = "#C97B6D"; // mouth
const BL  = "#FFB5A0"; // blush
const NS  = "#D08060"; // nose
const HR  = "#4A2F1A"; // default brown hair

const R = (col, row, fill, w = 1, h = 1) => ({ col, row, fill, w, h });
const toRect = (p, i) => (
  <rect key={i} x={p.col * S} y={p.row * S} width={p.w * S} height={p.h * S} fill={p.fill} />
);

/* ─────────────────────────────────────────
   HEAD — shared, rows 0–7
   Eyebrow row added at row 2.
   Ear pixels at col3 & col8.
   Iris split eyes, blush dots, nose.
───────────────────────────────────────── */
function makeHead(hairColor, sunglasses) {
  const EB = "#3A2010"; // eyebrow dark
  return [
    /* hair */
    R(4, 0, hairColor, 4),
    R(3, 1, hairColor, 6),

    /* ears + face row 2 */
    R(3, 2, SK2),                     // left ear
    R(4, 2, SK, 2),                   // forehead L
    R(4, 2, EB), R(7, 2, EB),         // eyebrows (overlay)
    R(6, 2, SK, 2),                   // forehead R
    R(8, 2, SK2),                     // right ear

    /* hair sides + eye row */
    R(3, 3, hairColor),
    ...(sunglasses
      ? [R(4, 3, EY, 4)]              // shades band
      : [R(4, 3, EY), R(5, 3, EY2), R(6, 3, EY2), R(7, 3, EY)] // eyes: pupil + iris
    ),
    R(8, 3, hairColor),

    /* cheeks + nose */
    R(3, 4, hairColor),
    R(4, 4, BL),                      // blush L
    R(5, 4, SK, 2),                   // cheek center
    R(6, 4, NS),                      // nose
    R(7, 4, BL),                      // blush R
    R(8, 4, hairColor),

    /* hair sides + mouth */
    R(3, 5, hairColor),
    R(4, 5, SK), R(5, 5, MO, 2), R(7, 5, SK),
    R(8, 5, hairColor),

    /* chin */
    R(4, 6, SK, 4),

    /* neck */
    R(5, 7, SK2, 2),
  ];
}

/* ─────────────────────────────────────────
   HOT: coral tee · sky-blue shorts · bare arms · sandals
───────────────────────────────────────── */
function hotParts() {
  const SH = "#FF7043", PT = "#64B5F6", SA = "#A1887F";
  return {
    extraHead: [],
    body: [
      R(3,  8, SH, 6),               // shoulders
      R(3,  9, SH, 6),               // chest
      R(4,  9, "#E64A19"),           // pocket accent
      R(3, 10, SH, 6),               // lower torso
      R(4, 11, PT, 4),               // shorts
      R(4, 12, PT, 4),
    ],
    armL: [
      R(2,  9, SK), R(2, 10, SK), R(2, 11, SK),
      R(2, 12, SK2),                 // forearm shadow
    ],
    armR: [
      R(9,  9, SK), R(9, 10, SK), R(9, 11, SK),
      R(9, 12, SK2),
    ],
    legs: [
      R(4, 13, SK), R(5, 13, SK), R(6, 13, SK), R(7, 13, SK),
      R(4, 14, SK), R(5, 14, SK), R(6, 14, SK), R(7, 14, SK),
      R(3, 15, SA, 2), R(7, 15, SA, 2), // sandals
      R(3, 16, "#6D4C41", 2), R(7, 16, "#6D4C41", 2),
    ],
  };
}

/* ─────────────────────────────────────────
   COLD / SNOWY: navy coat · charcoal hat · red scarf · brown boots
───────────────────────────────────────── */
function coldParts() {
  const CT = "#1565C0", BT = "#4E342E", SC = "#EF5350", HT = "#37474F";
  return {
    extraHead: [
      R(2, 0, HT), R(9, 0, HT),      // hat brim sides
      R(2, 1, HT), R(9, 1, HT),
    ],
    body: [
      R(4, 7, SC, 4),                 // scarf over neck
      R(3,  8, CT, 6),
      R(3,  9, CT, 6),
      R(5,  9, "#0D47A1"),            // button detail
      R(6,  9, "#0D47A1"),
      R(3, 10, CT, 6),
      R(3, 11, CT, 6), R(3, 12, CT, 6),
      R(3, 13, CT, 6), R(3, 14, CT, 6),
    ],
    armL: [
      R(2,  9, CT), R(2, 10, CT), R(2, 11, CT), R(2, 12, CT),
    ],
    armR: [
      R(9,  9, CT), R(9, 10, CT), R(9, 11, CT), R(9, 12, CT),
    ],
    legs: [
      R(3, 15, BT, 2), R(7, 15, BT, 2),
      R(3, 16, "#3E2723", 2), R(7, 16, "#3E2723", 2),
    ],
  };
}

/* ─────────────────────────────────────────
   RAINY / STORMY: yellow raincoat · hood · umbrella · rubber boots
───────────────────────────────────────── */
function rainyParts() {
  const RC = "#FDD835", RB = "#212121", UM = "#CFD8DC", UH = "#6D4C41";
  return {
    extraHead: [
      R(2, 1, RC), R(9, 1, RC),      // hood sides
      R(2, 2, RC), R(9, 2, RC),
    ],
    body: [
      R(3,  8, RC, 6),
      R(3,  9, RC, 5),
      R(6,  9, "#F9A825"),            // closure stripe
      R(3, 10, RC, 6),
      R(3, 11, RC, 6), R(3, 12, RC, 6),
      R(3, 13, RC, 4),
      R(3, 14, RC, 2), R(6, 14, RC, 2),
    ],
    armL: [
      R(2,  9, RC), R(2, 10, RC), R(2, 11, RC), R(2, 12, RC),
    ],
    armR: [
      /* hand holding umbrella handle */
      R(9,  9, RC), R(9, 10, RC),
      /* umbrella canopy */
      R(9,  6, UM, 3),
      R(8,  7, UM, 4),
      R(9,  8, UM, 2),
      /* handle */
      R(10, 9, UH), R(10, 10, UH), R(10, 11, UH), R(10, 12, UH), R(11, 12, UH),
    ],
    legs: [
      R(3, 15, RB, 2), R(7, 15, RB, 2),
      R(3, 16, "#424242", 2), R(7, 16, "#424242", 2),
    ],
  };
}

/* ─────────────────────────────────────────
   CASUAL: teal tee · dark jeans · black sneakers
───────────────────────────────────────── */
function casualParts() {
  const SH = "#26A69A", JN = "#1B3A6B", SW = "#212121";
  return {
    extraHead: [],
    body: [
      R(3,  8, SH, 6),
      R(5,  8, "#1DE9B6"), R(6,  8, "#1DE9B6"), // collar highlight
      R(3,  9, SH, 6),
      R(4,  9, "#1A8076"),                        // pocket
      R(3, 10, SH, 6),
      R(4, 11, JN, 4), R(4, 12, JN, 4),
      R(4, 11, "#122A50", 4),                     // belt
    ],
    armL: [
      R(2,  9, SK), R(2, 10, SK), R(2, 11, SK),
      R(2, 12, SK2),
    ],
    armR: [
      R(9,  9, SK), R(9, 10, SK), R(9, 11, SK),
      R(9, 12, SK2),
    ],
    legs: [
      R(4, 13, JN, 2), R(6, 13, JN, 2),
      R(4, 14, JN, 2), R(6, 14, JN, 2),
      R(3, 15, SW, 2), R(6, 15, SW, 3),           // sneakers
      R(3, 16, "#555", 2), R(6, 16, "#555", 3),   // sole
    ],
  };
}

/* ─────────────────────────────────────────
   NIGHT: dark hoodie · sweatpants · half-closed eyes
───────────────────────────────────────── */
function nightParts() {
  const HD = "#283593", PT = "#37474F", SW = "#1A1A1A";
  return {
    extraHead: [
      R(2, 1, HD), R(9, 1, HD),      // hood
      R(2, 2, HD), R(9, 2, HD),
    ],
    body: [
      R(3,  8, HD, 6),
      R(2,  9, HD), R(3,  9, HD, 6), R(9,  9, HD),
      R(4, 10, "#1A237E", 4),         // pocket
      R(3, 10, HD, 6),
      R(3, 11, PT, 6), R(3, 12, PT, 6),
      R(3, 13, PT, 6), R(3, 14, PT, 6),
    ],
    armL: [
      R(2,  9, HD), R(2, 10, HD), R(2, 11, HD), R(2, 12, HD),
    ],
    armR: [
      R(9,  9, HD), R(9, 10, HD), R(9, 11, HD), R(9, 12, HD),
    ],
    legs: [
      R(3, 15, SW, 2), R(7, 15, SW, 2),
      R(3, 16, "#333", 2), R(7, 16, "#333", 2),
    ],
  };
}

/* ─────────────────────────────────────────
   SNOW PARTICLES — pixel flakes that fall over Cael
───────────────────────────────────────── */
const SNOW_FLAKES = [
  { x: 2,  y: -14, size: 2, dur: 1.9, delay: 0,    drift:  3 },
  { x: 6,  y:  -8, size: 1, dur: 2.3, delay: 0.45, drift: -2 },
  { x: 10, y: -12, size: 2, dur: 1.6, delay: 0.9,  drift:  4 },
  { x: 4,  y:  -6, size: 1, dur: 2.1, delay: 1.3,  drift: -3 },
  { x: 9,  y: -10, size: 2, dur: 2.5, delay: 0.25, drift:  2 },
  { x: 1,  y: -16, size: 1, dur: 1.8, delay: 1.65, drift: -4 },
  { x: 7,  y:  -9, size: 2, dur: 2.0, delay: 0.7,  drift:  3 },
  { x: 11, y: -13, size: 1, dur: 1.7, delay: 1.1,  drift: -2 },
];

/* Sleepy half-closed eyes overlay for night mode */
function nightEyeOverlay() {
  return [
    R(4, 3, "#1A1A1A"),  // left lid (cover top half)
    R(7, 3, "#1A1A1A"),  // right lid
  ];
}

/* ─────────────────────────────────────────
   Cael
───────────────────────────────────────── */
export const Cael = memo(function Cael({ weatherType = "casual" }) {
  const isHot    = weatherType === "hot";
  const isCold   = weatherType === "snowy";
  const isRainy  = weatherType === "rainy";
  const isStormy = weatherType === "stormy";
  const isNight  = weatherType === "night";

  const hairColor =
    isCold            ? "#37474F"
    : (isRainy || isStormy) ? "#FDD835"
    : isNight         ? "#283593"
    : HR;

  const { extraHead, body, armL, armR, legs } =
    isHot            ? hotParts()
    : isCold         ? coldParts()
    : (isRainy || isStormy) ? rainyParts()
    : isNight        ? nightParts()
    :                  casualParts();

  const headRects  = makeHead(hairColor, isHot);
  const eyeOverlay = isNight ? nightEyeOverlay() : [];

  const wt = weatherType; // shorthand for class names

  return (
    <svg
      viewBox="0 0 48 72"
      style={{
        imageRendering: "pixelated",
        shapeRendering: "crispEdges",
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
      aria-label="Cael"
    >
      {/* Legs — bottom layer */}
      <g className={`cael-legs cael-legs--${wt}`}>
        {legs.map(toRect)}
      </g>

      {/* Body / torso */}
      <g className={`cael-body cael-body--${wt}`}>
        {body.map(toRect)}
      </g>

      {/* Left arm */}
      <g className={`cael-arm-l cael-arm-l--${wt}`}>
        {armL.map(toRect)}
      </g>

      {/* Right arm (+ umbrella if rainy) */}
      <g className={`cael-arm-r cael-arm-r--${wt}`}>
        {armR.map(toRect)}
      </g>

      {/* Head — top layer (hood/hat extras rendered first so face overlaps) */}
      <g className={`cael-head cael-head--${wt}`}>
        {extraHead.map(toRect)}
        {headRects.map(toRect)}
        {eyeOverlay.map(toRect)}
      </g>

      {/* Snow particles — only when cold/snowy */}
      {isCold && SNOW_FLAKES.map((f, i) => (
        <rect
          key={`snow-${i}`}
          x={f.x * S}
          y={f.y}
          width={f.size}
          height={f.size}
          fill="#D6EEFF"
          aria-hidden="true"
          style={{
            animation: `caelSnowFall ${f.dur}s linear ${f.delay}s infinite`,
            "--snow-drift": `${f.drift}px`,
          }}
        />
      ))}
    </svg>
  );
});
