"use client";

import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PickDuration from "./PickDuration";
import { MeasurementUnit, WeightUnit } from "@/lib/keyChain";
import { Button } from "@/components/ui/button";
import PalletIcon from "@/components/icon/PalletIcon";
import CrateIcon from "@/components/icon/CrateIcon";
import BoxIcon from "@/components/icon/BoxIcon";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import { handleGoToNextStep } from "@/lib/utils";
import FormikErrorBox from "@/components/form/FormikErrorBox";

const labels = [
  "handling_unit",
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

export default function FreightShipment({ formik, setCurrentStep }) {
  useScrollToTop();
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List a Shipment</p>
      </div>

      <Container>
        <p className="mb-4 text-xl font-semibold">Add Freight details</p>

        <div className="space-y-8">
          <div className="w-full space-y-1">
            <Label htmlFor="handling_unit" className="ml-0">
              Furniture Type
            </Label>
            <div className="flex flex-wrap items-center gap-4 ">
              <div
                onClick={() => formik.setFieldValue("handling_unit", "PALLET")}
                className={`${formik.values.handling_unit === "PALLET" ? "bg-primary" : "bg-white"} flex w-fit cursor-pointer items-center gap-3 rounded border border-primary px-4 py-2 pr-5 font-medium`}
              >
                <div>
                  <PalletIcon
                    className={`size-6 ${formik.values.handling_unit === "PALLET" ? "fill-black" : "fill-primary"} `}
                  />
                </div>
                <p>Pallet</p>
              </div>
              <div
                onClick={() => formik.setFieldValue("handling_unit", "CRATE")}
                className={`${formik.values.handling_unit === "CRATE" ? "bg-primary" : "bg-white"} flex w-fit cursor-pointer items-center gap-3 rounded border border-primary px-4 py-2 pr-5 font-medium`}
              >
                <div>
                  <CrateIcon
                    className={`size-6 ${formik.values.handling_unit === "CRATE" ? "fill-black" : "fill-primary"} `}
                  />
                </div>
                <p>Crate</p>
              </div>
              <div
                onClick={() => formik.setFieldValue("handling_unit", "BOX")}
                className={`${formik.values.handling_unit === "BOX" ? "bg-primary" : "bg-white"} flex w-fit cursor-pointer items-center gap-3 rounded border border-primary px-4 py-2 pr-5 font-medium`}
              >
                <div>
                  <BoxIcon
                    className={`size-6 ${formik.values.handling_unit === "BOX" ? "fill-black" : "fill-primary"} `}
                  />
                </div>
                <p>Box</p>
              </div>
            </div>
            <FormikErrorBox
              formik={formik}
              field="handling_unit"
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
                  onChange={(selectValue) =>
                    formik.setFieldValue("measurement_unit", selectValue)
                  }
                  value={formik.values.measurement_unit}
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
                  onChange={(selectValue) =>
                    formik.setFieldValue("weight_unit", selectValue)
                  }
                  value={formik.values.weight_unit}
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

          <div>
            <div className="flex items-center gap-16 pt-3">
              <div
                onClick={() => {
                  formik.setFieldValue("is_stackable", true);
                  formik.setFieldValue("is_hazardous", false);
                }}
                className="flex cursor-pointer items-center gap-2"
              >
                <div
                  className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_stackable === true ? "bg-secondary" : "bg-transparent"}`}
                ></div>
                <div>
                  <h4 className="text-sm font-semibold">Stackable</h4>
                  <p className="text-xs">
                    The chairs are stackable and stackable plastic crates
                  </p>
                </div>
              </div>

              <div
                onClick={() => {
                  formik.setFieldValue("is_hazardous", true);
                  formik.setFieldValue("is_stackable", false);
                }}
                className="flex cursor-pointer items-center gap-2"
              >
                <div
                  className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_hazardous === true ? "bg-secondary" : "bg-transparent"}`}
                ></div>
                <div>
                  <h4 className="text-sm font-semibold">Hazardous</h4>
                  <p className="text-xs">Toxic Chemicals,acid and Waste</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">
              Add Pickup and Drop Off dates
            </h4>
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
