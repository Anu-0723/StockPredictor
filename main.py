from flask import Flask, render_template, request
import yfinance as yf
import os

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    error = None
    stock_data = None

    if request.method == 'POST':
        symbol = request.form['symbol'].upper()
        try:
            data = yf.Ticker(symbol)
            hist = data.history(period='5d')

            # Check if data exists
            if hist.empty:
                raise ValueError("Invalid stock symbol")

            # Calculate values
            current_price = round(hist['Close'][-1], 2)
            sma_10 = round(hist['Close'].rolling(window=10).mean().iloc[-1], 2)
            sma_50 = round(hist['Close'].rolling(window=50).mean().iloc[-1], 2)
            rsi = 37.87  # placeholder RSI value
            prediction = round(current_price * 0.96, 2)

            # Recommendation logic
            recommendation = (
                "BUY" if prediction > current_price 
                else "SELL" if prediction < current_price 
                else "HOLD"
            )

            stock_data = {
                'symbol': symbol,
                'current_price': current_price,
                'predicted_price': prediction,
                'sma10': sma_10,
                'sma50': sma_50,
                'rsi': rsi,
                'recommendation': recommendation
            }

        except Exception as e:
            error = "❌ Invalid stock symbol. Please enter a valid one (e.g., AAPL, MSFT, TCS.NS)."

    return render_template('index.html', stock_data=stock_data, error=error)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))  # important for Render
    app.run(host='0.0.0.0', port=port, debug=True)
