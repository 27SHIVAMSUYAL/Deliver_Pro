const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    traveler: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assigned traveler
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    weight: { type: Number, required: true },
    deliveryLocation: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "delivered"], default: "pending" }
});

module.exports = mongoose.model("Order", orderSchema);
