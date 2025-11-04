// script.js
let priceChart = null;

async function getPrediction() {
  const tickerInput = document.getElementById("tickerInput");
  const ticker = tickerInput.value.trim().toUpperCase();
  const loadingSpinner = document.getElementById("loadingSpinner");
  const resultsSection = document.getElementById("resultsSection");
  const errorMessage = document.getElementById("errorMessage");

  // Clear previous state
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
    const response = await fetch(`/api/quote?ticker=${encodeURIComponent(ticker)}`);

    if (!response.ok) {
      throw new Error("Server error. Please try again later.");
    }

    const data = await response.json();
    loadingSpinner.style.display = "none";

    if (data.error) {
      errorMessage.textContent = `❌ ${data.error}`;
      errorMessage.style.display = "block";
      return;
    }

    // ✅ Update stock info
    document.getElementById("stockTicker").textContent = data.ticker;
    document.getElementById("currentPrice").textContent = data.currency + data.current_price;
    document.getElementById("predictedPrice").textContent = data.currency + data.predicted_price;
    document.getElementById("sma10").textContent = data.currency + data.sma10;
    document.getElementById("sma50").textContent = data.currency + data.sma50;
    document.getElementById("rsi14").textContent = data.rsi14;
    document.getElementById("recommendation").textContent = data.recommendation;

    // ✅ Change background color based on recommendation
    const recCard = document.getElementById("recommendationCard");
    recCard.style.background =
      data.recommendation === "BUY"
        ? "linear-gradient(135deg, #d4f8e8, #a7f3d0)"
        : data.recommendation === "SELL"
        ? "linear-gradient(135deg, #fee2e2, #fecaca)"
        : "linear-gradient(135deg, #fef3c7, #fde68a)";

    resultsSection.style.display = "block";

    // ✅ Chart setup
    const ctx = document.getElementById("priceChart").getContext("2d");
    if (priceChart) priceChart.destroy();

    priceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.chart.labels,
        datasets: [
          {
            label: `${data.ticker} Closing Price`,
            data: data.chart.values,
            borderColor: "#4e73df",
            backgroundColor: "rgba(78,115,223,0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { maxTicksLimit: 8 } },
          y: { beginAtZero: false },
        },
        plugins: {
          legend: { display: true },
          tooltip: { mode: "index", intersect: false },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching stock data:", err);
    loadingSpinner.style.display = "none";
    errorMessage.textContent = "⚠️ Unable to connect to the server or invalid stock symbol.";
    errorMessage.style.display = "block";
  }
}

// Allow pressing Enter key
document.getElementById("tickerInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getPrediction();
  }
});
