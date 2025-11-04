const predictBtn = document.getElementById('predictBtn');
const tickerInput = document.getElementById('tickerInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const ctx = document.getElementById('priceChart');

let priceChart;

predictBtn.addEventListener('click', () => {
    const ticker = tickerInput.value.trim().toUpperCase();
    if (!ticker) {
        showError("Please enter a valid stock symbol!");
        return;
    }

    showLoading(true);
    results.style.display = "none";
    error.style.display = "none";

    // Mock API (You can replace with real API later)
    setTimeout(() => {
        showLoading(false);
        displayResults(ticker);
    }, 1500);
});

function showError(message) {
    error.textContent = message;
    error.style.display = "block";
}

function showLoading(show) {
    loading.style.display = show ? "block" : "none";
}

function displayResults(ticker) {
    document.getElementById('stockName').textContent = `${ticker} - Demo Company`;
    document.getElementById('currentPrice').textContent = "$" + (150 + Math.random() * 20).toFixed(2);
    document.getElementById('predictedPrice').textContent = "$" + (160 + Math.random() * 20).toFixed(2);
    document.getElementById('confidence').textContent = (80 + Math.random() * 20).toFixed(1) + "%";

    const rec = ["BUY", "SELL", "HOLD"][Math.floor(Math.random() * 3)];
    const recEl = document.getElementById('recommendation');
    recEl.textContent = rec;
    recEl.className = "card-value recommendation " + rec.toLowerCase();

    results.style.display = "block";

    renderChart();
}

function renderChart() {
    const labels = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);
    const data = labels.map(() => (150 + Math.random() * 20).toFixed(2));

    if (priceChart) priceChart.destroy();

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Stock Price ($)',
                data,
                borderWidth: 3,
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}
