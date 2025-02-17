const express = require("express");
const router = express.Router();
const TripController = require("../controllers/TrippController");

router.get("/trips", TripController.getTrips);
router.get("/trip/:id", TripController.getTripById);

module.exports = router;
