from flask import Flask, render_template, request, jsonify
import os
import random  # just for demo purposes

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

# 👇 Add this route (the one your JS is calling)
@app.route('/api/quote')
def get_quote():
    ticker = request.args.get('ticker', '').upper()
    if not ticker:
        return jsonify({'error': 'No ticker provided'}), 400

    # Dummy prediction data for testing (you can replace with real logic)
    current_price = round(random.uniform(100, 500), 2)
    predicted_price = round(current_price * random.uniform(0.95, 1.1), 2)
    
    data = {
        'ticker': ticker,
        'currency': '$',
        'current_price': current_price,
        'predicted_price': predicted_price,
        'sma10': round(current_price * 0.98, 2),
        'sma50': round(current_price * 0.93, 2),
        'rsi14': round(random.uniform(30, 70), 2),
        'recommendation': random.choice(['BUY', 'SELL', 'HOLD']),
        'chart': {
            'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            'values': [round(current_price * random.uniform(0.9, 1.1), 2) for _ in range(5)]
        }
    }
    return jsonify(data)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
