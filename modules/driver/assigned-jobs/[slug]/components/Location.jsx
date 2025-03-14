import { useEffect, useState, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ApiKit from "@/common/ApiKit";

const MapWrapper = ({ jobUid, kind }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [viewport, setViewport] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [patchError, setPatchError] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const routeSource = useRef(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [directions, setDirections] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentCoordIndex, setCurrentCoordIndex] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const carMarker = useRef(null);
  const [isNavigationActive, setIsNavigationActive] = useState(false);
  const animationFrameId = useRef(null);
  const [visitedCoordinates, setVisitedCoordinates] = useState([]);

  // Enhanced map initialization
  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Changed to daylight style
      center: [-0.118092, 51.509865],
      zoom: 6
    });

    // Add enhanced controls
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      })
    );
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(new mapboxgl.FullscreenControl());

    map.current.on('load', () => {
      // Add suggested route source
      map.current.addSource('suggested-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] }
        }
      });

      // Add traveled route source
      map.current.addSource('traveled-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] }
        }
      });

      // Update suggested route layer (deep blue with glow)
      map.current.addLayer({
        id: 'suggested-route',
        type: 'line',
        source: 'suggested-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 6,
          'line-opacity': 0.3,
          'line-dasharray': [2, 2]
        }
      });

      // Add traveled route layer (bright blue)
      map.current.addLayer({
        id: 'traveled-route',
        type: 'line',
        source: 'traveled-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 6,
          'line-opacity': 0.8
        }
      });
    });
  }, []);

  // Add this after existing map initialization code in useEffect
  useEffect(() => {
    if (map.current) {
      // Add car marker icon
      const el = document.createElement('div');
      el.className = 'car-marker';
      el.style.backgroundImage = "url('/car-icon.png')"; // Add a car icon to your public folder
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundSize = 'cover';

      carMarker.current = new mapboxgl.Marker(el)
        .setLngLat([-0.118092, 51.509865])
        .addTo(map.current);
    }
  }, []);

  // Update marker position when location changes
  useEffect(() => {
    if (!map.current || !userLocation) return;

    if (!marker.current) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
    } else {
      marker.current.setLngLat([userLocation.longitude, userLocation.latitude]);
    }

    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 15
    });
  }, [userLocation]);

  // Enhanced displayRoute function
  const displayRoute = async (jobData, currentLocation) => {
    if (!map.current || !jobData || !currentLocation) return;

    try {
      const [originLng, originLat] = jobData.origin_coords.split(',').map(Number);
      const [destLng, destLat] = jobData.destination_coords.split(',').map(Number);
      const [currentLng, currentLat] = currentLocation.split(',').map(Number);

      // Get detailed route using Mapbox Directions API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLng},${currentLat};${originLng},${originLat};${destLng},${destLat}?steps=true&geometries=geojson&overview=full&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.routes?.[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;
        setRouteCoordinates(coordinates); // Store coordinates for navigation
        
        // Store navigation steps
        const steps = route.legs.flatMap(leg => 
          leg.steps.map(step => ({
            instruction: step.maneuver.instruction,
            distance: (step.distance * 0.000621371).toFixed(1),
            coordinates: step.maneuver.location
          }))
        );
        setDirections(steps);

        // Add markers
        marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([currentLng, currentLat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popup-content">
              <h3>Current Location</h3>
              <p>Driver Position</p>
            </div>
          `))
          .addTo(map.current);

        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat([originLng, originLat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popup-content">
              <h3>Pickup Location</h3>
              <p>${jobData.moving_from}</p>
            </div>
          `))
          .addTo(map.current);

        new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([destLng, destLat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="popup-content">
              <h3>Drop-off</h3>
              <p>${jobData.moving_to}</p>
            </div>
          `))
          .addTo(map.current);

        // Show suggested route
        map.current.getSource('suggested-route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        });

        // Initialize traveled route as empty
        map.current.getSource('traveled-route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        });

        // Fit bounds to show entire route
        const bounds = new mapboxgl.LngLatBounds()
        coordinates.forEach(coord => bounds.extend(coord));

        map.current.fitBounds(bounds, {
          padding: 100,
          duration: 1500
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Navigation controls
  const navigateToStep = useCallback((stepIndex) => {
    if (!map.current || !directions[stepIndex]) return;

    const [lng, lat] = directions[stepIndex].coordinates;
    map.current.flyTo({
      center: [lng, lat],
      zoom: 16,
      pitch: 60,
      bearing: 0
    });
    setActiveStep(stepIndex);
  }, [directions]);

  // Add new function for starting navigation
  const startNavigation = useCallback(() => {
    if (!routeCoordinates.length) return;
    
    setIsNavigating(true);
    setCurrentCoordIndex(0);

    // Animate car movement along the route
    const animate = () => {
      if (!isNavigating || currentCoordIndex >= routeCoordinates.length - 1) {
        setIsNavigating(false);
        return;
      }

      const coord = routeCoordinates[currentCoordIndex];
      if (carMarker.current && coord) {
        // Calculate bearing for smooth rotation
        const nextCoord = routeCoordinates[currentCoordIndex + 1];
        if (nextCoord) {
          const bearing = getBearing(coord, nextCoord);
          carMarker.current.setRotation(bearing);
        }

        carMarker.current.setLngLat(coord);
        map.current.panTo(coord, { duration: 1000 });
      }

      setCurrentCoordIndex(prev => prev + 1);
      setTimeout(animate, 1000); // Adjust speed by changing timeout
    };

    animate();
  }, [routeCoordinates, isNavigating, currentCoordIndex]);

  // Add bearing calculation helper
  const getBearing = (start, end) => {
    const startLat = start[1] * Math.PI / 180;
    const startLng = start[0] * Math.PI / 180;
    const endLat = end[1] * Math.PI / 180;
    const endLng = end[0] * Math.PI / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return bearing;
  };

  // Function to fetch and patch location
  const updateDriverLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = `${longitude},${latitude}`; // Format for API
          setUserLocation({ latitude, longitude });
          
          // Format kind and payload properly
          const normalizedKind = kind?.toLowerCase()?.replace('_job', '');
          const payload = {
            current_location: currentLocation, // Use formatted location string
            latitude,
            longitude
          };

          console.log('Updating location:', { 
            jobUid, 
            normalizedKind,
            currentLocation, // Log the correctly formatted location
            payload 
          });

          ApiKit.me.job.assigned
            .patchDriverDistance(jobUid, normalizedKind, payload)
            .then(response => {
              console.log("Location updated:", response.data);
              setJobDetails(response.data);
              displayRoute(response.data, currentLocation); // Pass the correct format
            })
            .catch((error) => {
              console.error("Location update failed:", error.response?.data || error);
              setPatchError(error.response?.data?.message || "Failed to update location");
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setPatchError("Could not get current location");
        },
        {
          enableHighAccuracy: true, // Enable high accuracy
          timeout: 5000,
          maximumAge: 0
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

  // Add this function to handle animation properly
  const startRouteNavigation = useCallback(() => {
    if (!routeCoordinates.length) {
      console.log('No route coordinates available');
      return;
    }

    setIsNavigating(true);
    setIsNavigationActive(true);
    setShowNavigation(true); // Force show navigation panel
    setCurrentCoordIndex(0);
    setVisitedCoordinates([routeCoordinates[0]]); // Start with first coordinate

    const animate = () => {
      setCurrentCoordIndex(prevIndex => {
        if (prevIndex >= routeCoordinates.length - 1) {
          setIsNavigating(false);
          setIsNavigationActive(false);
          return prevIndex;
        }

        const currentCoord = routeCoordinates[prevIndex];
        const nextCoord = routeCoordinates[prevIndex + 1];

        if (carMarker.current && currentCoord) {
          // Update car position and rotation
          const bearing = getBearing(currentCoord, nextCoord);
          carMarker.current.setLngLat(currentCoord);
          carMarker.current.setRotation(bearing);

          // Update visited coordinates
          const visitedPath = routeCoordinates.slice(0, prevIndex + 2);
          
          // Update traveled route
          map.current.getSource('traveled-route').setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: visitedPath
            }
          });

          // Center map and update navigation
          map.current.easeTo({
            center: currentCoord,
            zoom: 16,
            pitch: 60,
            bearing: bearing,
            duration: 1000
          });

          const currentStep = Math.floor((prevIndex / routeCoordinates.length) * directions.length);
          setActiveStep(currentStep);
        }

        return prevIndex + 1;
      });

      if (isNavigationActive) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animate();
  }, [routeCoordinates, directions, isNavigationActive]);

  // Add cleanup for animation
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Add cleanup effect for route when navigation stops
  useEffect(() => {
    if (!isNavigating && map.current) {
      // Clear traveled route but keep suggested route
      map.current.getSource('traveled-route')?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
      setVisitedCoordinates([]);
    }
  }, [isNavigating]);

  return (
    <div className="map-container">
      <div ref={mapContainer} style={{ height: '500px', width: '100%', borderRadius: '12px' }} />
      
      <div className="bottom-controls">
        <button 
          className={`nav-button ${isNavigating ? 'active' : ''}`}
          onClick={() => isNavigating ? setIsNavigating(false) : startRouteNavigation()}
        >
          {isNavigating ? 'Stop Navigation' : 'Start Drive'}
        </button>
        <button 
          className={`nav-button ${showNavigation ? 'active' : ''}`}
          onClick={() => setShowNavigation(!showNavigation)}
        >
          {showNavigation ? 'Hide Navigation' : 'Show Navigation'}
        </button>
      </div>

      {showNavigation && directions.length > 0 && (
        <div className="navigation-panel">
          <div className="nav-header">
            <h3>Navigation Steps</h3>
            <button 
              className="close-button"
              onClick={() => setShowNavigation(false)}
            >
              ×
            </button>
          </div>
          <div className="steps-container">
            {directions.map((step, index) => (
              <div 
                key={index}
                className={`step ${index === activeStep ? 'active' : ''}`}
                onClick={() => navigateToStep(index)}
              >
                <span className="step-number">{index + 1}</span>
                <div className="step-content">
                  <p>{step.instruction}</p>
                  <small>{step.distance} miles</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .map-container {
          position: relative;
          margin: 20px 0;
        }
        .animation-status {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }
        .status-badge {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .error-message {
          color: red;
          margin-top: 10px;
        }
        .controls {
          display: none; // Hide old controls
        }
        .bottom-controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          gap: 10px;
        }
        .nav-button {
          background: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 16px;
        }
        .nav-button:hover {
          background: #f8f8f8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .nav-button.active {
          background: #3b82f6;
          color: white;
        }
        .navigation-panel {
          position: absolute;
          top: 80px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 16px;
          width: 300px;
          max-height: 60vh;
          overflow-y: auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0 8px;
          color: #666;
        }
        .close-button:hover {
          color: #000;
        }
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .step:hover {
          background: rgba(59, 130, 246, 0.1);
        }
        .step.active {
          background: rgba(59, 130, 246, 0.2);
        }
        .step-number {
          background: #3b82f6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .step-content {
          flex: 1;
        }
        .step-content p {
          margin: 0;
          font-size: 14px;
        }
        .step-content small {
          color: #666;
          font-size: 12px;
        }
        .car-marker {
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .car-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default MapWrapper;
