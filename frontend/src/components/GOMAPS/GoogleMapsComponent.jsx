import React from 'react';
import { LoadScript,GoogleMap, Marker } from '@react-google-maps/api';
import './GoogleMapsComponent.css';


const GoogleMapsComponent = ({ location }) => {
 

  const position = {
    lat: location.latitude || 19.0760,  // Mumbai default latitude
    lng: location.longitude || 72.8777 // Mumbai default longitude
  };

  return (
    <div className='maps-main-container'>
      <LoadScript googleMapsApiKey={"AIzaSyA4JlMN-FfV70T_GZ_7iFX_YMzOvoG2FVU"}>
        <GoogleMap
          zoom={10}
          center={position}
          mapContainerStyle={{ width: "100%", height: "400px" }}
        
        >
          <Marker position={position} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapsComponent;
