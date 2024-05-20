const apiKey = 'b1b534c96a287b05ee3d72fa79800ce1';
var degree = "*C";
async function getWeatherData() {
    try {
        const city = await readf('/user/info/city');
        const unit = await readf('/user/info/unit');
        if (city) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`);
            const data = await response.json();
            if (unit) {
                if (unit === "imperial") {
                    degree = "*F";
                } else {
                    degree = "*C";
                }
                return data;
            } else {
                console.log('<!> Weather is performing first-time configuration');
                if (data.sys.country == "US") {
                    await writef('/user/info/unit', 'imperial');
                    console.log('<!> RAAAAAAH FREEDOM >:3');
                } else {
                    await writef('/user/info/unit', 'metric');
                    console.log(`<i> You have a decent measure system!`);
                }
                getWeatherData();
            }
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function refreshWeather() {
    getWeatherData().then(data => {
        if (data) {
            masschange('glancew', `${data.main.temp}${degree}, ${data.weather[0].description}`);
        }
    }).catch(error => {
        console.error('Error refreshing weather data:', error);
    });
}
setInterval(refreshWeather, 420000);