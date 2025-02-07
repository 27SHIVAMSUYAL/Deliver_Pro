import React from 'react'
import './GOMAPS.css'
import { useState } from 'react';

// import GoogleMaps from './GoogleMaps';
import GoogleMapsComponent from './GoogleMapsComponent';


const GOMAPS = () => {


  const [location, setLocation] = useState({
    latitude: 19.0760,  // Mumbai default latitude
    longitude: 72.8777, // Mumbai default longitude
  });
  const [toggle, settoggle] = useState(false);

  function geolocation() {

    try {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
      } else {
        console.log("Locating…");
        navigator.geolocation.getCurrentPosition(sucess, error);
      }
    } catch (error) {
      console.log(error);
    }

  }

  function sucess(position) {
    console.log(position);
    setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
     settoggle(!toggle) ;
  }
  function error(error) {
    console.log(error);
  }

  return (
    <div className="map-container">

      <div className="current-location">
        <div className="location-button"><button onClick={() => { geolocation()}}> <h3>GET LOCATION </h3></button></div>
        <div className="latitude-longitude">
          {
            (toggle && location.latitude && location.longitude) ? (<h1>
              <span style={{ marginRight: "10px" }}> Latitude : {location.latitude} </span>   <span style={{ marginLeft: "10px" }}>  Longitude : {location.longitude} </span>
            </h1>) : <p>
              Click button to get Current Location
            </p>
          }
        </div>
      </div>
      <div className="maps-div">

        <div className="map-sidebar">
           <h1>Deliver_Pro_Map</h1>
    
           
        </div>

        <div className="actual-map">
          <GoogleMapsComponent location={location} />
        </div>

      </div>
    </div>
  )
}

export default GOMAPS
