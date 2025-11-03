# Stock Market Prediction Web App

## Overview
A Flask-based stock market prediction web application that provides AI-powered buy/sell/hold recommendations using technical analysis and linear regression machine learning. The app fetches real-time stock data, calculates technical indicators (SMA10, SMA50, RSI14), predicts next-day closing prices, and displays interactive price charts.

**Status:** Fully functional and deployed  
**Last Updated:** November 3, 2025

## Purpose
- Allow users to analyze stocks by ticker symbol (e.g., AAPL, TCS.NS, GOOGL)
- Provide next-day price predictions using linear regression
- Display technical indicators for informed trading decisions
- Offer buy/sell/hold recommendations based on prediction logic
- Visualize 6-month price trends with interactive Chart.js graphs

## Tech Stack

### Backend
- **Python 3.11** - Runtime environment
- **Flask 3.1.2** - Web framework
- **yfinance 0.2.66** - Stock market data fetching
- **pandas 2.3.3** - Data manipulation and analysis
- **numpy 2.3.4** - Numerical computations
- **scikit-learn 1.7.2** - Machine learning (Linear Regression)

### Frontend
- **HTML5** - Structure
- **CSS3** - Responsive styling with gradient backgrounds
- **JavaScript (ES6)** - Interactive functionality
- **Chart.js 4.4.0** - Line chart visualization

## Project Structure
```
.
├── app.py                  # Flask backend with API endpoint
├── templates/
│   └── index.html         # Frontend HTML interface
├── static/
│   ├── style.css          # Responsive CSS styling
│   └── script.js          # JavaScript logic and Chart.js integration
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignore patterns
└── replit.md              # Project documentation
```

## Features

### Technical Indicators
1. **SMA10** - 10-day Simple Moving Average
2. **SMA50** - 50-day Simple Moving Average
3. **RSI14** - 14-day Relative Strength Index

### Machine Learning Prediction
- Uses **Linear Regression** to forecast next-day closing price
- Trained on 2 years of historical daily price data
- Feature: Sequential days as independent variable

### Recommendation Logic
- **BUY** - Predicted price > Current price × 1.02 (2% increase expected)
- **SELL** - Predicted price < Current price × 0.98 (2% decrease expected)
- **HOLD** - Predicted price within ±2% of current price

### Data Visualization
- Interactive line chart showing last 6 months of closing prices
- Responsive tooltips with exact price and date
- Smooth gradient fills and animations

## API Endpoint

### GET /api/quote
**Description:** Fetches stock data, calculates indicators, and returns predictions

**Query Parameters:**
- `ticker` (required) - Stock ticker symbol (e.g., AAPL, TCS.NS, MSFT)

**Response Format:**
```json
{
  "ticker": "AAPL",
  "current_price": 175.43,
  "predicted_price": 178.92,
  "sma10": 174.56,
  "sma50": 172.89,
  "rsi14": 58.45,
  "recommendation": "BUY",
  "currency": "$",
  "chart": {
    "labels": ["2025-05-01", "2025-05-02", ...],
    "values": [170.23, 171.45, ...]
  }
}
```

**Error Responses:**
- `400` - Missing ticker parameter
- `404` - No data found for ticker
- `500` - Server error during data fetching

## How to Use

### Running the Application
The Flask app runs automatically on port 5000 via the configured workflow.

**Manual start:**
```bash
python app.py
```

The app will be accessible at `http://0.0.0.0:5000`

### Using the Web Interface
1. Enter a stock ticker symbol (e.g., AAPL, TCS.NS, GOOGL)
2. Click "Get Prediction" button
3. View results:
   - Current and predicted prices
   - Technical indicators (SMA10, SMA50, RSI14)
   - Buy/Sell/Hold recommendation
   - 6-month price trend chart
4. Press Enter key to quickly submit

### Supported Stock Formats
- **US Stocks:** AAPL, MSFT, GOOGL, TSLA, AMZN
- **Indian Stocks:** TCS.NS, RELIANCE.NS, INFY.NS
- **Other Markets:** Use appropriate Yahoo Finance ticker format

## Configuration

### Environment Variables
- `SESSION_SECRET` - Flask session secret key (already configured)

### Port Configuration
- The app binds to `0.0.0.0:5000` for Replit compatibility
- Frontend accessible via Replit webview

## Technical Implementation Details

### Backend Calculations
1. **SMA Calculation:** Rolling average over specified window period
2. **RSI Calculation:** 
   - Delta = price change between days
   - Average gain and loss over 14 periods
   - RS = Average Gain / Average Loss
   - RSI = 100 - (100 / (1 + RS))
3. **Linear Regression:**
   - X = Sequential day numbers (0, 1, 2, ..., n)
   - y = Closing prices
   - Predict day (n+1)

### Frontend Features
- **Loading Spinner:** Shows during API calls
- **Error Handling:** Displays user-friendly error messages
- **Responsive Design:** Works on mobile, tablet, and desktop
- **Color-Coded Recommendations:**
  - Green gradient for BUY
  - Red gradient for SELL
  - Yellow/orange gradient for HOLD
- **Enter Key Support:** Submit on pressing Enter

## Recent Changes
- **November 3, 2025:** Initial project creation
  - Built complete Flask backend with yfinance integration
  - Created responsive frontend with Chart.js visualization
  - Implemented technical indicators and ML prediction
  - Added buy/sell/hold recommendation logic
  - Configured Flask workflow on port 5000

## Architecture Decisions
1. **yfinance over APIs:** Free, no API key required, reliable historical data
2. **Linear Regression:** Simple, interpretable, fast predictions for demo purposes
3. **Flask Development Server:** Suitable for Replit deployment
4. **Chart.js:** Lightweight, responsive, well-documented charting library
5. **Card-Based UI:** Modern, clean design pattern for displaying metrics
6. **Gradient Background:** Professional appearance, good contrast
7. **Currency Detection:** Automatically displays ₹ for INR, $ for USD

## Future Enhancement Ideas
- Add more ML models (LSTM, Random Forest, ARIMA)
- Support multiple timeframe analysis (1M, 3M, 1Y, 2Y)
- Implement candlestick charts with volume indicators
- Add portfolio tracking and watchlist functionality
- Include news sentiment analysis
- Add stock comparison features
- Implement historical prediction accuracy tracking
- Add mobile app version
- Support cryptocurrency predictions

## Dependencies Management
All Python dependencies are managed via `requirements.txt` and installed using `uv` package manager in the Replit environment.

## Notes
- Stock market predictions are for educational purposes only
- Past performance does not guarantee future results
- Always do your own research before making investment decisions
- Data fetched from Yahoo Finance via yfinance library
