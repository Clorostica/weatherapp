import { memo } from "react";

const S = 4; // viewBox px per pixel-cell (12 × 18 grid → 48 × 72)

/* ── Palette ── */
const SK = "#FFCBA4";
const EY = "#1A1A1A";
const MO = "#C97B6D";
const HR = "#4A2F1A";

/* ── Rect data helper ── */
const R = (col, row, fill, w = 1, h = 1) => ({ col, row, fill, w, h });

/* ─────────────────────────────────────────
   HEAD  (rows 0–7, shared)
   12-wide grid, face cols 3–8:
     col3 & col8 = hair/hat sides
     cols 4–7 = skin face
     eyes at col4 & col7
     mouth at cols 5–6
───────────────────────────────────────── */
function makeHead(hairColor, sunglasses) {
  return [
    R(4, 0, hairColor, 4),                                          // hair top

    R(3, 1, hairColor, 6),                                          // hair row

    R(3, 2, hairColor), R(4, 2, SK, 4), R(8, 2, hairColor),        // face r1

    // Eye row
    R(3, 3, hairColor),
    ...(sunglasses
      ? [R(4, 3, EY, 4)]                                            // shades band
      : [R(4, 3, EY), R(5, 3, SK, 2), R(7, 3, EY)]                 // eyes
    ),
    R(8, 3, hairColor),

    R(3, 4, hairColor), R(4, 4, SK, 4), R(8, 4, hairColor),        // cheeks

    R(3, 5, hairColor), R(4, 5, SK), R(5, 5, MO, 2), R(7, 5, SK), R(8, 5, hairColor), // mouth

    R(4, 6, SK, 4),   // chin
    R(5, 7, SK, 2),   // neck
  ];
}

/* ── HOT: coral t-shirt · sky-blue shorts · bare legs · sunglasses ── */
function hotBody() {
  const SH = "#FF7043", PT = "#64B5F6";
  return [
    R(3,  8, SH, 6),
    R(2,  9, SK), R(3,  9, SH, 6), R(9,  9, SK),
    R(2, 10, SK), R(3, 10, SH, 6), R(9, 10, SK),
    R(4, 11, PT, 4), R(4, 12, PT, 4),
    R(4, 13, SK), R(7, 13, SK),
    R(4, 14, SK), R(7, 14, SK),
    R(4, 15, SK, 2), R(6, 15, SK, 2),
  ];
}

/* ── COLD: navy coat · charcoal hat · red scarf · brown boots ── */
function coldBody() {
  const CT = "#1565C0", BT = "#3E2723", SC = "#EF5350";
  return [
    R(2, 0, "#37474F"), R(9, 0, "#37474F"),   // hat brim sides
    R(2, 1, "#37474F"), R(9, 1, "#37474F"),
    R(4, 7, SC, 4),                            // scarf overwrites neck
    R(3,  8, CT, 6),
    R(2,  9, CT), R(3,  9, CT, 6), R(9,  9, CT),
    R(2, 10, CT), R(3, 10, CT, 6), R(9, 10, CT),
    R(3, 11, CT, 6), R(3, 12, CT, 6),
    R(3, 13, CT, 6), R(3, 14, CT, 6),
    R(4, 15, BT, 2), R(6, 15, BT, 2),
  ];
}

/* ── RAINY: yellow raincoat · hood · umbrella in hand · rubber boots ── */
function rainyBody() {
  const RC = "#FDD835", RB = "#212121", UM = "#BDBDBD", UH = "#6D4C41";
  return [
    // Hood extension
    R(2, 1, RC), R(9, 1, RC),
    R(2, 2, RC), R(9, 2, RC),
    // Umbrella canopy (cols 9–11, held above)
    R(9,  7, UM, 3),
    R(8,  8, UM, 4),
    R(9,  9, UM, 2),
    R(10, 10, UH), R(10, 11, UH), R(10, 12, UH), R(10, 13, UH),
    R(11, 13, UH),
    // Raincoat
    R(3,  8, RC, 6),
    R(2,  9, RC), R(3,  9, RC, 5),
    R(3, 10, RC, 6),
    R(3, 11, RC, 6), R(3, 12, RC, 6),
    R(3, 13, RC, 4),
    R(3, 14, RC, 2), R(6, 14, RC, 2),
    R(4, 15, RB, 2), R(6, 15, RB, 2),
  ];
}

/* ── CASUAL: teal tee · dark jeans · black shoes ── */
function casualBody() {
  const SH = "#26A69A", JN = "#1B3A6B", SW = "#1A1A1A";
  return [
    R(3,  8, SH, 6),
    R(2,  9, SK), R(3,  9, SH, 6), R(9,  9, SK),
    R(2, 10, SK), R(3, 10, SH, 6), R(9, 10, SK),
    R(4, 11, JN, 4), R(4, 12, JN, 4),
    R(4, 13, JN, 2), R(6, 13, JN, 2),
    R(4, 14, JN, 2), R(6, 14, JN, 2),
    R(4, 15, SW, 2), R(6, 15, SW, 2),
  ];
}

/* ─────────────────────────────────────────
   Cael — the bit character
───────────────────────────────────────── */
export const Cael = memo(function Cael({ weatherType = "casual" }) {
  const isHot   = weatherType === "hot";
  const isCold  = weatherType === "snowy" || weatherType === "cold";
  const isRainy = weatherType === "rainy" || weatherType === "stormy";

  const hairColor = isCold  ? "#37474F"
                  : isRainy ? "#FDD835"
                  : HR;

  const parts = [
    ...makeHead(hairColor, isHot),
    ...(isHot    ? hotBody()
       : isCold  ? coldBody()
       : isRainy ? rainyBody()
       :           casualBody()),
  ];

  return (
    <svg
      viewBox="0 0 48 72"
      style={{
        imageRendering: "pixelated",
        shapeRendering: "crispEdges",
        display: "block",
        width: "100%",
        height: "100%",
      }}
      aria-label="Cael"
    >
      {parts.map((p, i) => (
        <rect
          key={i}
          x={p.col * S}
          y={p.row * S}
          width={p.w * S}
          height={p.h * S}
          fill={p.fill}
        />
      ))}
    </svg>
  );
});
