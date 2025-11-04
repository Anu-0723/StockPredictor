from flask import Flask, render_template, request, jsonify
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/quote')
def get_stock_data():
    symbol = request.args.get('symbol')

    if not symbol:
        return jsonify({'error': 'No stock symbol provided'}), 400

    try:
        # Fetch 2 years of data
        data = yf.download(symbol, period="2y", interval="1d")

        if data.empty:
            return jsonify({'error': 'Invalid stock symbol or no data found'}), 404

        data['Date'] = data.index
        data = data.dropna()

        # Technical indicators: SMA (50) & RSI (14)
        data['SMA50'] = data['Close'].rolling(window=50).mean()

        delta = data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        RS = gain / loss
        data['RSI'] = 100 - (100 / (1 + RS))

        # Prepare data for prediction
        data['Prediction'] = data['Close'].shift(-1)
        X = np.array(data[['Close']])
        X = X[:-1]
        y = np.array(data['Prediction'])
        y = y[:-1]

        # Train model
        model = LinearRegression()
        model.fit(X, y)

        # Predict next day price
        next_day_price = model.predict([[data['Close'].iloc[-1]]])[0]
        current_price = round(data['Close'].iloc[-1], 2)
        next_day_price = round(float(next_day_price), 2)

        # Buy/Sell recommendation
        if data['RSI'].iloc[-1] < 30:
            recommendation = "BUY (RSI indicates oversold)"
        elif data['RSI'].iloc[-1] > 70:
            recommendation = "SELL (RSI indicates overbought)"
        elif next_day_price > current_price:
            recommendation = "BUY (Predicted price is higher)"
        else:
            recommendation = "SELL (Predicted price is lower)"

        # Determine currency symbol
        if ".NS" in symbol:
            currency = "₹"
        elif ".L" in symbol:
            currency = "£"
        elif ".TO" in symbol:
            currency = "C$"
        else:
            currency = "$"

        # Send JSON response
        return jsonify({
            'symbol': symbol.upper(),
            'current_price': current_price,
            'predicted_price': next_day_price,
            'recommendation': recommendation,
            'currency': currency,
            'dates': data['Date'].dt.strftime('%Y-%m-%d').tolist()[-100:],
            'close_prices': data['Close'].tolist()[-100:]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
