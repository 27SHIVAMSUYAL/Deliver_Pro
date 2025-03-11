const User = require("../models/User");
const Parking = require("../models/Parking");


const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, name: user.name, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send user details along with token
        res.json({
            message: "Login successful",
            token,
            user: { 
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


exports.signUp = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new User({ name, email, phone, password });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, name: newUser.name, phone: newUser.phone },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send user details along with token (same format as login)
        res.status(201).json({
            message: "Signup successful",
            token,
            user: { 
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};


const multer = require("multer");

// 🔹 Setup Multer for memory storage (stores images as buffers)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

exports.postParking = async (req, res) => {
    upload(req, res, async (err) => {
        try {
            // 🔹 Handle upload errors
            if (err) {
                return res.status(400).json({ message: "Error uploading image", error: err.message });
            }

            // 🔹 Extract token from headers
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: No token provided" });
            }

            // 🔹 Verify and decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { userId, name, phone } = decoded;

            // 🔹 Extract form data from request (Added vehicleCount & vehicleCurrent)
            const { location, openTime, closeTime, pricePerHr, locationCoordinates, vehicleCount, vehicleCurrent } = req.body;
            
            // 🔹 Parse locationCoordinates safely
            let parsedCoordinates;
            try {
                parsedCoordinates = JSON.parse(locationCoordinates);
            } catch (error) {
                return res.status(400).json({ message: "Invalid JSON format for coordinates." });
            }

            // 🔹 Validate coordinates format
            if (
                !parsedCoordinates ||
                !parsedCoordinates.coordinates ||
                !Array.isArray(parsedCoordinates.coordinates) ||
                parsedCoordinates.coordinates.length !== 2 ||
                isNaN(parsedCoordinates.coordinates[0]) || 
                isNaN(parsedCoordinates.coordinates[1])
            ) {
                return res.status(400).json({ message: "Invalid coordinates format. Must be { type: 'Point', coordinates: [longitude, latitude] }" });
            }

            const [longitude, latitude] = parsedCoordinates.coordinates;

            // 🔹 Check if parking already exists at these coordinates
            const existingParking = await Parking.findOne({
                "locationCoordinates.coordinates": [longitude, latitude]
            });

            if (existingParking) {
                return res.status(409).json({ message: "A parking spot already exists at this location!" });
            }

            // 🔹 Prepare new parking entry (Added vehicleCount & vehicleCurrent)
            const newParking = new Parking({
                userId,
                name,
                phone,
                location,
                locationCoordinates: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                openTime,
                closeTime,
                pricePerHr,
                vehicleCount,      // 🔹 New field added
                vehicleCurrent     // 🔹 New field added
            });

            // 🔹 Handle image upload (if provided)
            if (req.file) {
                newParking.image = req.file.buffer.toString("base64"); // Convert image to base64 (or store in cloud)
            }

            // 🔹 Save parking details
            await newParking.save();

            res.status(201).json({ message: "Parking listed successfully", parking: newParking });

        } catch (error) {
            res.status(500).json({ message: "Error adding parking", error: error.message });
        }
    });
};


/* Summary:

JWT is generated in the backend and sent to the frontend.
The frontend stores it in sessionStorage.
The frontend sends the token in every request.
The backend extracts name and phone from the token and uses them. */