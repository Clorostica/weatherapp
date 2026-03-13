import { memo } from "react";
import "./Cael.css";

const S = 4; // px per grid cell — viewBox: 48 × 72 (12 × 18)

/* ── Palette ── */
const SK  = "#FFCBA4"; // skin
const SK2 = "#F0A882"; // shadow skin
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
   HEAD — shared rows 0–7
───────────────────────────────────────── */
function makeHead(hairColor, sunglasses) {
  const EB = "#3A2010";
  return [
    /* hair */
    R(4, 0, hairColor, 4),
    R(3, 1, hairColor, 6),

    /* ears + forehead */
    R(3, 2, SK2),
    R(4, 2, SK, 2),
    R(4, 2, EB), R(7, 2, EB),          // eyebrows
    R(6, 2, SK, 2),
    R(8, 2, SK2),

    /* hair sides + eyes row */
    R(3, 3, hairColor),
    ...(sunglasses
      ? [
          // top frame bar — two dark cells above each lens
          R(4, 2, "#111", 2),           // top frame left
          R(7, 2, "#111", 2),           // top frame right
          // left temple + lenses + bridge
          R(3, 3, "#111"),              // left temple
          R(4, 3, "#FF6D00", 2),        // left lens (orange tint, 2 wide)
          R(6, 3, "#111"),              // bridge
          R(7, 3, "#FF6D00", 2),        // right lens (2 wide)
        ]
      : [R(4, 3, EY), R(5, 3, EY2), R(6, 3, EY2), R(7, 3, EY)]
    ),
    R(8, 3, hairColor),

    /* cheeks + nose */
    R(3, 4, hairColor),
    R(4, 4, BL),
    R(5, 4, SK, 2),
    R(6, 4, NS),
    R(7, 4, BL),
    R(8, 4, hairColor),

    /* mouth */
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
   HOT: coral tee · sky shorts · sunglasses · sandals
───────────────────────────────────────── */
function hotParts() {
  const SH = "#FF7043", PT = "#64B5F6", SA = "#A1887F";
  return {
    extraHead: [],
    body: [
      R(3,  8, SH, 6),
      R(3,  9, SH, 6),
      R(4,  9, "#E64A19"),
      R(3, 10, SH, 6),
      R(4, 11, PT, 4),
      R(4, 12, PT, 4),
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
      R(4, 13, SK), R(5, 13, SK), R(6, 13, SK), R(7, 13, SK),
      R(4, 14, SK), R(5, 14, SK), R(6, 14, SK), R(7, 14, SK),
      R(3, 15, SA, 2), R(7, 15, SA, 2),
      R(3, 16, "#6D4C41", 2), R(7, 16, "#6D4C41", 2),
    ],
    accessories: [],
  };
}

/* ─────────────────────────────────────────
   COLD / SNOWY: navy coat · hat · red scarf · boots
───────────────────────────────────────── */
function coldParts() {
  const CT = "#1565C0", BT = "#4E342E", SC = "#EF5350", HT = "#37474F";
  return {
    extraHead: [
      R(2, 0, HT), R(9, 0, HT),
      R(2, 1, HT), R(9, 1, HT),
    ],
    body: [
      R(4, 7, SC, 4),                   // scarf
      R(3,  8, CT, 6),
      R(3,  9, CT, 6),
      R(5,  9, "#0D47A1"), R(6, 9, "#0D47A1"),
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
    accessories: [],
  };
}

/* ─────────────────────────────────────────
   RAINY / STORMY: yellow raincoat · umbrella · rubber boots
   Umbrella is rendered as a static accessory (above all groups)
   so it doesn't distort with arm animation.
───────────────────────────────────────── */
function rainyParts() {
  const RC = "#FDD835", RB = "#212121";
  const CAN = "#C62828", RIM = "#7F0000", HND = "#5D4037";
  return {
    extraHead: [
      R(2, 1, RC), R(9, 1, RC),         // hood sides
      R(2, 2, RC), R(9, 2, RC),
    ],
    body: [
      R(3,  8, RC, 6),
      R(3,  9, RC, 5),
      R(6,  9, "#F9A825"),
      R(3, 10, RC, 6),
      R(3, 11, RC, 6), R(3, 12, RC, 6),
      R(3, 13, RC, 4),
      R(3, 14, RC, 2), R(6, 14, RC, 2),
    ],
    armL: [
      R(2,  9, RC), R(2, 10, RC), R(2, 11, RC), R(2, 12, RC),
    ],
    /* right arm raised, hand gripping handle at col 10 */
    armR: [
      R(9,  8, RC),
      R(9,  9, RC),
      R(9, 10, SK2),                     // hand gripping
    ],
    legs: [
      R(3, 15, RB, 2), R(7, 15, RB, 2),
      R(3, 16, "#424242", 2), R(7, 16, "#424242", 2),
    ],
    /* ── Umbrella accessory (static, renders above head) ── */
    accessories: [
      /* canopy — bright red dome, right-of-center */
      R(9,  0, CAN, 3),                  // tip:    cols 9-11, y=0
      R(8,  1, CAN, 4),                  // upper:  cols 8-11, y=4
      R(7,  2, CAN, 5),                  // middle: cols 7-11, y=8
      R(7,  3, RIM), R(9, 3, RIM), R(11, 3, RIM), // scalloped rim
      /* handle — vertical stick from canopy to hand */
      R(10,  3, HND), R(10,  4, HND), R(10,  5, HND),
      R(10,  6, HND), R(10,  7, HND), R(10,  8, HND),
      R(10,  9, HND), R(10, 10, HND), R(10, 11, HND),
      R(10, 12, HND), R(10, 13, HND),
      /* hook at bottom */
      R(11, 13, HND),
    ],
  };
}

/* ─────────────────────────────────────────
   COOL (0–18°C): blue-grey jacket · dark jeans · white sneakers
───────────────────────────────────────── */
function coolParts() {
  const JK = "#546E7A", JK2 = "#455A64", JN = "#1B2A3A", SN = "#ECEFF1", SN2 = "#90A4AE";
  return {
    extraHead: [],
    body: [
      R(5, 7, JK2, 2),              // collar at neck
      R(3,  8, JK, 6),
      R(3,  9, JK, 6),
      R(5,  9, JK2), R(6, 9, JK2), // centre zip shadow
      R(3, 10, JK, 6),
      R(4, 11, JN, 4), R(4, 12, JN, 4),
    ],
    armL: [
      R(2,  9, JK), R(2, 10, JK), R(2, 11, JK),
      R(2, 12, SK2),
    ],
    armR: [
      R(9,  9, JK), R(9, 10, JK), R(9, 11, JK),
      R(9, 12, SK2),
    ],
    legs: [
      R(4, 13, JN, 2), R(6, 13, JN, 2),
      R(4, 14, JN, 2), R(6, 14, JN, 2),
      R(3, 15, SN, 3), R(6, 15, SN, 3),
      R(3, 16, SN2, 3), R(6, 16, SN2, 3),
    ],
    accessories: [],
  };
}

/* ─────────────────────────────────────────
   CASUAL: teal tee · dark jeans · sneakers
───────────────────────────────────────── */
function casualParts() {
  const SH = "#26A69A", JN = "#1B3A6B", SW = "#212121";
  return {
    extraHead: [],
    body: [
      R(3,  8, SH, 6),
      R(5,  8, "#1DE9B6"), R(6, 8, "#1DE9B6"),
      R(3,  9, SH, 6),
      R(4,  9, "#1A8076"),
      R(3, 10, SH, 6),
      R(4, 11, JN, 4), R(4, 12, JN, 4),
      R(4, 11, "#122A50", 4),
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
      R(3, 15, SW, 2), R(6, 15, SW, 3),
      R(3, 16, "#555", 2), R(6, 16, "#555", 3),
    ],
    accessories: [],
  };
}

/* ─────────────────────────────────────────
   NIGHT: dark hoodie · sweatpants · drowsy eyes
───────────────────────────────────────── */
function nightParts() {
  const HD = "#283593", PT = "#37474F", SW = "#1A1A1A";
  return {
    extraHead: [
      R(2, 1, HD), R(9, 1, HD),
      R(2, 2, HD), R(9, 2, HD),
    ],
    body: [
      R(3,  8, HD, 6),
      R(2,  9, HD), R(3, 9, HD, 6), R(9, 9, HD),
      R(4, 10, "#1A237E", 4),
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
    accessories: [],
  };
}

/* ─────────────────────────────────────────
   SNOW FLAKES — white pixels falling over Cael
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

/* ─────────────────────────────────────────
   RAIN DROPS — diagonal streaks falling over Cael
───────────────────────────────────────── */
const RAIN_DROPS = [
  { x: 0,  y: -10, dur: 0.42, delay: 0,    drift: -10 },
  { x: 3,  y:  -5, dur: 0.35, delay: 0.15, drift:  -8 },
  { x: 6,  y: -12, dur: 0.48, delay: 0.08, drift: -12 },
  { x: 9,  y:  -7, dur: 0.38, delay: 0.32, drift:  -9 },
  { x: 1,  y: -14, dur: 0.44, delay: 0.22, drift: -11 },
  { x: 5,  y:  -3, dur: 0.40, delay: 0.45, drift:  -8 },
  { x: 8,  y:  -9, dur: 0.36, delay: 0.05, drift: -10 },
  { x: 2,  y:  -6, dur: 0.46, delay: 0.38, drift:  -9 },
];

const STORM_DROPS = [
  { x: 0,  y: -10, dur: 0.28, delay: 0,    drift: -14 },
  { x: 2,  y:  -5, dur: 0.25, delay: 0.1,  drift: -12 },
  { x: 4,  y: -12, dur: 0.30, delay: 0.05, drift: -16 },
  { x: 6,  y:  -7, dur: 0.26, delay: 0.18, drift: -13 },
  { x: 8,  y: -14, dur: 0.32, delay: 0.25, drift: -15 },
  { x: 1,  y:  -3, dur: 0.24, delay: 0.38, drift: -12 },
  { x: 5,  y:  -9, dur: 0.29, delay: 0.12, drift: -14 },
  { x: 9,  y:  -6, dur: 0.27, delay: 0.42, drift: -16 },
  { x: 3,  y: -11, dur: 0.31, delay: 0.2,  drift: -15 },
  { x: 7,  y:  -4, dur: 0.23, delay: 0.08, drift: -13 },
];

/* Sleepy half-closed eyes overlay for night */
function nightEyeOverlay() {
  return [
    R(4, 3, "#1A1A1A"),
    R(7, 3, "#1A1A1A"),
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
  const isCool   = weatherType === "cool";

  const hairColor =
    isCold                  ? "#37474F"
    : (isRainy || isStormy) ? "#FDD835"
    : isNight               ? "#283593"
    : HR;

  const { extraHead, body, armL, armR, legs, accessories = [] } =
    isHot                   ? hotParts()
    : isCold                ? coldParts()
    : (isRainy || isStormy) ? rainyParts()
    : isNight               ? nightParts()
    : isCool                ? coolParts()
    :                         casualParts();

  const headRects  = makeHead(hairColor, isHot);
  const eyeOverlay = isNight ? nightEyeOverlay() : [];

  const wt = weatherType;

  /* rain / storm drops */
  const drops = isStormy ? STORM_DROPS : isRainy ? RAIN_DROPS : [];

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
      {/* Legs */}
      <g className={`cael-legs cael-legs--${wt}`}>
        {legs.map(toRect)}
      </g>

      {/* Body */}
      <g className={`cael-body cael-body--${wt}`}>
        {body.map(toRect)}
      </g>

      {/* Left arm */}
      <g className={`cael-arm-l cael-arm-l--${wt}`}>
        {armL.map(toRect)}
      </g>

      {/* Right arm */}
      <g className={`cael-arm-r cael-arm-r--${wt}`}>
        {armR.map(toRect)}
      </g>

      {/* Head (renders above body/arms) */}
      <g className={`cael-head cael-head--${wt}`}>
        {extraHead.map(toRect)}
        {headRects.map(toRect)}
        {eyeOverlay.map(toRect)}
      </g>

      {/* Static accessories — render above everything (umbrella, etc.) */}
      {accessories.length > 0 && (
        <g>{accessories.map(toRect)}</g>
      )}

      {/* Snow particles */}
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

      {/* Rain drops — diagonal streaks */}
      {drops.map((f, i) => (
        <rect
          key={`rain-${i}`}
          x={f.x * S}
          y={f.y}
          width={1}
          height={4}
          fill="#89CFF0"
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
