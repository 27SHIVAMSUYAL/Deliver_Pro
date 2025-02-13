import React, { useEffect, useState, useMemo, useRef } from "react";
import {

  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map, useMap

} from "@vis.gl/react-google-maps";
import "./GoogleMaps.css";
import points from "./data/points";    // parcel points imported 

import PlaceAutocomplete from "./mapComponents/PlaceAutocomplete";          // auto complete component imported 

const GoogleMaps = ({ location, setStartLocation, setEndLocation, startLocation, endLocation }) => {


  const [selectedPlace, setSelectedPlace] = useState(null);
  const [tripStartLocation, setTripStartLocation] = useState(null);
  const [tripEndLocation, setTripEndLocation] = useState(null);

  const [markerPosition, setMarkerPosition] = useState({
    lat: location?.latitude || 19.0760,    // default location if no location selected initially ie mumbai
    lng: location?.longitude || 72.8777,
  });



  // when ever we select a place on the auto complete change the marker location to there
  useEffect(() => {
    if (selectedPlace && selectedPlace.geometry?.location) {
      setMarkerPosition({
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      });


      console.log("lat of selected location = ", selectedPlace.geometry.location.lat())
      console.log("lng of selected location = ", selectedPlace.geometry.location.lng())
    }
  }, [selectedPlace]);
  /////////////////////////////////////////



  useEffect(() => {
    if (tripEndLocation) {
      setEndLocation(tripEndLocation);

    }
    if (tripStartLocation) {
      setStartLocation(tripStartLocation);
    }

  }, [tripStartLocation, tripEndLocation]);


  /////////////////////////////
  const map = useMap();
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (map && !directionsService && !directionsRenderer) {
      const service = new google.maps.DirectionsService();
      const renderer = new google.maps.DirectionsRenderer();
      renderer.setMap(map);

      setDirectionsService(service);
      setDirectionsRenderer(renderer);
    }
  }, [map]);

  const navigate = () => {
    if (!startLocation || !endLocation) {
      alert("Enter Start and End Location");
      return;
    }
    if (directionsService && directionsRenderer) {
      directionsService.route(
        {
          origin: {
            lat: startLocation.geometry.location.lat(),
            lng: startLocation.geometry.location.lng(),
          },
          destination: {
            lat: endLocation.geometry.location.lat(),
            lng: endLocation.geometry.location.lng(),
          }, // Mumbai
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }

  }

  //////////////////////////////
  return (
    <div className="maps-main-container">

      <Map defaultZoom={5} defaultCenter={markerPosition} mapId={"fdb5e6289a10040"}>

        {/* main marker */}
        <AdvancedMarker position={markerPosition} />
        {/*  */}


        {/* custom component of  packages marker  */}
        <Markers points={points} />

        {/*  */}

      </Map>


      {/* controlling position of search bar */}
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} tripStartLocation={tripStartLocation} setTripStartLocation={setTripStartLocation} tripEndLocation={tripEndLocation} setTripEndLocation={setTripEndLocation} />

        </div>
      </MapControl>

      <MapControl position={ControlPosition.BLOCK_END_INLINE_CENTER}>
        <button onClick={navigate} className="navigation-button">Start Navigation</button>
      </MapControl>

      {/*  */}

    </div>
  );
};

export default GoogleMaps;


// for each parcel put a point-marker on the map 
const Markers = ({ points }) => {
  return (
    <>
      {points.map((point, index) => (
        <AdvancedMarker key={index} position={{ lat: point.lat, lng: point.lng }}>

          <div style={{fontSize: "20px" }}>🍔</div>

        </AdvancedMarker>
      ))}
    </>
  );
};
///////////////////////////////////////////////////////

