const apiKey = 'b1b534c96a287b05ee3d72fa79800ce1';

async function getWeatherData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function displayWeather(data) {
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    console.log(`Temperature: ${temperature}°C`);
    console.log(`Description: ${description}`);
}

function refreshWeather() {
    getWeatherData().then(data => {
        if (data) {
            displayWeather(data);
        }
    }).catch(error => {
        console.error('Error refreshing weather data:', error);
    });
}
refreshWeather();
setInterval(refreshWeather, 160000);