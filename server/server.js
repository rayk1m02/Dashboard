require('dotenv').config();

const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://vercel.com/rayk1m02s-projects/dashboard/D97au1ZtLSHJkitDWn2MqteQ4hz9'
    : 'http://localhost:3000'
    https://dashboard-27t55qx9h-rayk1m02s-projects.vercel.app
}));

app.get('/api/stock', (req, res) => {
  const symbol = req.query.symbol || 'PFE'; // testing Pfizer stock first
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const path = "/time_series?apikey=9705b0018bde490181abf8a84cd6a300&technicalIndicator=ad&symbol=PFE&interval=1month&country=US&exchange=NYSE&type=stock&outputsize=10&start_date=2024-08-02 09:30:00&end_date=2025-01-30 16:00:00&format=json";
  const options = {
    method: 'GET',
    hostname: 'api.twelvedata.com',
    port: null,
    path: path,
  };

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


