import React from 'react';
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
  Tooltip, // tooltip when hovering over a data point
  Legend // legend for chart
);

function StockChart() {
  // Sample data 
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // x-axis labels
    datasets: [
      {
        label: 'Stock A', /// legend label
        data: [65, 59, 80, 81, 56], // y-axis values
        fill: false, // fill area under line with color
        borderColor: 'rgb(75, 192, 192)', // line color
        tension: 0.1, // how curved the line is
      },
      {
        label: 'Stock B',
        data: [20, 30, 40, 50, 60],
        fill: false,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Stock Price</h2> 
      <Line data={data} />
    </div>
  );
}

export default StockChart;