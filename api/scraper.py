import requests
from bs4 import BeautifulSoup
from cachetools import cached, TTLCache

# Cache for 5 minutes (300 seconds)
# maxsize=1 because we just store the whole market watch dictionary
cache = TTLCache(maxsize=1, ttl=300)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
}

@cached(cache)
def get_all_stocks():
    """
    Fetches the market watch page and parses all stocks into a dictionary.
    Returns: { "SYMBOL": {"price": 100.0, "change": 1.5, "change_percent": "1.5%", "volume": 1000} }
    """
    url = 'https://dps.psx.com.pk/market-watch'
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_='tbl')
    
    stocks = {}
    if not table:
        return stocks

    tbody = table.find('tbody')
    if not tbody:
        return stocks

    for tr in tbody.find_all('tr'):
        cols = tr.find_all('td')
        if len(cols) >= 8:
            symbol = cols[0].text.strip()
            # Depending on column layout, usually:
            # 0: Symbol, 1: Name, 2: Sector, 3: LDCP, 4: Open, 5: High, 6: Low, 7: Current, 8: Change, 9: Change%, 10: Volume
            # It might be slightly different. We'll extract based on typical structure.
            try:
                # We will just parse the last few columns which are typically Current, Change, Volume
                # Let's try to handle standard format where Current is the 6th or 7th column.
                # Actually, PSX market watch has 11 columns: Symbol, Name, LDCP, Open, High, Low, Current, Change, Change(%), Volume.
                # Let's just grab them safely.
                
                # Column 6 is usually Current, 7 is Change, 8 is Volume (0-indexed might be 5, 6, 8)
                # Let's be defensive.
                
                # The columns for PSX Market Watch are:
                # 0: Symbol
                # 1: Name
                # 2: LDCP
                # 3: Open
                # 4: High
                # 5: Low
                # 6: Current
                # 7: Change
                # 8: Change %
                # 9: Volume
                
                name = cols[1].text.strip()
                ldcp = cols[2].text.strip().replace(',', '')
                open_val = cols[3].text.strip().replace(',', '')
                high = cols[4].text.strip().replace(',', '')
                low = cols[5].text.strip().replace(',', '')
                current = cols[7].text.strip().replace(',', '')
                change = cols[8].text.strip().replace(',', '')
                change_pct = cols[9].text.strip() if len(cols) > 9 else "0%"
                volume = cols[10].text.strip().replace(',', '') if len(cols) > 10 else "0"
                
                stocks[symbol] = {
                    "symbol": symbol,
                    "name": name,
                    "ldcp": float(ldcp) if ldcp and ldcp != '-' else 0.0,
                    "open": float(open_val) if open_val and open_val != '-' else 0.0,
                    "high": float(high) if high and high != '-' else 0.0,
                    "low": float(low) if low and low != '-' else 0.0,
                    "price": float(current) if current and current != '-' else 0.0,
                    "change": float(change) if change and change != '-' else 0.0,
                    "change_percent": change_pct,
                    "volume": int(volume) if volume and volume != '-' else 0
                }
            except Exception as e:
                pass # Skip rows that don't match the format
                
    return stocks

def get_stock(symbol: str):
    stocks = get_all_stocks()
    return stocks.get(symbol.upper())
