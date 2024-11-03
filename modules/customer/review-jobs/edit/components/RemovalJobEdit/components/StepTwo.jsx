import FormikErrorBox from "@/components/form/FormikErrorBox";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import { cn, handleGoToNextStep } from "@/lib/utils";

import cleaner_1 from "@/public/image/cleaner_1.png";
import cleaner_2 from "@/public/image/cleaner_2.png";
import cleaner_3 from "@/public/image/cleaner_3.png";
import cleaner_4 from "@/public/image/cleaner_4.png";
import cleaner_5 from "@/public/image/cleaner_5.png";
import cleaner_6 from "@/public/image/cleaner_6.png";
import Image from "next/image";

const labels = [
  "team_configuration",
  "have_parking_space",
  "is_parking_ulez_congestion_charges",
  "is_included_all_charges",
  "is_individual",
  "is_company",
];

export default function StepTwo({ formik, setCurrentStep }) {
  useScrollToTop();

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
    <Container>
      <div className="h-4 rounded-lg bg-[#D9D9D9]">
        {
          <div
            className="h-full rounded-lg bg-secondary"
            style={{
              width: `${(2 / 4) * 100}%`,
            }}
          ></div>
        }
      </div>

      <div className="mb-5 mt-10 grid grid-cols-2 gap-4">
        <div
          onClick={() =>
            formik.setFieldValue("team_configuration", "ONE_MAN_ONE_TRUCK")
          }
          className={cn(
            "col-span-2 flex cursor-pointer flex-col items-center rounded-md border-2 py-4 xl:col-span-1 xl:flex-row",
            formik.values.team_configuration === "ONE_MAN_ONE_TRUCK" &&
              "border-secondary",
          )}
        >
          <Image src={cleaner_1} alt="cleaner_1" />

          <div>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 1 Man
            </p>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 1 Delivery Truck
            </p>
          </div>
        </div>
        <div
          onClick={() =>
            formik.setFieldValue("team_configuration", "TWO_MAN_ONE_TRUCK")
          }
          className={cn(
            "col-span-2 flex cursor-pointer flex-col items-center rounded-md border-2 py-4 xl:col-span-1 xl:flex-row",
            formik.values.team_configuration === "TWO_MAN_ONE_TRUCK" &&
              "border-secondary",
          )}
        >
          <Image src={cleaner_2} alt="cleaner_2" />

          <div>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 2 Man
            </p>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 1 Delivery Truck
            </p>
          </div>
        </div>
        <div
          onClick={() =>
            formik.setFieldValue("team_configuration", "THREE_MAN_ONE_TRUCK")
          }
          className={cn(
            "col-span-2 flex cursor-pointer flex-col items-center rounded-md border-2 py-4 xl:col-span-1 xl:flex-row",
            formik.values.team_configuration === "THREE_MAN_ONE_TRUCK" &&
              "border-secondary",
          )}
        >
          <Image src={cleaner_3} alt="cleaner_3" />

          <div>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 3 Man
            </p>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 1 Delivery Truck
            </p>
          </div>
        </div>
        <div
          onClick={() =>
            formik.setFieldValue("team_configuration", "THREE_MAN_TWO_TRUCK")
          }
          className={cn(
            "col-span-2 flex cursor-pointer flex-col items-center rounded-md border-2 py-4 xl:col-span-1 xl:flex-row",
            formik.values.team_configuration === "THREE_MAN_TWO_TRUCK" &&
              "border-secondary",
          )}
        >
          <Image src={cleaner_4} alt="cleaner_4" />

          <div>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 3 Man
            </p>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 2 Delivery Truck
            </p>
          </div>
        </div>
        <div
          onClick={() =>
            formik.setFieldValue("team_configuration", "FOUR_MAN_TWO_TRUCK")
          }
          className={cn(
            "col-span-2 flex cursor-pointer flex-col items-center rounded-md border-2 py-4 xl:col-span-1 xl:flex-row",
            formik.values.team_configuration === "FOUR_MAN_TWO_TRUCK" &&
              "border-secondary",
          )}
        >
          <Image src={cleaner_4} alt="cleaner_4" />

          <div>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 4 Man
            </p>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 2 Delivery Truck
            </p>
          </div>
        </div>
        <div
          onClick={() =>
            formik.setFieldValue("team_configuration", "FIVE_MAN_TWO_TRUCK")
          }
          className={cn(
            "col-span-2 flex cursor-pointer flex-col items-center rounded-md border-2 py-4 xl:col-span-1 xl:flex-row",
            formik.values.team_configuration === "FIVE_MAN_TWO_TRUCK" &&
              "border-secondary",
          )}
        >
          <Image src={cleaner_5} alt="cleaner_5" />

          <div>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 5 Man
            </p>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 2 Delivery Truck
            </p>
          </div>
        </div>
        <div
          onClick={() =>
            formik.setFieldValue("team_configuration", "FIVE_MAN_THREE_TRUCK")
          }
          className={cn(
            "col-span-2 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 py-4 xl:flex-row",
            formik.values.team_configuration === "FIVE_MAN_THREE_TRUCK" &&
              "border-secondary",
          )}
        >
          <Image src={cleaner_6} alt="cleaner_6" />

          <div>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 5 Man
            </p>
            <p className="font-semibold max-xl:text-center">
              <span className="max-xl:hidden">•</span> 3 Delivery Truck
            </p>
          </div>
        </div>
      </div>
      <FormikErrorBox
        formik={formik}
        field="team_configuration"
        className="w-full md:w-3/6"
      />

      <div className="mb-10 mt-10 space-y-1 lg:w-1/2">
        <Label
          htmlFor="have_parking_space"
          className="ml-0 sm:text-base lg:text-lg"
        >
          Do you have a parking space
        </Label>
        {renderOptions("have_parking_space")}
        <FormikErrorBox formik={formik} field="have_parking_space" />
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
        />
      </div>

      <div className="mb-10 space-y-1 lg:w-1/2">
        <Label
          htmlFor="is_included_all_charges"
          className="ml-0 sm:text-base lg:text-lg"
        >
          Service provider include all these charges in quotation?
        </Label>
        {renderOptions("is_included_all_charges")}
        <FormikErrorBox formik={formik} field="is_included_all_charges" />
      </div>

      <div className="mb-10 space-y-1 lg:w-1/2">
        <Label htmlFor="is_individual" className="ml-0 sm:text-base lg:text-lg">
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
      </div>

      <div>
        <p className="text-xl font-semibold">Note</p>
        <p className="text-lg font-medium">
          Protecting your privacy is our top priority. We share your details
          only with your chosen provider. We do not support transactions outside
          our platform. Payments are securely handled, held until both parties
          are satisfied. Respect for providers is crucial, and abuse will not be
          tolerated.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between gap-5">
        <Button
          onClick={() => setCurrentStep(2)}
          type="button"
          variant="accent"
          className="w-full sm:w-fit  sm:px-20"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            handleGoToNextStep(labels, formik, () => {
              setCurrentStep(4);
            });
          }}
          type="button"
          className="w-full sm:w-fit  sm:px-20"
        >
          Next
        </Button>
      </div>
    </Container>
  );
}
