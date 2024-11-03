import CleaningIcon from "@/components/icon/CleaningIcon";
import DeliveryIcon from "@/components/icon/DeliveryIcon";
import RemovalIcon from "@/components/icon/RemovalIcon";
import Link from "next/link";

export default function CreateJobPage() {
  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-black/10 lg:min-h-[calc(100vh-80px)]">
      <div className="w-fit max-w-none rounded-md bg-white p-2 sm:rounded-3xl sm:p-6">
        <h3 className="text-center text-xl font-semibold sm:text-3xl">
          Create Job For
        </h3>
        <div className="mt-1 flex items-center justify-between gap-1 sm:mt-3 sm:gap-5">
          <Link
            href="/create-job/delivery-driver"
            className="group flex cursor-pointer flex-col items-center rounded-md p-3 hover:bg-secondary xs:p-4 sm:rounded-3xl sm:p-6"
          >
            <DeliveryIcon className="size-16 rounded-full bg-secondary fill-white p-4 group-hover:bg-white group-hover:fill-secondary xs:size-20 sm:size-32" />
            <p className="mt-3 text-center text-sm font-medium group-hover:text-white xs:text-base sm:mt-6 sm:text-xl">
              Delivery <br />
              Service
            </p>
          </Link>

          <Link
            href="/create-job/cleaning-service"
            className="group flex cursor-pointer flex-col items-center rounded-md p-3 hover:bg-secondary xs:p-4 sm:rounded-3xl sm:p-6"
          >
            <CleaningIcon className="size-16 rounded-full bg-secondary fill-white p-4 group-hover:bg-white group-hover:fill-secondary xs:size-20 sm:size-32" />
            <p className="mt-3 text-center text-sm font-medium group-hover:text-white xs:text-base sm:mt-6 sm:text-xl">
              Cleaning <br />
              Service
            </p>
          </Link>

          <Link
            href="/create-job/removal-driver"
            className="group flex cursor-pointer flex-col items-center rounded-md p-3 hover:bg-secondary xs:p-4 sm:rounded-3xl sm:p-6"
          >
            <RemovalIcon className="size-16 rounded-full bg-secondary fill-white p-4 group-hover:bg-white group-hover:fill-secondary xs:size-20 sm:size-32" />
            <p className="mt-3 text-center text-sm font-medium group-hover:text-white xs:text-base sm:mt-6 sm:text-xl">
              Removal <br />
              Service
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
