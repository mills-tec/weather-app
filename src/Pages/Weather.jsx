import React from "react";
import "../navigation/Nav.css";
import "../Cssfolder/weather.css";
import { FaSearchLocation } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Clouds from "../assets/weatherImgs/clouds.png";
import Clear from "../assets/weatherImgs/Clear.png";
import Rain from "../assets/weatherImgs/rain.png";
import Snow from "../assets/weatherImgs/snowy.png";
import Storm from "../assets/weatherImgs/storm.png";
import axios from "axios";
import { FaThermometerHalf } from "react-icons/fa";
import { WiRaindrop } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

const Weather = () => {
  const apiKey = "9b2ab23e35c8fba3b35b2fa85b2ceb9e";
  const [cityName, setCityName] = useState("");
  const [handleError, sethandleError] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [currentForecast, setCurrentForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foreCast, setForeCast] = useState([]);
  const [hasCachedData, setHasCachedData] = useState(() => {
    return !!window.localStorage.getItem("WEATHER-APP");
  });
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });

  //GETTING THE STORED VALUES IN LOCAL STORAGE
  useEffect(() => {
    const storedData = window.localStorage.getItem("WEATHER-APP");
    if (storedData) {
      const { weatherData, currentForecast, foreCast } = JSON.parse(storedData);
      setWeatherData(weatherData);
      setCurrentForecast(currentForecast);
      setForeCast(foreCast);
      // setHasCachedData(true); // Mark that we loaded from cache

      setHasCachedData(true); // Mark that we loaded from cache
    }
  }, []);

  // STORE WEATHER DATA'S TO LOCAL STORAGE
  useEffect(() => {
    if (weatherData && weatherData.main) {
      const dataToStore = {
        weatherData,
        currentForecast,
        foreCast,
      };
      window.localStorage.setItem("WEATHER-APP", JSON.stringify(dataToStore));
    }
  }, [weatherData, currentForecast, foreCast]);

  // SUGGESTIONS FOR SEARCHING CITIES IN THE INPUT FIELD
  const fetchSuggestions = (inputvalue) => {
    const query = inputvalue.trim();
    if (query.length > 0 ) {
      axios
        .get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${apiKey}`
        )
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((error) => {
          console.log(error);
          setSuggestions([]);
        });
    }
  };
  useEffect(() => {
    if (cityName.length > 1) {
      // ADDING DEBOUNCING TO CALL THE FUNCTION AFTER THE USER FINISHES TYPING.
      const timeoutId = setTimeout(() => {
        fetchSuggestions(cityName);
      }, 400);

      return () => clearTimeout(timeoutId); // Cleanup the timeout when the component unmounts
    }
  }, [cityName]);

  // HANDLING SUGGESTIONS WHEN THE USER CLICKS ON IT
  const handleSuggestionClick = (suggestionname) => {
    const selectedCity = suggestions.find(
      (suggestion) => suggestion.name === suggestionname
    );
    setCityName(selectedCity.name);
    setSuggestions([]); // Clear suggestions after selection
  }
  
  // SETTING A DEFAULT CITY NAME
  useEffect(() => {
    if (!hasCachedData) {
      // setHasCachedData(true);
      setIsLoading(true);
      const defaultCity = `Addis Ababa`;
      setCityName(defaultCity);
      const currentWeatherUrl = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&units=metric`
      );
      const forecastWeatherUrl = axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity}&appid=${apiKey}&units=metric`
      );
      Promise.all([currentWeatherUrl, forecastWeatherUrl])
        .then((response) => {
          // current weather data
          setWeatherData(response[0].data);

          // for today's forecast
          const forecastData = getCurrentForecast(response[1].data.list);
          setCurrentForecast(forecastData);

          // remaining forecast data
          const remainingForecast = getForecast(response[1].data.list);
          setForeCast(remainingForecast);

          // handling errors
          sethandleError(false);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          sethandleError(true);
          setIsLoading(false);
        });
    }
  }, [hasCachedData]);

  // FUNCTION TO GET THE CURRENT FORECAST DATA
  const getCurrentForecast = (forecast) => {
    // console.log(days);
    const today = new Date().toISOString().slice(0, 10);

    return forecast.filter((item) => {
      return item.dt_txt.startsWith(today);
    });
  };

  // FUNCTION TO GET THE REMAINING FORECAST DATA
  const getForecast = (forecast) => {
    const today = "12:00:00";

    return forecast.filter((item) => {
      // console.log(item.dt_txt)
      return item.dt_txt.endsWith(today);
    });
  };

  // FUNCTION TO GET THE WEATHER DATA
  function getWeather() {
    if (cityName.trim() !== "") {
      setIsLoading(true);
      const currentWeatherUrl = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      const forecastWeatherUrl = axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );

      Promise.all([currentWeatherUrl, forecastWeatherUrl])
        .then((response) => {
          // current weather data
          setWeatherData(response[0].data);

          // for today's forecast
          const forecastData = getCurrentForecast(response[1].data.list);
          setCurrentForecast(forecastData);

          // remaining forecast data
          const remainingForecast = getForecast(response[1].data.list);
          setForeCast(remainingForecast);

          // handling errors
          sethandleError(false);
          setIsLoading(false);
          setCityName("");
        })
        .catch((error) => {
          console.log(error);
          sethandleError(true);
          setIsLoading(false);
        });
    }
  }

  const weatherImgs = {
    Clouds: Clouds,
    Clear: Clear,
    Rain: Rain,
    Snow: Snow,
    Storm: Storm,
    Thunderstorm: Storm,
  };

  const weatherImg =
    weatherData.weather && weatherImgs[weatherData.weather[0].main];

  return (
    <div className="page-Content" >
      <div className="weather-Content">
        <div className="weather-page1" onClick={() => setSuggestions([])}>
          {/* searrch input field */}
          <div className="block-color">{/* <h1>hrh</h1> */}</div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Cities"
              onChange={(e) => {
                setCityName(e.target.value);
              }}
              onKeyDown={(e) =>{

                if (e.key === "Enter") {
                  getWeather();
                  setSuggestions([]);
                }
              }}
              value={cityName} 
              ref={inputRef}
            />
            <FaSearchLocation onClick={getWeather} />

            {/* SUGGESTED LIST */}
            {suggestions.length > 0 && (
              <div className="suggestion-list">
                <ul>
                  {suggestions.map(({ name }, index) => (
                    <li key={index} onClick={()=> handleSuggestionClick(name) }>{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* current weather */}
          {isLoading ? (
            <h1 className="loading">Loading....</h1>
          ) : handleError ? (
            <h1 className="errorhandle">Location Not found : 404 Error</h1>
          ) : (
            <div className="weather-card">
              <div className="weather-texts">
                <h1>{weatherData.name}</h1>
                {weatherData.weather && (
                  <p>{weatherData.weather[0].description}</p>
                )}
                {weatherData.main && (
                  <h2>{Math.floor(weatherData.main.temp)}&#176;C</h2>
                )}
              </div>
              <div className="weather-imgs">
                <img src={weatherImg} alt="" />
              </div>
            </div>
          )}

          {/* forecast weather */}
          {!isLoading && !handleError && currentForecast.length > 0 && (
            <div className="forecast-card">
              <h2>Today's Forecast</h2>
              <div className="forecast-weather">
                {currentForecast.map((forecast, index) => (
                  <div className="hourly-forecast" key={index}>
                    <p>
                      {new Date(forecast.dt_txt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <img
                      src={`${weatherImgs[forecast.weather[0].main]}`}
                      alt=""
                    />

                    <p>
                      {Math.floor(forecast.main.temp)}
                      &#176;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* air condition */}
          {!isLoading && !handleError && weatherData.main && (
            <div className="airCondition">
              <h2>air Condition</h2>
              <div className="aircondtion1">
                <div>
                  <span>
                    <FaThermometerHalf />
                    <p>feels like</p>
                  </span>
                  <p>
                    {weatherData.main &&
                      Math.floor(weatherData.main.feels_like)}
                    &#176;
                  </p>
                </div>
                <div>
                  <span>
                    <WiRaindrop />
                    <p>Chance of raining</p>
                  </span>

                  <p>
                    {currentForecast[0]
                      ? Math.floor(currentForecast[0].pop) * 100
                      : 0}
                    %
                  </p>
                </div>
              </div>
              <div className="aircondtion2">
                <div>
                  <span>
                    <FaWind />
                    <p>Wind Speed</p>
                  </span>
                  <p className="windSpeed">
                    {currentForecast[0]
                      ? Math.floor(currentForecast[0].wind.speed)
                      : 0}
                    m/s
                  </p>
                </div>
                <div>
                  <span>
                    <WiHumidity />
                    <p>Humidity</p>
                  </span>
                  <p className="humidity">
                    {currentForecast[0]
                      ? Math.floor(currentForecast[0].main.humidity)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5 days forecast*/}
        {!isLoading && !handleError && foreCast.length > 0 && (
          <div className="weather-page2">
            <div className="remainingForecast">
              <h2> 5 days forecast</h2>
              <div className="remainingForecast-card">
                {foreCast.map((forecast, index) => (
                  <div key={index}>
                    <p>
                      {new Date(forecast.dt_txt).toLocaleDateString("en-Us", {
                        weekday: "long",
                      })}
                    </p>
                    <div className="forecast-imgs">
                      <img
                        src={`${
                          forecast.weather &&
                          weatherImgs[forecast.weather[0].main]
                        }`}
                        alt=""
                        className="forecastmainimg"
                      />

                      <p>{forecast.weather[0].main}</p>
                    </div>
                    <p>
                      {new Date(forecast.dt_txt).toLocaleDateString("en-Us", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
