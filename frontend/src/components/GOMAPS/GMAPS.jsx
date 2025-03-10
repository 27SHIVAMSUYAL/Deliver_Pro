import './GMAPS.css';
import {
  APIProvider,
  useMap,
  useMapsLibrary,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map
} from "@vis.gl/react-google-maps";

import React, { useEffect, useState, useRef } from "react";
import "./GoogleMaps.css";
import points from "./data/points";
import PlaceAutocomplete from "./mapComponents/PlaceAutocomplete";

const GMAPS = () => {
  const GoogleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [location, setLocation] = useState({ latitude: 19.0760, longitude: 72.8777 });
  const [slider, setSlider] = useState(2500);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 19.0760, lng: 72.8777 });
  const [parkingSpots, setParkingSpots] = useState([]); // Stores parking locations

  const circleRef = useRef(null);
  const map = useMap();

  // Function to fetch nearby parking spots
  const fetchParkingSpots = async (lat, lng) => {
    try {
      const url = "http://localhost:5000/api/trips/trips"; // POST request URL
      console.log("Sending request to:", url);

      const response = await fetch(url, {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat, lng }) // Send lat & lng in request body
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch parking spots. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received Data:", data);
      setParkingSpots(data); // Assuming you have a state setter function
    } catch (error) {
      console.error("Error fetching parking spots:", error);
    }
  };


  // When marker position changes, fetch parking spots
  useEffect(() => {
    if (markerPosition) {
      fetchParkingSpots(markerPosition.lat, markerPosition.lng);
    }
  }, [markerPosition]);

  // Update map center and create circle
  useEffect(() => {
    if (!map || !markerPosition) return;

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    circleRef.current = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: markerPosition,
      radius: parseFloat(slider)
    });

    map.setCenter(markerPosition);
    map.setZoom(12.5);
  }, [map, markerPosition, slider]);

  return (
    <div className="map-container">
      <div className="maps-div">
        <div className="map-sidebar">
          <h1>Set Location</h1>
          <p>
            {markerPosition ? (
              <>
                lat = {markerPosition.lat} <br />
                lng = {markerPosition.lng}
              </>
            ) : (
              "No location selected"
            )}
          </p>

          <input
            type="range"
            min={500}
            max="2500"
            value={slider}
            onChange={(e) => setSlider(e.target.value)}
            className="range"
            step="500"
          />

          <div class="flex justify-between px-2.5 mt-2 text-xs">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
          <div class="flex justify-between px-2.5 mt-2 text-xs">
            <span>0.5</span>
            <span>1</span>
            <span>1.5</span>
            <span>2</span>
            <span>2.5</span>
          </div>
        </div>

        <div className="actual-map">
          <Map defaultZoom={5} defaultCenter={markerPosition} mapId={"fdb5e6289a10040"}>
            {/* Selected Location Marker */}
            <AdvancedMarker position={markerPosition} />

            {/* Parking Spot Markers */}
            {parkingSpots.map((spot, index) => (
              <AdvancedMarker key={index} position={{
                lat: spot.locationCoordinates.coordinates[1],
                lng: spot.locationCoordinates.coordinates[0]
              }}>
                <div style={{ fontSize: "50px" }}>🚗</div>
              </AdvancedMarker>
            ))}
          </Map>

          <MapControl position={ControlPosition.TOP}>
            <div className="autocomplete-control">
              <PlaceAutocomplete
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
                setMarkerPosition={setMarkerPosition}
              />
            </div>
          </MapControl>
        </div>
      </div>
    </div>
  );
};

export default GMAPS;
