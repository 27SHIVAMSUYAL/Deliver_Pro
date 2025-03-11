const Parking = require("../models/Parking"); // Import the correct model

exports.getParkingByLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body; // Latitude and Longitude for search location

        if (!lat || !lng) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }

        // Convert input latitude and longitude to a GeoJSON point
        const userLocation = { type: 'Point', coordinates: [lng, lat] };

        // Find parking locations where 'locationCoordinates' is within 2 km of the user location
        const parkings = await Parking.find({
            locationCoordinates: {
                $near: {
                    $geometry: userLocation,
                    $maxDistance: 20000 // 20000 meters = 20 km
                }
            }
        });

        res.json(parkings);
    } catch (error) {
        console.error("Error fetching parking locations:", error);
        res.status(500).json({ message: "Error fetching parking locations", error });
    }
};




// 📌 Get Parking Spot by ID
exports.getParkingById = async (req, res) => {
    try {
        const { id } = req.params;
        const parking = await Parking.findById(id);

        if (!parking) {
            return res.status(404).json({ message: "Parking spot not found!" });
        }

        res.status(200).json(parking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

exports.bookParkingSpot = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the parking spot
        const parking = await Parking.findById(id);
        if (!parking) {
            return res.status(404).json({ message: "Parking spot not found!" });
        }

        // Check if parking is full
        if (parking.vehicleCurrent >= parking.vehicleCount) {
            return res.status(400).json({ message: "This parking spot is already full!" });
        }

        // Increment vehicle count
        parking.vehicleCurrent += 1;

        // If now full, update status
        if (parking.vehicleCurrent === parking.vehicleCount) {
            parking.status = "full";
        }

        // Save changes
        await parking.save();

        res.status(200).json({ message: "Booking confirmed!", parking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error!" });
    }
};

// 📌 Get All Available Parking Spots
exports.getAvailableParkings = async (req, res) => {
    try {
        const availableParkings = await Parking.find({ status: "active" });

        res.status(200).json(availableParkings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error!" });
    }
};




