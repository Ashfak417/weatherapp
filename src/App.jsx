import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("Colombo"); // Initial default city
  const [weatherData, setWeatherData] = useState(null);
  const [displayedCityName, setDisplayedCityName] = useState("");
  const [displayedCountryCode, setDisplayedCountryCode] = useState("");

  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formetedDate = `${month} ${day} ,${year}`;

  const API_KEY = "953f5137034ad3aa8d8db5fb2161508a";

  const fetchweatherData = async () => {
    // This check is now less critical here because handleSubmit prevents empty queries,
    // but good for robustness if this function were called directly elsewhere.
    if (!city.trim()) {
      setWeatherData(null);
      setDisplayedCityName("");
      setDisplayedCountryCode("");
      return;
    }

    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        alert(
          `Location "💔${city}❌" 🤔not found.😒😡Hey Enter correct city or country name🌍🥰.`
        );
        setCity("Colombo"); // Reset city to a known good default
        return;
      }

      const { lat, lon, name, country } = geoData[0];
      setDisplayedCityName(name);
      setDisplayedCountryCode(country);

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const data = await weatherResponse.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(
        "Failed to fetch weather data. Please check your internet connection or API key."
      );
      setWeatherData(null);
      setDisplayedCityName("");
      setDisplayedCountryCode("");
      setCity("Colombo");
    }
  };

  // IMPORTANT: Changed useEffect dependency to an empty array []
  // This means fetchweatherData() only runs once when the component mounts.
  useEffect(() => {
    fetchweatherData();
  }, []);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // --- Input validation: Check if city is empty or just whitespace ---
    if (!city.trim()) {
      alert("Please enter a city or country name to get weather.");
      return; // Stop the function here if input is empty
    }

    // --- Directly call fetchweatherData() when the button is clicked ---
    fetchweatherData();
  };

  const getweatherIcloudUrl = (main) => {
    switch (main) {
      case "Clouds":
        return "/images/clouds.png";
      case "Rain":
        return "/images/rain.png";
      case "Mist":
        return "/images/tronado.png";
      case "Haze":
        return "/images/sun.png";
      case "Clear":
        return "/images/sun.png";
      case "Thunderstorm":
        return "/images/thunder.png";
      case "Drizzle":
        return "/images/rain.png";
      case "Snow":
        return "/images/snow.png";
      case "Storm":
        return "/images/strom.png";
      default:
        console.warn(`No icon for weather condition: ${main}. Using default.`);
        return "/images/sun.png";
    }
  };

  return (
    <div className="App">
      <div className="container">
        {weatherData && displayedCityName && displayedCountryCode ? (
          <>
            <h1 className="container_date">{formetedDate}</h1>
            <div className="weather_data">
              <h2 className="container_city">{displayedCityName}</h2>
              <img
                className="container_img"
                src={getweatherIcloudUrl(weatherData.weather[0].main)}
                width="180px"
                alt="Weather icon"
              />
              <h2 className="container_degree">{weatherData.main.temp}°C</h2>
              <h2 className="country_per">
                {weatherData.weather[0].description}
              </h2>

              <form className="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter City or Country Name"
                  onChange={handleInputChange}
                  value={city}
                />
                <button type="submit">Get Weather</button>
              </form>
            </div>
          </>
        ) : (
          <div className="loading-state">Loading weather...</div>
        )}
      </div>
    </div>
  );
}

export default App;
