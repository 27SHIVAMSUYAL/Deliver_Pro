import React, { useEffect, useState } from 'react';
import './GOMAPS.css';
import {
  APIProvider,
  Map,
  useMap
} from "@vis.gl/react-google-maps";

const Directions = () => {
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

  useEffect(() => {
    if (directionsService && directionsRenderer) {
      directionsService.route(
        {
          origin: { lat: 28.6139, lng: 77.2090 }, // Delhi
          destination: { lat: 19.0760, lng: 72.8777 }, // Mumbai
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
  }, [directionsService, directionsRenderer]);

  return null; // No need to render anything extra
};

const GOMAPS = () => {
  return (
    <div className="map-container">
      <APIProvider apiKey={"AIzaSyA4JlMN-FfV70T_GZ_7iFX_YMzOvoG2FVU"}>
        <div className="actual-map">
          <Map defaultZoom={5} defaultCenter={{ lat: 23.2599, lng: 77.4126 }} mapId={"fdb5e6289a10040"}>
            <Directions />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default GOMAPS;
