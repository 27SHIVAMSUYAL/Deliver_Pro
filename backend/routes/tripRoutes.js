const express = require("express");
const router = express.Router();
const ParkingController = require("../controllers/ParkingController");

// ✅ Parking Routes
router.get("/parking/:id", ParkingController.getParkingById); // Get parking details by ID
router.put("/parking/book/:id", ParkingController.bookParkingSpot); // Book a parking spot (set status to "full")
router.post("/parking", ParkingController.getParkingByLocation); 

module.exports = router;

