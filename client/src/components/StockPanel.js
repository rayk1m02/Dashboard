import React from 'react';

function StockPanel() {
  const stocks = ['PFE', 'LLY', 'UNH', 'JNJ', 'NVO'];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Stocks</h2>
      <div className="space-y-2">
        {stocks.map((stock, index) => (
          <button
            key={index}
            className="w-full p-2 text-left hover:bg-gray-100 rounded transition-colors"
          >
            {stock}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StockPanel;