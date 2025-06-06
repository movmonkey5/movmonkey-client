import ApiKit from "@/common/ApiKit";
import InfoIcon from "@/components/icon/InfoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";
import VideoIcon from "@/components/icon/VideoIcon";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DeliveryOverview from "@/modules/driver/open-jobs/slug/components/delivery/Overview";
import DeliveryPhotos from "@/modules/driver/open-jobs/slug/components/delivery/Photos";
import DeliveryVideo from "@/modules/driver/open-jobs/slug/components/delivery/Video";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CircleChevronLeft, PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewDetails({ formik, setCurrentStep, images, videos, loading }) {
  const [view, setView] = useState("overview");
  const router = useRouter();

  const job = formik.values.job; // Accessing job details from formik

  const { data: files } = useQuery({
    queryKey: [`job`, `files`, job?.uid, `delivery`],
    queryFn: () =>
      ApiKit.me.job.delivery
        .getFiles(job?.uid)
        .then(({ data }) => data?.results),
  });

  let jobVideos = videos || [];
  let jobPhotos = images || [];

  if (files?.length) {
    jobVideos = files.filter((file) => file?.kind === "VIDEO");
    jobPhotos = files.filter((file) => file?.kind === "IMAGE");
  }

  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-4 md:h-20">
          <Link href="/created-jobs">
            <Button size="icon" variant="ghost">
              <CircleChevronLeft size={24} />
            </Button>
          </Link>
          <h3>{job?.title}</h3>
        </div>
      </div>

      <Container>
        <div className="space-y-3">
          <div className="flex gap-2 text-lg font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between md:text-2xl">
            <span>Job Id: {job?.slug}</span>
            <Button
              variant="secondary"
              className="flex gap-1 text-base"
              onClick={() => {
                router.push(`/review-jobs/edit/delivery_job/${job.uid}`);
              }}
            >
              <PencilLineIcon />
              Edit Job
            </Button>
          </div>
          <h2 className="text-lg font-bold md:text-2xl">
            Job Kind: {job?.kind || "Delivery Job"}
          </h2>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Job Execution Date: {format(new Date(job?.moving_date), "PPP")}
          </h2>

          <div>
            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Description of the job:
            </h2>
            <p className="text-sm md:text-lg">
              {job?.description || "No description provided"}
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 lg:gap-10">
          <div
            onClick={() => {
              setView("overview");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-3 rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
              {
                "bg- border-2 border-secondary bg-secondary text-white":
                  view === "overview",
                "border-2 border-secondary bg-white text-secondary":
                  view !== "overview",
              }
            )}
          >
            <InfoIcon
              className={`h-6 w-6 ${
                view === "overview" ? "fill-white" : "fill-secondary"
              }`}
            />
            Information
          </div>
          <div
            onClick={() => {
              setView("photos");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-3 rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
              {
                "bg- border-2 border-secondary bg-secondary text-white":
                  view === "photos",
                "border-2 border-secondary bg-white text-secondary":
                  view !== "photos",
              }
            )}
          >
            <PhotosIcon
              className={`h-6 w-6 ${
                view === "photos" ? "fill-white" : "fill-secondary"
              }`}
            />
            Photos
          </div>
          <div
            onClick={() => {
              setView("videos");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-3 rounded-full px-10 py-2 text-sm font-semibold max-sm:w-full sm:text-base md:text-lg",
              {
                "bg- border-2 border-secondary bg-secondary text-white":
                  view === "videos",
                "border-2 border-secondary bg-white text-secondary":
                  view !== "videos",
              }
            )}
          >
            <VideoIcon
              className={`h-6 w-6 ${
                view === "videos" ? "fill-white" : "fill-secondary"
              }`}
            />
            Videos
          </div>
        </div>

        <div className="mt-5">
          {view === "overview" && (
            <DeliveryOverview job={job} isCustomer={true} />
          )}
          {view === "videos" && <DeliveryVideo videos={jobVideos} />}
          {view === "photos" && <DeliveryPhotos photos={jobPhotos} />}
        </div>
      </Container>
    </div>
  );
}
