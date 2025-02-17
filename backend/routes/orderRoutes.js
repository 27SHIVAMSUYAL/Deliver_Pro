const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.get("/orders", OrderController.getOrders);
router.put("/updateOrderStatus", OrderController.updateOrderStatus);

module.exports = router;
