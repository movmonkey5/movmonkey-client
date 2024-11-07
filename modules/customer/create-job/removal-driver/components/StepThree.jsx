"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, handleGoToNextStep } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import Container from "@/components/shared/Container";

import service_1 from "@/public/image/packing_services.png";
import service_2 from "@/public/image/packing_materials.png";
import service_3 from "@/public/image/dismantling_assembling.png";
import Image from "next/image";
import useScrollToTop from "@/lib/hooks/useScrollToTop";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { useState } from "react";

export default function StepThree({ formik, setCurrentStep }) {
  useScrollToTop();
  const [open, setOpen] = useState(false);

  const labels = [
    "moving_date",
    "extra_moving_service",
    "is_moving_everything_at_once",
    "is_driver_flexible_to_move_item_at_different_time",
    "have_animal",
  ];

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

  const toggleExtraMovingService = (service) => {
    const currentServices = formik.values.extra_moving_service
      .split(",")
      .filter((s) => s !== "");
    const updatedServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
    formik.setFieldValue("extra_moving_service", updatedServices.join(","));
  };

  return (
    <Container>
      <div className="h-4 rounded-lg bg-[#D9D9D9]">
        {
          <div
            className="h-full rounded-lg bg-secondary"
            style={{
              width: `${(3 / 4) * 100}%`,
            }}
          ></div>
        }
      </div>

      <div className="mb-10 mt-10">
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex flex-col gap-2 max-sm:w-full">
            <Label
              htmlFor="moving_date"
              className="ml-0 sm:text-base lg:text-lg"
            >
              What Your moving date
            </Label>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "flex h-10 w-full items-center justify-start rounded-full border border-slate-300 bg-transparent px-4 py-2 text-slate-500 hover:bg-slate-50 sm:w-[280px]",
                  formik.values.moving_date && "text-black",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formik.values.moving_date ? (
                  format(formik.values.moving_date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(formik.values.moving_date)}
              fromDate={new Date()}
              onSelect={(date) => {
                formik.setFieldValue(
                  "moving_date",
                  format(date, "P").split("/").join("-"),
                );
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormikErrorBox
          formik={formik}
          field="moving_date"
          className="w-full md:w-2/5"
        />
        <div
          onClick={() => {
            formik.setFieldValue(
              "is_moving_date_flexible",
              !formik.values.is_moving_date_flexible,
            );
          }}
          className="ml-1 mt-2 flex cursor-pointer items-center gap-2"
        >
          <div
            className={`h-6 w-6 rounded-full border-2 border-secondary ${formik.values.is_moving_date_flexible === true ? "bg-secondary" : "bg-transparent"}`}
          ></div>
          <p className="text-sm font-semibold">My moving date is flexible</p>
        </div>
      </div>

      <div className="mb-10">
        <Label
          htmlFor="extra_moving_service"
          className="ml-0 sm:text-base lg:text-lg"
        >
          Do you require any extra moving services?
        </Label>

        <div className="mt-4 flex flex-wrap items-center gap-5">
          <div
            className="flex cursor-pointer flex-col items-center"
            onClick={() => toggleExtraMovingService("PACKING_SERVICES")}
          >
            <Image
              src={service_1}
              alt="service_1"
              width={80}
              height={80}
              quality={100}
              className={cn(
                "rounded-full border-2 border-transparent",
                formik.values.extra_moving_service.includes(
                  "PACKING_SERVICES",
                ) && "border-secondary",
              )}
            />
            <p
              className={cn(
                "mt-2 w-28 text-center text-sm font-semibold",
                formik.values.extra_moving_service.includes(
                  "PACKING_SERVICES",
                ) && "text-secondary",
              )}
            >
              Packing Services
            </p>
          </div>
          <div
            className="flex cursor-pointer flex-col items-center"
            onClick={() => toggleExtraMovingService("PACKING_MATERIALS")}
          >
            <Image
              src={service_2}
              alt="service_2"
              width={80}
              height={80}
              quality={100}
              className={cn(
                "rounded-full border-2 border-transparent",
                formik.values.extra_moving_service.includes(
                  "PACKING_MATERIALS",
                ) && "border-secondary",
              )}
            />
            <p
              className={cn(
                "mt-2 w-28 text-center text-sm font-semibold",
                formik.values.extra_moving_service.includes(
                  "PACKING_MATERIALS",
                ) && "text-secondary",
              )}
            >
              Packing Materials
            </p>
          </div>
          <div
            className="flex cursor-pointer flex-col items-center"
            onClick={() =>
              toggleExtraMovingService("DISMANTLING_AND_REASSEMBLING")
            }
          >
            <Image
              src={service_3}
              alt="service_3"
              width={80}
              height={80}
              quality={100}
              className={cn(
                "rounded-full border-2 border-transparent",
                formik.values.extra_moving_service.includes(
                  "DISMANTLING_AND_REASSEMBLING",
                ) && "border-secondary",
              )}
            />
            <p
              className={cn(
                "mt-2 w-28 text-center text-sm font-semibold",
                formik.values.extra_moving_service.includes(
                  "DISMANTLING_AND_REASSEMBLING",
                ) && "text-secondary",
              )}
            >
              Dismantling & Reassembling
            </p>
          </div>
        </div>
        <FormikErrorBox
          formik={formik}
          field="extra_moving_service"
          className="w-full md:w-3/6"
        />
      </div>
      <div className="mb-10 space-y-1 lg:w-1/2">
        <Label
          htmlFor="is_moving_everything_at_once"
          className="ml-0 sm:text-base lg:text-lg"
        >
          Do you want to move everything at once?
        </Label>
        {renderOptions("is_moving_everything_at_once")}
        <FormikErrorBox formik={formik} field="is_moving_everything_at_once" />
      </div>

      <div className="mb-10 space-y-1 lg:w-1/2">
        <Label
          htmlFor="is_driver_flexible_to_move_item_at_different_time"
          className="ml-0 sm:text-base lg:text-lg"
        >
          Are you flexible for driver to move your items twice or three times?
        </Label>
        {renderOptions("is_driver_flexible_to_move_item_at_different_time")}
        <FormikErrorBox
          formik={formik}
          field="is_driver_flexible_to_move_item_at_different_time"
        />
      </div>

      <div className="mb-10 space-y-1 lg:w-1/2">
        <Label htmlFor="have_animal" className="ml-0 sm:text-base lg:text-lg">
          Do you have animals?
        </Label>
        {renderOptions("have_animal")}
        <FormikErrorBox formik={formik} field="have_animal" />
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
  );
}
