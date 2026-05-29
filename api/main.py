from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.scraper import get_all_stocks, get_stock

app = FastAPI(title="PSX API for Google Sheets")

# Allow requests from anywhere (Google Apps Script)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the PSX API. Use /api/market or /api/ticker/{symbol}"}

@app.get("/api/market")
def get_market():
    """Returns the entire market watch data."""
    try:
        stocks = get_all_stocks()
        return {"status": "success", "data": stocks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ticker/{symbol}")
def get_ticker(symbol: str):
    """Returns data for a specific ticker."""
    try:
        stock = get_stock(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    if stock:
        return {"status": "success", "data": stock}
    raise HTTPException(status_code=404, detail=f"Ticker {symbol} not found")
