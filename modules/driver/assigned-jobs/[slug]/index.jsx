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
  
  // Log params to check if they're being passed correctly
  console.log("Component Params:", params);
  console.log("Extracted slugs:", params?.slugs);
  
  const uid = params?.slugs?.[1];
  const kind = params?.slugs?.[0]?.toUpperCase();
  
  // Log uid and kind
  console.log("Job UID:", uid);
  console.log("Job Kind:", kind);

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["jobDetails", uid, kind],
    queryFn: async () => {
      try {
        console.log("Making API call with UID:", uid, "Kind:", kind);
        const response = await ApiKit.me.job.assigned.getJobDetails(uid, kind);
        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },
    enabled: Boolean(uid && kind),
  });

  // Remove the separate userDetails query since it's now included in job data

  // Log job data
  console.log("Job Data:", job);

  const quotationId = job?.quotation?.uid;
  console.log("Quotation ID:", quotationId);

  const { data: files } = useQuery({
    queryKey: ["delivery-job-files", uid, kind],
    queryFn: async () => {
      try {
        console.log("Fetching files for job:", uid, kind);
        const response = await ApiKit.me.job.assigned.getFiles(uid, kind);
        console.log("Files Response:", response);
        return response.data.results;
      } catch (error) {
        console.error("Files Error:", error);
        throw error;
      }
    },
    enabled: Boolean(uid && kind),
  });

  // Log files data
  console.log("Files Data:", files);

  let videos = [];
  let photos = [];

  if (files?.length) {
    videos = files.filter((file) => file?.kind === "VIDEO");
    photos = files.filter((file) => file?.kind === "IMAGE");
    console.log("Filtered Videos:", videos);
    console.log("Filtered Photos:", photos);
  }

  const isLoading = jobLoading;
  console.log("Loading State:", { jobLoading, isLoading });

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  // Add more detailed error handling
  if (!job) {
    console.log("No job data available:", { uid, kind, job });
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">No job details found</h2>
        <p className="text-gray-600 mt-2">Job ID: {uid}</p>
        <p className="text-gray-600">Kind: {kind}</p>
        <Link href="/driver/assigned-jobs">
          <Button className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
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
        <MapWrapper jobUid={uid} kind={kind} />

        {/* User Information Section */}
        <div className="mb-8 rounded-lg bg-gray-100 p-4">
          <h2 className="text-2xl font-semibold">Job from User</h2>
          {job?.customer_details ? (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h5 className="text-xl font-medium">{job.customer_details.full_name}</h5>
                <p>Email: {job.customer_details.email}</p>
                <p>Phone: {job.customer_details.phone || 'Not provided'}</p>
              </div>
              <div>
                <Link
                  href={`/driver/message?name=${job.customer_details.full_name?.split(" ").join("-")}`}
                >
                  <Button size="lg" className="w-full md:w-8/12">
                    Chat
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mt-2">Customer details not available</p>
            </div>
          )}
        </div>

        {/* Job Details Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">{job?.title || 'Untitled Job'}</h3>
          <p className="text-lg font-bold">Job ID: {job?.slug || 'N/A'}</p>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Execution Date: {job?.moving_date ? format(new Date(job.moving_date), "PPP") : 'Not set'}
          </h2>

          <div>
            <div className=" my-5 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
                Moving From
              </div>
              <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
                {job?.distance?.moving_from || 'Not specified'}
              </div>
            </div>
            <div className="flex flex-col gap-1  md:flex-row md:items-center md:justify-between">
              <div className="text-base capitalize md:w-2/4 md:text-xl md:font-semibold">
                Moving To
              </div>
              <div className="text-base font-semibold capitalize md:w-2/4 md:text-xl">
                {job?.distance?.moving_to || 'Not specified'}
              </div>
            </div>
            <h2 className="mt-4 text-lg font-bold md:text-2xl">
              Job Description:
            </h2>
            <p className="text-sm md:text-lg">
              {job?.item_description || "No description provided"}
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
