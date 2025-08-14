const Forecast = ({ forecastData }) => {
  if (!forecastData || forecastData.length === 0) {
    return null;
  }

  return (
    <div className="forecast">
      {forecastData.map((day, index) => (
        <div key={index} className="">
          <p className="">{day.date}</p>
          <p className="">{day.temp}°C</p>
          <p>{day.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Forecast;
