"use client";

import { format, isAfter, isToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { useState } from "react";

export default function PickDuration({ formik }) {
  const { moving_date, dropoff } = formik.values;
  const [open, setOpen] = useState(false);
  const [openDropoff, setOpenDropoff] = useState(false);

  const isDateInTheFuture = (date) => {
    const today = new Date();
    return isAfter(date, today) || isToday(date);
  };

  return (
    <div className="flex flex-col gap-4 xs:flex-row">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex flex-col gap-2 max-sm:w-full">
            <Label htmlFor="moving_date">Moving Date</Label>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "flex h-10 w-full items-center justify-start rounded-full border border-slate-300 bg-transparent px-4 py-2 text-slate-500 hover:bg-slate-50 sm:w-[280px]",
                  moving_date && "text-black",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {moving_date ? (
                  format(moving_date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(moving_date)}
              onSelect={(date) => {
                if (isDateInTheFuture(date)) {
                  formik.setFieldValue(
                    "moving_date",
                    format(date, "P").split("/").join("-"),
                  );
                  setOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormikErrorBox formik={formik} field={"moving_date"} />
      </div>
      <div>
        <Popover open={openDropoff} onOpenChange={setOpenDropoff}>
          <div className="flex flex-col gap-2 max-sm:w-full">
            <Label htmlFor="dropoff">Dropoff Date</Label>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "flex h-10 w-full items-center justify-start rounded-full border border-slate-300 bg-transparent px-4 py-2 text-slate-500 hover:bg-slate-50 sm:w-[280px]",
                  dropoff && "text-black",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dropoff ? format(dropoff, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(dropoff)}
              onSelect={(date) => {
                if (isDateInTheFuture(date)) {
                  formik.setFieldValue(
                    "dropoff",
                    format(date, "P").split("/").join("-"),
                  );
                  setOpenDropoff(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormikErrorBox formik={formik} field={"dropoff"} />
      </div>
    </div>
  );
}
