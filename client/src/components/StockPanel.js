import React, { useState } from 'react';

const DEFAULT_STOCKS = [
  { symbol: 'PFE', name: 'Pfizer' },
  { symbol: 'LLY', name: 'Eli Lilly' },
  { symbol: 'UNH', name: 'UnitedHealth Group' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'NVO', name: 'Novo Nordisk' },
  { symbol: 'MRK', name: 'Merck & Co.' },
  { symbol: 'ABT', name: 'Abbott Laboratories' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific' },
  { symbol: 'AMGN', name: 'Amgen' },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb' },
];

/**
 * Document this file 
 */

function StockPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);

  const handleStockClick = (stock) => {
    const isSelected = selectedStocks.includes(stock.symbol);
    let updatedStocks;
    if (isSelected) {
      updatedStocks = selectedStocks.filter((symbol) => symbol !== stock.symbol);
    } else {
      updatedStocks = [...selectedStocks, stock.symbol];
    }
    setSelectedStocks(updatedStocks);
    onSelectStocks(updatedStocks);
  };

  const filteredStocks = DEFAULT_STOCKS.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stoc.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="texts-xl font-semibold mb-4">Stocks</h2>
      <input
      type="text"
      placeholder="Search stocks..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full p-2 mb-4 border rounded"
      />
      <div classNmae="space-y-2">
        {filteredStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleStockClick(stock)}
              className={`w-full p-2 text-left hover:bg-gray-100 rounded transition-colors ${ selectedStocks.includes(stock.symbol) ? 'bg-blue-100' : ''}`}
            >
              {stock.name} ({stock.symbol})
            </button>
          ))}
      </div>
    </div>
  );
}

export default StockPanel;