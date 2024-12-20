import useScrollToTop from "@/lib/hooks/useScrollToTop";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import CleanerPackages from "./CleanerPackages";
import DayAndTimePreference from "./DayAndTimePreference";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn, handleGoToNextStep } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import MultipleDaysPreference from "./MultipleDaysPreference";
import { useState } from "react";

const labels = [
  "cleaning_plan",
  "cleaning_duration",
  "preferred_day",
  "preferred_meridiem",
  "moving_date",
];

const FLEXIBLE = "FLEXIBLE";

export default function CleaningSchedule({ formik, setCurrentStep, moveBack }) {
  useScrollToTop();
  const [open, setOpen] = useState(false);

  const handleDayPreference = (data) => {
    const selectedPreferredDay = data.toUpperCase();

    // Check for duplicate item and is the selected value is flexible
    if (formik.values.preferred_day.includes(selectedPreferredDay)) {
      // Filter out duplicate item
      const updatedDays = formik.values.preferred_day.filter(
        (item) => item !== selectedPreferredDay,
      );

      formik.setFieldValue("preferred_day", updatedDays);

      return;
    }

    // Check if the selected item is flexible or flexible is already selected
    if (
      selectedPreferredDay === FLEXIBLE ||
      formik.values.preferred_day.includes(FLEXIBLE)
    ) {
      formik.setFieldValue("preferred_day", [FLEXIBLE]);

      return;
    }

    // Push new item
    formik.setFieldValue("preferred_day", [
      ...formik.values.preferred_day,
      selectedPreferredDay,
    ]);
  };

  const handleTimePreference = (data) => {
    formik.setFieldValue("preferred_meridiem", data.toUpperCase());
  };

  return (
    <div>
      <div className="flex min-h-16 items-center bg-primary text-2xl font-semibold text-black md:h-20 md:text-2xl lg:mt-10">
        <p className={`mx-auto flex w-full max-w-7xl items-center gap-2 px-5`}>
          {moveBack ? moveBack : null}
          Schedule
        </p>
      </div>

      <Container>
        <div className="flex flex-col gap-6">
          {/* Cleaner packages */}
          {formik.values.category !== "cleaning_job-end-of-tenancy" ? (
            <div>
              <h3 className="mb-4 text-xl font-bold">
                HOW OFTEN WOULD YOU LIKE A CLEANER?
              </h3>
              <CleanerPackages formik={formik} />
              <FormikErrorBox
                formik={formik}
                field="cleaning_plan"
                className={"w-full md:w-2/5"}
              />
            </div>
          ) : null}

          {/* Cleaner time range */}
          <div>
            <div className="w-full space-y-4">
              <Label
                htmlFor="cleaning_duration"
                className="ml-0 text-xl font-bold"
              >
                HOW LONG DO YOU NEED A CLEANER?(Hour)
              </Label>
              <Input
                type="number"
                id="cleaning_duration"
                name="cleaning_duration"
                placeholder="Duration in Hour"
                className="w-full md:w-2/5"
                value={formik.values.cleaning_duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormikErrorBox
                formik={formik}
                field="cleaning_duration"
                className={"w-full md:w-2/5"}
              />
            </div>
          </div>

          {/* Day preference */}
          <div>
            <h3 className="mb-4 text-xl font-bold">PREFERRED DAY</h3>
            <MultipleDaysPreference
              data={[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
                "Flexible",
              ]}
              handleClick={handleDayPreference}
              selected={formik.values.preferred_day}
            />
            <FormikErrorBox
              formik={formik}
              field="preferred_day"
              className={"w-full md:w-2/5"}
            />
          </div>

          {/* Time Preference */}
          <div>
            <h3 className="mb-4 text-xl font-bold">PREFERRED TIME(S)</h3>
            <DayAndTimePreference
              data={["AM", "PM", "Flexible"]}
              handleClick={handleTimePreference}
              selected={formik.values.preferred_meridiem}
            />
            <FormikErrorBox
              formik={formik}
              field="preferred_meridiem"
              className={"w-full md:w-2/5"}
            />
          </div>

          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <div className="flex flex-col gap-2 ">
                <Label
                  htmlFor="moving_date"
                  className="ml-0 sm:text-base lg:text-lg"
                >
                  What Your cleaning date
                </Label>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "flex h-10 w-full items-center justify-start rounded-full border border-slate-300 bg-transparent px-4 py-2 text-slate-500 hover:bg-slate-50 md:w-2/5",
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
              className={"w-full md:w-2/5"}
            />
          </div>
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
              handleGoToNextStep(
                formik.values.category === "cleaning_job-end-of-tenancy"
                  ? labels.slice(1)
                  : labels,
                formik,
                () => {
                  setCurrentStep(4);
                },
              );
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
