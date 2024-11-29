/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ApiKit from "@/common/ApiKit";
import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import TabNavigation from "@/components/shared/TabNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeParams } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "@/components/shared/Pagination";
import JobList from "./components/JobList";
import ReviewList from "../profile/components/ReviewList";

const tabs = [
  { label: "Available Jobs", value: "/cleaner/open-jobs" },
  { label: "Assigned Jobs", value: "/cleaner/assigned-jobs" },
  { label: "Jobs Completed", value: "/cleaner/completed-jobs" },
];

export default function DriverOpenJobsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [params, setParams] = useState({ search: "", page: 1 });

  const {
    data: jobs,
    isLoading: isJobsLoading,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: [`/me/jobs/completed`, params],
    queryFn: () =>
      ApiKit.me.job.completed
        .getJobs(sanitizeParams(params))
        .then(({ data }) => data),
    keepPreviousData: true,
  });
  const {
    data: review,
    isLoading: reviewLoading,
    refetch: refetchReview,
  } = useQuery({
    queryKey: ["me/jobs/tatings", params],
    queryFn: () => ApiKit.me.getRatings().then(({ data }) => data),
    keepPreviousData: true,
  });

  useEffect(() => {
    refetchJobs();
    refetchReview();
  }, [params.page]);

  if (isJobsLoading) {
    return <Loading className="h-screen" />;
  }

  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <div className=" bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>Cleaners  Job Board</h3>
        </div>
      </div>

      <Container className="mt-10">
        <div className="hidden md:block">
          <TabNavigation tabs={tabs} />
        </div>

        <div className="md:hidden">
          <SelectField
            options={tabs}
            value={tabs.find((el) => el.value === pathname)}
            onChange={(selectedOption) => {
              router.push(selectedOption.value);
            }}
          />
        </div>

        <div className="mb-8">
          <Label htmlFor="search_job" />
          <Input
            type="text"
            placeholder="Search jobs by title..."
            id="search-jobs"
            name="search-jobs"
            onChange={(event) => {
              setParams((prevParams) => ({
                ...prevParams,
                page: 1,
                search: event.target.value,
              }));
            }}
            value={params.search}
          />
        </div>

        {jobs?.count > 0 ? (
          <>
            <JobList jobs={jobs?.results} />
            <Pagination
              params={params}
              setParams={setParams}
              totalCount={jobs?.count}
            />
          </>
        ) : (
          <p>No available jobs...</p>
        )}
        <ReviewList reviewList={review?.results} />
      </Container>
    </div>
  );
}
