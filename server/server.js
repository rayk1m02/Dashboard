require('dotenv').config();

const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Same-Origin Policy and Cross-Origin Resource Sharing
// Tells server which domains are allowed to make requests to this server
app.use(cors({
  origin: ['https://stocks-dashboard-coral.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/api/stock', (req, res) => {
  console.log('Received request for stock data');
  const symbol = req.query.symbol || 'PFE'; // testing Pfizer stock first
  console.log('Using symbol:', symbol);
  
  // Path with proper URL encoding
  const params = new URLSearchParams({
    apikey: '9705b0018bde490181abf8a84cd6a300',
    technicalIndicator: 'ad',
    symbol: 'PFE',
    interval: '1month',
    country: 'US',
    exchange: 'NYSE',
    type: 'stock',
    outputsize: '10',
    start_date: '2024-08-02 09:30:00',
    end_date: new Date().toISOString().split('T').join(' ').split('..')[0],
    format: 'json'
  });

  const options = {
    method: 'GET',
    hostname: 'api.twelvedata.com',
    port: null,
    path: `/time_series?${params.toString()}`
  };

  console.log('Request path:', options.path); // Debug log

  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    apiRes.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        res.json(parsedData);
      } catch (error) {
        console.error('Error parsing API response:', error);
        res.status(500).json({ error: 'Failed to parse stock data' });
      }
    });
  });

  apiReq.on('error', (error) => {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  });

  apiReq.end();
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});