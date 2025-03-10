import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from session storage safely
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Safely parse JSON
      } catch (error) {
        console.error("Error parsing user data:", error);
        sessionStorage.removeItem("user"); // Remove corrupted data
        navigate("/"); // Redirect to login
        alert("error in token , Please login");
      }
    } else {

      navigate("/"); // Redirect to login if no user is found
      alert("No user found in session storage , Please login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    console.log("you just logged out ");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">
        {user ? `Welcome, ${user.name}! 🎉` : "Loading..."}
      </h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
