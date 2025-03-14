/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import JobList from "./components/JobList";
import JobFilters from "./components/JobFilters";
import { Input } from "@/components/ui/input";
import { sanitizeParams } from "@/lib/utils";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import { Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define consistent filter options - these should always be shown
const kindOptions = [
  { label: "All", value: "" },
  { label: "Delivery", value: "DELIVERY" },
  { label: "Removal", value: "REMOVAL" },
  { label: "Cleaning", value: "CLEANING" },
];

const fetchJobs = (kind, params) => {
  let callToAPI;

  switch (kind) {
    case "":
      callToAPI = ApiKit.me.job.jobList.getJobList(params);
      break;
    case "DELIVERY":
      callToAPI = ApiKit.me.job.delivery.getJobs(params);
      break;
    case "CLEANING":
      callToAPI = ApiKit.me.job.cleaning.getJobs(params);
      break;
    case "REMOVAL":
      callToAPI = ApiKit.me.job.removal.getJobs(params);
      break;
    default:
      callToAPI = ApiKit.me.job.jobList.getJobList(params);
  }

  return callToAPI;
};

export default function CreatedJobs() {
  const queryClient = useQueryClient();
  const [jobKind, setJobKind] = useState("");
  const [params, setParams] = useState({ search: "", page: 1 });
  const searchInputRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Pre-fetch job data when the component mounts
  useEffect(() => {
    // Prefetch all job types to improve overall performance
    queryClient.prefetchQuery({
      queryKey: ["me/jobs", "delivery"],
      queryFn: () => ApiKit.me.job.delivery.getJobs().then(({ data }) => data),
    });
    
    queryClient.prefetchQuery({
      queryKey: ["me/jobs", "cleaning"],
      queryFn: () => ApiKit.me.job.cleaning.getJobs().then(({ data }) => data),
    });
    
    queryClient.prefetchQuery({
      queryKey: ["me/jobs", "removal"],
      queryFn: () => ApiKit.me.job.removal.getJobs().then(({ data }) => data),
    });
  }, [queryClient]);

  const {
    data: jobs,
    isLoading,
    isFetching,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ["me/jobs", jobKind, params],
    queryFn: () => fetchJobs(jobKind, sanitizeParams(params)).then(({ data }) => data),
  });

  // For filter counts - non-blocking queries with less frequent refreshes
  const { data: deliveryJobs } = useQuery({
    queryKey: ["me/jobs", "delivery"],
    queryFn: () => ApiKit.me.job.delivery.getJobs().then(({ data }) => data),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const { data: cleaningJobs } = useQuery({
    queryKey: ["me/jobs", "cleaning"],
    queryFn: () => ApiKit.me.job.cleaning.getJobs().then(({ data }) => data),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const { data: removalJobs } = useQuery({
    queryKey: ["me/jobs", "removal"],
    queryFn: () => ApiKit.me.job.removal.getJobs().then(({ data }) => data),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setParams((prevParams) => ({
      ...prevParams,
      page: 1,
      search: value,
    }));
  };

  useEffect(() => {
    refetchJobs();
  }, [jobKind, params]);

  useEffect(() => {
    setParams({
      page: 1,
      search: "",
    });
  }, [jobKind]);

  // Handle initial page load vs subsequent search/filter operations
  useEffect(() => {
    if (jobs && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [jobs]);

  // Only show full page loading on initial page load
  if (isLoading && isFirstLoad) {
    return <Loading className="h-screen" />;
  }

  // Determine if we're in a search loading state (but not initial load)
  const isSearchLoading = isFetching && !isFirstLoad;

  // Get count values but keep them separate from the filter options
  const jobCounts = {
    all: jobs?.count || 0,
    delivery: deliveryJobs?.count || 0,
    removal: removalJobs?.count || 0,
    cleaning: cleaningJobs?.count || 0
  };
  
  // Add counts to filter options - make sure all options are always included
  const filtersWithCounts = kindOptions.map(option => {
    switch(option.value) {
      case "":
        return { ...option, count: jobCounts.all };
      case "DELIVERY":
        return { ...option, count: jobCounts.delivery };
      case "REMOVAL":
        return { ...option, count: jobCounts.removal };
      case "CLEANING":
        return { ...option, count: jobCounts.cleaning };
      default:
        return option;
    }
  });

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>My Jobs</h3>
          <Link href="/create-job">
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              <span>Create New Job</span>
            </Button>
          </Link>
        </div>
      </div>

      <Container className="mt-10">
        {/* Always show all filter options, regardless of count */}
        <JobFilters
          kindOptions={filtersWithCounts}
          jobKind={jobKind}
          setJobKind={setJobKind}
        />
        
        <div className="mt-6 mb-8 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {isSearchLoading ? (
              <Loader2 size={18} className="animate-spin text-primary" />
            ) : (
              <Search size={18} />
            )}
          </div>
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search jobs by title or location..."
            id="search-jobs"
            name="search-jobs"
            className="pl-10 py-6 border-gray-200 focus:border-primary rounded-lg"
            onChange={handleSearchChange}
            value={params.search}
            onBlur={() => {
              if (isSearchLoading) {
                searchInputRef.current?.focus();
              }
            }}
          />
        </div>

        <div className="relative min-h-[400px]">
          {/* Local loading indicator that doesn't block interaction */}
          {isSearchLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex justify-center items-start pt-20">
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="mt-2 text-sm text-gray-600">Loading jobs...</span>
              </div>
            </div>
          )}

          {jobs?.count > 0 ? (
            <>
              <JobList jobs={jobs?.results} />
              <div className="mt-8">
                <Pagination
                  params={params}
                  setParams={setParams}
                  totalCount={jobs?.count}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-lg border border-gray-200">
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800">No jobs found</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                You don't have any jobs matching your search criteria. Try adjusting your filters or create a new job.
              </p>
              <Link href="/create-job" className="mt-6">
                <Button className="flex items-center gap-2">
                  <Plus size={18} />
                  <span>Create New Job</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
