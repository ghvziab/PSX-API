/**
 * Configuration
 * Change this to your Vercel deployment URL when ready.
 * e.g., "https://my-psx-api.vercel.app/api"
 * Note: Localhost will NOT work in Google Sheets because Google's servers cannot see your computer.
 * Use ngrok (e.g., "https://<your-ngrok-id>.ngrok-free.app/api") for local testing.
 */
const API_BASE_URL = "http://localhost:8000/api";

/**
 * Fetches the current price of a PSX ticker.
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The current price.
 * @customfunction
 */
function PSX_PRICE(ticker) {
  if (!ticker) return null;
  
  const url = `${API_BASE_URL}/ticker/${ticker}`;
  try {
    const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    const json = JSON.parse(response.getContentText());
    if (json.status === "success" && json.data) {
      return json.data.price;
    }
    return "N/A";
  } catch (e) {
    return "Error";
  }
}

/**
 * Fetches the day's change value of a PSX ticker.
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The day's change.
 * @customfunction
 */
function PSX_CHANGE(ticker) {
  if (!ticker) return null;
  
  const url = `${API_BASE_URL}/ticker/${ticker}`;
  try {
    const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    const json = JSON.parse(response.getContentText());
    if (json.status === "success" && json.data) {
      return json.data.change;
    }
    return "N/A";
  } catch (e) {
    return "Error";
  }
}

/**
 * Fetches the day's change percentage of a PSX ticker.
 *
 * @param {"OGDC"} ticker The stock ticker symbol.
 * @return The day's change percentage (e.g. "1.5%").
 * @customfunction
 */
function PSX_CHANGE_PCT(ticker) {
  if (!ticker) return null;
  
  const url = `${API_BASE_URL}/ticker/${ticker}`;
  try {
    const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    const json = JSON.parse(response.getContentText());
    if (json.status === "success" && json.data) {
      return json.data.change_percent;
    }
    return "N/A";
  } catch (e) {
    return "Error";
  }
}
