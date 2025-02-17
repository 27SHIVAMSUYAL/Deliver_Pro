const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    traveler: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    allowedWeight: { type: Number, required: true }, // kg/lbs
    pricePerKg: { type: Number, required: true }, // Charge traveler wants to take
    status: { type: String, enum: ["active", "completed"], default: "active" }
});

module.exports = mongoose.model("Trip", tripSchema);
