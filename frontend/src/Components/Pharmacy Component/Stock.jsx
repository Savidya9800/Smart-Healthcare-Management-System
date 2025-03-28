import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockDetails from './StockDetails';
import UpdateStock from './UpdateStock';

function Stock() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock');
        setStockData(response.data);
      } catch (err) {
        console.error("Error fetching stock data:", err.message);
        setError('Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/stock/${id}`);
      setStockData(stockData.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting stock item:", err.message);
      setError('Failed to delete stock');
    }
  };

  const handleUpdateClick = (stockItem) => {
    setSelectedStock(stockItem);
  };

  const handleUpdateStock = async (updatedStock) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/stock/${updatedStock._id}`, updatedStock);
      setStockData(stockData.map(item => item._id === updatedStock._id ? response.data : item));
      setSelectedStock(null);
    } catch (err) {
      console.error("Error updating stock:", err.message);
      setError('Failed to update stock');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading stock data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {selectedStock ? (
            <UpdateStock
              stock={selectedStock}
              onUpdateStock={handleUpdateStock}
              onCancel={() => setSelectedStock(null)}
            />
          ) : (
            <StockDetails
              stockItems={stockData}
              onDelete={handleDelete}
              onUpdateClick={handleUpdateClick}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Stock;