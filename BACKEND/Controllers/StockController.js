const Stock = require("../Models/stockModel");

//Get All Stock Items
const getAllStock = async (req, res) => {
  try {
    const stockItems = await Stock.find();
    res.status(200).json(stockItems);
  } catch (err) {
    console.error("Error ferching stock items:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//Get Stock Item by ID
const getStockById = async (req, res) => {
  try {
    const stockItem = await Stock.findById(req.params.id);
    if (!stockItem) {
      return res.status(404).json({ message: "Stock Item not found" });
    }
    res.status(200).json(stockItem);
  } catch (err) {
    console.error("Error fetching stock item:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//Add new Stock Item
const addStock = async (req, res) => {
  try {
    const stockItem = new Stock(req.body);
    await stockItem.save();
    res.status(201).json(stockItem);
  } catch (err) {
    console.error("Error adding stock item:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
//Update Stock Item
const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStock) {
      return res.status(404).json({ message: "Stock Item not found" });
    }
    res.status(200).json(updatedStock);
  } catch (err) {
    console.error("Error updating stock item:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
//Delete Stock Item
const deleteStock = async (req, res) => {
  try {
    const stockItem = await Stock.findByIdAndDelete(req.params.id);
    if (!stockItem) {
      return res.status(404).json({ message: "Stock Item not found" });
    }
    res.status(200).json({ message: "Stock Item deleted" });
  } catch (err) {
    console.error("Error deleting stock item:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllStock,
  getStockById,
  addStock,
  updateStock,
  deleteStock,
};
