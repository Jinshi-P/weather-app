import { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const apiKey = process.env.REACT_APP_WEATHER_API;

  const weatherData = async (city) => {
    if (city) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
        );
        const data = await response.json();
        if (response.ok) {
          setWeather(data);
          setCity("");
          setError("");
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch weather data");
      }
      setSuggestions([]);
    } else {
      setError("Please enter a city name");
    }
  };

  const fetchSuggestions = async (input) => {
    if (input.length > 2) {
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": process.env.REACT_APP_RAPID_API,
              "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setSuggestions(data.data);
        } else {
          setWeather("");
        }
      } catch (error) {
        setError("Error fetching city suggestions");
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setWeather(null);

    weatherData(city);
  };

  return (
    <div className="app">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="search">
            <input
              type="text"
              placeholder="Enter city..."
              value={city}
              onChange={(e) => {
                setError("");
                setWeather(null);
                setCity(e.target.value);
                fetchSuggestions(e.target.value);
              }}
            />
            <button type="submit">
              {" "}
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </button>
          </div>

          {/* to display suggestions */}
          <ul style={{ cursor: "pointer" }}>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => {
                  setCity(suggestion.city);
                  weatherData(suggestion.city);

                  setSuggestions([]);
                }}
                style={{ listStyleType: "none" }}
              >
                {suggestion.city}
              </li>
            ))}
          </ul>
        </form>
      </div>
      <div className="displaybox">
        {error && <p style={{ color: "red", fontSize: "28px" }}>{error}</p>}
        {weather && (
          <div style={{width:" 100%"}}>
            <img 
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
            <h1> {Math.round(weather.main.temp - 273.15).toFixed(0)}°C</h1>

            <h1>{weather.name}</h1>

            <h1>{weather.weather[0].description}</h1>
            <div className="weather-details" >
              <div>
                <p>{weather.main.humidity}%<br/>Humidity</p>
              </div>
              <div>
                <p>{weather.wind.speed} m/s<br/>Wind Speed </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
