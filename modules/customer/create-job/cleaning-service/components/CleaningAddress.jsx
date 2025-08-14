import { countries } from "@/lib/keyChain";
import { useEffect, useRef } from "react";

import { handleGoToNextStep } from "@/lib/utils";
import useScrollToTop from "@/lib/hooks/useScrollToTop";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectField from "@/components/form/SelectField";
import { Textarea } from "@/components/ui/textarea";
import useStore from "@/store";
const labels = [
  "title",
  "full_address",
  "city",
  "postal_code",
  "postal_area",
  "country",
];

export default function CleaningAddress({ formik, setCurrentStep, moveBack }) {
  useScrollToTop();
  const cityInputRef = useRef(null);
  const { user } = useStore();
  const country = user?.country;
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && country) {
      setTimeout(() => {
        const options = {
          componentRestrictions: { country },
          types: ['(cities)'] // Restrict to cities only
        };
  
        const cityAutocomplete = new window.google.maps.places.Autocomplete(
          cityInputRef.current,
          options
        );
  
        cityAutocomplete.addListener("place_changed", () => {
          const place = cityAutocomplete.getPlace();
          formik.setFieldValue("city", place.name);
        });
      }, 100);
    }
  }, [formik, country]);
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className={`mx-auto flex w-full max-w-7xl items-center gap-2 px-5`}>
          {moveBack ? moveBack : null}
          Cleaning Location Address
        </p>
      </div>

      <Container>
        <div>
          <div className="flex flex-col gap-4">
            <div className="w-full space-y-1">
              <Label htmlFor="city">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="Enter a title for the Job..."
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormikErrorBox formik={formik} field="title" />
            </div>
            <div className="w-full space-y-1">
              <Label htmlFor="full_address">Address</Label> 
              <Textarea
                id="full_address"
                name="full_address"
                placeholder="Enter your full address here..."
                value={formik.values.full_address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormikErrorBox formik={formik} field="full_address" />
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full space-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="Enter your city..."
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                ref={cityInputRef}
              />
              <FormikErrorBox formik={formik} field="city" />
            </div>

              <div className="w-full space-y-1">
                <Label htmlFor="postal_area">State/Province/Region</Label>
                <Input
                  type="text"
                  id="postal_area"
                  name="postal_area"
                  placeholder="Enter your state/province/region..."
                  value={formik.values.postal_area}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="postal_area" />
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full space-y-1">
                <Label htmlFor="postal_code">Postal/Zip Code</Label>
                <Input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  placeholder="Enter your Postal/Zip Code..."
                  value={formik.values.postal_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="postal_code" />
              </div>

              <div className="w-full">
                <Label className="mb-1" htmlFor="country">
                  Country
                </Label>
                <SelectField
                  name="country"
                  isSearchable={true}
                  placeholder="Select your country..."
                  options={countries}
                  onChange={(selectValue) =>
                    formik.setFieldValue("country", selectValue)
                  }
                  value={formik.values.country}
                />
                {formik.errors.country && formik.touched.country && (
                  <div className="mt-3 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                    {formik.errors.country}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between gap-5">
          <Button
            onClick={() => setCurrentStep(1)}
            type="button"
            variant="accent"
            className="w-full sm:w-fit  sm:px-20"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              handleGoToNextStep(labels, formik, () => {
                setCurrentStep(3);
              });
            }}
            type="button"
            className="w-full sm:w-fit  sm:px-20"
          >
            Next
          </Button>
        </div>
      </Container>
    </div>
  );
}
