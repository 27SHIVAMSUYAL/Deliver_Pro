const express = require("express");
const router = express.Router();
const CarryBuddyController = require("../controllers/CarryBuddyController");

router.post("/login", CarryBuddyController.login);
router.post("/signup", CarryBuddyController.signUp);
router.post("/postParking", CarryBuddyController.postParking);

module.exports = router;
