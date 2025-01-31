import './App.css';
import StockDisplay from './components/StockDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Healthcare Stocks Dashboard</h1>
        <StockDisplay />
      </header>
    </div>
  );
}

export default App;