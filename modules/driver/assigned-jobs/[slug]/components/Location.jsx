import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ApiKit from "@/common/ApiKit";

const MapWrapper = ({ coords, jobUid }) => {
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
          setViewport({
            latitude,
            longitude,
            zoom: 12,
          });
          setUserLocation({ latitude, longitude });

          const payload = {
            current_location: `${latitude},${longitude}`,
          };

          ApiKit.me.job.assigned
            .patchDriverDistance(jobUid, payload)
            .then(() => console.log("Distance updated successfully"))
            .catch((error) => {
              console.error("Error updating distance:", error);
              setPatchError(error);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    } else {
      setIsLoading(false);
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
