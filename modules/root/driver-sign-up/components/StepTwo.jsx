import FormikErrorBox from "@/components/form/FormikErrorBox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

const desiredFields = [
  "is_individual",
  "is_company",
  "have_insurance",
  "have_criminal_conviction",
  "is_background_check_passed",
];

export default function StepTwo({
  setCurrentStep,
  formik,
  currentValidationSchema,
}) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const filteredObject = {};

  for (const key in formik.values) {
    if (desiredFields.includes(key)) {
      filteredObject[key] = formik.values[key];
    }
  }

  const handleNext = async () => {
    Object.keys(filteredObject).forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    try {
      await currentValidationSchema.validate(formik.values, {
        abortEarly: false,
      });
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      formik.setErrors(errors);
    }
  };

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
      <div>
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
          <Label
            htmlFor="have_insurance"
            className="ml-0 sm:text-base lg:text-lg"
          >
            Do you have insurances?
          </Label>
          {renderOptions("have_insurance")}
          <FormikErrorBox formik={formik} field="have_insurance" />
        </div>

        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label
            htmlFor="have_criminal_conviction"
            className="ml-0 sm:text-base lg:text-lg"
          >
            Do you have any criminal conviction?
          </Label>
          {renderOptions("have_criminal_conviction")}
          <FormikErrorBox formik={formik} field="have_criminal_conviction" />
        </div>

        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label
            htmlFor="is_background_check_passed"
            className="ml-0 sm:text-base lg:text-lg"
          >
            All our drivers are subject to background check, Are you happy with
            these?
          </Label>
          {renderOptions("is_background_check_passed")}
          <FormikErrorBox formik={formik} field="is_background_check_passed" />
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
          onClick={handleNext}
          type="button"
          className="w-full sm:w-fit  sm:px-20"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
