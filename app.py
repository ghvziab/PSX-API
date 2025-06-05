from flask import Flask, jsonify
from scraper import scraper
import traceback
import logging

app = Flask(__name__)

app.logger.setLevel(logging.DEBUG)

@app.route("/psx-market-watch")
def psxdata():
    try:
        data = scraper()
        return jsonify(data)
    except:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug = True)