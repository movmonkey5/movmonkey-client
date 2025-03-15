"use client";

import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Overview from "./components/Overview";
import Video from "./components/Video";
import Photos from "./components/Photos";
import DeliveryOverview from "./components/delivery/Overview";
import DeliveryVideo from "./components/delivery/Video";
import DeliveryPhotos from "./components/delivery/Photos";
import InfoIcon from "@/components/icon/InfoIcon";
import VideoIcon from "@/components/icon/VideoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";

const fetchJob = (kind, slug) => {
  let callToApi;
  if (kind === "delivery") {
    callToApi = ApiKit.public.job.delivery.getJob(slug);
  } else {
    callToApi = ApiKit.public.job.removal.getJob(slug);
  }
  return callToApi;
};
const fetchFiles = (kind, slug) => {
  let callToApi;
  if (kind === "delivery") {
    callToApi = ApiKit.public.job.delivery.getFiles(slug);
  } else {
    callToApi = ApiKit.public.job.removal.getFiles(slug);
  }
  return callToApi;
};

export default function DriverOpenJobDetailsPage({ params }) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind");
  const [view, setView] = useState("overview");

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", kind],
    queryFn: () => fetchJob(kind, slug).then(({ data }) => data),
  });

  const { data: files, isLoading: isFilesLoading } = useQuery({
    queryKey: ["job", "files", slug, kind],
    queryFn: () => fetchFiles(kind, slug).then(({ data }) => data?.results),
  });

  if (isLoading || isFilesLoading) {
    return <Loading className="h-screen" />;
  }

  let videos;
  let photos;

  if (files?.length) {
    videos = files.filter((file) => file?.kind === "VIDEO");
    photos = files.filter((file) => file?.kind === "IMAGE");
  }
  console.log(job,"adnan job");
  const isCompleted = job?.status === "COMPLETED";
  
  // Function to safely format date or return a fallback message
  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    
    try {
      // Try to parse the date if it's a string
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      
      // Check if the date is valid
      if (!isValid(date)) return "Invalid date";
      
      // If valid, format the date
      return format(date, "PPP");
    } catch (error) {
      return "Invalid date format";
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-4 md:h-20">
          <Link href="/driver/open-jobs">
            <Button size="icon" variant="ghost">
              <CircleChevronLeft size={24} />
            </Button>
          </Link>
          <h3>{job?.title}</h3>
          {isCompleted && (
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-1.5 text-black shadow-md animate-fadeIn">
              <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-sm font-medium">Job Successfully Completed</span>
            </div>
          )}
        </div>
      </div>

      <Container>
        <div className="space-y-3">
          <h2 className="text-lg font-bold md:text-2xl">Job ID: {job?.slug}</h2>
          <h2 className="text-lg font-bold md:text-2xl">
            Job Kind: {kind === "delivery" ? "Delivery Job" : "Removal Job"}
          </h2>
          <h2 className="text-lg font-bold md:text-2xl">
            {kind === "delivery" ? (
              <>Delivery Category: {job?.category?.[0]?.title || "N/A"}</>
            ) : (
              <>Removal Category: {job?.category?.title || "N/A"}</>
            )}
          </h2>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Required Miles : {job?.distance.total_distance} Miles
          </h2>
          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Job Execution Date: {formatDate(job?.moving_date)}
          </h2>

          {/* Show addresses if quotation is accepted OR job is completed */}
          {(job?.quotation?.status === "ACCEPTED" || isCompleted) ? (
            <div>
              <div className="my-5 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
                  Moving From
                </div>
                <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
                  {job?.distance?.moving_from || "N/A"}
                </div>
              </div>
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
                  Moving To
                </div>
                <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
                  {job?.distance?.moving_to || "N/A"}
                </div>
              </div>
            </div>
          ) : (
            <div className="my-5 p-4 bg-yellow-50 border border-secondary/20 rounded-lg">
              <p className="text-secondary font-medium flex items-center gap-2">
                <InfoIcon className="h-5 w-5 fill-secondary" />
                The exact pickup and delivery addresses will be visible after your quotation is accepted
              </p>
            </div>
          )}

          <h2 className="mt-4 text-lg font-bold md:text-2xl">
            Description of the job:
          </h2>
          <p className="text-sm md:text-lg">
            {job?.description || "No description provided"}
          </p>
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
              },
            )}
          >
            <InfoIcon
              className={`h-6 w-6 ${
                view === "overview" ? "fill-white" : "fill-secondary"
              }`}
            />
            Information
          </div>
          
          {!isCompleted && (
            <>
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
                  },
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
                  },
                )}
              >
                <VideoIcon
                  className={`h-6 w-6 ${
                    view === "videos" ? "fill-white" : "fill-secondary"
                  }`}
                />
                Videos
              </div>
            </>
          )}
        </div>

        <div className="mt-5">
          {kind === "delivery" && view === "overview" && (
            <DeliveryOverview job={job} />
          )}
          {kind === "delivery" && view === "videos" && !isCompleted && (
            <DeliveryVideo videos={videos} />
          )}
          {kind === "delivery" && view === "photos" && !isCompleted && (
            <DeliveryPhotos photos={photos} />
          )}
        </div>

        <div className="mt-5">
          {kind === "removal" && view === "overview" && <Overview job={job} />}
          {kind === "removal" && view === "videos" && !isCompleted && (
            <Video videos={videos} />
          )}
          {kind === "removal" && view === "photos" && !isCompleted && (
            <Photos photos={photos} />
          )}
        </div>
        {isCompleted && (
            <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-black shadow-lg animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h3 className="text-lg font-bold">Job Successfully Completed!</h3>
                <p className="text-sm">Well done! All tasks for this job have been completed successfully.</p>
              </div>
            </div>
          )}
      </Container>
      
    </div>
  );
}
