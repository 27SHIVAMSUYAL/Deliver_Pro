const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://47shivam1o1:Shivam12345@cluster0.0ycju.mongodb.net/DeliverPro?retryWrites=true&w=majority&appName=Cluster0");
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
