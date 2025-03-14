"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

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
import Loader from "lucide-react";

const MapComponent = dynamic(() => import('./components/Location'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] bg-gray-50 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-600 mt-2">Loading map...</p>
      </div>
    </div>
  )
});

export default function CleanerAssignedJobDetailsPage({ params }) {
  const router = useRouter();
  const [view, setView] = useState("overview");
  

  
  const uid = params?.slugs?.[1];
  const kind = params?.slugs?.[0]?.toUpperCase();
  


  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["jobDetails", uid, kind],
    queryFn: async () => {
      try {
        console.log("Making API call with UID:", uid, "Kind:", kind);
        const response = await ApiKit.me.job.assigned.getJobDetails(uid, kind);
       
        return response.data;
      } catch (error) {
        
        throw error;
      }
    },
    enabled: Boolean(uid && kind),
  });

  // Remove the separate userDetails query since it's now included in job data

  // Log job data
  

  const quotationId = job?.quotation?.uid;
  console.log("Quotation ID:", quotationId);

  const { data: files, error: filesError } = useQuery({
    queryKey: ["delivery-job-files", uid, kind],
    queryFn: async () => {
      try {
        console.log("Fetching files for job:", uid, kind);
        const response = await ApiKit.me.job.assigned.getFiles(uid, kind);
        console.log("Files Response:", response);
        return response.data.results;
      } catch (error) {
        console.error("Files Error:", error);
        // Return empty array instead of throwing
        return [];
      }
    },
    enabled: Boolean(uid && kind),
  });

  // Log files data
  console.log("Job Datassssssssssssssssssssssssssssssssssssssssssssssssss:",job );

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

  const handleGoBack = () => {
    try {
      if (window.history.length > 2) {
        router.back();
      } else {
        // Fallback to a specific route if there's no history
        router.push('/driver/assigned-jobs');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback using window.history
      window.history.back();
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      {/* Job Status Section */}
      <div className="my-8 flex flex-col justify-between bg-[#366935] p-6 md:px-40">
        <h1 className="text-3xl font-semibold text-white">
          This Job is Active Now
        </h1>
      </div>

      <Container>
        {job?.distance && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Route Information</h2>
            <Suspense fallback={
              <div className="min-h-[400px] bg-gray-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-gray-600 mt-2">Loading map component...</p>
                </div>
              </div>
            }>
              <MapWrapper jobUid={uid} kind={kind} job={job} />
            </Suspense>
          </div>
        )}
        
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
          <Button 
            size="lg" 
            onClick={handleGoBack}
            className="hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <CircleChevronLeft className="w-5 h-5" />
            Back
          </Button>
        </div>
      </Container>
    </div>
  );
}
