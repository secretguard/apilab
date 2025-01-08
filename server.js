const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Proxy route to handle requests to the Shodan API
app.post("/proxy", async (req, res) => {
    const { apiKey, query } = req.body;

    if (!apiKey || !query) {
        res.status(400).send("API key and query are required.");
        return;
    }

    try {
        console.log("Received request:", { apiKey: "*******", query });

        // Make the request to the Shodan API
        const response = await axios.get(`https://api.shodan.io/shodan/host/search`, {
            params: { key: apiKey, query },
        });

        console.log("Shodan response:", response.data);

        // Send the response data back to the frontend
        res.json(response.data);
    } catch (error) {
        console.error("Error communicating with Shodan:", error.message);

        // Send error details to the frontend
        const statusCode = error.response ? error.response.status : 500;
        res.status(statusCode).send(error.message);
    }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});