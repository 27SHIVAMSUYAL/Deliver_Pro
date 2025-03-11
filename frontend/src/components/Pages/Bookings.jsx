import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const Bookings = () => {
  const { state } = useLocation(); // Extract parking data from state
  const { id } = useParams(); // Get parking ID from URL
  const navigate = useNavigate();

  const [parking, setParking] = useState(state?.parking || null);
  const [loading, setLoading] = useState(!state?.parking);
  const [error, setError] = useState(null);

  // Fetch parking details if not passed via state
  useEffect(() => {
    if (!parking) {
      fetch(`http://localhost:5000/api/trips/parking/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setParking(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load parking details");
          setLoading(false);
        });
    }
  }, [id, parking]);

  const handleBooking = async () => {
    try {
      // Update parking status in the database
      const response = await fetch(`http://localhost:5000/api/trips/parking/book/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "USER_ID_HERE" }) // Replace with actual user ID
      });

      if (!response.ok) throw new Error("Booking failed");

      alert("Booking successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Booking failed. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Book Parking Spot</h1>
      <p><strong>Name:</strong> {parking.name}</p>
      <p><strong>Location:</strong> {parking.location}</p>
      <p><strong>Price per Hour:</strong> ₹{parking.pricePerHr}</p>
      <p><strong>Current Vehicles:</strong> {parking.vehicleCurrent || 0} / {parking.vehicleCount || "N/A"}</p>
      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
};

export default Bookings;
