const apiKey = 'b1b534c96a287b05ee3d72fa79800ce1';

function freedom(cityName) {
    fetch(`http://api.geonames.org/searchJSON?q=${cityName}&countryBias=US&maxRows=1&username=randomuser691337`)
        .then(response => response.json())
        .then(data => {
            if (data.totalResultsCount > 0) {
                const country = data.geonames[0].countryName;
                if (country === "United States") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return "what the fuck";
            }
        })
        .catch(error => {
            console.error("Error fetching city data:", error);
        });
}

async function getWeatherData() {
    try {
        const city = await readf('/user/info/city');
        if (city) {
            const fuck = await freedom(city);
            let unit = "metric";
            if (fuck === true) {
                unit = "imperial";
            }
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`);
            const data = await response.json();
            console.log(data.main.temp);
            return data;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
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