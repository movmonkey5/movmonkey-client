"use client";

import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimalType, WeightUnit } from "@/lib/keyChain";
import PickDuration from "./PickDuration";
import { Button } from "@/components/ui/button";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { handleGoToNextStep } from "@/lib/utils";

const labels = [
  "quantity",
  "identification_mark",
  "animal_name",
  "animal_breed",
  "weight",
  "weight_unit",
  "is_vaccinated",
  "in_kennel_carrier",
  "specific_need",
  "moving_date",
  "dropoff",
  "agree_terms",
];

export default function AnimalShipment({ formik, setCurrentStep }) {
  useScrollToTop();
  console.log(formik.values);
  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className="mx-auto w-full max-w-7xl px-5 py-2 ">List a Shipment</p>
      </div>
      <Container>
        <p className="mb-4 text-xl font-semibold">Add Animal details</p>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-full space-y-1">
                <Label htmlFor="quantity">Number Of Animal</Label>
                <Input
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="ex: 10"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="quantity" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="identification_mark">Shipment Title</Label>
              <Input
                type="text"
                id="identification_mark"
                placeholder="(e.g., Identification Mark on Animal or Animal Tag Number)"
                value={formik.values.identification_mark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormikErrorBox
                formik={formik}
                field="identification_mark"
                className="w-full md:w-2/5"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Animal Details:</h4>
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="animal_name">Animal’s Name</Label>
                <Input
                  type="text"
                  id="animal_name"
                  name="animal_name"
                  placeholder="Enter your animal’s name"
                  value={formik.values.animal_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="animal_name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="animal_breed">Animal’s Breed</Label>
                <Input
                  type="text"
                  id="animal_breed"
                  placeholder="Enter your animal’s breed"
                  value={formik.values.animal_breed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormikErrorBox formik={formik} field="animal_breed" />
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
                <Label htmlFor="weight_unit">Measurement Unit</Label>
                <SelectField
                  name="weight_unit"
                  placeholder="E.g. Kilograms"
                  options={WeightUnit}
                  onChange={(selectValue) =>
                    formik.setFieldValue("weight_unit", selectValue.value)
                  }
                  value={formik.values.weight_unit?.value}
                />
                <FormikErrorBox formik={formik} field="weight_unit" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Is your animal current on all vaccinations?</Label>
              <p className="ml-2 text-xs">
                (Please note, animals not current on vaccinations should not be
                transported)
              </p>
              <div className="ml-2 flex items-center gap-16 pt-3">
                <div
                  onClick={() => {
                    formik.setFieldValue("is_vaccinated", true);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_vaccinated === true ? "bg-secondary" : "bg-transparent"}`}
                  ></div>
                  <p className="text-sm font-semibold">Yes</p>
                </div>

                <div
                  onClick={() => {
                    formik.setFieldValue("is_vaccinated", false);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_vaccinated === false ? "bg-secondary" : "bg-transparent"}`}
                  ></div>
                  <p className="text-sm font-semibold">No</p>
                </div>
              </div>
              <FormikErrorBox
                formik={formik}
                field="is_vaccinated"
                className="w-full md:w-2/5"
              />
            </div>
            <div className="space-y-1">
              <Label>Will your dog be in a kennel/carrier?</Label>
              <div className="ml-2 flex items-center gap-16 pt-3">
                <div
                  onClick={() => {
                    formik.setFieldValue("in_kennel_carrier", true);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.in_kennel_carrier === true ? "bg-secondary" : "bg-transparent"}`}
                  ></div>
                  <p className="text-sm font-semibold">Yes</p>
                </div>

                <div
                  onClick={() => {
                    formik.setFieldValue("in_kennel_carrier", false);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.in_kennel_carrier === false ? "bg-secondary" : "bg-transparent"}`}
                  ></div>
                  <p className="text-sm font-semibold">No</p>
                </div>
              </div>
              <FormikErrorBox
                formik={formik}
                field="in_kennel_carrier"
                className="w-full md:w-2/5"
              />
            </div>
            <div className="space-y-1">
              <Label>Does your dog have specific needs?</Label>
              <div className="ml-2 flex items-center gap-16 pt-3">
                <div
                  onClick={() => {
                    formik.setFieldValue("specific_need", true);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.specific_need === true ? "bg-secondary" : "bg-transparent"}`}
                  ></div>
                  <p className="text-sm font-semibold">Yes</p>
                </div>

                <div
                  onClick={() => {
                    formik.setFieldValue("specific_need", false);
                  }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.specific_need === false ? "bg-secondary" : "bg-transparent"}`}
                  ></div>
                  <p className="text-sm font-semibold">No</p>
                </div>
              </div>
              <FormikErrorBox
                formik={formik}
                field="specific_need"
                className="w-full md:w-2/5"
              />
              {formik.values.specific_need && (
                <div className="mt-4 space-y-1">
                  <Label htmlFor="spec_need_reason">Please specify the specific needs:</Label>
                  <Input
                    type="text"
                    id="spec_need_reason"
                    name="spec_need_reason"
                    placeholder="Enter specific needs"
                    value={formik.values.spec_need_reason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormikErrorBox formik={formik} field="spec_need_reason" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">
              Add Pickup and Drop Off dates
            </h4>
            <PickDuration formik={formik} />
          </div>

          <div className="xl rounded-2xl border-2 border-secondary bg-gray-100 px-6 py-4">
            <Label className="ml-0">Terms & Conditions</Label>

            <div
              onClick={() => {
                formik.setFieldValue("agree_terms", !formik.values.agree_terms);
              }}
              className="mt-2 flex cursor-pointer items-start gap-2"
            >
              <div
                className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.agree_terms === true ? "bg-secondary" : "bg-transparent"}`}
              ></div>
              <p className="text-sm lg:max-w-4xl">
                {`Pets are precious cargo. They get easily stressed out during
                transport. Please consider your pet's age, breed, and
                temperament before potentially putting them at risk.`}
              </p>
            </div>

            <FormikErrorBox
              formik={formik}
              field="agree_terms"
              className="w-full md:w-2/5"
            />
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
