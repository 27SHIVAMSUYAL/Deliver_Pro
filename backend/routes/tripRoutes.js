const express = require("express");
const router = express.Router();
const TripController = require("../controllers/TrippController");

router.post("/trips", TripController.getParkingByLocation);


module.exports = router;
