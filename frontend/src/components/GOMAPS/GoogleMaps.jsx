import React from 'react';
import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow , useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import './GoogleMaps.css'

const GoogleMaps = ({ location }) => {

    const [Position, setPosition] = useState({
        lat: location.latitude || 19.0760,            // default mumbai
        lng: location.longitude || 72.8777
    });

    //   Update map position when location prop changes
    useEffect(() => {
        if (location.latitude && location.longitude) {
            setPosition({
                lat: location.latitude,
                lng: location.longitude,
            });
        }
    }, [location]);

    return (
        <APIProvider apiKey={"AIzaSyA4JlMN-FfV70T_GZ_7iFX_YMzOvoG2FVU"}>

            <div className="map-div">
                <Map
                    zoom={10}
                    center={Position}
                >
                    {/* Additional markers or components can be added here */}
                    <AdvancedMarker position={Position}  >
                        </AdvancedMarker>
                    
                </Map>
            </div>
        </APIProvider>
    );
};

export default GoogleMaps;
