from flask import Flask, jsonify
from scraper import scraper

app = Flask(__name__)

@app.route("/psx-market-watch")
def psxdata():
    try:
        data = scraper()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)