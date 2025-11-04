async function getPrediction() {
    const symbol = document.getElementById("stockSymbol").value.trim();
    const outputDiv = document.getElementById("output");
    const ctx = document.getElementById("myChart").getContext("2d");

    outputDiv.innerHTML = "⏳ Fetching data...";

    try {
        const response = await fetch(`/api/quote?symbol=${symbol}`);
        const data = await response.json();

        if (!response.ok) {
            outputDiv.innerHTML = `⚠️ ${data.error || "Something went wrong."}`;
            return;
        }

        outputDiv.innerHTML = `
            <h3>${data.symbol}</h3>
            <p><strong>Current Price:</strong> ${data.currency}${data.current_price}</p>
            <p><strong>Predicted Price (Next Day):</strong> ${data.currency}${data.predicted_price}</p>
            <p><strong>Recommendation:</strong> ${data.recommendation}</p>
        `;

        // Remove old chart if exists
        if (window.myChart) {
            window.myChart.destroy();
        }

        // Draw chart using Chart.js
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.dates,
                datasets: [{
                    label: `${data.symbol} Stock Price`,
                    data: data.close_prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Price' } }
                }
            }
        });

    } catch (error) {
        outputDiv.innerHTML = "⚠️ Unable to connect to the server or invalid stock symbol.";
        console.error(error);
    }
}
