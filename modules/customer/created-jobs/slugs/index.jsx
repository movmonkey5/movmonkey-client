"use client";

import ApiKit from "@/common/ApiKit";
import { useQuery } from "@tanstack/react-query";
import CleaningDetails from "./components/CleaningDetails";
import RemovalDetails from "./components/RemovalDetails";
import DeliveryDetails from "./components/DeliveryDetails";
import Loading from "@/components/shared/Loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft, PencilLineIcon } from "lucide-react";
import { format } from "date-fns";
import Container from "@/components/shared/Container";

export default function UserJobDetailsPage({ params }) {
  const category = params.slugs[0].split(/[-_]/)[0];
  const uid = params.slugs[1];

  // Helper function to get the correct job type for the URL
  const getJobUrlType = (category) => {
    switch (category) {
      case "cleaning":
        return "cleaning_job";
      case "removal":
        return "removal_job";
      case "delivery":
        return "delivery_job";
      default:
        return "cleaning_job"; // fallback, though this shouldn't happen
    }
  };

  const fetchDetails = (category) => {
    let fetchToApi;
    switch (category) {
      case "cleaning":
        return (fetchToApi = ApiKit.me.job.cleaning.getJob(uid));
      case "removal":
        return (fetchToApi = ApiKit.me.job.removal.getJob(uid));
      case "delivery":
        return (fetchToApi = ApiKit.me.job.delivery.getJob(uid));
      default:
        return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: [category, uid],
    queryFn: () => fetchDetails(category).then(({ data }) => data),
  });


  if (isLoading) {
    return <Loading className="h-screen" />;
  }
  const jobID = data?.quotation?.uid;
  const jobKind = data?.quotation?.kind;
  console.log("jobKind", data?.item_description);
  const jobUrlType = getJobUrlType(category);
console.log(data,data)
  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-4 md:h-20">
          <Link href="/created-jobs" className="flex items-center">
            <Button size="icon" variant="ghost">
              <CircleChevronLeft size={24} />
            </Button>
            <h3>{data?.title}</h3>
          </Link>
          {(data?.status === "IN_PROGRESS" || data?.status === "COMPLETED") && (
            <div className="flex items-center gap-2">
              {data?.status === "COMPLETED" && (
                <p className="mx-12 text-white">This Job has Completed</p>
              )}
              {data?.status === "IN_PROGRESS" && (
                <p className="mx-12 text-white">Job is already assigned</p>
              )}
              {jobID && (
                <Link
                  href={`/quotation/${jobKind}/${jobID}`}
                  className="flex rounded-xl border p-2 text-base text-white"
                >
                  Check Details here
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <Container>
        <div className="space-y-3">
          <div className="flex gap-2 text-lg font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between md:text-2xl">
            <span>Job Id: {data?.slug}</span>
            {data?.status !== "IN_PROGRESS" && data?.status !== "COMPLETED" && (
              <Link href={`/created-jobs/edit/${jobUrlType}/${data?.uid}`}>
                <Button variant="secondary" className="flex gap-1 text-base">
                  <PencilLineIcon />
                  Edit Job
                </Button>
              </Link>
            )}
          </div>
          <h2 className="text-lg font-bold md:text-2xl">
            Job Kind: {category} job
             {/* {data?.kind?.split("_").join(" ")} */}
          </h2>
          
          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Job Execution Date:{" "}
            {data?.moving_date
              ? format(new Date(data.moving_date), "PPP")
              : "Date not available"}
          </h2>

          <div>
            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Description of the job:
            </h2>
            <p className="text-sm md:text-lg">
              {data?.item_description || "No description provided"}
            </p>
          </div>
        </div>
      </Container>

      {category === "cleaning" && <CleaningDetails job={data} />}
      {category === "removal" && <RemovalDetails job={data} />}
      {category === "delivery" && <DeliveryDetails job={data} />}
    </div>
  );
}