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



