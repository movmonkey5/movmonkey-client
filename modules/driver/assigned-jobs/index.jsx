/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ApiKit from "@/common/ApiKit";
import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import TabNavigation from "@/components/shared/TabNavigation";
import { Input } from "@/components/ui/input";
import { sanitizeParams } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Pagination from "@/components/shared/Pagination";
import JobList from "./components/JobList";
import { Search, Loader2 } from "lucide-react";

const tabs = [
  { label: "Available Jobs", value: "/driver/open-jobs" },
  { label: "Assigned Jobs", value: "/driver/assigned-jobs" },
  { label: "Jobs Completed", value: "/driver/completed-jobs" },
];

export default function DriverAssignedJobsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [params, setParams] = useState({ search: "", page: 1 });
  const searchInputRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const {
    data: jobs,
    isLoading,
    isFetching,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: [`/me/jobs/assigned`, params],
    queryFn: async () => {
      try {
        const response = await ApiKit.me.job.assigned.getJobs(sanitizeParams(params));
        return response.data;
      } catch (error) {
        console.error('Failed to fetch assigned jobs:', error);
        throw error;
      }
    },
    keepPreviousData: true,
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
  }, [params.page]);

  // Handle initial page load vs subsequent search/filter operations
  useEffect(() => {
    if (jobs && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [jobs]);

  if (isLoading && isFirstLoad) {
    return <Loading className="h-screen" />;
  }

  // Determine if we're in a search loading state (but not initial load)
  const isSearchLoading = isFetching && !isFirstLoad;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>Driver's Assigned Jobs</h3>
        </div>
      </div>

      <Container className="mt-10">
        <div className="hidden md:block">
          <TabNavigation tabs={tabs} />
        </div>

        <div className="md:hidden mb-6">
          <SelectField
            options={tabs}
            value={tabs.find((el) => el.value === pathname)}
            onChange={(selectedOption) => {
              router.push(selectedOption.value);
            }}
          />
        </div>

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
            placeholder="Search assigned jobs..."
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
              <h3 className="text-xl font-semibold text-gray-800">No assigned jobs</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                You don't have any jobs assigned to you at the moment. Check available jobs to find new opportunities.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
