import React from 'react'
import './GOMAPS.css'
import { useState, useEffect ,useRef} from 'react';
import {
  APIProvider
  , useMap,
  useMapsLibrary , useDirections, DirectionsRenderer
} from "@vis.gl/react-google-maps";

import GoogleMaps from './GoogleMaps';



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
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);


useEffect(() => {
  if (!map ) {
    console.warn("Google Maps routes library is not ready yet.");
    return;
  }

  // Ensure the library is available before setting up services
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

      console.error("directionService and Renderer not fond");
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
        <APIProvider apiKey={"AIzaSyA4JlMN-FfV70T_GZ_7iFX_YMzOvoG2FVU"}  >
          <div className="map-sidebar">

            {/*  */}
            <div className="start-location">
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <h1>Start Location</h1><button style={{ fontSize: 25 }} onClick={() => {
                  setStartLocation(null);
                }}>🔄</button>
              </div>
              <div>
                <p style={{ fontSize: 11 }}>{startLocation ? <>lat = {startLocation.geometry.location.lat()} <br />
                  lng = {startLocation.geometry.location.lng()}</> : ""}</p>
              </div>
            </div>

            {/*  */}

            <div className="end-location">
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <h1>End Location</h1><button style={{ fontSize: 25 }} onClick={() => {
                  setEndLocation(null);
                }}>🔄</button>
              </div>
              <div>
                <p style={{ fontSize: 11 }}>{endLocation ? <>lat = {endLocation.geometry.location.lat()} <br />
                  lng = {endLocation.geometry.location.lng()}</> : ""}</p>
              </div>
            </div>

            <button onClick={handleNavigation}>start navigation </button>
            {/*  */}

          </div>

          <div className="actual-map">
            <GoogleMaps location={location} setStartLocation={setStartLocation} setEndLocation={setEndLocation} />

          </div>
        </APIProvider>
      </div>

    </div>
  )
}

export default GOMAPS
