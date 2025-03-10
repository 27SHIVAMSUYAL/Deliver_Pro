import React from 'react'
import { useEffect, useState, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import './PlaceAutocomplete.css';

const PlaceAutocomplete = ({ selectedPlace, setSelectedPlace, setMarkerPosition }) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);

    const inputRef = useRef(null);
    const places = useMapsLibrary("places");   // instance to use the places api by this hook useMapsLibrary

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ["geometry", "name", "formatted_address"],
        };


        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));  //places.Autocomplete gets the suggestions and injects it into the inputref directly  to get the dropdown UI
        //   setPlaceAutocomplete(new places.Autocomplete(...)) sets a single object instance of the places.Autocomplete class from Google Maps. This object contains:
        //Methods: like getPlace() to fetch selected place details and addListener() to listen for events.
        //Properties: such as the input element and autocomplete options.

    }, [places]);


    useEffect(() => {

        if (!placeAutocomplete) return;
        // The place_changed event is not a predefined event in React.
        //  It is a built-in event provided by the Google Places API (specifically the Autocomplete service).
        placeAutocomplete.addListener("place_changed", () => {
            setSelectedPlace(placeAutocomplete.getPlace());      //placeAutocomplete.getPlace()  gets the details of the selected place
            console.log(placeAutocomplete.getPlace().geometry.location.lat());
            console.log(placeAutocomplete.getPlace().geometry.location.lng());   // setSelectedPlace function sets these details to the  in the parent component <GoogleMaps>.jsx

        });
    }, [setSelectedPlace, placeAutocomplete]);




    const handleButtonClick = () => {

        ///////////set marker position by auto complete
        if (selectedPlace && selectedPlace.geometry) {
            const newPosition = {
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng()
            };
            setMarkerPosition(newPosition); // Move marker and map to the new position
        }
        /////////////////////////////////////////////////////////////////////////

        if (inputRef.current) {
            inputRef.current.value = ""; // Clear the input field
        }
    };


   




    return (
        <div className="autocomplete-container">
            <input ref={inputRef} placeholder={(" Search a Location")} />
            <button className='setTripButton' onClick={handleButtonClick}> <h3>{("Set Location")}</h3></button>

        </div>
    );
};

export default PlaceAutocomplete

