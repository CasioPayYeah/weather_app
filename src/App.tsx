import React, { useEffect, useState } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import axios from 'axios';

import GoogleMaps from './components/LocationInput';
import { WEATHER_API_KEY, WEATHER_URL } from './utils/constants';

import type WeatherType from './types/WeatherData';

function App() {
  const [userLocation, setUserLocation] = useState({
    lat: '',
    lon: '',
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [weatherData, setWeatherData] = useState<WeatherType>();

  async function fetchData(lat: string, lon: string) {
    try {
      const apiUrl = `${WEATHER_URL}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toString();
            const lon = position.coords.longitude.toString();

            setUserLocation({
              lat,
              lon,
            });
          },
          (error) => {
            throw new Error(`Error getting location: ${error.message}`);
          },
        );
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (userLocation.lat && userLocation.lon) {
      fetchData(userLocation.lat, userLocation.lon);
    }
  }, [userLocation]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  useEffect(() => {
    console.log(weatherData);
  }, [weatherData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        padding={1}
        display="flex"
        flexDirection="column"
        minWidth={300}
      >
        <Box display="flex" justifyContent="space-between" sx={{ width: '100%' }} alignItems="center" mb={1}>
          <Typography variant="body1">WEATHER APP</Typography>

          <Box>
            <IconButton
              onClick={() => { fetchData(userLocation.lat, userLocation.lon); }}
            >
              <LocationOnOutlinedIcon />
            </IconButton>

            <IconButton
              onClick={() => {
                toggleTheme();
              }}
              color="inherit"
            >
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Box>

        {weatherData ? (
          <Box alignSelf="flex-start" sx={{ fontSize: '12px' }}>
            <Box
              display="flex"
              flexDirection="row"
              gap={2}
              mt={1}
            >
              <Typography variant="body2">
                {`${weatherData.name.toUpperCase()}`}
              </Typography>

              <Typography variant="body2">
                {`${Math.round(Math.round(weatherData.main.temp))} °C`}
              </Typography>
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              gap={2}
              mt={1}
            >
              <Typography variant="body2">
                {`MAX: ${Math.round(Math.round(weatherData.main.temp_max))} °C`}
              </Typography>

              <Typography variant="body2">
                {`MIN: ${Math.round(Math.round(weatherData.main.temp_min))} °C`}
              </Typography>
            </Box>

            <Typography variant="body2">
              {`FEELS LIKE: ${Math.round(weatherData.main.feels_like)} °C`}
            </Typography>

            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
              <Typography variant="body2">
                {weatherData.weather[0].description.toUpperCase()}
              </Typography>

              <Box
                component="img"
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather Icon"
                sx={{
                  height: 40,
                  width: 40,
                }}
              />
            </Box>
          </Box>
        ) : null}

        <GoogleMaps setWeatherData={setWeatherData} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
