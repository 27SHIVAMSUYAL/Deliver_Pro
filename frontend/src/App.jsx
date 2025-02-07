import React from "react";
import NAVBAR from "./components/navbar";
import GOMAPS from "./components/GOMAPS/GOMAPS";
import './App.css';
function App() {
  return (
  
      <div className="appcontainer">
        <div className="navbarcontainer">
          <NAVBAR />
        </div>
        <div className="gomapscontainer">
          <GOMAPS />

        </div>



      </div>
    
  );
}
export default App;


