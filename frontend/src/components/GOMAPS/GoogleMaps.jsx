import React, { useEffect, useState, useMemo, useRef } from "react";
import {

  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map

} from "@vis.gl/react-google-maps";
import "./GoogleMaps.css";
import points from "./data/points";    // parcel points imported 

import PlaceAutocomplete from "./mapComponents/PlaceAutocomplete";          // auto complete component imported 

const GoogleMaps = ({ location }) => {


  const [selectedPlace, setSelectedPlace] = useState(null);
  const [tripStartLocation, setTripStartLocation] = useState(null);

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
          <PlaceAutocomplete setSelectedPlace={setSelectedPlace} tripStartLocation={tripStartLocation}setTripStartLocation={setTripStartLocation}/>
        </div>
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

          <div>📍</div>
        </AdvancedMarker>
      ))}
    </>
  );
};
///////////////////////////////////////////////////////

