import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * 
 * [Browser] → [StockDisplay.js] → [Your Server (server.js)] → [TwelveData API]
                ↑                         |
                |-------------------------|
                     Returns stock data
 *                    
 */

function StockDisplay() {
  // stockData - variable to store stock data (intial value is null)
  // setStockData - function to update stock data
  // useState - hook to create the state variable and function
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {        
        // Render URL or localhost
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        console.log('Attempting to fetch from:', baseUrl); 
        // fetching stock data from server
        const response = await axios.get(`${baseUrl}/api/stock`);
        // updating function
        setStockData(response.data);
      } catch (err) {
        // Updates the state to display error message to use in UI
        setError(`Failed to fetch stock data: ${err.message}`);
        // Logs to browsers console for debugging
        console.error('Full error:', err);
      }
    };

    fetchStockData();
  }, []);

  if (error) return (
    <div>
      <h3>Error:</h3>
      <p>{error}</p>
      <p>API URL: {process.env.REACT_APP_API_URL}</p>
    </div>
  );

  if (!stockData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Stock Data</h2>
      <pre>{JSON.stringify(stockData, null, 2)}</pre>
    </div>
  );
}

export default StockDisplay;
