"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import JobList from "./components/JobList";
import JobFilters from "./components/JobFilters";
import { Input } from "@/components/ui/input";
import { sanitizeParams } from "@/lib/utils";
import Loading from "@/components/shared/Loading";
import { Label } from "@/components/ui/label";
import Pagination from "@/components/shared/Pagination";

const kindOptions = [
  { label: "All", value: "", count: 0 },
  { label: "Delivery", value: "DELIVERY_JOB", count: 0 },
  { label: "Removal", value: "REMOVAL_JOB", count: 0 },
  { label: "Cleaning", value: "CLEANING_JOB", count: 0 },
];

export default function QuotedJobs() {
  const [jobKind, setJobKind] = useState("");
  const [params, setParams] = useState({ search: "", page: 1 });

  const {
    data: jobs,
    isLoading: isJobsLoading,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ["me/quotations", jobKind, params],
    queryFn: () =>
      ApiKit.me.getQuotation(sanitizeParams(params)).then(({ data }) => data),
  });

  useEffect(() => {
    refetchJobs();
  }, [jobKind, params, refetchJobs]); 

  useEffect(() => {
    setParams({
      page: 1,
      search: "",
    });
  }, [jobKind]);

  if (isJobsLoading) {
    return <Loading className="h-screen" />;
  }

  const filteredJobs = jobs?.results.filter((job) =>
    jobKind ? job.kind === jobKind : true,
  );

  kindOptions[0].count = jobs?.count || 0;
  kindOptions[1].count =
    jobs?.results.filter((job) => job.kind === "DELIVERY_JOB").length || 0;
  kindOptions[2].count =
    jobs?.results.filter((job) => job.kind === "REMOVAL_JOB").length || 0;
  kindOptions[3].count =
    jobs?.results.filter((job) => job.kind === "CLEANING_JOB").length || 0;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-black/10 lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>View Quotations</h3>
        </div>
      </div>

      <Container className="mt-10">
        <JobFilters
          kindOptions={kindOptions}
          jobKind={jobKind}
          setJobKind={setJobKind}
        />
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

        {filteredJobs?.length > 0 ? (
          <>
            <JobList jobs={filteredJobs} />
            <Pagination
              params={params}
              setParams={setParams}
              totalCount={filteredJobs.length}
            />
          </>
        ) : (
          <p>No available jobs...</p>
        )}
      </Container>
    </div>
  );
}
