"use client";

import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";
import InfoIcon from "@/components/icon/InfoIcon";
import VideoIcon from "@/components/icon/VideoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";

export default function DriverAssignedJobDetailsPage({ params }) {
  console.log("Job", params);

  const uid = params.slugs[1];
  //   const searchParams = useSearchParams();
  //   const fromNotification = searchParams.get("from") === "notifications";

  // Fetch job details based on notification or directly from quotation
  const {
    data: job,
    isLoading: jobLoading,
    error: jobError,
  } = useQuery({
    queryKey: ["jobDetails", uid],
    queryFn: () =>
      ApiKit.me.job.assigned.getJobDeatails(uid).then(({ data }) => data),
  });

  const isLoading = jobLoading;
  const error = jobError;

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  if (error) {
    return <div>Error loading details: {error.message}</div>;
  }

  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <div className="my-8  flex flex-col justify-between bg-[#366935] p-6  md:px-40">
        <h1 className="mb-8 text-3xl font-semibold text-white">
          Your Job is Active now{" "}
        </h1>
        <div className="flex w-1/2 gap-8">
          <Button size="lg" className="w-1/2">
            Mark as Completed
          </Button>
        </div>
      </div>

      <Container>
        <div className="my-4 flex flex-col ">
          <h1 className="text-3xl font-semibold">Job from user</h1>
          <h5 className="text-xl font-medium"> Name : XXXXXXX</h5>
          <p>XXXXXXX@gmail.com</p>
          <p>XXXXXX</p>
          <p>+44 XXXX XXXXX</p>
        </div>
        <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-2">
          <h3 className="px-4 py-6 text-2xl">{job.title}</h3>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold md:text-2xl">Job ID: {job?.slug}</h2>
          <h2 className="text-lg font-bold md:text-2xl"></h2>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Required Miles : {job?.distance.total_distance} Miles
          </h2>
          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Job Execution Date: {format(job?.moving_date, "PPP")}
          </h2>

          <div>
            <div className=" my-5 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
                Moving From
              </div>
              <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
                {job?.distance.moving_from}
              </div>
            </div>
            <div className="flex flex-col gap-1  md:flex-row md:items-center md:justify-between">
              <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
                Moving To
              </div>
              <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
                {job?.distance.moving_to}
              </div>
            </div>

            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Description of the job:
            </h2>
            <p className="text-sm md:text-lg">
              {job?.description || "No description provided"}
            </p>
          </div>
        </div>
        <Button size="lg" className=" my-8">
          Back
        </Button>
      </Container>
    </div>
  );
}
