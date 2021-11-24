const router = require("express").Router();

const orderController = require("../controllers/order.controller");


router.post("/add", orderController.addOrder);
router.get("/", orderController.getOrders);
router.get("/currentOrders", orderController.getCurrentOrders);
router.get("/historyOrders", orderController.getHistoryOrders);
router.get("/:id", orderController.getOrder);
router.delete("/:id", orderController.deleteOrder);
router.put("/:id", orderController.updateOrder);
router.put("/updateState/:id", orderController.updateStateOrder);

module.exports = router;