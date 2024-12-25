import ImageUploader from "@/components/form/ImageUploader";
import SelectField from "@/components/form/SelectField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { documentType, driverRole } from "@/lib/keyChain";
import { useEffect } from "react";
import { toast } from "sonner";

const desiredFields = ["role", "document_type"];

export default function StepThree({
  setCurrentStep,
  formik,
  files,
  setFiles,
  insuranceFiles,
  setInsuranceFiles,
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
      if (files.length === 0) {
        toast.error("Please upload two files");
      } else if (files.length === 1) {
        toast.error("Please upload one more file");
      }
      if (insuranceFiles.length === 0) {
        toast.error("Please upload insurance documents");
        return;
      }
      
      files.length === 2 && setCurrentStep((prevStep) => prevStep + 1);
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      formik.setErrors(errors);
    }
  };

  return (
    <div>
      <div>
        <div className="mb-5 space-y-1 lg:w-1/2">
          <Label className="sm:text-base lg:text-lg" htmlFor="role">
            Select your driving role
          </Label>
          <SelectField
            name="role"
            placeholder="E.g. Delivery Driver"
            options={driverRole}
            onChange={(selectValue) =>
              formik.setFieldValue("role", selectValue)
            }
            value={formik.values.role}
          />
          {formik.touched.role && formik.errors.role ? (
            <>
              <div>
                <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                  {formik.errors.role}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="mb-5 space-y-1 lg:w-1/2">
          <Label className="sm:text-base lg:text-lg" htmlFor="id_type">
            Select the type of ID
          </Label>
          <SelectField
            name="document_type"
            placeholder="E.g. Driving License"
            options={documentType}
            onChange={(selectValue) =>
              formik.setFieldValue("document_type", selectValue)
            }
            value={formik.values.document_type}
          />
          {formik.touched.document_type && formik.errors.document_type ? (
            <>
              <div>
                <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                  {formik.errors.document_type}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="mb-5 space-y-3">
          <div>
            <h3 className="text-lg font-semibold lg:text-2xl">
              Proofs of your photo identification
            </h3>
            <p className="text-[#8C8C8C] max-sm:text-sm">
              You can add multiple files at once (max 2 files)
            </p>
          </div>

          <ImageUploader files={files} setFiles={setFiles} maxFiles={2} />
        </div>
           {/* Insurance Document Section */}
                <div className="mb-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold lg:text-2xl">
                      Insurance Document Photo
                    </h3>
                    <p className="text-[#8C8C8C] max-sm:text-sm">
                      Upload your insurance documentation photo (1 file required)
                    </p>
                  </div>
                  <ImageUploader
                    files={insuranceFiles}
                    setFiles={setInsuranceFiles}
                    maxFiles={1}
                  />
                </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-5">
        <Button
          onClick={() => setCurrentStep(2)}
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
