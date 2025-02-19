import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ApiKit from "@/common/ApiKit";

const MapWrapper = ({ jobUid, kind }) => {
  const [viewport, setViewport] = useState({
    latitude: 23.777176, // Default center
    longitude: 90.399452,
    zoom: 12,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [patchError, setPatchError] = useState(null);

  // Function to fetch and patch location
  const updateDriverLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Format kind and payload properly
          const normalizedKind = kind?.toLowerCase()?.replace('_job', '');
          const payload = {
            current_location: `${latitude},${longitude}`,
            latitude,
            longitude
          };

          console.log('Updating location:', { 
            jobUid, 
            normalizedKind,
            payload 
          });

          ApiKit.me.job.assigned
            .patchDriverDistance(jobUid, normalizedKind, payload)
            .then(response => {
              console.log("Location updated:", response.data);
            })
            .catch((error) => {
              console.error("Location update failed:", error.response?.data || error);
              setPatchError(error.response?.data?.message || "Failed to update location");
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setPatchError("Could not get current location");
        }
      );
    }
  };

  // Initial fetch and periodic update
  useEffect(() => {
    updateDriverLocation(); // Initial fetch

    const interval = setInterval(() => {
      updateDriverLocation();
    }, 60000); // 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [jobUid]);


  if (patchError) {
    return <p>Error updating driver distance: {patchError.message}</p>;
  }

  return (
    <div>
    </div>
  );
};

export default MapWrapper;
