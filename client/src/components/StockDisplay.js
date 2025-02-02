import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StockDisplay() {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Temporarily comment out the API call until backend is ready
        setStockData({ message: "Backend API not yet connected" });
        
        // Original code commented out until backend is ready
        /*
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${baseUrl}/api/stock`);
        setStockData(response.data);
        */
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error(err);
      }
    };

    fetchStockData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!stockData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Stock Data</h2>
      <pre>{JSON.stringify(stockData, null, 2)}</pre>
    </div>
  );
}

export default StockDisplay;
