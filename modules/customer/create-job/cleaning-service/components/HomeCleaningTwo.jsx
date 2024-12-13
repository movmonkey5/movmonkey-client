"use client";
import Image from "next/image";

import useScrollToTop from "@/lib/hooks/useScrollToTop";

import { cn, handleGoToNextStep } from "@/lib/utils";

import buildingImg from "@/public/image/building-icon.png";
import homeImg from "@/public/image/house-icon.png";
import windowImg from "@/public/image/window-icon.png";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import DayAndTimePreference from "./DayAndTimePreference";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormikErrorBox from "@/components/form/FormikErrorBox";

const cleaningTypes = [
  { title: "Home Clean", value: "HOME_CLEAN", img: homeImg },
  { title: "Windows Clean", value: "WINDOWS_CLEAN", img: windowImg },
  {
    title: "New Building Clean",
    value: "NEW_BUILDING_CLEAN",
    img: buildingImg,
  },
];

const labels = [
  "cleaning_type",
  "room_count",
  "bathroom_count",
  "kitchen_count",
  "kitchen_cleaning_preference",
  "have_animal",
];

export default function HomeCleaningTwo({
  formik,
  setCurrentStep,
  setSubStep,
  moveBack,
}) {
  useScrollToTop();

  const handleKitchenCleaningPreference = (value) => {
    formik.setFieldValue(
      "kitchen_cleaning_preference",
      value.toUpperCase().split(" ").join("_"),
    );
  };

  const handlePetPreference = (value) => {
    formik.setFieldValue("have_animal", value === "Yes");
  };

  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className={`mx-auto flex w-full max-w-7xl items-center gap-2 px-5`}>
          {moveBack ? moveBack : null}
          Home Cleaning
        </p>
      </div>

      <Container>
        <p className="mb-5 mt-10 text-xl font-semibold ">
          What type of cleaning you want?
        </p>

        <div className="mb-5 ">
          <div className="flex flex-wrap items-center gap-2 lg:gap-8">
            {cleaningTypes.map((type) => (
              <div
                key={type.title}
                onClick={() =>
                  formik.setFieldValue("cleaning_type", type.value)
                }
                className={`flex cursor-pointer flex-col items-center justify-center`}
              >
                <Image
                  src={type.img}
                  width={100}
                  height={100}
                  alt={type.title}
                  quality={100}
                  className={cn(
                    formik.values.cleaning_type === type.value
                      ? "border-4 border-secondary"
                      : "border-4 border-transparent",
                  )}
                />
                <p className={`mt-2 text-center font-semibold`}>{type.title}</p>
              </div>
            ))}
          </div>
          <FormikErrorBox
            formik={formik}
            field="cleaning_type"
            className={"w-full md:w-2/5"}
          />
        </div>

        <div className="space-y-6">
          <div className="w-full space-y-1">
            <Label htmlFor="room_count">NUMBER OF BEDROOMS</Label>
            <Input
              type="number"
              id="room_count"
              name="room_count"
              placeholder="Number of bedrooms"
              className="w-full md:w-2/5"
              value={formik.values.room_count}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormikErrorBox
              formik={formik}
              field="room_count"
              className={"w-full md:w-2/5"}
            />
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="bathroom_count">NUMBER OF BATHROOMS?</Label>
            <Input
              type="number"
              id="bathroom_count"
              name="bathroom_count"
              placeholder="Number of bathrooms"
              className="w-full md:w-2/5"
              value={formik.values.bathroom_count}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormikErrorBox
              formik={formik}
              field="bathroom_count"
              className={"w-full md:w-2/5"}
            />
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="kitchen_count">NUMBER OF KITCHENS?</Label>
            <Input
              type="number"
              id="kitchen_count"
              name="kitchen_count"
              placeholder="Number of kitchens"
              className="w-full md:w-2/5"
              value={formik.values.kitchen_count}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormikErrorBox
              formik={formik}
              field="kitchen_count"
              className={"w-full md:w-2/5"}
            />
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">
              How would you like your kitchen cupboards and appliances to be
              cleaned?
            </h3>
            <DayAndTimePreference
              data={["Outside only", "Inside and outside", "Customize"]}
              handleClick={handleKitchenCleaningPreference}
              selected={formik.values.kitchen_cleaning_preference}
            />
            <FormikErrorBox
              formik={formik}
              field="kitchen_cleaning_preference"
              className={"w-full md:w-2/5"}
            />
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold">DO YOU HAVE ANY PETS?</h3>

            <DayAndTimePreference
              data={["Yes", "No"]}
              handleClick={handlePetPreference}
              selected={formik.values.have_animal ? "YES" : "NO"}
            />
            <small>*If Yes Please state what pet you have</small>
            <FormikErrorBox
              formik={formik}
              field="have_animal"
              className={"w-full md:w-2/5"}
            />
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="animal_type">PLEASE STATE WHAT PETS YOU HAVE</Label>
            <Input
              id="animal_type"
              name="animal_type"
              placeholder="Optional"
              className="w-full md:w-2/5"
              value={formik.values.animal_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-5">
          <Button
            onClick={() => setSubStep(0)}
            type="button"
            variant="accent"
            className="w-full sm:w-fit  sm:px-20"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              handleGoToNextStep(labels, formik, () => {
                setCurrentStep(5);
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
