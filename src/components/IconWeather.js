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
        React.createElement("circle", {
          key: "sun-center",
          cx: "50",
          cy: "50",
          r: "20",
          fill: "#FFD93D",
          className: "pulse",
        }),
        ...[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) =>
          React.createElement("line", {
            key: i,
            x1: "50",
            y1: "10",
            x2: "50",
            y2: "20",
            stroke: "#FFD93D",
            strokeWidth: "3",
            strokeLinecap: "round",
            transform: `rotate(${angle} 50 50)`,
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
        React.createElement("ellipse", {
          key: "cloud",
          cx: "50",
          cy: "35",
          rx: "25",
          ry: "15",
          fill: "#87CEEB",
        }),
        ...[30, 50, 70].map((x, i) =>
          React.createElement("line", {
            key: i,
            x1: x,
            y1: "50",
            x2: x,
            y2: "70",
            stroke: "#00B4D8",
            strokeWidth: "2",
            strokeLinecap: "round",
            className: "bounce",
            style: { animationDelay: `${i * 0.2}s` },
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
        React.createElement("ellipse", {
          key: "cloud",
          cx: "50",
          cy: "35",
          rx: "25",
          ry: "15",
          fill: "#E6F3FF",
        }),
        ...[25, 45, 65, 35, 55, 75].map((x, i) =>
          React.createElement("circle", {
            key: i,
            cx: x,
            cy: 50 + (i % 2) * 10,
            r: "3",
            fill: "#90E0EF",
            className: "bounce",
            style: { animationDelay: `${i * 0.3}s` },
          })
        ),
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
        React.createElement("ellipse", {
          key: "cloud1",
          cx: "30",
          cy: "50",
          rx: "20",
          ry: "12",
          fill: "#DEE2E6",
          className: "pulse",
        }),
        React.createElement("ellipse", {
          key: "cloud2",
          cx: "50",
          cy: "45",
          rx: "25",
          ry: "15",
          fill: "#DEE2E6",
          className: "pulse",
          style: { animationDelay: "0.5s" },
        }),
        React.createElement("ellipse", {
          key: "cloud3",
          cx: "70",
          cy: "50",
          rx: "18",
          ry: "10",
          fill: "#DEE2E6",
          className: "pulse",
          style: { animationDelay: "1s" },
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
