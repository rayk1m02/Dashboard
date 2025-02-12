// loads environment variable from .env file into process.env so node.js can access them
require('dotenv').config();

// express is a web framework for node.js. Helps build a web server easily
const express = require('express');
// module which allows making secure HTTPS requests
const https = require('https');
// cors is a middleware for handling cross-origin requests
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

// Same-Origin Policy (SOP) and Cross-Origin Resource Sharing (CORS)

// tells this server which domains are allowed to make requests to it
app.use(cors({
  // vercel frontend or local host request the stock data from this server. render requests?
  origin: ['https://stocks-dashboard-coral.vercel.app', 'http://localhost:3000',],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

/**
 * implement code to account for multiple stocks
 */
// route to get stock data from TwelveData API
app.get('/api/stock', (req, res) => {
	console.log('Received request with query:', req.query); // Log the query parameters
  const symbol = req.query.symbol || 'PFE'; // testing Pfizer stock first
  const interval = req.query.interval || '1day';

	  // Calculate start date based on interval
		let startDate;
		const now = Date.now();
	
		switch (interval) {
			case '1day':
				// For intraday data, set start date to today
				startDate = new Date(now).toISOString().split('T')[0];
				break;
			case '1week':
				// For weekly data, set start date to 3 months ago
				startDate = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
				break;
			case '1month':
				// For monthly data, set start day to 1 year ago
				startDate = new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
				break;
			case '1year':
				// For yearly data, set start date to 5 years ago
				startDate = new Date(now - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
				break;
			default:
				// Default to 1 day for unknown intervals
				startDate = new Date(now).toISOString().split('T')[0];
		}

  // proper URL encoded path
  const params = new URLSearchParams({
    apikey: process.env.TWELVEDATA_API_KEY,
    technicalIndicator: 'ad',
    symbol: symbol,
    interval: interval,
    country: 'US',
    exchange: 'NYSE',
    type: 'stock',
    //number of data points returned
    // outputsize: '10', 
    /**
     * one year from today
     * Date.now() returns milliseconds. So today - one year in milliseconds 
     * gives exactly one year from today
     * 
     * toISOString() returns ISO 8601 format - YYYY-MM-DDTHH:mm:ss.sssZ
     * where we split by delimiter 'T', basically splitting between the date and time
     * we only want the date part so use [0].
     */
    start_date: new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    format: 'json'
  });

  const options = {
    method: 'GET',
    hostname: 'api.twelvedata.com',
    port: null,
    // get request url from TWELVEDATA starts with /time_series?...
    path: `/time_series?${params.toString()}` 
  };

  // make the request to the API
  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    // listen for data from the API
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    // when the data is finished, parse it and send it to the frontend
    apiRes.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
				console.log('API Response:', parsedData); // Log the API response
        res.json(parsedData);
      } catch (error) {
				console.error('Error parsing API response:', error); // Log parsing errors
        res.status(500).json({ error: 'Failed to parse stock data' });
      }
    });
  });

  // error handling for the request
  apiReq.on('error', (error) => {
		console.error('Error making API request:', error); // Log API request errors
    res.status(500).json({ error: 'Failed to fetch stock data' });
  });

  apiReq.end();
});

// error handling middleware
// catches any errors that occur in the app and sends a 500 error response
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// request logging middleware
// debugging and monitoring - logs every request to the server
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/** Console logs can be seen on Render */

/**
 * API response for reference:
 * 
 * {
	"meta": {
		"symbol": "PFE",
		"interval": "1day",
		"currency": "USD",
		"exchange_timezone": "America/New_York",
		"exchange": "NYSE",
		"mic_code": "XNYS",
		"type": "Common Stock"
	},
	"values": [
		{
			"datetime": "2025-02-11",
			"open": "25.83000",
			"high": "25.91000",
			"low": "25.46000",
			"close": "25.53000",
			"volume": "36540500"
		},
		{
			"datetime": "2025-02-10",
			"open": "25.78000",
			"high": "26.12000",
			"low": "25.51000",
			"close": "25.87000",
			"volume": "39632700"
		},
		{
			"datetime": "2025-02-07",
			"open": "25.86000",
			"high": "25.96000",
			"low": "25.53000",
			"close": "25.74000",
			"volume": "36512800"
		},
		{
			"datetime": "2025-02-06",
			"open": "26.42000",
			"high": "26.47000",
			"low": "25.78000",
			"close": "25.83000",
			"volume": "45182000"
		},
		{
			"datetime": "2025-02-05",
			"open": "25.95000",
			"high": "26.69000",
			"low": "25.70000",
			"close": "26.44000",
			"volume": "50426800"
		},
		{
			"datetime": "2025-02-04",
			"open": "26.10000",
			"high": "26.92000",
			"low": "25.60000",
			"close": "25.87000",
			"volume": "68748300"
		},
		{
			"datetime": "2025-02-03",
			"open": "26.30000",
			"high": "26.47000",
			"low": "26.15000",
			"close": "26.20000",
			"volume": "49626200"
		},
		{
			"datetime": "2025-01-31",
			"open": "26.96000",
			"high": "27.010000",
			"low": "26.42000",
			"close": "26.52000",
			"volume": "37338200"
		},
		{
			"datetime": "2025-01-30",
			"open": "26.66000",
			"high": "27.010000",
			"low": "26.58000",
			"close": "26.91000",
			"volume": "32289600"
		},
		{
			"datetime": "2025-01-29",
			"open": "26.80000",
			"high": "27.070000",
			"low": "26.57000",
			"close": "26.62000",
			"volume": "34418200"
		}
	]
}
 * 
 * 
 */