import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        // Clear session when the browser closes
        window.onbeforeunload = () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        };

        // Redirect to dashboard if already logged in
        if (sessionStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Email & Password Validation
        const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValidator.test(email)) {
            setError("Enter a valid email address");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setError(""); // Clear previous errors

        try {
            const res = await axios.post("http://localhost:5000/api/carrybuddy/login", {
                email,
                password,
            });

            console.log("Response Data:", res.data);

            // Ensure token exists
            if (res.data.token) {
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("user", JSON.stringify(res.data.user || {}));
                
                console.log("Token stored:", sessionStorage.getItem("token"));
                console.log("user :", sessionStorage.getItem("user"));
                alert("Login Sucessfull");
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                throw new Error("Token missing in response!");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Login failed! Please try again.");
        }
    };

    return (
        <div className="card w-96 shadow-xl mx-auto">
            <form onSubmit={handleSubmit} className="card-body">
                <h2 className="text-3xl font-bold text-center">Login</h2>

                {/* Email Field */}
                <label className="flex items-center gap-2 p-2 border rounded-md w-full">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email@site.com"
                        required
                        className="w-full bg-transparent outline-none p-2"
                    />
                </label>

                {/* Password Field */}
                <label className="flex items-center gap-2 p-2 border rounded-md w-full">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full bg-transparent outline-none p-2"
                    />
                </label>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                {/* Submit Button */}
                <div className="mt-6">
                    <button type="submit" className="btn btn-primary btn-block text-white font-bold">
                        Submit
                    </button>
                </div>

                {/* Sign-up Link */}
                <button className="mt-1 text-right hover:text-blue-500 link" onClick={() => navigate("/signup")}>
                    Sign up
                </button>
            </form>
        </div>
    );
}

export default Login;
