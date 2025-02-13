import React, { useState, useEffect } from 'react';
import axios from 'axios'; // library for making https requests
/** 
 * React wrapper for chart.js Line chart
 * React components handle DOM manipulation and updating automatically
 */
import { Line } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  CategoryScale, // x-axis labels (time (month, weeks, days, hrs, etc))
  LinearScale, // y-axis labels (stock price)
  PointElement, // data points on the line
  LineElement, // rendering the line
  Title, // chart title
  Tooltip, // when hovering over a data point
  Legend // shows stock names at the top
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
);

const COLORS = [
  'rgb(75, 192, 192)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(199, 199, 199)',
  'rgb(83, 102, 255)',
  'rgb(255, 99, 255)',
  'rgb(99, 255, 132)',
];

/**
 * 
 * [Browser] → [StockChart.js] → [Your Server (server.js)] → [TwelveData API]
                ↑                         |
                |-------------------------|
                     Returns stock data
 *                    
 */

function StockChart({ selectedStocks }) {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [timeScale, setTimeScale] = useState('1H');

  const TIME_PERIODS = {
    '1H': '1h',
    '1D': '1day',
    '1W': '1week',
    '1M': '1month',
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://dashboard-310f.onrender.com';
        console.log('Fetching data from:', baseUrl); // Log the base URL
        
        const responses = await Promise.all(
          selectedStocks.map((symbol) =>
            axios.get(`${baseUrl}/api/stock`, {
              params: {symbol, interval: TIME_PERIODS[timeScale] } 
            }) 
          )
        );

        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);
        
        const datasets = responses.map((response, index) => {
          // Reverse array to show oldest to newest
          const values = [...response.data.values].reverse();
          return {
            label: `${response.data.meta?.symbol} (${response.data.meta?.name || 'Stock Price'})`,
            data: values.map((item) => parseFloat(item.close)),
            borderColor: COLORS[index % COLORS.length],
            tension: 0.1,
          };
        });
        
        // // Transform API response into chart data format
        // const chartData = {
        //   labels: values.map(item => {
        //     const date = new Date(item.datetime);
        //     if (TIME_PERIODS[timeScale] === '1h') {
        //       // Intraday (1H): Show time
        //       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        //     } else if (TIME_PERIODS[timeScale] === '1day') {
        //       // Daily (1D): Show date
        //       return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        //     } else if (TIME_PERIODS[timeScale] === '1week') {
        //       // Weekly: Show date
        //       return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        //     } else if (TIME_PERIODS[timeScale] === '1month') {
        //       // Monthly: Show month and year
        //       return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
        //     } else {
        //       // Fallback: Show raw datetime
        //       return item.datetime;
        //     }
        //   }),
        //   datasets: [{
        //     label: response.data.meta?.symbol || 'Stock Price',
        //     data: values.map(item => parseFloat(item.close)),
        //     borderColor: 'rgb(75, 192, 192)',
        //     tension: 0.1
        //   }]
        // };

        const labels = responses[0]?.data.values.map((item) => {
          const date = new Date(item.datetime);
          if (TIME_PERIODS[timeScale] === '1h') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else if (TIME_PERIODS[timeScale] === '1day') {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          } else if (TIME_PERIODS[timeScale] === '1week') {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          } else if (TIME_PERIODS[timeScale] === '1month') {
            return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
          } else {
            return item.datetime;
          }
        });
        
        setStockData({ labels, datasets });
      } catch (err) {
        setError(`Failed to fetch stock data: ${err.message}`);
        console.error('Full error:', err);
      }
    };

    if (selectedStocks.length > 0) {
      fetchStockData();
    } else {
      setStockData(null); // Reset chart if no stocks are selected
    }
  }, [selectedStocks, timeScale]); // Refetch when stocks or time scale is changed

  // when user selects a time interval
  const handleTimeScaleChange = (period) => {
    setTimeScale(period);
  };

  if (error) return <div>Error: {error}</div>;
  if (!stockData) return <div>Select stocks to view the chart.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Stock Price</h2>
        <div className="flex gap-2">
          {Object.keys(TIME_PERIODS).map((period) => (
            <button
              key={period}
              onClick={() => handleTimeScaleChange(period)}
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