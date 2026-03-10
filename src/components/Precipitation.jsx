import { memo } from "react";
import { useLang } from "./useLang";

const formatHour = (timestamp, lang) =>
  new Date(timestamp * 1000).toLocaleTimeString(
    lang === "es" ? "es-ES" : "en-US",
    { hour: "2-digit" }
  );

/* Smooth cubic bezier path through an array of {x,y} points */
function curvePath(pts) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y} ${cx} ${p1.y} ${p1.x} ${p1.y}`;
  }
  return d;
}

/* SVG coordinate space — matches .precip-chart aspect-ratio in CSS */
const VW = 260, PT = 22, CH = 70, PB = 18, PL = 6, PR = 6;
const VH = PT + CH + PB; // 110

export const Precipitation = memo(function Precipitation({ hourly }) {
  const { lang } = useLang();
  const isEs = lang === "es";

  if (!hourly?.length) return null;

  const data = hourly.slice(0, 8).map(e => ({
    dt:   e.dt,
    pop:  e.pop  || 0,
    rain: e.rain?.["3h"] || 0,
    snow: e.snow?.["3h"] || 0,
  }));

  const totalRain = data.reduce((s, d) => s + d.rain, 0);
  const totalSnow = data.reduce((s, d) => s + d.snow, 0);

  /* Map data → SVG coords (normalize to 1.0 for absolute values) */
  const pts = data.map((d, i) => ({
    x: PL + (i / (data.length - 1)) * (VW - PL - PR),
    y: PT + (1 - d.pop) * CH,
    pop: d.pop,
    dt:  d.dt,
  }));

  const line = curvePath(pts);
  const area = `${line} L ${pts.at(-1).x} ${PT + CH} L ${pts[0].x} ${PT + CH} Z`;

  return (
    <>
      <p className="section-title">{isEs ? "Precipitación" : "Precipitation"}</p>

      {/* SVG area chart — fills container via aspect-ratio in CSS */}
      <div className="precip-chart">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Vertical gradient for fill area */}
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#60A5FA" stopOpacity="0.35" />
              <stop offset="75%"  stopColor="#60A5FA" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0"    />
            </linearGradient>

            {/* Glow on the curve line */}
            <filter id="pglow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glow on dots */}
            <filter id="dglow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Horizontal guide lines at 25 / 50 / 75 % */}
          {[0.25, 0.5, 0.75].map(v => {
            const gy = PT + (1 - v) * CH;
            return (
              <g key={v}>
                <line
                  x1={PL} y1={gy} x2={VW - PR} y2={gy}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.5"
                  strokeDasharray="3 4"
                />
                <text x={PL} y={gy - 2} fontSize="5.5" fill="rgba(255,255,255,0.18)">
                  {Math.round(v * 100)}%
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={PL} y1={PT + CH} x2={VW - PR} y2={PT + CH}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />

          {/* Gradient fill area */}
          <path d={area} fill="url(#pg)" />

          {/* Glowing bezier curve */}
          <path
            d={line}
            fill="none"
            stroke="rgba(147,197,253,0.85)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#pglow)"
          />

          {/* Per-point: dot + percentage + time label */}
          {pts.map((p, i) => (
            <g key={data[i].dt}>
              {/* Vertical drop line to baseline */}
              {data[i].pop > 0.05 && (
                <line
                  x1={p.x} y1={p.y + 3}
                  x2={p.x} y2={PT + CH}
                  stroke="rgba(147,197,253,0.12)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* Percentage label above point */}
              {data[i].pop > 0.04 && (
                <text
                  x={p.x} y={p.y - 5}
                  textAnchor="middle"
                  fontSize="7"
                  fill="rgba(255,255,255,0.6)"
                  fontWeight="500"
                >
                  {Math.round(data[i].pop * 100)}%
                </text>
              )}

              {/* Outer ring (subtle) */}
              <circle cx={p.x} cy={p.y} r="4.5" fill="rgba(147,197,253,0.1)" />
              {/* Core dot with glow */}
              <circle cx={p.x} cy={p.y} r="2.5" fill="#93C5FD" filter="url(#dglow)" />

              {/* Time label */}
              <text
                x={p.x} y={PT + CH + PB - 3}
                textAnchor="middle"
                fontSize="7"
                fill="rgba(255,255,255,0.3)"
              >
                {formatHour(data[i].dt, lang)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="aq-divider" />

      <div className="precip-summary">
        {totalRain > 0 && (
          <div className="precip-stat">
            <span className="precip-stat-label">{isEs ? "Lluvia" : "Rain"}</span>
            <span className="precip-stat-val">
              {totalRain.toFixed(1)} <span className="wc-unit">mm</span>
            </span>
          </div>
        )}
        {totalSnow > 0 && (
          <div className="precip-stat">
            <span className="precip-stat-label">{isEs ? "Nieve" : "Snow"}</span>
            <span className="precip-stat-val">
              {totalSnow.toFixed(1)} <span className="wc-unit">mm</span>
            </span>
          </div>
        )}
        {totalRain === 0 && totalSnow === 0 && (
          <p className="precip-none">
            {isEs ? "Sin precipitación esperada" : "No precipitation expected"}
          </p>
        )}
      </div>
    </>
  );
});
