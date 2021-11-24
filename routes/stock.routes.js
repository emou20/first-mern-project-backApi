const router = require("express").Router();

const stockController = require("../controllers/stock.controller");


router.post("/add", stockController.addStock);
router.post("/deletProductAmount", stockController.deletProductAmount);
router.get("/", stockController.getStocks);
router.get("/listeDeletProductAmount", stockController.getDeletProductAmount);
router.get("/getPublicStocks", stockController.getPublicStocks);
router.get("/getNoPublicStocks", stockController.getNoPublicStocks);
router.get("/getStocksProducts", stockController.getStocksProducts);
router.get("/:id", stockController.getStock);
router.delete("/:id", stockController.deleteStock);
router.put("/:id", stockController.updateStock);

module.exports = router;