"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CleaningIcon from "@/components/icon/CleaningIcon";
import DeliveryIcon from "@/components/icon/DeliveryIcon";
import RemovalIcon from "@/components/icon/RemovalIcon";

export default function QuoteButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center xs:justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex flex-col items-center">
          {/* Small Button for Mobile */}
          <DialogTrigger asChild>
            <Button size="sm" className="text-lg  xs:hidden">
              Apply for a quote
            </Button>
          </DialogTrigger>

          {/* Large Button for Desktop */}
          <DialogTrigger asChild>
            <Button size="lg" className="hidden text-xl  xs:block">
              Apply For A Quote
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="w-fit max-w-none">
          <h3 className="text-center text-xl font-semibold sm:text-3xl">
            Get Quote For
          </h3>

          <div className="flex items-center justify-between gap-1 sm:mt-3 sm:gap-5">
            <Link
              href="/create-job/delivery-driver"
              className="group flex cursor-pointer flex-col items-center rounded-md p-4 hover:bg-secondary sm:rounded-3xl sm:p-6"
            >
              <DeliveryIcon className="size-16 rounded-full bg-secondary fill-white p-4 group-hover:bg-white group-hover:fill-secondary xs:size-20 sm:size-32" />
              <p className="mt-3 text-center text-sm font-medium group-hover:text-white xs:text-base sm:mt-6 sm:text-xl">
                Delivery <br />
                Service
              </p>
            </Link>

            <Link
              href="/create-job/cleaning-service"
              className="group flex cursor-pointer flex-col items-center rounded-md p-4 hover:bg-secondary sm:rounded-3xl sm:p-6"
            >
              <CleaningIcon className="size-16 rounded-full bg-secondary fill-white p-4 group-hover:bg-white group-hover:fill-secondary xs:size-20 sm:size-32" />
              <p className="mt-3 text-center text-sm font-medium group-hover:text-white xs:text-base sm:mt-6 sm:text-xl">
                Cleaning <br />
                Service
              </p>
            </Link>

            <Link
              href="/create-job/removal-driver"
              className="group flex cursor-pointer flex-col items-center rounded-md p-4 hover:bg-secondary sm:rounded-3xl sm:p-6"
            >
              <RemovalIcon className="size-16 rounded-full bg-secondary fill-white p-4 group-hover:bg-white group-hover:fill-secondary xs:size-20 sm:size-32" />
              <p className="mt-3 text-center text-sm font-medium group-hover:text-white xs:text-base sm:mt-6 sm:text-xl">
                Removal <br />
                Service
              </p>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
