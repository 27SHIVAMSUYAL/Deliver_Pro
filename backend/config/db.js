const mongoose = require("mongoose");
const Trip = require("../models/Parking"); // Import the Trip model
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        await Trip.syncIndexes(); // Ensure indexes are created

        console.log("✅ 2dsphere indexes ensured");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed", error.message);
        process.exit(1);
    }
};


module.exports = connectDB;
