"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Pencil } from "lucide-react";
import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userPlaceHolder from "@/public/image/user-placeholder-green.png";
import { MessageCircleMore } from "lucide-react";
import ReviewList from "./components/ReviewList";
import useStore from "@/store";

export default function CleanerProfilePage() {
  const [activeTab, setActiveTab] = useState("actives");
  const user = useStore((state) => state.user);
  const [currency, setCurrency] = useState("$");

  useEffect(() => {
    if (user?.currencySymbol) {
      setCurrency(user.currencySymbol);
    }
  }, [user]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["me.getProfile"],
    queryFn: () => ApiKit.me.getProfile().then(({ data }) => data),
  });

  const { data: rating, isLoading: reviewLoading } = useQuery({
    queryKey: ["me/jobs/tatings"],
    queryFn: () => ApiKit.me.getRatings().then(({ data }) => data),
  });

  const { data: activeJobs, isLoading: activeJobsLoading } = useQuery({
    queryKey: ["/me/jobs/assigned"],
    queryFn: () => ApiKit.me.job.assigned.getJobs().then(({ data }) => data),
  });

  const { data: completedJobs, isLoading: completedJobsLoading } = useQuery({
    queryKey: ["/me/jobs/completed"],
    queryFn: () => ApiKit.me.job.completed.getJobs().then(({ data }) => data),
  });

  const { data: draftJobs, isLoading: draftJobsLoading } = useQuery({
    queryKey: ["/me/jobs/favourite"],
    queryFn: () => ApiKit.me.job.favourite.getJobs().then(({ data }) => data),
  });

  if (profileLoading) {
    return <Loading className="min-h-[calc(100vh-8rem)]" />;
  }
  
  // Define tab colors for consistent styling
  const tabColors = {
    actives: {
      active: "from-blue-500 to-blue-600",
      glow: "rgba(59,130,246,0.7)",
      text: "text-blue-600",
      light: "#1e40af",
      badge: "bg-blue-500"
    },
    completed: {
      active: "from-green-500 to-green-600",
      glow: "rgba(34,197,94,0.7)",
      text: "text-green-600",
      light: "#15803d",
      badge: "bg-green-500"
    },
    favourite: {
      active: "from-amber-500 to-amber-600",
      glow: "rgba(245,158,11,0.7)",
      text: "text-amber-600",
      light: "#d97706",
      badge: "bg-amber-500"
    },
  };

  // Custom tab icons with unique glow colors for each tab
  const tabIcons = {
    actives: (
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    completed: (
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    favourite: (
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    ),
  };

  // Job type icons for different job types
  const jobTypeIcons = {
    cleaning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
      </svg>
    ),
    // Add other job type icons if needed
  };

  // Enhanced job rendering with dynamic icons based on job type
  const renderJobList = (jobs, type) => (
    <div className="mt-2">
      <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-100 p-3">
        <p className="text-lg font-medium text-[#0588d1]">
          <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0588d1] text-white">
            {jobs?.count || 0}
          </span>
          {type} {(jobs?.count || 0) !== 1 ? "Jobs" : "Job"}
        </p>
      </div>

      {jobs?.results?.length ? (
        <div className="space-y-2">
          {jobs.results.map((job) => {
            // Extract job type from job_type field or kind field
            let jobType = "cleaning"; // Default for cleaner
            
            if (job?.job_type) {
              jobType = job.job_type.split('_')[0].toLowerCase();
            } else if (job?.kind) {
              jobType = job.kind.toLowerCase().includes("cleaning") ? "cleaning" : "cleaning";
            }
            
            // Get the appropriate job ID for the link
            const jobIdentifier = job?.job_uid || job?.uid;
            
            // Determine the correct path based on job status
            const jobPath = job?.status === "IN_PROGRESS" || job?.status === "ACCEPTED"
              ? `/cleaner/assigned-jobs/${jobType}/${jobIdentifier}`
              : `/cleaner/open-jobs/${job?.slug}?kind=${jobType}`;
            
            return (
              <Link
                href={jobPath}
                key={job?.uid || job?.id || jobIdentifier}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:bg-primary/10"
              >
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white">
                    {jobTypeIcons[jobType] || "C"}
                  </div>
                  <div>
                    <p className="font-semibold">{job?.title || job?.job_title || "Untitled Job"}</p>
                    <p className="text-sm text-gray-500">
                      <span className="capitalize">{jobType}</span> • 
                      {job?.job_uid ? ` ID: ${job.job_uid.substring(0, 8)}...` : 
                       job?.slug ? ` ID: ${job.slug.substring(0, 10)}...` : " No ID"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                  {job.status}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="mb-2 text-gray-500">No {type.toLowerCase()} jobs found</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 pb-8">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-6">
        <Container>
          <h3 className="px-4 text-3xl font-bold">
            Total Earned: {currency}
          </h3>
        </Container>
      </div>
      
      <Container>
        <h4 className="text-2xl font-bold lg:text-4xl">Cleaner Profile</h4>

        <div className="mt-5 flex gap-5 max-xs:flex-col xs:items-center xs:justify-between">
          <div className="flex items-center gap-5">
            <div className="size-16 lg:size-24">
              <Image
                src={profile?.avatar?.at350x350 || userPlaceHolder}
                width={350}
                height={350}
                className="size-16 rounded-full border-2 border-secondary lg:size-24"
                alt="user avatar"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold lg:text-2xl">
                {profile?.full_name}
              </h4>
              <p className="text-base lg:text-xl">{profile?.email}</p>
              <p className="text-base lg:text-xl">
                Currency : <b>{currency}</b>
              </p>
              <p className="text-base text-[#0588d1] lg:text-xl">
                {profile?.job_count} {profile?.job_count !== 1 ? "Jobs" : "Job"}{" "}
                Completed
              </p>
              <p>Total Rated : {rating?.count || 0}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 max-xs:mt-0 max-xs:w-full sm:flex-row">
            <Link href="/cleaner/profile/edit" className="block">
              <Button variant="secondary" className="gap-2 max-xs:w-full">
                <Pencil className="size-5" />
                <span className="hidden md:block"> Edit Profile</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center sm:block">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            value={activeTab}
            className="w-full"
          >
            {/* Tabs with reduced width */}
            <div className="mb-6 mx-auto max-w-3xl">              
              <TabsList className="flex h-auto w-full gap-2 bg-transparent p-0">
                {[
                  { id: "actives", label: "Active Jobs" },
                  { id: "completed", label: "Completed Jobs" },
                  { id: "favourite", label: "Jobs in Favourite" }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`
                      group relative flex-1 rounded-xl border border-gray-200/80 py-2.5 px-1.5
                      transition-all duration-300 ease-out
                      ${activeTab === tab.id 
                        ? `bg-gradient-to-br ${tabColors[tab.id].active} text-white` 
                        : 'bg-white hover:border-gray-300'}
                    `}
                    style={{
                      boxShadow: activeTab === tab.id 
                        ? `0 8px 20px -6px ${tabColors[tab.id].glow}` 
                        : '0 2px 6px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {tabIcons[tab.id]}
                      {/* Explicitly setting text color to white when active */}
                      <span className={`font-medium text-sm ${activeTab === tab.id ? 'text-white' : tabColors[tab.id].text}`}>
                        {tab.label}
                      </span>
                      
                      {tab.id === "actives" && activeJobs?.count > 0 && (
                        <span className={`ml-2 flex h-6 min-w-6 items-center justify-center rounded-full 
                          ${activeTab === tab.id ? 'bg-white text-blue-600' : tabColors[tab.id].badge + ' text-white'}
                          px-2 text-xs font-bold shadow-md transition-all`}>
                          {activeJobs.count}
                        </span>
                      )}
                      {tab.id === "completed" && completedJobs?.count > 0 && (
                        <span className={`ml-2 flex h-6 min-w-6 items-center justify-center rounded-full 
                          ${activeTab === tab.id ? 'bg-white text-green-600' : tabColors[tab.id].badge + ' text-white'}
                          px-2 text-xs font-bold shadow-md transition-all`}>
                          {completedJobs.count}
                        </span>
                      )}
                      {tab.id === "favourite" && draftJobs?.count > 0 && (
                        <span className={`ml-2 flex h-6 min-w-6 items-center justify-center rounded-full 
                          ${activeTab === tab.id ? 'bg-white text-amber-600' : tabColors[tab.id].badge + ' text-white'}
                          px-2 text-xs font-bold shadow-md transition-all`}>
                          {draftJobs.count}
                        </span>
                      )}
                    </div>
                    
                    {/* Animated glow effect when active */}
                    {activeTab === tab.id && (
                      <>
                        <div className="absolute inset-0 -z-10 animate-pulse rounded-xl opacity-30" 
                             style={{backgroundColor: tabColors[tab.id].light, 
                                    boxShadow: `0 0 25px 3px ${tabColors[tab.id].glow}`}}>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-white opacity-20"></div>
                      </>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
              <TabsContent value="actives" className="m-0 outline-none">
                {activeJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(activeJobs, "Active")
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="m-0 outline-none">
                {completedJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(completedJobs, "Completed")
                )}
              </TabsContent>
              
              <TabsContent value="favourite" className="m-0 outline-none">
                {draftJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(draftJobs, "Favourite")
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Container>

      <Container>
        {/* Review list from existing code */}
        <ReviewList reviewList={rating?.results} />
      </Container>
    </div>
  );
}
