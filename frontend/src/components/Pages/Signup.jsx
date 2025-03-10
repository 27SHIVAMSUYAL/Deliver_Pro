import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");
    console.log("in the signup page ");
    const handleChange = (e) => {
       console.log("handleChange");
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/carrybuddy/signup", formData); // Use formData directly
    
            if (response.data.token) {
                sessionStorage.setItem("token", response.data.token); // Store token
                sessionStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data
                console.log("Token and user stored in session storage");
                alert("Signup Sucessfull");
                navigate("/dashboard"); // Redirect to Dashboard
            }
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed. Please try again.");
        }
    };
    
    
    

    return (
        <div className="card w-96 shadow-xl mx-auto">
            <form onSubmit={handleSubmit} className="card-body">
                <span className="badge badge-xs badge-warning">Deliver Pro</span>
                <div className="flex justify-center">
                    <h2 className="text-3xl font-bold">Fill Details</h2>
                </div>

                {/* Name Field */}
                <label className="flex items-center gap-2 p-2 border rounded-md w-full">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" required className="w-full bg-transparent outline-none p-2"  autoComplete="name"/>
                </label>

                {/* Email Field */}
                <label className="flex items-center gap-2 p-2 border rounded-md w-full">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email@site.com" required className="w-full bg-transparent outline-none p-2" autoComplete="email"/>
                </label>

                {/* Phone Number Field */}
                <label className="flex items-center gap-2 p-2 border rounded-md w-full">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required pattern="[0-9]{10}" className="w-full bg-transparent outline-none p-2" autoComplete="tel" />
                </label>

                {/* Password Field */}
                <label className="flex items-center gap-2 p-2 border rounded-md w-full">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" minLength="8" required className="w-full bg-transparent outline-none p-2" />
                </label>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                {/* Submit Button */}
                <div className="mt-6">
                    <button type="submit" className="btn btn-primary btn-block text-white font-bold">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
