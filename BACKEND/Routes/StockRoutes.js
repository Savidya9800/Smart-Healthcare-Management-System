const express = require("express");
const router = express.Router();
//Insert Model
const Stock = require("../Models/stockModel");
//Insert Controller
const StockController = require("../Controllers/StockController");

router.get("/", StockController.getAllStock);
router.get("/:id", StockController.getStockById);
router.post("/", StockController.addStock);
router.put("/:id", StockController.updateStock);
router.delete("/:id", StockController.deleteStock);

//export
module.exports = router;
