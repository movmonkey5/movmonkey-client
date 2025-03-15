"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";

import ApiKit from "@/common/ApiKit";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import CleanerJobOverview from "./components/CleanerJobOverview";
import CleanerJobVideos from "./components/CleanerJobVideos";
import CleanerJobPhotos from "./components/CleanerJobPhotos";
import InfoIcon from "@/components/icon/InfoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";
import VideoIcon from "@/components/icon/VideoIcon";

export default function CleanerOpenJobDetailsPage({ slug }) {
  const [view, setView] = useState("overview");

  const { data: job, isLoading } = useQuery({
    queryKey: ["cleaning-job-details"],
    queryFn: () =>
      ApiKit.public.job.cleaning.getJob(slug).then(({ data }) => data),
  });

  const { data: files } = useQuery({
    queryKey: ["cleaning-job-files"],
    queryFn: () =>
      ApiKit.public.job.cleaning
        .getFiles(slug)
        .then(({ data }) => data?.results),
  });

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  let videos;
  let photos;

  if (files?.length) {
    videos = files.filter((file) => file?.kind === "VIDEO");
    photos = files.filter((file) => file?.kind === "IMAGE");
  }
  const isCompleted = job?.status === "COMPLETED";
console.log(job,' ooooooooooooooooooooooooooooooooooooooo');
  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-4 md:h-20">
          <Link href="/cleaner/open-jobs">
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
          <h2 className="text-lg font-bold md:text-2xl">Job Id: {job?.slug}</h2>
          <h2 className="text-lg font-bold md:text-2xl">
            Job Kind: Cleaning Job
          </h2>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Job Execution Date: {format(job?.moving_date, "PPP")}
          </h2>

          <div>
            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Description of the job:
            </h2>
            <p className="text-sm md:text-lg">
              {job?.item_description || "No description provided"}
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
          {view === "overview" && <CleanerJobOverview job={job} />}
          {view === "videos" && <CleanerJobVideos videos={videos} />}
          {view === "photos" && <CleanerJobPhotos photos={photos} />}
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
