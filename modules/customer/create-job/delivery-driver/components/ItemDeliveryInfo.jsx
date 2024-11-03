"use client";

import { cn, handleGoToNextStep } from "@/lib/utils";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import useRemoveValidationOnMount from "@/lib/hooks/useRemoveValidationOnMount";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { Label } from "@/components/ui/label";
import OnePerson from "@/components/icon/OnePerson";
import TwoPerson from "@/components/icon/TwoPerson";

const labels = [
  "have_parking_space",
  "is_parking_ulez_congestion_charges",
  "is_included_all_charges",
  "man_count",
];

export default function ItemDeliveryInfo({ formik, setCurrentStep }) {
  useScrollToTop();
  useRemoveValidationOnMount(labels, formik);

  const renderOptions = (fieldName) => {
    return (
      <div className="flex items-center gap-16 pt-3">
        <div
          onClick={() => formik.setFieldValue(fieldName, true)}
          className="flex cursor-pointer items-center gap-2"
        >
          <div
            className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values[fieldName] === true ? "bg-secondary" : "bg-transparent"}`}
          ></div>
          <p className="text-sm font-semibold">Yes</p>
        </div>

        <div
          onClick={() => formik.setFieldValue(fieldName, false)}
          className="flex cursor-pointer items-center gap-2"
        >
          <div
            className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values[fieldName] === false ? "bg-secondary" : "bg-transparent"}`}
          ></div>
          <p className="text-sm font-semibold">No</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">Item Delivery</p>
      </div>

      <Container>
        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label
            htmlFor="have_parking_space"
            className="ml-0 sm:text-base lg:text-lg"
          >
            Do you have a parking space?
          </Label>
          {renderOptions("have_parking_space")}
          <FormikErrorBox
            formik={formik}
            field="have_parking_space"
            className="w-full md:w-3/6"
          />
        </div>

        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label
            htmlFor="is_parking_ulez_congestion_charges"
            className="ml-0 sm:text-base lg:text-lg"
          >
            Are you paying for parking, Ulez, Congestion charges fees?
          </Label>
          {renderOptions("is_parking_ulez_congestion_charges")}
          <FormikErrorBox
            formik={formik}
            field="is_parking_ulez_congestion_charges"
            className="w-full md:w-3/6"
          />
        </div>

        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label
            htmlFor="is_included_all_charges"
            className="ml-0 sm:text-base lg:text-lg"
          >
            Delivery provider include all these charges in quotation?
          </Label>
          {renderOptions("is_included_all_charges")}
          <FormikErrorBox
            formik={formik}
            field="is_included_all_charges"
            className="w-full md:w-3/6"
          />
        </div>

        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label
            htmlFor="is_individual"
            className="ml-0 sm:text-base lg:text-lg"
          >
            Are you Individual?
          </Label>

          <div className="flex items-center gap-16 pt-3">
            <div
              onClick={() => {
                formik.setFieldValue("is_individual", true);
                formik.setFieldValue("is_company", false);
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_individual === true ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <p className="text-sm font-semibold">Yes</p>
            </div>

            <div
              onClick={() => {
                formik.setFieldValue("is_individual", false);
                formik.setFieldValue("is_company", true);
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_individual === false ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <p className="text-sm font-semibold">No</p>
            </div>
          </div>
          <FormikErrorBox formik={formik} field="is_individual" />
        </div>

        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label htmlFor="is_company" className="ml-0 sm:text-base lg:text-lg">
            Are you Company?
          </Label>

          <div className="flex items-center gap-16 pt-3">
            <div
              onClick={() => {
                formik.setFieldValue("is_company", true);
                formik.setFieldValue("is_individual", false);
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_company === true ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <p className="text-sm font-semibold">Yes</p>
            </div>

            <div
              onClick={() => {
                formik.setFieldValue("is_company", false);
                formik.setFieldValue("is_individual", true);
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_company === false ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <p className="text-sm font-semibold">No</p>
            </div>
          </div>
          <FormikErrorBox formik={formik} field="is_company" />
        </div>

        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label htmlFor="man_count" className="ml-0 sm:text-base lg:text-lg">
            Number of people?
          </Label>

          <div className="flex items-center gap-8 pt-3">
            <div
              onClick={() => formik.setFieldValue("man_count", 1)}
              className={cn(
                "flex cursor-pointer items-center gap-1 rounded-md border py-2 pl-2 pr-5",
                {
                  "border-secondary bg-secondary text-white":
                    formik.values.man_count === 1,
                  "border-slate-300 bg-white text-black":
                    formik.values.man_count !== 1,
                },
              )}
            >
              <div>
                <OnePerson
                  className={cn("size-8", {
                    "fill-white": formik.values.man_count === 1,
                    "fill-secondary": formik.values.man_count !== 1,
                  })}
                />
              </div>
              <p className="text-lg font-semibold">1 Person</p>
            </div>
            <div
              onClick={() => formik.setFieldValue("man_count", 2)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md border py-2 pl-3.5 pr-5",
                {
                  "border-secondary bg-secondary text-white":
                    formik.values.man_count === 2,
                  "border-slate-300 bg-white text-black":
                    formik.values.man_count !== 2,
                },
              )}
            >
              <div>
                <TwoPerson
                  className={cn("size-8", {
                    "fill-white": formik.values.man_count === 2,
                    "fill-secondary": formik.values.man_count !== 2,
                  })}
                />
              </div>
              <p className="text-lg font-semibold">2 People</p>
            </div>
          </div>
          <FormikErrorBox
            formik={formik}
            field="man_count"
            className="w-full md:w-3/6"
          />
        </div>

        <div>
          <p className="text-xl font-semibold">Note</p>
          <p className="text-lg font-medium">
            Protecting your privacy is our top priority. We share your details
            only with your chosen provider. We do not support transactions
            outside our platform. Payments are securely handled, held until both
            parties are satisfied. Respect for providers is crucial, and abuse
            will not be tolerated.
          </p>
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
