import { memo } from "react";
import { useLang } from "./useLang";

export const ForecastGrid = memo(function ForecastGrid({
  forecast,
  getWeatherIcon,
  formatDateLabel,
}) {
  const { t } = useLang();

  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2
          className="title text-3xl font-semibold mb-4"
          style={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
            fontSize: "2rem",
          }}
        >
          {t.weatherForecast}
        </h2>

        <div className="forecast-container flex flex-row items-center justify-between">
          {forecast.map(({ date, temp, description, weatherMain }) => (
            <div
              key={date}
              className="title weather-card flex flex-col items-center gap-1 min-w-[120px] bg-white/10 px-4 py-3 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              {getWeatherIcon(weatherMain)}

              <p
                className="title text-base font-medium text-gray-200"
                style={{
                  textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
                  fontSize: "1.125rem",
                }}
              >
                {formatDateLabel(date)}
              </p>
              <p
                className="title text-xl md:text-3xl font-extrabold"
                style={{
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
                  fontSize: "1.75rem",
                }}
              >
                {temp}°C
              </p>

              <p
                className="title text-sm md:text-base text-gray-300/90"
                style={{
                  textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
                  fontSize: "1rem",
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
