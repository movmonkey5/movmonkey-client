"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Pencil, MessageCircleMore } from "lucide-react";
import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userPlaceHolder from "@/public/image/user-placeholder-green.png";
import ReviewList from "./components/ReviewList";
import useStore from "@/store";

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState("actives");
  const [draftJobType, setDraftJobType] = useState("removal"); // New state for job type
  const [currency, setCurrency] = useState("$"); // Default currency symbol

  // Get user from store using the hook directly
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user?.currencySymbol) {
      setCurrency(user.currencySymbol);
    }
  }, [user]);
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["me.getProfile"],
    queryFn: () => ApiKit.me.getProfile().then(({ data }) => data),
  });
  const { data: review, isLoading: reviewLoading } = useQuery({
    queryKey: ["me/jobs/tatings"],
    queryFn: () => ApiKit.me.getRatings().then(({ data }) => data.results),
  });

  console.log(review);
  const { data: activeJobs, isLoading: activeJobsLoading } = useQuery({
    queryKey: ["/me/jobs/actives"],
    queryFn: () => ApiKit.me.job.active.getJobs().then(({ data }) => data),
  });

  const { data: completedJobs, isLoading: completedJobsLoading } = useQuery({
    queryKey: ["/me/jobs/completed"],
    queryFn: () => ApiKit.me.job.completed.getJobs().then(({ data }) => data),
  });

  // Updated draftJobs query to be dynamic based on draftJobType
  const { data: draftJobs, isLoading: draftJobsLoading } = useQuery({
    queryKey: ["/me/jobs", draftJobType, "DRAFT"],
    queryFn: () =>
      ApiKit.me.job.draft.getJobs(draftJobType).then(({ data }) => data),
    enabled: activeTab === "draft", // Only fetch when draft tab is active
  });

  if (reviewLoading) {
    return <Loading className="min-h-[calc(100vh-8rem)]" />;
  }
// console.log(activeJobs,"activeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

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
    draft: (
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </div>
    ),
  };

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
    draft: {
      active: "from-amber-500 to-amber-600",
      glow: "rgba(245,158,11,0.7)",
      text: "text-amber-600",
      light: "#d97706",
      badge: "bg-amber-500"
    },
  };

  // Job type icons for different job types
  const jobTypeIcons = {
    removal: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ),
    delivery: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
      </svg>
    ),
    cleaning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
      </svg>
    )
  };

  // Helper function to determine job type from slug
  const getJobTypeFromSlug = (slug) => {
    if (!slug) return "removal"; // Default
    
    // Extract the job type from the slug (e.g., "removal-job-2025-02-28-9606466d" -> "removal")
    const slugParts = slug.split('-');
    if (slugParts.length > 0) {
      const jobType = slugParts[0].toLowerCase();
      if (jobTypeIcons[jobType]) {
        return jobType;
      }
    }
    
    return "removal"; // Default fallback
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
        {type === "Draft" && (
          <Button variant="outline" size="sm">
            <span className="mr-1">+</span> New Job
          </Button>
        )}
      </div>

      {jobs?.results?.length ? (
        <div className="space-y-2">
          {jobs.results.map((job) => {
            // Determine job type from slug
            const jobType = getJobTypeFromSlug(job.slug);
            
            return (
              <Link
                href={`/${job.status === "DRAFT" ? "review-jobs" : "created-jobs"}/${job.slug}/${job?.uid}`}
                key={job?.uid}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:bg-primary/10"
              >
                <div className="flex items-center">
                  <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full
                    ${jobType === 'removal' ? 'bg-blue-500' : 
                      jobType === 'delivery' ? 'bg-green-500' : 
                      jobType === 'cleaning' ? 'bg-amber-500' : 'bg-primary'} 
                    text-white`}>
                    {jobTypeIcons[jobType] || jobType.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{job?.title}</p>
                    <p className="text-sm text-gray-500">
                      <span className="capitalize">{jobType}</span> • {new Date(job?.updated_at).toLocaleDateString()}
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
          {type === "Draft" && (
            <Link href="/create-job">
              <Button variant="outline" size="sm">
                Create your first job
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );

  // Define available job types
  const jobTypes = ["removal", "delivery", "cleaning"]; // Add more types as needed

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 pb-8">
      <Container>
        <h4 className="text-2xl font-bold lg:text-4xl">User Profile</h4>

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
                {" "}
                Currency : <b>{currency}</b>
              </p>
              <p className="text-base text-[#0588d1] lg:text-xl">
                {profile?.job_count} {profile?.job_count !== 1 ? "Jobs" : "Job"}{" "}
                posted
              </p>
            </div>
          </div>
          <div className="flex  items-center justify-center gap-5  max-xs:mt-0  max-xs:w-full  sm:flex-row">
            <Link href="/quotation" className="block">
              <Button variant="secondary" className=" max-xs:w-full">
                <ClipboardList className="mx-2 size-5" />
                <span className="hidden md:block">Check Quotations</span>
              </Button>
            </Link>
            <Link href="/profile/edit" className="block">
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
                  { id: "actives", label: "Ongoing Jobs" },
                  { id: "completed", label: "Completed Jobs" },
                  { id: "draft", label: "Jobs in Draft" }
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
                      {tab.id === "draft" && draftJobs?.count > 0 && (
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
                  renderJobList(activeJobs, "Ongoing")
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="m-0 outline-none">
                {completedJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(completedJobs, "Completed")
                )}
              </TabsContent>
              
              <TabsContent value="draft" className="m-0 outline-none">
                {/* Job Type Selection */}
                <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-4">
                  <label htmlFor="jobType" className="font-medium text-gray-700">
                    Select Job Type:
                  </label>
                  <select
                    id="jobType"
                    value={draftJobType}
                    onChange={(e) => setDraftJobType(e.target.value)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-[#0588d1] focus:outline-none"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {draftJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(draftJobs, "Draft")
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Container>
      <Container>
        {/* Other profile information here */}
        <ReviewList reviewList={review} />
      </Container>
    </div>
  );
}
