from flask import Flask, render_template, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SESSION_SECRET', 'dev-secret-key-change-in-production')

def calculate_sma(data, window):
    return data['Close'].rolling(window=window).mean()

def calculate_rsi(data, period=14):
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def predict_next_day_price(data):
    data = data.dropna()
    data['Days'] = np.arange(len(data))
    
    X = data[['Days']].values
    y = data['Close'].values
    
    model = LinearRegression()
    model.fit(X, y)
    
    next_day = np.array([[len(data)]])
    predicted_price = model.predict(next_day)[0]
    
    return predicted_price

def get_recommendation(current_price, predicted_price):
    if predicted_price > current_price * 1.02:
        return "BUY"
    elif predicted_price < current_price * 0.98:
        return "SELL"
    else:
        return "HOLD"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/quote')
def get_quote():
    ticker = request.args.get('ticker', '').upper().strip()
    
    if not ticker:
        return jsonify({'error': 'Please provide a ticker symbol'}), 400
    
    try:
        stock = yf.Ticker(ticker)
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=730)
        
        data = stock.history(start=start_date, end=end_date)
        
        if data.empty:
            return jsonify({'error': f'No data found for ticker: {ticker}'}), 404
        
        data['SMA10'] = calculate_sma(data, 10)
        data['SMA50'] = calculate_sma(data, 50)
        data['RSI14'] = calculate_rsi(data, 14)
        
        current_price = data['Close'].iloc[-1]
        sma10 = data['SMA10'].iloc[-1]
        sma50 = data['SMA50'].iloc[-1]
        rsi14 = data['RSI14'].iloc[-1]
        
        predicted_price = predict_next_day_price(data)
        
        recommendation = get_recommendation(current_price, predicted_price)
        
        chart_data = data.tail(180)
        
        chart_labels = [date.to_pydatetime().strftime('%Y-%m-%d') for date in chart_data.index]
        chart_values = chart_data['Close'].tolist()
        
        info = stock.info
        currency_symbol = info.get('currency', 'USD')
        if currency_symbol == 'INR':
            currency_symbol = '₹'
        elif currency_symbol == 'USD':
            currency_symbol = '$'
        else:
            currency_symbol = currency_symbol + ' '
        
        response = {
            'ticker': ticker,
            'current_price': round(current_price, 2),
            'predicted_price': round(predicted_price, 2),
            'sma10': round(sma10, 2),
            'sma50': round(sma50, 2),
            'rsi14': round(rsi14, 2),
            'recommendation': recommendation,
            'currency': currency_symbol,
            'chart': {
                'labels': chart_labels,
                'values': chart_values
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': f'Error fetching data: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
