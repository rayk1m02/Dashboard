import './App.css';
import StockChart from './components/StockChart';
import StockPanel from './components/StockPanel';
import SentimentAnalysis from './components/SentimentAnalysis';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Healthcare Stocks Dashboard</h1>
      </header>
      
      <div className="grid grid-cols-4 gap-4">
        {/* Main chart area - spans 3 columns */}
        <div className="col-span-3 bg-white rounded-lg shadow p-4">
          <StockChart />
        </div>
        
        {/* Stock list - takes 1 column */}
        <div className="col-span-1 bg-white rounded-lg shadow">
          <StockPanel />
        </div>
        
        {/* Sentiment analysis - spans 3 columns */}
        <div className="col-span-3 bg-white rounded-lg shadow p-4">
          <SentimentAnalysis />
        </div>
        
        {/* Empty space for future use */}
        <div className="col-span-1 bg-white rounded-lg shadow p-4">
          {/* Future content */}
        </div>
      </div>
    </div>
  );
}

export default App;