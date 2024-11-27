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
import InfoIcon from "@/components/icon/InfoIcon";
import VideoIcon from "@/components/icon/VideoIcon";
import PhotosIcon from "@/components/icon/PhotosIcon";
import CleanerJobPhotos from "./components/CleanerJobPhotos";
import CleanerJobVideos from "./components/CleanerJobVideos";
import RemovalOverview from "./components/RemovalOverView";
import MapWrapper from "./components/Location";
import { useRouter } from "next/router";

export default function CleanerAssignedJobDetailsPage({ params }) {
  const [view, setView] = useState("overview");
  const uid = params.slugs[1];

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["jobDetails", uid],
    queryFn: () =>
      ApiKit.me.job.assigned.getJobDeatails(uid).then(({ data }) => data),
  });

  const { data: userDetails, isLoading: driverLoading } = useQuery({
    queryKey: ["userDetails", uid],
    queryFn: () =>
      uid &&
      ApiKit.me.quotations.user.getUserDetails(uid).then(({ data }) => data),
  });
  const { data: files } = useQuery({
    queryKey: ["delivery-job-files"],
    queryFn: () =>
      ApiKit.me.job.assigned.getFiles(uid).then(({ data }) => data.results),
  });

  let videos;
  let photos;

  if (files?.length) {
    videos = files.filter((file) => file?.kind === "VIDEO");
    photos = files.filter((file) => file?.kind === "IMAGE");
  }

  const isLoading = jobLoading || driverLoading;

  if (isLoading) {
    return <Loading className="h-screen" />;
  }
  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      {/* Job Status Section */}
      <div className="my-8 flex flex-col justify-between bg-[#366935] p-6 md:px-40">
        <h1 className="text-3xl font-semibold text-white">
          This Job is Active Now
        </h1>
      </div>

      <Container>
        <MapWrapper jobUid={uid} />

        {/* User Information Section */}
        <div className="mb-8 rounded-lg bg-gray-100 p-4">
          <h2 className="text-2xl font-semibold">Job from User</h2>
          {userDetails ? (
            <div className="mt-4 flex items-center justify-between ">
              <div>
                <h5 className="text-xl font-medium">{userDetails.full_name}</h5>
                <p>Email: {userDetails.email}</p>
                <p>Phone: {userDetails.phone}</p>
              </div>
              <div>
                <Link
                  href={`/driver/message?name=${userDetails?.full_name?.split(" ").join("-")} `}
                >
                  <Button
                    size="lg"
                    className=" w-full md:w-8/12"
                  >
                    Chat With {userDetails?.full_name}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h5 className="text-xl font-medium">Name: XXXXXXX</h5>
              <p>Email: XXXXXXX@gmail.com</p>
              <p>Phone: +44 XXXX XXXXX</p>
            </div>
          )}
        </div>

        {/* Job Details Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">{job.title}</h3>
          <p className="text-lg font-bold">Job ID: {job.slug}</p>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Execution Date: {format(job.moving_date, "PPP")}
          </h2>

          <div>
            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Job Description:
            </h2>
            <p className="text-sm md:text-lg">
              {job.item_description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Job Overview, Photos, and Videos Tabs */}
        <div className="mt-10 flex gap-4">
          <div
            onClick={() => setView("overview")}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold",
              view === "overview"
                ? "bg-secondary text-white"
                : "border-2 border-secondary text-secondary",
            )}
          >
            <InfoIcon
              className={`h-6 w-6 ${view === "overview" ? "fill-white" : "fill-secondary"}`}
            />
            Overview
          </div>
          <div
            onClick={() => setView("photos")}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold",
              view === "photos"
                ? "bg-secondary text-white"
                : "border-2 border-secondary text-secondary",
            )}
          >
            <PhotosIcon
              className={`h-6 w-6 ${view === "photos" ? "fill-white" : "fill-secondary"}`}
            />
            Photos
          </div>
          <div
            onClick={() => setView("videos")}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold",
              view === "videos"
                ? "bg-secondary text-white"
                : "border-2 border-secondary text-secondary",
            )}
          >
            <VideoIcon
              className={`h-6 w-6 ${view === "videos" ? "fill-white" : "fill-secondary"}`}
            />
            Videos
          </div>
        </div>

        {/* Conditional Rendering of Components Based on View */}
        <div className="mt-6">
          {view === "overview" && <RemovalOverview job={job} />}
          {view === "photos" && <CleanerJobPhotos photos={photos} />}
          {view === "videos" && <CleanerJobVideos videos={videos} />}
        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Link href="/cleaner/assigned-jobs">
            <Button size="lg">Back</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
