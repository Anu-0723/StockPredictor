let priceChart = null;

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('predictBtn').disabled = true;
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('predictBtn').disabled = false;
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    hideLoading();
}

function showResults(data) {
    document.getElementById('stockTicker').textContent = data.ticker;
    document.getElementById('currentPrice').textContent = data.currency + data.current_price.toLocaleString();
    document.getElementById('predictedPrice').textContent = data.currency + data.predicted_price.toLocaleString();
    document.getElementById('sma10').textContent = data.currency + data.sma10.toLocaleString();
    document.getElementById('sma50').textContent = data.currency + data.sma50.toLocaleString();
    document.getElementById('rsi14').textContent = data.rsi14.toFixed(2);
    
    const recommendationEl = document.getElementById('recommendation');
    recommendationEl.textContent = data.recommendation;
    recommendationEl.className = 'card-value recommendation ' + data.recommendation.toLowerCase();
    
    const recommendationCard = document.getElementById('recommendationCard');
    recommendationCard.style.background = 
        data.recommendation === 'BUY' ? 'linear-gradient(135deg, #d4f8e8 0%, #a7f3d0 100%)' :
        data.recommendation === 'SELL' ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' :
        'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
    
    updateChart(data.chart.labels, data.chart.values);
    
    document.getElementById('resultsSection').style.display = 'block';
    hideLoading();
}

function updateChart(labels, values) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    if (priceChart) {
        priceChart.destroy();
    }
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Closing Price',
                data: values,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 5,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 10,
                        autoSkip: true
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

async function getPrediction() {
    const ticker = document.getElementById('tickerInput').value.trim();
    
    if (!ticker) {
        showError('Please enter a stock ticker symbol');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`/api/quote?ticker=${encodeURIComponent(ticker)}`);
        const data = await response.json();
        
        if (response.ok) {
            showResults(data);
        } else {
            showError(data.error || 'An error occurred while fetching data');
        }
    } catch (error) {
        showError('Network error: Unable to connect to the server');
        console.error('Error:', error);
    }
}

document.getElementById('tickerInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getPrediction();
    }
});

document.getElementById('tickerInput').focus();
