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
export default function DriverProfilePage() {
  const [activeTab, setActiveTab] = useState("actives");
  const user = useStore((state) => state.user);
  console.log("cleaner", user);
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

  const renderJobList = (jobs, type) => (
    <>
      <p className="mb-2 text-base font-medium text-[#0588d1]">
        {jobs?.count} {type} {jobs?.count !== 1 ? "Jobs" : "Job"}
      </p>
      {jobs?.results?.length
        ? jobs.results.map((job) => (
            <Link
              href={`/${job?.status === "ACCEPTED" ? "cleaner/assigned-jobs" : "cleaner/assigned-jobs"}/${job?.kind?.toLowerCase()}/${job?.uid}`}
              key={job?.uid}
              className="mb-3 block w-fit cursor-pointer rounded-lg bg-primary px-2 font-semibold max-lg:py-2 lg:rounded-full lg:px-4 lg:py-1"
            >
              • {job?.title}
            </Link>
          ))
        : `No ${type.toLowerCase()} jobs found.`}
    </>
  );

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-6">
        <Container>
          <h3 className="px-4 text-3xl font-bold">
            Total Earned: {currency}1370
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
              <p className="text-base text-[#0588d1] lg:text-xl">
                {profile?.job_count} {profile?.job_count !== 1 ? "Jobs" : "Job"}{" "}
                Completed
              </p>
              <p>Total Rated : {rating?.count}</p>
            </div>
          </div>
          <div className="flex flex-col gap-5 max-xs:mt-0 max-xs:w-full  sm:flex-row sm:items-center">
            <Link href="/cleaner/profile/edit" className="block">
              <Button variant="secondary" className="gap-2 max-xs:w-full">
                <Pencil className="size-5" />
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
              <TabsTrigger value="favourite">Jobs in Favourite</TabsTrigger>
            </TabsList>
            <TabsContent value="actives" className="ml-2">
              {renderJobList(activeJobs, "Active")}
            </TabsContent>
            <TabsContent value="completed" className="ml-2">
              {renderJobList(completedJobs, "Completed")}
            </TabsContent>
            <TabsContent value="favourite" className="ml-2">
              {renderJobList(draftJobs, "Favourite")}
            </TabsContent>
          </Tabs>
        </div>
      </Container>
      <Container>
        {/* Other profile information here */}
        <ReviewList reviewList={rating?.results} />
      </Container>
    </div>
  );
}
