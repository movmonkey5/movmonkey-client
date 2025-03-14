import { useEffect, useState, useMemo, useCallback } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ApiKit from "@/common/ApiKit";
import { CarFront } from 'lucide-react';

const MapWrapper = ({ jobUid, category }) => {
  const [coords, setCoords] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 23.777176,
    longitude: 90.399452,
    zoom: 12,
  });
  const [route, setRoute] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // Memoized fetch distance data function
  const fetchDistanceData = useCallback(async () => {
    try {
      const response = await ApiKit.me.job.distance.getDistance(jobUid, category);
      setCoords(response.data);
      
      // Fix: Parse driver location correctly - ensure lat and lng are within valid ranges
      if (response.data.current_location) {
        try {
          // Split coordinates and properly map them
          const [lng, lat] = response.data.current_location.split(",").map(Number);
          
          // Validate coordinate ranges
          if (isValidLatitude(lat) && isValidLongitude(lng)) {
            setDriverLocation([lng, lat]);
          } else {
            console.error("Invalid driver location coordinates:", lng, lat);
            setDriverLocation(null);
          }
        } catch (err) {
          console.error("Error parsing driver location:", err);
          setDriverLocation(null);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching distance data:", err);
      setError("Failed to fetch distance data");
    } finally {
      setIsLoading(false);
    }
  }, [jobUid, category]);

  // Helper functions to validate coordinates
  const isValidLatitude = (lat) => {
    return typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90;
  };
  
  const isValidLongitude = (lng) => {
    return typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180;
  };

  // Fetch route function
  const fetchRoute = useCallback(async (origin, destination) => {
    if (!origin || !destination) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const data = await res.json();

      if (data.routes?.[0]) {
        const routeData = data.routes[0];
        setRoute(routeData.geometry);
        setDistance((routeData.distance / 1000).toFixed(2));
        setDuration((routeData.duration / 60).toFixed(0));
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  }, []);

  // Initial data fetching and location setup
  useEffect(() => {
    fetchDistanceData();

    const intervalId = setInterval(fetchDistanceData, 60000);
    return () => clearInterval(intervalId);
  }, [fetchDistanceData]);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setViewport(prev => ({
            ...prev,
            latitude,
            longitude,
          }));
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Fetch route when coordinates are available
  useEffect(() => {
    if (coords?.origin_coords && coords?.destination_coords) {
      try {
        const origin = coords.origin_coords.split(",").map(Number);
        const destination = coords.destination_coords.split(",").map(Number);
        
        if (isValidLongitude(origin[0]) && isValidLatitude(origin[1]) && 
            isValidLongitude(destination[0]) && isValidLatitude(destination[1])) {
          fetchRoute(origin, destination);
        } else {
          console.error("Invalid origin or destination coordinates");
        }
      } catch (err) {
        console.error("Error parsing coordinates for route:", err);
      }
    }
  }, [coords, fetchRoute]);

  // Memoized route layer style
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
    []
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex h-[450px] w-[80%] items-center justify-center">
        <div className="loader">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[450px] w-[80%] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // Parse origin and destination with validation
  let origin = null;
  let destination = null;
  
  try {
    if (coords?.origin_coords) {
      const [lng, lat] = coords.origin_coords.split(",").map(Number);
      if (isValidLongitude(lng) && isValidLatitude(lat)) {
        origin = [lng, lat];
      }
    }
    
    if (coords?.destination_coords) {
      const [lng, lat] = coords.destination_coords.split(",").map(Number);
      if (isValidLongitude(lng) && isValidLatitude(lat)) {
        destination = [lng, lat];
      }
    }
  } catch (err) {
    console.error("Error parsing coordinates:", err);
  }

  if (!origin || !destination) {
    return (
      <div className="h-[450px] w-[80%] flex items-center justify-center text-yellow-500">
        Insufficient or invalid location data
      </div>
    );
  }

  return (
    <div className="relative h-[450px] w-[80%] overflow-hidden rounded-lg">
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
        {origin && (
          <Marker latitude={origin[1]} longitude={origin[0]} color="blue" />
        )}
        
        {/* Destination Marker */}
        {destination && (
          <Marker latitude={destination[1]} longitude={destination[0]} color="red" />
        )}

        {/* Driver Location Marker */}
        {driverLocation && isValidLatitude(driverLocation[1]) && isValidLongitude(driverLocation[0]) && (
          <Marker
            latitude={driverLocation[1]} 
            longitude={driverLocation[0]}
          >
            <div className="bg-green-500 p-1 rounded-full text-white">
              <CarFront size={20} />
            </div>
          </Marker>
        )}

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
    </div>
  );
};

export default MapWrapper;