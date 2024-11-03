// JobMap.js
"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const JobMap = ({ origin, destination }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const fetchDirections = () => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`Error fetching directions: ${result}`);
        }
      },
    );
  };

  useEffect(() => {
    if (origin && destination) {
      fetchDirections();
    }
  }, [origin, destination]);

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={{ lat: 23.8041, lng: 90.4152 }} // Center the map on a default location
    >
      {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
      )}
    </GoogleMap>
  );
};

export default JobMap;
