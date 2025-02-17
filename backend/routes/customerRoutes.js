const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController");

router.post("/login", CustomerController.login);
router.post("/signup", CustomerController.signUp);
router.post("/placeOrder", CustomerController.placeOrder);

module.exports = router;
