import { useEffect, useState, useMemo } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapWrapper = ({ coords }) => {
  const origin = coords.origin_coords
    ? coords.origin_coords.split(",").map(Number)
    : [0, 0]; // Default if no origin coordinates provided
  const destination = coords.destination_coords
    ? coords.destination_coords.split(",").map(Number)
    : [0, 0]; // Default if no destination coordinates provided

  console.log("Origin:", origin);
  console.log("Destination:", destination);
  const [viewport, setViewport] = useState({
    latitude: 23.777176, // Default center
    longitude: 90.399452,
    zoom: 12,
  });
  const [route, setRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // Get initial user location and set map center
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
          setUserLocation([longitude, latitude]); // Store user location
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false); // Continue with default location
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    } else {
      setIsLoading(false); // Geolocation not available, use default location
    }
  }, []);

  // Fetch route once when component mounts
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
        );
        const data = await res.json();

        if (data.routes?.[0]) {
          const routeData = data.routes[0];
          setRoute(routeData.geometry);
          setDistance((routeData.distance / 1000).toFixed(2)); // Convert meters to kilometers
          setDuration((routeData.duration / 60).toFixed(0)); // Convert seconds to minutes

          // After getting the route, fit the map to show both points
          const bounds = new mapboxgl.LngLatBounds()
            .extend(origin)
            .extend(destination);

          const { lng, lat } = bounds.getCenter();
          const distanceBounds = bounds
            .getNorthEast()
            .distanceTo(bounds.getSouthWest());

          setViewport({
            latitude: lat,
            longitude: lng,
            zoom: distanceBounds > 100000 ? 8 : distanceBounds > 50000 ? 10 : 12,
          });
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (!isLoading) {
      fetchRoute();
    }
  }, [isLoading]);

  // Memoize route layer style
  const routeLayer = useMemo(
    () => ({
      id: "route",
      type: "line",
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    }),
    [],
  );

  return (
    <div className="relative h-[450px] w-[80%] overflow-hidden rounded-lg">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="loader">Loading map...</div>
        </div>
      ) : (
        <>
          {/* Display distance and duration above the map */}
          <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded-md shadow-md">
            <p>Distance: {distance ? `${distance} km` : "Calculating..."}</p>
            <p>Duration: {duration ? `${duration} mins` : "Calculating..."}</p>
          </div>
          <Map
            initialViewState={viewport}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          >
            {/* Origin Marker */}
            <Marker latitude={origin[1]} longitude={origin[0]} color="blue" />
            <Marker
              latitude={destination[1]}
              longitude={destination[0]}
              color="red"
            />

            {/* User Location Marker */}
            {userLocation && (
              <Marker
                latitude={userLocation[1]}
                longitude={userLocation[0]}
                color="blue"
              >
                <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
              </Marker>
            )}

            {/* Route Line */}
            {route && (
              <Source id="route" type="geojson" data={route}>
                <Layer {...routeLayer} />
              </Source>
            )}
          </Map>
        </>
      )}
    </div>
  );
};

export default MapWrapper;
