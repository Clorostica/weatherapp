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
        <h2 className="title text-2xl font-semibold mb-4">
          {t.weatherForecast}
        </h2>

        <div className="forecast-container flex flex-row items-center justify-between">
          {forecast.map(({ date, temp, description, weatherMain }) => (
            <div
              key={date}
              className="title weather-card flex flex-col items-center gap-1 min-w-[120px] bg-white/10 px-4 py-3 rounded-lg"
            >
              {getWeatherIcon(weatherMain)}

              <p className="title text-sm font-medium text-gray-200">
                {formatDateLabel(date)}
              </p>
              <p className="title text-lg md:text-2xl font-extrabold">
                {temp}°C
              </p>

              <p className="title text-xs md:text-sm text-gray-300/90">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
