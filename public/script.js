// ======================================
// WEATHER APP
// ======================================


// ======================================
// SEARCH WEATHER BY CITY
// ======================================

async function getWeather() {

    let city = document.getElementById("city").value.trim();

    if (city === "") {

        document.getElementById("result").innerHTML =
            "<p class='error'>Please enter a city name.</p>";

        return;
    }

    document.getElementById("result").innerHTML =
        "<p>🔄 Getting weather...</p>";

    try {

        // Our own backend API
        let url =
            `/api/weather?city=${encodeURIComponent(city)}`;

        let response = await fetch(url);

        let data = await response.json();


        if (!response.ok) {

            document.getElementById("result").innerHTML =
                `<p class="error">❌ ${data.message}</p>`;

            return;
        }


        // Show weather
        showWeather(
            data.current,
            data.forecast
        );


        // Save city in recent searches
        saveRecentCity(
            data.current.name
        );

    }

    catch (error) {

        console.log(error);

        document.getElementById("result").innerHTML =
            "<p class='error'>❌ Unable to connect. Please check your internet connection.</p>";
    }
}


// ======================================
// SHOW CURRENT WEATHER
// ======================================

function showWeather(data, forecastData) {

    changeWeatherBackground(
        data.weather[0].main
    );


    let icon =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


    document.getElementById("result").innerHTML = `

        <div class="current-weather">

            <h2>
                ${data.name}, ${data.sys.country}
            </h2>

            <img
                src="${icon}"
                alt="${data.weather[0].description}"
            >

            <h3>
                ${data.weather[0].description}
            </h3>

            <p>
                🌡️ Temperature:
                ${data.main.temp} °C
            </p>

            <p>
                🌡️ Feels Like:
                ${data.main.feels_like} °C
            </p>

            <p>
                💧 Humidity:
                ${data.main.humidity}%
            </p>

            <p>
                💨 Wind Speed:
                ${data.wind.speed} m/s
            </p>

            <p>
                🔽 Pressure:
                ${data.main.pressure} hPa
            </p>

        </div>

        <h2 class="forecast-title">
            📅 5-Day Forecast
        </h2>

        <div id="forecast"></div>

    `;


    showForecast(forecastData);
}


// ======================================
// SHOW 5-DAY FORECAST
// ======================================

function showForecast(data) {

    let forecastContainer =
        document.getElementById("forecast");


    // Select forecast around 12 PM
    let dailyForecast =
        data.list.filter(function(item) {

            return item.dt_txt.includes("12:00:00");

        });


    // First 5 days
    dailyForecast =
        dailyForecast.slice(0, 5);


    dailyForecast.forEach(function(item) {

        let date =
            new Date(item.dt * 1000);


        let day =
            date.toLocaleDateString("en-IN", {
                weekday: "short"
            });


        let icon =
            `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;


        let card =
            document.createElement("div");


        card.className =
            "forecast-card";


        card.innerHTML = `

            <h3>${day}</h3>

            <img
                src="${icon}"
                alt="${item.weather[0].description}"
            >

            <p>
                ${item.main.temp} °C
            </p>

            <small>
                ${item.weather[0].main}
            </small>

        `;


        forecastContainer.appendChild(card);

    });
}


// ======================================
// ENTER KEY SEARCH
// ======================================

function handleKeyPress(event) {

    if (event.key === "Enter") {

        getWeather();

    }
}


// ======================================
// DARK MODE
// ======================================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");


    let button =
        document.querySelector(".dark-btn");


    if (document.body.classList.contains("dark-mode")) {

        button.innerHTML =
            "☀️ Light Mode";

    }

    else {

        button.innerHTML =
            "🌙 Dark Mode";

    }
}


// ======================================
// SAVE RECENT CITY
// ======================================

function saveRecentCity(city) {

    let recentCities =
        JSON.parse(
            localStorage.getItem("recentCities")
        ) || [];


    // Remove duplicate city
    recentCities =
        recentCities.filter(function(item) {

            return item.toLowerCase() !==
                city.toLowerCase();

        });


    // Add new city at beginning
    recentCities.unshift(city);


    // Keep only 5 cities
    recentCities =
        recentCities.slice(0, 5);


    // Save to browser
    localStorage.setItem(
        "recentCities",
        JSON.stringify(recentCities)
    );


    showRecentCities();
}


// ======================================
// SHOW RECENT SEARCHES
// ======================================

function showRecentCities() {

    let container =
        document.getElementById("recent-searches");


    // If HTML element doesn't exist
    if (!container) {

        return;
    }


    let recentCities =
        JSON.parse(
            localStorage.getItem("recentCities")
        ) || [];


    // No recent searches
    if (recentCities.length === 0) {

        container.innerHTML = "";

        return;
    }


    let html = `
        <h3>🕘 Recent Searches</h3>
    `;


    recentCities.forEach(function(city) {

        // Escape quotes for onclick
        let safeCity =
            city.replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'");


        html += `

            <button
                class="recent-city"
                onclick="searchRecentCity('${safeCity}')"
            >
                ${city}
            </button>

        `;

    });


    html += `

        <button
            class="clear-recent"
            onclick="clearRecentCities()"
        >
            🗑️ Clear History
        </button>

    `;


    container.innerHTML =
        html;
}


// ======================================
// SEARCH RECENT CITY
// ======================================

function searchRecentCity(city) {

    document.getElementById("city").value =
        city;

    getWeather();
}


// ======================================
// CLEAR RECENT SEARCHES
// ======================================

function clearRecentCities() {

    localStorage.removeItem(
        "recentCities"
    );


    showRecentCities();
}


// ======================================
// LOAD RECENT SEARCHES
// WHEN APP OPENS
// ======================================

showRecentCities();


// ======================================
// WEATHER BACKGROUND
// ======================================

function changeWeatherBackground(weather) {

    let condition =
        weather.toLowerCase();


    document.body.classList.remove(
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "stormy",
        "default-weather"
    );


    if (condition.includes("clear")) {

        document.body.classList.add("sunny");

    }

    else if (
        condition.includes("cloud")
    ) {

        document.body.classList.add("cloudy");

    }

    else if (
        condition.includes("rain")
    ) {

        document.body.classList.add("rainy");

    }

    else if (
        condition.includes("snow")
    ) {

        document.body.classList.add("snowy");

    }

    else if (
        condition.includes("thunderstorm")
    ) {

        document.body.classList.add("stormy");

    }

    else {

        document.body.classList.add(
            "default-weather"
        );

    }
              }
