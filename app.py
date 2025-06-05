from flask import Flask, jsonify
from scraper import scraper
app = Flask(__name__)

@app.route("/psx-market-watch")
def psxdata():
    data = scraper()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug = True)