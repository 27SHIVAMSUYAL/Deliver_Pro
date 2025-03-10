import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";

import GOMAPS from "./components/GOMAPS/GOMAPS";
import GMAPS from "./components/GOMAPS/GMAPS";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import Post from "./components/Pages/Post";
import "./App.css";
import NAVBAR from "./components/NAVBAR";
import Dashboard from "./components/Pages/Dashboard";


function App() {
    const GoogleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const [token, setToken] = useState(sessionStorage.getItem("token"));

    useEffect(() => { // Listen for changes in session storage
        const handleStorageChange = () => {
            setToken(sessionStorage.getItem("token"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);// Cleanup when component unmounts
    }, []);

    const logout = () => {
        sessionStorage.clear();
        setToken(null);
    };

    return (
        <Router>
            <div className="appcontainer">
                <div className="navbarcontainer">
                    <NAVBAR logout={logout} />
                </div>
                <APIProvider apiKey={GoogleMapsApiKey}>
                    <Routes>
                        <Route path="/" element={ <Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/gomap" element={<GOMAPS />} />
                        <Route path="/test" element={<GMAPS />} />
                        <Route path="/post" element={<Post />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </APIProvider>
            </div>
        </Router>
    );
}

export default App;
