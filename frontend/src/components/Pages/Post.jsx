import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Post() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(""); // Corrected useState


    const [formData, setFormData] = useState({
        address: "",
        openTime: "",
        closeTime: "",
        pricePerHour: "",
        latitude: "",
        longitude: "",
        image: null,
        vehicleCount: "",
        vehicleCurrent: "0", // Default to 0 since no vehicles are present initially
    });

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data:", error);
                sessionStorage.removeItem("user");
                navigate("/");
                alert("No user found in session storage, Please login");
            }
        } else {
            navigate("/");
            alert("No user found in session storage, Please login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageUpload = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleImageDelete = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString(),
                    }));
                },
                () => {
                    setError("Failed to get location");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(formData).some((field) => field === "" || field === null)) {
            setError("All fields are mandatory!");
            return;
        }

        const latitude = parseFloat(formData.latitude);
        const longitude = parseFloat(formData.longitude);
        const vehicleCount = parseInt(formData.vehicleCount);
        const vehicleCurrent = parseInt(formData.vehicleCurrent);

        if (isNaN(latitude) || isNaN(longitude)) {
            setError("Invalid latitude or longitude values.");
            return;
        }

        if (isNaN(vehicleCount) || vehicleCount < 0) {
            setError("Invalid vehicle count.");
            return;
        }

        if (isNaN(vehicleCurrent) || vehicleCurrent < 0 || vehicleCurrent > vehicleCount) {
            setError("Invalid vehicle current value.");
            return;
        }

        setError("");

        const token = sessionStorage.getItem("token");
        if (!token) {
            setError("Unauthorized: No token found. Please log in.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("location", formData.address);
        formDataToSend.append("openTime", formData.openTime);
        formDataToSend.append("closeTime", formData.closeTime);
        formDataToSend.append("pricePerHr", formData.pricePerHour);
        formDataToSend.append("vehicleCount", vehicleCount);
        formDataToSend.append("vehicleCurrent", vehicleCurrent);
        formDataToSend.append("locationCoordinates", JSON.stringify({
            type: "Point",
            coordinates: [longitude, latitude]
        }));

        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const response = await fetch("http://localhost:5000/api/carrybuddy/postParking", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Parking added successfully!");
                console.log(formData);
                console.log("Parking added successfully!");
                setFormData({
                    address: "",
                    openTime: "",
                    closeTime: "",
                    pricePerHour: "",
                    latitude: "",
                    longitude: "",
                    image: null,
                    vehicleCount: "",
                    vehicleCurrent: "0",
                });
            } else {
                setError(data.message || "Failed to add parking.");
            }
        } catch (error) {
            setError("Error connecting to server.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 shadow-lg rounded-lg border bg-white">
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-t-lg relative">
                {formData.image ? (
                    <>
                        <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Uploaded"
                            className="w-full h-full object-cover rounded-t-lg"
                        />
                        <button
                            onClick={handleImageDelete}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                        >
                            ✕
                        </button>
                    </>
                ) : (
                    <label className="cursor-pointer text-gray-500">
                        Upload Photo
                        <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                )}
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full p-2 border rounded"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <input className="w-full p-2 border rounded" name="openTime" type="time" value={formData.openTime} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="closeTime" type="time" value={formData.closeTime} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="pricePerHour" type="number" placeholder="Price per Hour ₹₹" min={0} value={formData.pricePerHour} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="latitude" type="text" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="longitude" type="text" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="vehicleCount" type="number" placeholder="Total Vehicle Capacity" min={0} value={formData.vehicleCount} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="vehicleCurrent" type="number" placeholder="Current Vehicles Present" min={0} value={formData.vehicleCurrent} onChange={handleChange} required />
                    <button type="button" onClick={handleGetCurrentLocation} className="bg-green-500 text-white p-2 rounded mt-2">Get Current Location</button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit Form</button>
                </form>
            </div>
        </div>
    );
}

export default Post;
