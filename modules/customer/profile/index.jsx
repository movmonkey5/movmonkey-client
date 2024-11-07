"use client";

import { useState } from "react";
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

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState("actives");
  const [draftJobType, setDraftJobType] = useState("removal"); // New state for job type

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["me.getProfile"],
    queryFn: () => ApiKit.me.getProfile().then(({ data }) => data),
  });

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

  if (profileLoading) {
    return <Loading className="min-h-[calc(100vh-8rem)]" />;
  }

  const renderJobList = (jobs, type) => (
    <>
      <p className="mb-2 text-base font-medium text-[#0588d1]">
        {jobs?.count} {type} {jobs?.count !== 1 ? "Jobs" : "Job"}
      </p>
      {jobs?.results?.length
        ? jobs.results.map((job) => (
            <Link
              href={`/${job.status === "DRAFT" ? "review-jobs" : "created-jobs"}/${job.slug}/${job?.uid}`}
              key={job?.uid}
              className="mb-3 block w-fit cursor-pointer rounded-lg bg-primary px-2 font-semibold max-lg:py-2 lg:rounded-full lg:px-4 lg:py-1"
            >
              • {job?.title}
            </Link>
          ))
        : `No ${type.toLowerCase()} jobs found.`}
    </>
  );

  // Define available job types
  const jobTypes = ["removal", "delivery", "cleaning"]; // Add more types as needed

  return (
    <div className="min-h-[calc(100vh-80px)]">
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

        <div className="mt-5 flex flex-col items-center justify-center sm:block">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList>
              <TabsTrigger value="actives">Active Jobs</TabsTrigger>
              <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
              <TabsTrigger value="draft">Jobs in Draft</TabsTrigger>
            </TabsList>
            <TabsContent value="actives" className="ml-2">
              {activeJobsLoading ? (
                <Loading />
              ) : (
                renderJobList(activeJobs, "Active")
              )}
            </TabsContent>
            <TabsContent value="completed" className="ml-2">
              {completedJobsLoading ? (
                <Loading />
              ) : (
                renderJobList(completedJobs, "Completed")
              )}
            </TabsContent>
            <TabsContent value="draft" className="ml-2">
              {/* Job Type Selection */}
              <div className="mb-4">
                <label htmlFor="jobType" className="mr-2 font-medium">
                  Select Job Type:
                </label>
                <select
                  id="jobType"
                  value={draftJobType}
                  onChange={(e) => setDraftJobType(e.target.value)}
                  className="my-2 rounded-xl border  border-black px-2 text-black"
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
          </Tabs>
        </div>
      </Container>
    </div>
  );
}
