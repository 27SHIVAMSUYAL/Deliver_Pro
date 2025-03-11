const mongoose = require("mongoose");

// GeoJSON Point Schema
const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'], // Must be 'Point'
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
            validator: function (value) {
                return value.length === 2; // Must have 2 values
            },
            message: "Coordinates must have exactly two numbers [longitude, latitude]"
        }
    }
});

// parking Schema
const parkingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔹 Reference to User model
    name: { type: String, required: true },  // 🔹 Store user's name
    phone: { type: String, required: true }, // 🔹 Store user's phone number

    location: { type: String, required: true ,unique:true},
    locationCoordinates: { type: pointSchema, required: true ,unique:true},
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    pricePerHr: { type: Number, required: true },
    vehicleCount: { type: Number, required: true },
    vehicleCurrent: { type: Number, required: true },

    status: { type: String, enum: ['active', 'closed', 'full'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

// Create 2dsphere indexes for geospatial queries
parkingSchema.index({ locationCoordinates: "2dsphere" });

// Create model                  ⬇️ Collection name
const Parking = mongoose.model("Parking", parkingSchema);
                                           //⬆️schema name
module.exports = Parking;