// script.js
let priceChart = null;

async function getPrediction() {
  const tickerInput = document.getElementById("tickerInput");
  const ticker = tickerInput.value.trim().toUpperCase();
  const loadingSpinner = document.getElementById("loadingSpinner");
  const resultsSection = document.getElementById("resultsSection");
  const errorMessage = document.getElementById("errorMessage");

  // Clear old results & errors
  resultsSection.style.display = "none";
  errorMessage.style.display = "none";
  loadingSpinner.style.display = "block";

  if (!ticker) {
    loadingSpinner.style.display = "none";
    errorMessage.textContent = "⚠️ Please enter a stock ticker symbol.";
    errorMessage.style.display = "block";
    return;
  }

  try {
    const response = await fetch(`/api/quote?ticker=${ticker}`);
    const data = await response.json();
    loadingSpinner.style.display = "none";

    if (!response.ok || data.error) {
      errorMessage.textContent = `❌ ${data.error || "Something went wrong."}`;
      errorMessage.style.display = "block";
      return;
    }

    // Update values in UI
    document.getElementById("stockTicker").textContent = data.ticker;
    document.getElementById("currentPrice").textContent = data.currency + data.current_price;
    document.getElementById("predictedPrice").textContent = data.currency + data.predicted_price;
    document.getElementById("sma10").textContent = data.currency + data.sma10;
    document.getElementById("sma50").textContent = data.currency + data.sma50;
    document.getElementById("rsi14").textContent = data.rsi14;
    document.getElementById("recommendation").textContent = data.recommendation;

    // Change recommendation color
    const recCard = document.getElementById("recommendationCard");
    recCard.classList.remove("buy", "sell", "hold");
    recCard.classList.add(data.recommendation.toLowerCase());

    // Show results
    resultsSection.style.display = "block";

    // Chart.js Visualization
    const ctx = document.getElementById("priceChart").getContext("2d");

    if (priceChart) {
      priceChart.destroy();
    }

    priceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.chart.labels,
        datasets: [
          {
            label: `${data.ticker} Closing Price`,
            data: data.chart.values,
            borderWidth: 2,
            borderColor: "#4e73df",
            fill: false,
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: { maxTicksLimit: 8 },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });

  } catch (err) {
    loadingSpinner.style.display = "none";
    errorMessage.textContent = `⚠️ Error: ${err.message}`;
    errorMessage.style.display = "block";
  }
}
