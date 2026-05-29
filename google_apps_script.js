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
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();

    // 2. Handle HTTP Errors
    if (code === 404) {
      return { error: `Error: Ticker '${ticker}' not found on PSX` };
    } else if (code >= 500) {
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
 * Fetches the current price of a PSX ticker.
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The current price.
 * @customfunction
 */
function PSX_PRICE(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.price;
}

/**
 * Fetches the day's change value of a PSX ticker.
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The day's change.
 * @customfunction
 */
function PSX_CHANGE(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.change;
}

/**
 * Fetches the day's change percentage of a PSX ticker.
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The day's change percentage (e.g. "1.5%").
 * @customfunction
 */
function PSX_CHANGE_PCT(ticker) {
  const result = fetchTickerData(ticker);
  return result.error ? result.error : result.data.change_percent;
}
