/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { sanitizeParams } from "@/lib/utils";
import ApiKit from "@/common/ApiKit";

import CleanerOpenJobsList from "./components/CleanerOpenJobsList";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import SelectField from "@/components/form/SelectField";
import TabNavigation from "@/components/shared/TabNavigation";
import { Search, Loader2 } from "lucide-react";

const tabs = [
  { label: "Available Jobs", value: "/cleaner/open-jobs" },
  { label: "Assigned Jobs", value: "/cleaner/assigned-jobs" },
  { label: "Jobs Completed", value: "/cleaner/completed-jobs" },
];

export default function CleanerOpenJobsPage() {
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
    queryKey: [`/public/jobs/all`, params],
    queryFn: () =>
      ApiKit.public.job.all
        .getJobs(sanitizeParams(params))
        .then(({ data }) => data),
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

  // Determine if we're in a search loading state (but not initial load)
  const isSearchLoading = isFetching && !isFirstLoad;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>Cleaner's Job Board</h3>
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
            placeholder="Search cleaning jobs by title or location..."
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
              <CleanerOpenJobsList jobs={jobs?.results} />
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
              <div className="text-gray-400 text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800">No cleaning jobs available</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                There are no cleaning jobs available at the moment. Check back later or try different search criteria.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
