// JavaScript for Shodan API Lab

const CONFIG = {
    apiUrl: "http://localhost:3000/proxy", // Default API URL
};

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const keywordInput = document.getElementById("search-keyword");
    const apiKeyInput = document.getElementById("api-key");
    const requestViewer = document.getElementById("request-viewer");
    const responseViewer = document.getElementById("response-viewer");
    const resultsViewer = document.getElementById("results-viewer");

    searchButton.addEventListener("click", async () => {
        const keyword = keywordInput.value.trim();
        const apiKey = apiKeyInput.value.trim();

        // Validate inputs
        const apiKeyPattern = /^[a-zA-Z0-9]{32}$/; // Assuming Shodan API keys are 32 alphanumeric characters
        if (!keyword) {
            alert("Please provide a valid search keyword.");
            return;
        }
        if (!apiKey || !apiKeyPattern.test(apiKey)) {
            alert("Please provide a valid Shodan API key.");
            return;
        }

        const apiUrl = CONFIG.apiUrl; // Configurable API URL

        requestViewer.textContent = `POST ${apiUrl} with payload: { query: "${keyword}", apiKey: "*******" }`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey: apiKey, query: keyword }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let responseData;
            try {
                responseData = await response.json();
            } catch (jsonError) {
                throw new Error("Failed to parse JSON response.");
            }

            responseViewer.textContent = JSON.stringify(responseData, null, 2);
            responseViewer.style.overflow = "auto";
            responseViewer.style.maxHeight = "300px";

            if (responseData.matches && Array.isArray(responseData.matches) && responseData.matches.length > 0) {
                resultsViewer.innerHTML = responseData.matches.map(match => {
                    return `<div class="result-item">
                                <p><strong>IP:</strong> ${match.ip_str}</p>
                                <p><strong>Port:</strong> ${match.port}</p>
                                <p><strong>Data:</strong></p>
                                <pre>${match.data}</pre>
                            </div>`;
                }).join("");
                resultsViewer.style.overflow = "auto";
                resultsViewer.style.maxHeight = "300px";
            } else {
                resultsViewer.innerHTML = "<p>No results found for the given keyword.</p>";
                resultsViewer.style.overflow = "auto";
                resultsViewer.style.maxHeight = "300px";
            }
        } catch (error) {
            responseViewer.textContent = `Error: ${error.message}`;
            resultsViewer.innerHTML = "<p>Failed to retrieve data. Please check your proxy server or network connection.</p>";
        }
    });
});