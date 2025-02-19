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
import CleanerJobOverview from "./components/CleaningOverview";

export default function CleanerAssignedJobDetailsPage({ params }) {
  const [view, setView] = useState("overview");
  
  // Extract parameters first
  const uid = params?.slugs?.[1];
  const kind = params?.slugs?.[0]?.toUpperCase();
  
  console.log('Route params:', { uid, kind, params });

  // First query to get job details
  const {
    data: job,
    isLoading: jobLoading,
    error
  } = useQuery({
    queryKey: ["jobDetails", uid, kind],
    queryFn: async () => {
      if (!uid || !kind) throw new Error("Missing job parameters");
      
      try {
        const response = await ApiKit.me.job.assigned.getJobDetails(uid, kind);
        console.log('Job details response:', response);
        return response.data;
      } catch (error) {
        console.error('Job fetch error:', error);
        throw error;
      }
    },
    enabled: Boolean(uid && kind)
  });

  // Get quotation ID from job data
  const quotationId = job?.quotation?.uid;
  console.log('Quotation ID:', quotationId);

  // Then query for user details using quotation ID
  const { data: userDetails, isLoading: driverLoading } = useQuery({
    queryKey: ["userDetails", quotationId],
    queryFn: () =>
      quotationId && ApiKit.me.quotations.user
        .getUserDetails(quotationId)
        .then(({ data }) => data),
    enabled: Boolean(quotationId)
  });

  const { data: files } = useQuery({
    queryKey: ["cleaning-job-files"],
    queryFn: () =>
      ApiKit.public.job.cleaning
        .getFiles(job.slug)
        .then(({ data }) => data?.results),
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

  // Show loading state
  if (jobLoading) return <Loading className="h-screen" />;

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          {error.message || "Failed to load job details"}
        </h2>
        <Link href="/cleaner/assigned-jobs">
          <Button className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  // Show not found state
  if (!job) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <Link href="/cleaner/assigned-jobs">
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
                  href={`/cleaner/message?name=${userDetails?.full_name?.split(" ").join("-")} `}
                >
                  <Button size="lg" className=" w-full md:w-8/12">
                    Chat
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
          <h3 className="text-2xl font-semibold">
            {job?.title || 'Untitled Job'}
          </h3>
          <p className="text-lg font-bold">
            Job ID: {job?.slug || 'N/A'}
          </p>

          <h2 className="w-fit bg-primary p-2 text-lg font-bold md:text-2xl">
            Execution Date: {
              job?.moving_date 
                ? format(new Date(job.moving_date), "PPP") 
                : 'Not set'
            }
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
          {view === "overview" && <CleanerJobOverview job={job} />}
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
