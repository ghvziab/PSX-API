/**
 * Configuration
 * Change this to your Vercel deployment URL when ready.
 */
const API_BASE_URL = "https://psx-api-ten.vercel.app/api";

/**
 * Helper function to fetch data and translate errors into human-readable messages.
 */
function fetchTickerData(ticker) {
  if (!ticker) return { error: "Error: Empty cell or missing ticker" };
  
  ticker = String(ticker).trim();
  
  // 1. Catch unquoted strings that Google Sheets turns into #NAME? or #REF! errors
  if (ticker.startsWith("#")) {
    return { error: 'Error: Missing quotes! Try "SYMBOL" instead of SYMBOL' };
  }

  const url = `${API_BASE_URL}/ticker/${ticker}`;
  try {
    const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    const code = response.getResponseCode();
    
    // 2. Handle HTTP Errors
    if (code === 404) {
      return { error: `Error: Ticker '${ticker}' not found on PSX` };
    } else if (code >= 500) {
      return { error: "Error: API server is down" };
    } else if (code !== 200) {
      return { error: `Error: Unexpected API response (${code})` };
    }
    
    const json = JSON.parse(response.getContentText());
    if (json.status === "success" && json.data) {
      return { data: json.data };
    }
    
    return { error: "Error: API returned invalid data format" };
  } catch (e) {
    // 3. Handle Network/Execution Errors
    return { error: "Error: Could not connect to the API" };
  }
}

/**
 * Fetches the current, live trading price of a PSX ticker.
 * Example: =PSX_PRICE("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The current trading price.
 * @customfunction
 */
function PSX_PRICE(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.price;
}

/**
 * Calculates the total value of your shares for a given PSX ticker.
 * Example: =PSX_TOTAL_VALUE("OGDC", 100)
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @param {100} shares The number of shares you own.
 * @return The total value (price * shares).
 * @customfunction
 */
function PSX_TOTAL_VALUE(ticker, shares) {
  if (shares === undefined || isNaN(shares)) return "Error: Missing or invalid number of shares";
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.price * Number(shares);
}

/**
 * Fetches the full company name associated with a PSX ticker.
 * Example: =PSX_NAME("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The full company name.
 * @customfunction
 */
function PSX_NAME(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.name;
}

/**
 * Fetches the absolute day's change in value of a PSX ticker.
 * (Current Price minus Last Day's Closing Price).
 * Example: =PSX_CHANGE("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The day's price change.
 * @customfunction
 */
function PSX_CHANGE(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.change;
}

/**
 * Fetches the day's change percentage of a PSX ticker.
 * Example: =PSX_CHANGE_PCT("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The day's change percentage formatted as a string (e.g. "1.5%").
 * @customfunction
 */
function PSX_CHANGE_PCT(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.change_percent;
}

/**
 * Fetches the total trading volume for the day of a PSX ticker.
 * Example: =PSX_VOLUME("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The total volume traded today.
 * @customfunction
 */
function PSX_VOLUME(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.volume;
}

/**
 * Fetches the Last Day Closing Price (LDCP) of a PSX ticker.
 * This is the official price the stock closed at on the previous trading day.
 * Example: =PSX_LDCP("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The previous day's closing price.
 * @customfunction
 */
function PSX_LDCP(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.ldcp;
}

/**
 * Fetches the opening price of a PSX ticker for the current trading day.
 * Example: =PSX_OPEN("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The opening price.
 * @customfunction
 */
function PSX_OPEN(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.open;
}

/**
 * Fetches the highest trading price of a PSX ticker for the current trading day.
 * Example: =PSX_HIGH("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The highest price of the day.
 * @customfunction
 */
function PSX_HIGH(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.high;
}

/**
 * Fetches the lowest trading price of a PSX ticker for the current trading day.
 * Example: =PSX_LOW("OGDC")
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The lowest price of the day.
 * @customfunction
 */
function PSX_LOW(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.low;
}
