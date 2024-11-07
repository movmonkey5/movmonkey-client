import { useEffect, useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const MapWrapper = ({ origin, destination }) => {
  const [route, setRoute] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 23.810331,
    longitude: 	90.412521,
    zoom: 10,
  });

  useEffect(() => {
    const fitBounds = () => {
      if (origin && destination) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([origin[0], origin[1]]);
        bounds.extend([destination[0], destination[1]]);
        const { lng, lat } = bounds.getCenter();

        setViewport({
          latitude: lat,
          longitude: lng,
          zoom:
            bounds.getNorthEast().distanceTo(bounds.getSouthWest()) > 100
              ? 8
              : 10,
        });
      }
    };

    fitBounds();
  }, [origin, destination]);

  useEffect(() => {
    const getRoute = async () => {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
      );
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0].geometry);
      }
    };

    if (origin && destination) {
      getRoute();
    }
  }, [origin, destination]);

  return (
    <Map
      initialViewState={viewport}
      style={{ width: "80%", height: 350 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    >
      {origin && (
        <Marker latitude={origin[1]} longitude={origin[0]} color="blue" />
      )}
      {destination && (
        <Marker
          latitude={destination[1]}
          longitude={destination[0]}
          color="red"
        />
      )}

      {route && (
        <Source id="route" type="geojson" data={route}>
          <Layer
            id="route"
            type="line"
            paint={{
              "line-color": "#3887be",
              "line-width": 5,
              "line-opacity": 0.75,
            }}
          />
        </Source>
      )}
    </Map>
  );
};

export default MapWrapper;
