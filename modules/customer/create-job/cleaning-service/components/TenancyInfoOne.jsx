/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as Yup from 'yup';
import ApiKit from "@/common/ApiKit";
import { cn, handleGoToNextStep } from "@/lib/utils";
import useScrollToTop from "@/lib/hooks/useScrollToTop";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Container from "@/components/shared/Container";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import Loading from "@/components/shared/Loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const checkboxItems = [
  {
    label: "Cleaning all internal windows and glass",
    field: "internal_windows_and_glass_cleaning",
  },
  {
    label: "Dusting & removing cobwebs",
    field: "dusting_and_cobweb_removal",
  },
  {
    label: "Dusting & cleaning all shades, switches, and sockets",
    field: "shades_switches_sockets_cleaning",
  },
  {
    label:
      "Washing down all the paint work (doors, windows sills, skirting boards)",
    field: "paintwork_washing",
  },
  {
    label: "Deep cleaning of kitchen. including the oven, hob, and cooker hood",
    field: "kitchen_deep_cleaning",
  },
  {
    label:
      "Any white goods. If possible, pull out the white goods and clean behind",
    field: "white_goods_cleaning",
  },
  {
    label:
      "Cleaning the kitchen cupboards inside and out. Cleaning all the surfaces",
    field: "kitchen_cupboards_cleaning",
  },
  {
    label: "Deep cleaning and removing the line scale from the bathrooms",
    field: "bathroom_deep_cleaning",
  },
  {
    label: "All hard floors are vacuumed and then washed",
    field: "hard_floor_cleaning",
  },
  {
    label: "All carpeted floors are vacuumed",
    field: "carpeted_floor_cleaning",
  },
];


const labels = [
  "category_slug", 
  "room_count", 
  "bathroom_count", 
  "level_count",
  "have_parking_space",
  "is_parking_ulez_congestion_charges", 
  "is_included_all_charges",
  "is_individual",
  "is_company"
];

export default function TenancyInfoOne({
  formik,
  setCurrentStep,
  setSubStep,
  moveBack,
}) {
  useScrollToTop();

  useEffect(() => {
    formik.setFieldValue("category_slug", null);
  }, []);

  const { data: cleaningCategories, isLoading } = useQuery({
    queryKey: ["cleaning"],
    queryFn: () =>
      ApiKit.public.category.getCleaningServices().then(({ data }) => data),
  });

  if (isLoading) {
    return <Loading />;
  }

  const tenancySubCategories = cleaningCategories?.results[2].options;
  const renderOptions = (fieldName) => {
    return (
      <div className="flex items-center gap-16 pt-3">
        <div
          onClick={() => formik.setFieldValue(fieldName, true)}
          className="flex cursor-pointer items-center gap-2"
        >
          <div
            className={`h-6 w-6 rounded-full border-2 border-secondary ${
              formik.values[fieldName] === true ? "bg-secondary" : "bg-transparent"
            }`}
          ></div>
          <p className="text-sm font-semibold">Yes</p>
        </div>

        <div
          onClick={() => formik.setFieldValue(fieldName, false)}
          className="flex cursor-pointer items-center gap-2"
        >
          <div
            className={`h-6 w-6 rounded-full border-2 border-secondary ${
              formik.values[fieldName] === false ? "bg-secondary" : "bg-transparent"
            }`}
          ></div>
          <p className="text-sm font-semibold">No</p>
        </div>
      </div>
    );
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
            Please tell us about your place*
          </p>

          <div>
            <div className="mt-6 flex flex-wrap items-start gap-2 lg:gap-8">
              {tenancySubCategories?.map((category) => (
                <div
                  key={category.slug}
                  onClick={() =>
                    formik.setFieldValue("category_slug", category.slug)
                  }
                  className={`flex cursor-pointer flex-col items-center justify-start`}
                >
                  <Image
                    src={category.image}
                    width={100}
                    height={100}
                    alt={category.title}
                    quality={100}
                    className={cn(
                      "size-24 rounded-full object-cover",
                      formik.values.category_slug === category.slug
                        ? "border-4 border-secondary"
                        : "border-4 border-transparent",
                    )}
                  />
                  <p className={`mt-2 text-center font-semibold`}>
                    {category.title}
                  </p>
                </div>
              ))}
            </div>
            <FormikErrorBox
              formik={formik}
              field="category_slug"
              className={"w-full md:w-2/5"}
            />
          </div>
        </div>

        <div>
          <p className="mb-5 text-xl font-semibold">This include all below</p>

          <div className="space-y-4">
            {checkboxItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 pt-2 lg:pt-0"
              >
                <Checkbox
                  id={item.field}
                  className="size-6 rounded-sm border-2 border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-white"
                  onClick={() => {
                    formik.setFieldValue(
                      item.field,
                      !formik.values[item.field],
                    );
                  }}
                />
                <label htmlFor={item.field} className="cursor-pointer text-lg">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

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
          <Label htmlFor="level_count">HOW MANY LEVELS?</Label>
          <Input
            type="number"
            id="level_count"
            name="level_count"
            placeholder="Number of bathrooms"
            className="w-full md:w-2/5"
            value={formik.values.level_count}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FormikErrorBox
            formik={formik}
            field="level_count"
            className={"w-full md:w-2/5"}
          />
        </div>



        <div className="mb-10 space-y-1 lg:w-1/2">
          <Label
            htmlFor="have_parking_space"
            className="ml-0 sm:text-base lg:text-lg"
          >
            Do you have a parking space?
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
            Delivery provider include all these charges in quotation?
          </Label>
          {renderOptions("is_included_all_charges")}
          <FormikErrorBox formik={formik} field="is_included_all_charges" />
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
                className={`h-6 w-6 rounded-full border-2 border-secondary ${
                  formik.values.is_individual === true ? "bg-secondary" : "bg-transparent"
                }`}
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
                className={`h-6 w-6 rounded-full border-2 border-secondary ${
                  formik.values.is_individual === false ? "bg-secondary" : "bg-transparent"
                }`}
              ></div>
              <p className="text-sm font-semibold">No</p>
            </div>
          </div>
          <FormikErrorBox formik={formik} field="is_individual" />
        </div>
        <div className="mb-10 space-y-1 lg:w-1/2">
        <Label
          htmlFor="is_company"
          className="ml-0 sm:text-base lg:text-lg"
        >
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
              className={`h-6 w-6 rounded-full border-2 border-secondary ${
                formik.values.is_company === true ? "bg-secondary" : "bg-transparent"
              }`}
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
              className={`h-6 w-6 rounded-full border-2 border-secondary ${
                formik.values.is_company === false ? "bg-secondary" : "bg-transparent"
              }`}
            ></div>
            <p className="text-sm font-semibold">No</p>
          </div>
        </div>
        <FormikErrorBox formik={formik} field="is_company" />
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
            onClick={() => setCurrentStep(3)}
            type="button"
            variant="accent"
            className="w-full sm:w-fit  sm:px-20"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              handleGoToNextStep(labels, formik, () => {
                setSubStep(1);
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
