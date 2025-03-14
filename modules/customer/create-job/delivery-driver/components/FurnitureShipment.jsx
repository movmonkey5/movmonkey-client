"use client";

import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MeasurementUnit, WeightUnit } from "@/lib/keyChain";
import PickDuration from "./PickDuration";
import { Button } from "@/components/ui/button";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import { handleGoToNextStep } from "@/lib/utils";
import FormikErrorBox from "@/components/form/FormikErrorBox";

const labels = [
  "furniture",
  "length",
  "width",
  "height",
  "weight",
  "quantity",
  "measurement_unit",
  "weight_unit",
  "moving_date",
  "dropoff",
];

export default function FurnitureShipment({ formik, setCurrentStep }) {
  useScrollToTop();
  console.log("formik hiiiiiiiiiiiiiiiiiiiiiiiii", formik.values);
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List a Shipment</p>
      </div>

      <Container>
        <p className="mb-4 text-xl font-semibold">Add Item details</p>

        <div className="space-y-8">
          <div className="w-full space-y-1">
            <Label htmlFor="furniture">Item Type</Label>
            <Input
              type="text"
              id="furniture"
              placeholder="ex: Multiple seated sofa and couch"
              value={formik.values.furniture}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormikErrorBox
              formik={formik}
              field="furniture"
              className="w-full md:w-2/5"
            />
          </div>

          <div className="space-y-4">
            <p className="mb-4 text-xl font-semibold">Dimensions</p>

            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-4">
              <div className="w-full space-y-1">
                <Label htmlFor="length">Length</Label>
                <Input
                  type="number"
                  id="length"
                  placeholder="ex: 10"
                  value={formik.values.length}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="length" />
              </div>
              <div className="w-full space-y-1">
                <Label htmlFor="width">Width</Label>
                <Input
                  type="number"
                  id="width"
                  placeholder="ex: 10"
                  value={formik.values.width}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="width" />
              </div>
              <div className="w-full space-y-1">
                <Label htmlFor="height">Height</Label>
                <Input
                  type="number"
                  id="height"
                  placeholder="ex: 10"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="height" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="measurement_unit">Measurement Unit</Label>
                <SelectField
                  name="measurement_unit"
                  placeholder="E.g. Inches"
                  options={MeasurementUnit}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("measurement_unit", selectedOption?.value || '');
                  }}
                  value={MeasurementUnit.find(option => option.value === formik.values.measurement_unit) || ''}
                />
                <FormikErrorBox formik={formik} field="measurement_unit" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:w-1/2">
              <div className="space-y-1">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  type="number"
                  id="weight"
                  placeholder="ex: 10"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="weight" />
              </div>
              <div className="w-full space-y-1">
                <Label htmlFor="weight_unit">Weight Unit</Label>
                <SelectField
                  name="weight_unit"
                  placeholder="E.g. Kilograms"
                  options={WeightUnit}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("weight_unit", selectedOption?.value || '');
                  }}
                  value={WeightUnit.find(option => option.value === formik.values.weight_unit) || ''}
                />
                <FormikErrorBox formik={formik} field="weight_unit" />
              </div>
            </div>

            <div>
              <div className="w-fit space-y-1">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  id="quantity"
                  placeholder="ex: 10"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="quantity" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="mb-4 text-xl font-semibold">
              Add Pickup and Drop Off dates
            </p>
            <PickDuration formik={formik} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-5">
          <Button
            onClick={() => setCurrentStep(4)}
            type="button"
            variant="accent"
            className="w-full sm:w-fit  sm:px-20"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              handleGoToNextStep(labels, formik, () => {
                setCurrentStep(6);
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
