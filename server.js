const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Frontend files serve karna
app.use(express.static(path.join(__dirname, "public")));

// Weather API
app.get("/api/weather", async (req, res) => {
    try {
        const city = req.query.city;

        if (!city) {
            return res.status(400).json({
                message: "City name is required"
            });
        }

        if (!API_KEY) {
            return res.status(500).json({
                message: "API key is not configured on server"
            });
        }

        const currentUrl =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const [currentResponse, forecastResponse] =
            await Promise.all([
                fetch(currentUrl),
                fetch(forecastUrl)
            ]);

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        if (!currentResponse.ok) {
            return res.status(currentResponse.status).json(currentData);
        }

        if (!forecastResponse.ok) {
            return res.status(forecastResponse.status).json(forecastData);
        }

        res.json({
            current: currentData,
            forecast: forecastData
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to fetch weather data"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Weather App running on port ${PORT}`);
});
