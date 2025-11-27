import React from "react";
import "./weather-icons.css";

const AnimatedSunIcon = ({ size = 64 }) =>
  React.createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      },
    },
    React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 100 100",
        className: "spin-slow",
      },
      [
        React.createElement("defs", {
          key: "gradient",
        }, [
          React.createElement("radialGradient", {
            key: "sunGrad",
            id: "sunGradient",
          }, [
            React.createElement("stop", { key: "s1", offset: "0%", stopColor: "#FFF176" }),
            React.createElement("stop", { key: "s2", offset: "100%", stopColor: "#FFB300" }),
          ])
        ]),
        React.createElement("circle", {
          key: "sun-center",
          cx: "50",
          cy: "50",
          r: "22",
          fill: "url(#sunGradient)",
          className: "pulse",
        }),
        ...[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) =>
          React.createElement("line", {
            key: i,
            x1: "50",
            y1: "8",
            x2: "50",
            y2: "18",
            stroke: "#FFA000",
            strokeWidth: "4",
            strokeLinecap: "round",
            transform: `rotate(${angle} 50 50)`,
            opacity: "0.9",
          })
        ),
      ]
    )
  );

// 🌧️ Lluvia
const AnimatedRainIcon = ({ size = 64 }) =>
  React.createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      },
    },
    React.createElement(
      "svg",
      { width: size, height: size, viewBox: "0 0 100 100" },
      [
        React.createElement("defs", {
          key: "cloudGrad",
        }, [
          React.createElement("linearGradient", {
            key: "cg",
            id: "cloudGradient",
            x1: "0%",
            y1: "0%",
            x2: "0%",
            y2: "100%",
          }, [
            React.createElement("stop", { key: "c1", offset: "0%", stopColor: "#E3F2FD" }),
            React.createElement("stop", { key: "c2", offset: "100%", stopColor: "#90CAF9" }),
          ])
        ]),
        React.createElement("path", {
          key: "cloud-shape",
          d: "M30,45 Q25,38 32,35 Q35,28 42,30 Q48,25 55,30 Q62,28 65,35 Q72,38 67,45 Z",
          fill: "url(#cloudGradient)",
          className: "pulse",
        }),
        ...[35, 50, 65].map((x, i) =>
          React.createElement("line", {
            key: i,
            x1: x,
            y1: "52",
            x2: x - 3,
            y2: "68",
            stroke: "#0288D1",
            strokeWidth: "3",
            strokeLinecap: "round",
            className: "bounce",
            style: { animationDelay: `${i * 0.15}s` },
          })
        ),
      ]
    )
  );

// ❄️ Nieve
const AnimatedSnowIcon = ({ size = 64 }) =>
  React.createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      },
    },
    React.createElement(
      "svg",
      { width: size, height: size, viewBox: "0 0 100 100" },
      [
        React.createElement("path", {
          key: "cloud-shape",
          d: "M30,45 Q25,38 32,35 Q35,28 42,30 Q48,25 55,30 Q62,28 65,35 Q72,38 67,45 Z",
          fill: "#F5F5F5",
        }),
        ...[30, 42, 54, 38, 50, 62].map((x, i) => {
          const y = 50 + (i % 3) * 8;
          return React.createElement("g", { key: i }, [
            React.createElement("circle", {
              key: "c1",
              cx: x,
              cy: y,
              r: "2.5",
              fill: "#B3E5FC",
            }),
            React.createElement("line", {
              key: "l1",
              x1: x - 3,
              y1: y,
              x2: x + 3,
              y2: y,
              stroke: "#81D4FA",
              strokeWidth: "1",
            }),
            React.createElement("line", {
              key: "l2",
              x1: x,
              y1: y - 3,
              x2: x,
              y2: y + 3,
              stroke: "#81D4FA",
              strokeWidth: "1",
            }),
          ]);
        }).flat(),
      ]
    )
  );

// ☁️ Nubes
const AnimatedCloudIcon = ({ size = 64 }) =>
  React.createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      },
    },
    React.createElement(
      "svg",
      { width: size, height: size, viewBox: "0 0 100 100" },
      [
        React.createElement("defs", {
          key: "cloudGrad2",
        }, [
          React.createElement("linearGradient", {
            key: "cg2",
            id: "cloudGradient2",
            x1: "0%",
            y1: "0%",
            x2: "0%",
            y2: "100%",
          }, [
            React.createElement("stop", { key: "c1", offset: "0%", stopColor: "#FFFFFF" }),
            React.createElement("stop", { key: "c2", offset: "100%", stopColor: "#ECEFF1" }),
          ])
        ]),
        React.createElement("path", {
          key: "cloud1",
          d: "M25,55 Q20,48 27,45 Q30,38 37,40 Q40,35 45,40 Q48,38 50,45 Q52,48 48,55 Z",
          fill: "url(#cloudGradient2)",
          className: "pulse",
        }),
        React.createElement("path", {
          key: "cloud2",
          d: "M40,50 Q35,43 42,40 Q45,33 52,35 Q58,30 63,35 Q68,33 70,40 Q75,43 70,50 Z",
          fill: "url(#cloudGradient2)",
          className: "pulse",
          style: { animationDelay: "0.5s" },
          opacity: "0.9",
        }),
      ]
    )
  );

const getWeatherIcon = (condition, size = 64) => {
  switch (condition.toLowerCase()) {
    case "clear":
    case "sunny":
      return React.createElement(AnimatedSunIcon, { size });
    case "rain":
    case "rainy":
      return React.createElement(AnimatedRainIcon, { size });
    case "snow":
    case "snowy":
    case "cold":
      return React.createElement(AnimatedSnowIcon, { size });
    case "clouds":
    case "cloudy":
      return React.createElement(AnimatedCloudIcon, { size });
    default:
      return React.createElement(AnimatedSunIcon, { size });
  }
};

export default getWeatherIcon;