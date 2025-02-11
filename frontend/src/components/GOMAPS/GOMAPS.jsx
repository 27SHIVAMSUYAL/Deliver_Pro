import React from 'react'
import './GOMAPS.css'
import { useState, useEffect } from 'react';
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import GoogleMaps from './GoogleMaps';
import PlaceAutocomplete from './mapComponents/PlaceAutocomplete';
// import GoogleMapsComponent from './GoogleMapsComponent';



const GOMAPS = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);

  useEffect(() => {
    if (selectedPlace && selectedPlace.geometry?.location) {
      setMarkerPosition({
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      });
    }
  }, [selectedPlace]);

  ///////////////////////////////////////////////////////////// 
  //default marker location 
  const [location, setLocation] = useState({
    latitude: 19.0760,  // Mumbai default latitude
    longitude: 72.8777, // Mumbai default longitude
  });
  const [toggle, settoggle] = useState(false);

  /////////////////////////////////////////////////////////////////////////

  // seting    current location  /////////////////////////////////////////////////////////////
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
    settoggle(!toggle);
  }
  function error(error) {
    console.log(error);
  }
  ////////////////////////////////////////////////////////////////////////////


  return (
    <div className="map-container">

      <div className="current-location">
        <div className="location-button"><button onClick={() => { geolocation() }}> <h3>CURRENT LOCATION </h3></button></div>
        <div className="latitude-longitude">
          {
            (toggle || (location.latitude && location.longitude)) ? (<h1>
              <span style={{ marginRight: "10px" }}> Latitude : {location.latitude} </span>   <span style={{ marginLeft: "10px" }}>  Longitude : {location.longitude} </span>
            </h1>) : <p>
              Click button to get Current Location
            </p>
          }
        </div>
      </div>

      <div className="maps-div">
        <APIProvider apiKey={"AIzaSyA4JlMN-FfV70T_GZ_7iFX_YMzOvoG2FVU"}>
          <div className="map-sidebar">

            
            <div className="start-location">
              <h2>Start Location</h2><button>🔄</button>
            </div>
            <div className="end-location">
              <h2>End Location</h2><button>🔄</button>
            </div>


          </div>

          <div className="actual-map">
            <GoogleMaps location={location} />
            
          </div>
        </APIProvider>
      </div>

    </div>
  )
}

export default GOMAPS
