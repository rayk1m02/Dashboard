import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, // for the x-axis labels (time (month, weeks, days, hrs, etc))
  LinearScale, // for the y-axis numbers (stock price)
  PointElement, // for the dots on the line
  LineElement, // for the actual line
  Title, // chart title
  Tooltip, // when hovering over a data point
  Legend // shows stock names at the top
);

function StockChart() {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [timeScale, setTimeScale] = useState('1D');

  const TIME_PERIODS = {
    '1D': '1day',
    '1W': '1week',
    '1M': '1month',
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${baseUrl}/api/stock`, {
          params: {
            interval: TIME_PERIODS[timeScale]
          }
        });

        // Add these console.logs
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);

        // Check if response has the expected structure
        if (!response.data.values || !Array.isArray(response.data.values)) {
          throw new Error('Invalid data format received from API');
        }
        
        // Reverse the array to show oldest to newest
        const values = [...response.data.values].reverse();
        
        // Transform API response into chart data format
        const chartData = {
          labels: values.map(item => {
            try {
              const date = new Date(item.datetime);
              if (isNaN(date)) {
                throw new Error('Invalid date');
              }
              // Format date based on timeScale
              if (timeScale === '1D') {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } else {
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }
            } catch (e) {
              console.error('Date parsing error:', e);
              return item.datetime; // fallback to raw datetime string
            }
          }),
          datasets: [{
            label: response.data.meta?.symbol || 'Stock Price',
            data: values.map(item => {
              const price = parseFloat(item.close);
              return isNaN(price) ? null : price;
            }),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };
        
        setStockData(chartData);
      } catch (err) {
        setError(`Failed to fetch stock data: ${err.message}`);
        console.error('Full error:', err);
      }
    };

    fetchStockData();
  }, [timeScale]); // Refetch when timeScale changes

  const handleZoomChange = (period) => {
    setTimeScale(period);
  };

  if (error) return (
    <div>
      <h3>Error:</h3>
      <p>{error}</p>
    </div>
  );

  if (!stockData) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Stock Price</h2>
        <div className="flex gap-2">
          {Object.keys(TIME_PERIODS).map((period) => (
            <button
              key={period}
              onClick={() => handleZoomChange(period)}
              className={`px-3 py-1 rounded ${
                timeScale === period 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <Line data={stockData} />
    </div>
  );
}

export default StockChart;