"use client";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, handleGoToNextStep } from "@/lib/utils";
import PickDuration from "./PickDuration";
import OpenTransport from "@/components/icon/OpenTransport";
import CloseTransport from "@/components/icon/CloseTransport";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import FormikErrorBox from "@/components/form/FormikErrorBox";

const labels = [
  "vehicle_year",
  "vehicle_brand",
  "vehicle_model",
  "vehicle_type",
  "moving_date",
  "dropoff",
  "service_type",
];

export default function VehicleShipment({ formik, setCurrentStep }) {
  useScrollToTop();

  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List a Shipment</p>
      </div>

      <Container>
        <p className="mb-4 text-xl font-semibold">Add vehicle details</p>

        <div>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
            <div className="w-full space-y-1">
              <Label htmlFor="vehicle_year">YEAR</Label>
              <Input
                type="text"
                id="vehicle_year"
                placeholder="ex: 2014"
                value={formik.values.vehicle_year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormikErrorBox formik={formik} field="vehicle_year" />
            </div>
            <div className="w-full space-y-1">
              <Label htmlFor="vehicle_brand">MAKE</Label>
              <Input
                type="text"
                id="vehicle_brand"
                placeholder="ex: Ford"
                value={formik.values.vehicle_brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormikErrorBox formik={formik} field="vehicle_brand" />
            </div>
            <div className="w-full space-y-1">
              <Label htmlFor="vehicle_model">MODEL</Label>
              <Input
                type="text"
                id="vehicle_model"
                placeholder="ex: E-Series"
                value={formik.values.vehicle_model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormikErrorBox formik={formik} field="vehicle_model" />
            </div>
          </div>

          <div className="mb-8">
            <Label htmlFor="vehicle_type">Vehicle Type</Label>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              <div
                onClick={() => formik.setFieldValue("vehicle_type", "OPERABLE")}
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                  {
                    "border-secondary bg-secondary text-white":
                      formik.values.vehicle_type === "OPERABLE",
                    "border-slate-300 bg-white text-black":
                      formik.values.vehicle_type !== "OPERABLE",
                  },
                )}
              >
                <p className="text-center text-base font-medium">Operable</p>
              </div>

              <div
                onClick={() =>
                  formik.setFieldValue("vehicle_type", "CONVERTIBLE")
                }
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                  {
                    "border-secondary bg-secondary text-white":
                      formik.values.vehicle_type === "CONVERTIBLE",
                    "border-slate-300 bg-white text-black":
                      formik.values.vehicle_type !== "CONVERTIBLE",
                  },
                )}
              >
                <p className="text-center text-base font-medium">Convertible</p>
              </div>

              <div
                onClick={() => formik.setFieldValue("vehicle_type", "MODIFIED")}
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1 lg:px-5 lg:py-2",
                  {
                    "border-secondary bg-secondary text-white":
                      formik.values.vehicle_type === "MODIFIED",
                    "border-slate-300 bg-white text-black":
                      formik.values.vehicle_type !== "MODIFIED",
                  },
                )}
              >
                <p className="text-center text-base font-medium">Modified</p>
              </div>
            </div>
            <FormikErrorBox
              formik={formik}
              field="vehicle_type"
              className="w-full md:w-2/5"
            />
          </div>

          <p className="mb-4 text-xl font-semibold">
            Add Pickup and Drop Off dates
          </p>
          <PickDuration formik={formik} />

          <p className="mb-4 mt-8 text-xl font-semibold">Service Type</p>
          <div className="space-y-2">
            <div
              onClick={() => {
                formik.setFieldValue("service_type", "OPEN_TRANSPORT");
              }}
              className="flex w-fit cursor-pointer items-center gap-3"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.service_type === "OPEN_TRANSPORT" ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <div className="flex items-center gap-2">
                <OpenTransport className="h-8 w-8" />
                <p className="font-semibold">Open Transport(£)</p>
              </div>
            </div>
            <div
              onClick={() => {
                formik.setFieldValue("service_type", "CLOSE_TRANSPORT");
              }}
              className="flex w-fit cursor-pointer items-center gap-3"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.service_type === "CLOSE_TRANSPORT" ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <div className="flex items-center gap-2">
                <CloseTransport className="h-8 w-8" />
                <p className="font-semibold">Close Transport(£)</p>
              </div>
            </div>
          </div>
          <FormikErrorBox
            formik={formik}
            field="service_type"
            className="w-full md:w-2/5"
          />
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
