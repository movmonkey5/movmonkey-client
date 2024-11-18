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
  const [isLoading, setIsLoading] = useState(true);
  const [patchError, setPatchError] = useState(null);

  // Fetch user's current location and set it as the center
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setViewport({
            latitude,
            longitude,
            zoom: 12,
          });
          setUserLocation({ latitude, longitude }); // Store user location
          setIsLoading(false);

          // Call patchDriverDistance API
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
  }, [coords, jobUid]);

  if (isLoading) {
    return <p>Loading map...</p>;
  }

  if (patchError) {
    return <p>Error updating driver distance: {patchError.message}</p>;
  }

  return (
    <div>
        tracking mode on 
    </div>
  );
};

export default MapWrapper;
