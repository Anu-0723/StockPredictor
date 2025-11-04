from flask import Flask, render_template, request, jsonify
import yfinance as yf
import pandas as pd
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/quote', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('ticker', '').upper().strip()

    if not symbol:
        return jsonify({'error': '⚠️ Please enter a valid stock symbol.'}), 400

    try:
        # Fetch last 6 months of data
        data = yf.Ticker(symbol)
        hist = data.history(period='6mo')

        if hist.empty:
            return jsonify({'error': f'❌ Invalid or unsupported stock symbol: {symbol}'}), 400

        # --- Calculate metrics ---
        current_price = round(hist['Close'][-1], 2)
        sma_10 = round(hist['Close'].rolling(window=10).mean().iloc[-1], 2)
        sma_50 = round(hist['Close'].rolling(window=50).mean().iloc[-1], 2)

        # --- RSI Calculation ---
        delta = hist['Close'].diff()
        gain = delta.where(delta > 0, 0).rolling(14).mean()
        loss = -delta.where(delta < 0, 0).rolling(14).mean()
        rs = gain / loss
        rsi = round(100 - (100 / (1 + rs.iloc[-1])), 2)

        # --- Simple prediction logic ---
        predicted_price = round(current_price * 1.02, 2)
        if predicted_price > current_price:
            recommendation = "BUY ✅"
        elif predicted_price < current_price:
            recommendation = "SELL ⚠️"
        else:
            recommendation = "HOLD ⏸️"

        # --- Chart data (Last 30 days) ---
        chart_labels = [str(d.date()) for d in hist.index[-30:]]
        chart_values = [round(v, 2) for v in hist['Close'].tail(30)]

        # Return all data
        return jsonify({
            'ticker': symbol,
            'current_price': current_price,
            'predicted_price': predicted_price,
            'sma10': sma_10,
            'sma50': sma_50,
            'rsi14': rsi,
            'recommendation': recommendation,
            'chart': {
                'labels': chart_labels,
                'values': chart_values
            }
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': f'⚠️ Could not fetch data: {str(e)}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
