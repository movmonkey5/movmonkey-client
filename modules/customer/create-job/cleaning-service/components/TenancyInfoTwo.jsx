import Image from "next/image";

import { cn, handleGoToNextStep } from "@/lib/utils";
import useScrollToTop from "@/lib/hooks/useScrollToTop";

import combinedKitchenImg from "@/public/image/combined-kitchen.png";
import separatedKitchenImg from "@/public/image/separated-kitchen.png";
import utilityRoomImg from "@/public/image/utility-room.png";
import studyRoomImg from "@/public/image/study-room.png";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import DayAndTimePreference from "./DayAndTimePreference";
import FormikErrorBox from "@/components/form/FormikErrorBox";

const cleaningTypes = [
  {
    title: "Combined Kitchen",
    value: "COMBINED_KITCHEN",
    img: combinedKitchenImg,
  },
  {
    title: "Separated Kitchen",
    value: "SEPARATED_KITCHEN",
    img: separatedKitchenImg,
  },
  { title: "Utility Room", value: "UTILITY_ROOM", img: utilityRoomImg },
  { title: "Study Room", value: "STUDY_ROOM", img: studyRoomImg },
];

const labels = [
  "feature",
  "carpet_cleaning_preference",
  "is_require_dusting",
  "carpet_fiber",
];

export default function TenancyInfoTwo({
  formik,
  setCurrentStep,
  setSubStep,
  moveBack,
}) {
  useScrollToTop();

  const handleCarpetCleaningPreference = (value) => {
    formik.setFieldValue(
      "carpet_cleaning_preference",
      value.toUpperCase().split(" ").join("_"),
    );
  };

  const handleRequireDustingPreference = (value) => {
    formik.setFieldValue(
      "is_require_dusting",
      value.toUpperCase().split(" ").join("_"),
    );
  };

  const handleCarpetFiberPreference = (value) => {
    formik.setFieldValue(
      "carpet_fiber",
      value.toUpperCase().split(" ").join("_"),
    );
  };

  const handleChangeCleaningType = (value) => {
    // Check for duplicate item
    if (
      formik.values.feature.includes(value) ||
      formik.values.feature.length >= 2
    ) {
      // Filter out duplicate item
      const updatedFeature = formik.values.feature.filter(
        (item) => item !== value,
      );

      if (updatedFeature.length > 2) {
        return;
      }

      formik.setFieldValue("feature", updatedFeature);

      return;
    }

    // Push new item
    formik.setFieldValue("feature", [...formik.values.feature, value]);
  };

  return (
    <>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className={`mx-auto flex w-full max-w-7xl items-center gap-2 px-5`}>
          {moveBack ? moveBack : null}
          End Of Tenancy
        </p>
      </div>

      <Container extraClassName="flex flex-col gap-6">
        <div>
          <p className="mb-5 mt-10 text-xl font-semibold">
            Which of the following apply to your property?
          </p>

          <div className="mt-6 flex flex-wrap items-start gap-2 lg:gap-8">
            {cleaningTypes.map((type) => (
              <div
                key={type.title}
                onClick={() => {
                  handleChangeCleaningType(type.value);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center`}
              >
                <Image
                  src={type.img}
                  width={100}
                  height={100}
                  alt={type.title}
                  quality={100}
                  className={cn(
                    "size-24 object-cover p-2",
                    formik.values.feature.includes(type.value)
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
            field="feature"
            className={"w-full md:w-2/5"}
          />
        </div>
        {/* <div className="w-full space-y-1">
          <Label htmlFor="additional_cleaning_information">
            Please state your additional information
          </Label>
          <Input
            type="text"
            id="additional_cleaning_information"
            name="additional_cleaning_information"
            placeholder="Enter additional cleaning info..."
            className="w-full md:w-2/5"
            value={formik.values.additional_cleaning_information}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div> */}

        <div>
          <h3 className="mb-4 text-xl font-bold">
            How would like your carpets/rugs to be cleaned
          </h3>
          <DayAndTimePreference
            data={["Hoovered only", "Professionally cleaned", "No Carpets"]}
            handleClick={handleCarpetCleaningPreference}
            selected={formik.values.carpet_cleaning_preference}
          />
          <FormikErrorBox
            formik={formik}
            field="carpet_cleaning_preference"
            className={"w-full md:w-2/5"}
          />
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">
            Are there any blinds, which would require dusting?
          </h3>
          <DayAndTimePreference
            data={["Yes", "No"]}
            handleClick={handleRequireDustingPreference}
            selected={formik.values.is_require_dusting}
          />
          <FormikErrorBox
            formik={formik}
            field="is_require_dusting"
            className={"w-full md:w-2/5"}
          />
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">
            What fibres are your carpets/rugs ma de of?
          </h3>
          <DayAndTimePreference
            data={["Standard synthetic", "Delicate wool"]}
            handleClick={handleCarpetFiberPreference}
            selected={formik.values.carpet_fiber}
          />
          <FormikErrorBox
            formik={formik}
            field="carpet_fiber"
            className={"w-full md:w-2/5"}
          />
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
            // onClick={() => setCurrentStep(5)}
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
    </>
  );
}
