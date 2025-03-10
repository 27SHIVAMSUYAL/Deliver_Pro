import React from 'react';
import './GOMAPS.css';
import { useState, useEffect } from 'react';
import {
  APIProvider,
  useMap,
  useMapsLibrary
} from "@vis.gl/react-google-maps";

import GoogleMaps from './GoogleMaps';

const GOMAPS = () => {
  const GoogleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);

  ///////////////////////////////////////////////////////////// 
  // Default marker location 
  const [location, setLocation] = useState({
    latitude: 19.0760,  // Mumbai default latitude
    longitude: 72.8777, // Mumbai default longitude
  });
  const [toggle, settoggle] = useState(false);

  /////////////////////////////////////////////////////////////////////////

  // Setting current location  
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
    setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    settoggle(!toggle);
  }

  function error(error) {
    console.log(error);
  }

  ////////////////////////////////////////////////////////////////////////////
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!map) {
      console.warn("Google Maps routes library is not ready yet.");
      return;
    }

    if (!directionsService) {
      setDirectionsService(new google.maps.DirectionsService());
    }

    if (!directionsRenderer) {
      setDirectionsRenderer(new google.maps.DirectionsRenderer({ map }));
    }
  }, [map, routesLibrary]);

  const handleNavigation = () => {
    if (!startLocation || !endLocation) {
      alert("Please set both Start and End locations!");
      return;
    }

    if (!directionsService || !directionsRenderer) {
      console.error("Direction Service and Renderer not found");
      alert("Google Maps is still initializing. Please wait a moment.");
      return;
    }

    const request = {
      origin: {
        lat: startLocation.geometry.location.lat(),
        lng: startLocation.geometry.location.lng(),
      },
      destination: {
        lat: endLocation.geometry.location.lat(),
        lng: endLocation.geometry.location.lng(),
      },
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService?.route(request, (result, status) => {
      if (status === "OK") {
        console.log(result);
      } else {
        alert("Could not calculate directions. Please check locations.");
      }
    }).then((result) => {
      directionsRenderer?.setDirections(result);
    });
  }

  useEffect(() => {
    console.log("Location reset");
  }, [startLocation, endLocation]);

  return (
    <div className="map-container">

      <div className="current-location">
        <div className="location-button">
          <button onClick={() => { geolocation() }}>
            <h3>CURRENT LOCATION</h3>
          </button>
        </div>
        <div className="latitude-longitude">
          {(toggle || (location.latitude && location.longitude)) ? (
            <h1>
              <span style={{ marginRight: "10px" }}> Latitude: {location.latitude} </span>
              <span style={{ marginLeft: "10px" }}> Longitude: {location.longitude} </span>
            </h1>
          ) : <p>Click button to get Current Location</p>}
        </div>
      </div>

      <div className="maps-div">
        <APIProvider apiKey={GoogleMapsApiKey}>
          <div className="map-sidebar">

            {/* Start Location */}
            <div className="start-location">
              <h1>Start Location</h1>
              <p style={{ fontSize: 11 }}>
                {startLocation ? (
                  <>
                    lat = {startLocation.geometry.location.lat()} <br />
                    lng = {startLocation.geometry.location.lng()}
                  </>
                ) : "No location selected"}
              </p>
            </div>

            {/* End Location */}
            <div className="end-location">
              <h1>End Location</h1>
              <p style={{ fontSize: 11 }}>
                {endLocation ? (
                  <>
                    lat = {endLocation.geometry.location.lat()} <br />
                    lng = {endLocation.geometry.location.lng()}
                  </>
                ) : "No location selected"}
              </p>
            </div>

            {/* Reset Locations Button */}

           

          </div>

          <div className="actual-map">
            <GoogleMaps
              location={location}
              setStartLocation={(newLocation) => {
                if (startLocation && endLocation) {
                  alert("Both locations are already set! Please reset before selecting new locations.");
                } else if (!startLocation) {
                  setStartLocation(newLocation);
                }
              }}
              setEndLocation={(newLocation) => {
                if (startLocation && endLocation) {
                  alert("Both locations are already set! Please reset before selecting new locations.");
                } else if (!endLocation) {
                  setEndLocation(newLocation);
                }
              }}
              startLocation={startLocation}
              endLocation={endLocation}
            />
          </div>
        </APIProvider>
      </div>

    </div>
  );
}

export default GOMAPS;
