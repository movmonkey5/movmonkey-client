"use client";

import { useState, useEffect, useRef } from "react";
import { handleGoToNextStep } from "@/lib/utils";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JobMap from "./JobMap";

const labels = ["title"];
// MapWrapper.js

import { useLoadScript } from "@react-google-maps/api";

const MapWrapper = ({ origin, destination }) => {
  // Load the Google Maps API once here
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  if (!isLoaded) return <div>Loading map...</div>;

  // Render JobMap only once the API is loaded
  return <JobMap origin={origin} destination={destination} />;
};


export default function FindDistance({ formik, setCurrentStep }) {
  useScrollToTop();

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      setTimeout(() => {
        const originAutocomplete = new window.google.maps.places.Autocomplete(
          originInputRef.current,
        );
        const destinationAutocomplete =
          new window.google.maps.places.Autocomplete(
            destinationInputRef.current,
          );

        originAutocomplete.addListener("place_changed", () => {
          const place = originAutocomplete.getPlace();
          formik.setFieldValue("moving_from", place.formatted_address);
        });

        destinationAutocomplete.addListener("place_changed", () => {
          const place = destinationAutocomplete.getPlace();
          formik.setFieldValue("moving_to", place.formatted_address);
        });
      }, 100);
    } else {
      console.error("Google Maps API not loaded");
    }
  }, []);

  useEffect(() => {
    if (formik.values.moving_from === "" || formik.values.moving_to === "") {
      formik.setFieldValue("total_distance", null);
    }
  }, [formik.values.moving_from, formik.values.moving_to]);

  const getDistance = async () => {
    const { moving_from, moving_to } = formik.values;

    const res = await fetch(
      `/api/get-distance?origin=${moving_from}&destination=${moving_to}`,
    );
    const data = await res.json();

    if (res.ok) {
      const distanceInMiles = parseFloat(data.distance) * 0.621371;
      // setDistance(distanceInMiles.toFixed(2) + " Miles");
      setDuration(data.duration);
      formik.setFieldValue("total_distance", distanceInMiles.toFixed(2));
    } else {
      console.error(data.error);
    }
  };

  return (
    <Container>
      <div className="mb-5 w-full space-y-1">
        <Label htmlFor="title">Job Title</Label>
        <Input
          type="text"
          id="title"
          placeholder="ex: Moving a couch"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormikErrorBox formik={formik} field="title" />
      </div>

      <div className="space-y-28">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-10">
          <div className="w-full space-y-1">
            <Label htmlFor="moving_from">Where are you moving item from?</Label>
            <Input
              type="text"
              id="moving_from"
              placeholder="ex: full address"
              value={formik.values.moving_from}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              ref={originInputRef}
            />
          </div>
          <div className="w-full space-y-1">
            <Label htmlFor="moving_to">Where are you moving item to?</Label>
            <Input
              type="text"
              id="moving_to"
              placeholder="ex: full address"
              value={formik.values.moving_to}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              ref={destinationInputRef}
            />
          </div>
        </div>
        {formik.values.moving_from &&
          formik.values.moving_to &&
          !formik.values.total_distance && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                className="px-20"
                onClick={getDistance}
              >
                Calculate
              </Button>
            </div>
          )}
        {formik.values.total_distance && (
          <div className="flex justify-center">
            <div className="flex size-40 items-center justify-center rounded-full bg-secondary p-3">
              <h5 className="text-center text-3xl font-semibold text-white">
                {formik.values.total_distance} Miles
              </h5>
            </div>
          </div>
        )}
        {formik.values.total_distance && (
          <div className="my-10">
            <h4 className="text-center text-lg font-semibold">Job Route</h4>
            <MapWrapper
              origin={formik.values.moving_from}
              destination={formik.values.moving_to}
            />
          </div>
        )}
        {formik.values.total_distance && (
          <div className="flex justify-center">
            <Button
              onClick={() => {
                handleGoToNextStep(labels, formik, () => {
                  setCurrentStep(2);
                });
              }}
              variant="secondary"
              className="px-20"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}