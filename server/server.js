// loads environment variable from .env file into process.env so node.js can access them
require('dotenv').config();
console.log('Environment variables after loading:', {
  PORT: process.env.PORT,
  TWELVEDATA_API_KEY: process.env.TWELVEDATA_API_KEY?.substring(0, 5) + '...' // Only show first 5 chars for security
});
// express is a web framework for node.js. Helps build a web server easily
const express = require('express');
// module which allows making secure HTTPS requests
const https = require('https');
// cors is a middleware for handling cross-origin requests
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Add environment variable validation
if (!process.env.TWELVEDATA_API_KEY) {
  console.error('ERROR: TWELVEDATA_API_KEY environment variable is not set!');
  console.error('Please create a .env file in the server directory with your API key.');
  console.error('Example: TWELVEDATA_API_KEY=your_api_key_here');
  process.exit(1); // Exit the process if the API key is missing
}

// Same-Origin Policy and Cross-Origin Resource Sharing
// Tells server which domains are allowed to make requests to this server
app.use(cors({
  // vercel frontend  or localhostrequests the stock data from this server file
  origin: ['https://stocks-dashboard-coral.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Add preflight handler for OPTIONS requests
app.options('*', cors()); // Enable pre-flight for all routes

// test route to ensure server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

/**
 * eventually i need to be able to specificy what stock/symbol the user wants to retrieve
 * maybe add a param for the symbol, and then use it in API call
 * 
 * what about stock data for all stocks? do i need to call this multiple times for each stock and keep track?
 * 
 * something like this (getting symbol from URL params)
 * app.get('/api/stock/:symbol', (req, res) => {
 *    const symbol = req.params.symbol || 'some_default_stock' (maybe ALL stock view?) how tho? idk'; 
 */
// route to get stock data from TwelveData API
app.get('/api/stock', (req, res) => {
  const symbol = req.query.symbol || 'PFE'; // testing Pfizer stock first
  const interval = req.query.interval || '1day';

  console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    HAS_API_KEY: !!process.env.TWELVEDATA_API_KEY,
    API_KEY_LENGTH: process.env.TWELVEDATA_API_KEY?.length
  });

  if (!process.env.TWELVEDATA_API_KEY) {
    console.error('API key is missing!');
    return res.status(500).json({ 
      error: 'API key configuration is missing',
      details: 'Please ensure TWELVEDATA_API_KEY is set in environment variables'
    });
  }

  // Path with proper URL encoding
  const params = new URLSearchParams({
    apikey: process.env.TWELVEDATA_API_KEY,
    technicalIndicator: 'ad',
    symbol: symbol,
    interval: interval,
    country: 'US',
    exchange: 'NYSE',
    type: 'stock',
    outputsize: '10',
    // one year from today
    start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    format: 'json'
  });

  const options = {
    method: 'GET',
    hostname: 'api.twelvedata.com',
    port: null,
    path: `/time_series?${params.toString()}`
  };

   // Add this log to verify the API key is being sent
   console.log('API Request URL:', `/time_series?${params.toString()}`);

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
        console.log('API Response:', parsedData);
        res.json(parsedData);
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse stock data' });
      }
    });
  });

  // error handling for the request
  apiReq.on('error', (error) => {
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