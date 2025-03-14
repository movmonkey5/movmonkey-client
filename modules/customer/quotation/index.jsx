"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import JobList from "./components/JobList";
import JobFilters from "./components/JobFilters";
import { sanitizeParams } from "@/lib/utils";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";

const kindOptions = [
  { label: "All", value: "" },
  { label: "Delivery", value: "DELIVERY_JOB" },
  { label: "Removal", value: "REMOVAL_JOB" },
  { label: "Cleaning", value: "CLEANING_JOB" },
];

export default function QuotedJobs() {
  const [jobKind, setJobKind] = useState("");
  const [params, setParams] = useState({ page: 1 }); // Removed search from initial params
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const {
    data: jobs,
    isLoading,
    isFetching,
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
    });
  }, [jobKind]);
  
  // Track first load vs subsequent searches
  useEffect(() => {
    if (jobs && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [jobs]);

  // Only show full page loading on initial load
  if (isLoading && isFirstLoad) {
    return <Loading className="h-screen" />;
  }
  
  // Determine if we're in a loading state (but not initial load)
  const isContentLoading = isFetching && !isFirstLoad;

  const filteredJobs = jobs?.results.filter((job) =>
    jobKind ? job.kind === jobKind : true,
  );

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 lg:min-h-[calc(100vh-80px)]">
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

        <div className="relative min-h-[400px] mt-6">
          {/* Local loading indicator that doesn't block interaction */}
          {isContentLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex justify-center items-start pt-20">
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="mt-2 text-sm text-gray-600">Loading quotations...</span>
              </div>
            </div>
          )}

          {filteredJobs?.length > 0 ? (
            <>
              <JobList jobs={filteredJobs} />
              <div className="mt-8">
                <Pagination
                  params={params}
                  setParams={setParams}
                  totalCount={filteredJobs.length}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-lg border border-gray-200">
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800">No quotations found</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                No quotations are available based on your filter criteria.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
