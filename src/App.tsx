import React, { useEffect, useState } from 'react';
import {
  Button, TextField,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import Box from '@mui/system/Box';
import axios from 'axios';

import type WeatherType from './types/WeatherData';

import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState({
    lat: '',
    lon: '',
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [weatherData, setWeatherData] = useState<WeatherType>();

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toString().slice(0, 5);
            const lon = position.coords.longitude.toString().slice(0, 5);

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
    const fetchData = async () => {
      try {
        const { lat, lon } = userLocation;

        const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
        const apiKey = 'f3854e81563595cc9194d339b76fcd0f';
        const apiUrl = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await axios.get(apiUrl);
        setWeatherData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userLocation]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        padding={2}
        display="flex"
        flexDirection="column"
        maxHeight={200}
        maxWidth={250}
      >
        <Box display="flex" justifyContent="space-between" sx={{ width: '100%' }}>
          <Box>Weather App</Box>
          <Button variant="outlined" size="small" onClick={() => { toggleTheme(); }}>
            {themeMode}
          </Button>
        </Box>

        {weatherData ? (
          <Box alignSelf="flex-start" sx={{ fontSize: '12px' }}>
            <p>
              {`${weatherData.name.toUpperCase()}`}
            </p>

            <p>
              {`FEELS LIKE: ${weatherData.main.feels_like.toString().slice(0, 2)} °C`}
            </p>

            <Box mt={4}>
              <TextField
                label="Location"
                id="outlined-size-small"
                size="small"
              />
            </Box>
          </Box>
        ) : null}
      </Box>
    </ThemeProvider>
  );
}

export default App;
