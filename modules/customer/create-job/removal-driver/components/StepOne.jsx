import Image from "next/image";

import { cn, handleGoToNextStep } from "@/lib/utils";
import useRemoveValidationOnMount from "@/lib/hooks/useRemoveValidationOnMount";
import useScrollToTop from "@/lib/hooks/useScrollToTop";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import FormikErrorBox from "@/components/form/FormikErrorBox";

const labels = ["category_slug", "bed_room_count", "floor_level", "have_lift"];

export default function StepOne({ formik, setCurrentStep, categories }) {
  useScrollToTop();
  useRemoveValidationOnMount(labels, formik);

  return (
    <Container>
      <div className="  h-4 rounded-lg bg-[#D9D9D9]">
        {
          <div
            className="h-full rounded-lg bg-secondary"
            style={{
              width: `${(1 / 4) * 100}%`,
            }}
          ></div>
        }
      </div>

      <div>
        <p className="mb-5 mt-10 text-xl font-semibold ">
          What type of property are you moving?
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-8">
          {categories.map((category) => (
            <div
              key={category.slug}
              onClick={() =>
                formik.setFieldValue("category_slug", category.slug)
              }
              className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center`}
            >
              <Image
                src={category?.image}
                width={100}
                height={100}
                alt={category?.title}
                quality={100}
                className={cn(
                  "rounded-full",
                  formik.values.category_slug === category.slug
                    ? "border-4 border-secondary"
                    : "border-4 border-transparent",
                )}
              />
              <p
                className={`${formik.values.category_slug === category.slug ? "text-secondary" : "text-black"} mb-4 mt-2 text-center font-semibold`}
              >
                {category?.title}
              </p>
            </div>
          ))}
        </div>
        <FormikErrorBox
          formik={formik}
          field="category_slug"
          className="w-full md:w-2/5"
        />
      </div>

      <div>
        <p className="mb-5 mt-10 text-xl font-semibold ">
          How many bedrooms are there?
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 lg:gap-8">
          <div
            onClick={() => formik.setFieldValue("bed_room_count", 1)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.bed_room_count === 1 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            1
          </div>
          <div
            onClick={() => formik.setFieldValue("bed_room_count", 2)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.bed_room_count === 2 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            2
          </div>
          <div
            onClick={() => formik.setFieldValue("bed_room_count", 3)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.bed_room_count === 3 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            3
          </div>
          <div
            onClick={() => formik.setFieldValue("bed_room_count", 4)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.bed_room_count === 4 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            4
          </div>
          <div
            onClick={() => formik.setFieldValue("bed_room_count", 5)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.bed_room_count === 5 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            5+
          </div>
        </div>

        <FormikErrorBox
          formik={formik}
          field="bed_room_count"
          className="w-full md:w-2/5"
        />
      </div>

      <div>
        <p className="mb-5 mt-10 text-xl font-semibold ">
          What is the floor level of your apartment/flat?
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 lg:gap-8">
          <div
            onClick={() => formik.setFieldValue("floor_level", 1)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.floor_level === 1 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            1
          </div>
          <div
            onClick={() => formik.setFieldValue("floor_level", 2)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.floor_level === 2 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            2
          </div>
          <div
            onClick={() => formik.setFieldValue("floor_level", 3)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.floor_level === 3 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            3
          </div>
          <div
            onClick={() => formik.setFieldValue("floor_level", 4)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.floor_level === 4 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            4
          </div>
          <div
            onClick={() => formik.setFieldValue("floor_level", 5)}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 text-lg font-bold ${formik.values.floor_level === 5 ? "border-secondary bg-secondary/10 hover:bg-secondary/10" : "hover:hover:bg-slate-50"}`}
          >
            5+
          </div>
        </div>

        <FormikErrorBox
          formik={formik}
          field="floor_level"
          className="w-full md:w-2/5"
        />
      </div>

      <div>
        <p className="mb-5 mt-10 text-xl font-semibold ">
          Is there a lift in your apartment/flat block?
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 lg:gap-8">
          <div
            onClick={() => formik.setFieldValue("have_lift", true)}
            className={`w-fit cursor-pointer border-4 ${formik.values.have_lift === true && "border-secondary"}`}
          >
            <Image src="/icon/Lift.svg" width={80} height={80} alt="lift" />
          </div>
          <div
            onClick={() => formik.setFieldValue("have_lift", false)}
            className={`w-fit cursor-pointer border-4 ${formik.values.have_lift === false && "border-secondary"}`}
          >
            <Image src="/icon/Stairs.svg" width={80} height={80} alt="lift" />
          </div>
        </div>

        <FormikErrorBox
          formik={formik}
          field="have_lift"
          className="w-full md:w-2/5"
        />
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
  );
}