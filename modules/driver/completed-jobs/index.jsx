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
import ReviewList from "../profile/components/ReviewList";
import { Search, Award, Loader2 } from "lucide-react";

const tabs = [
  { label: "Available Jobs", value: "/driver/open-jobs" },
  { label: "Assigned Jobs", value: "/driver/assigned-jobs" },
  { label: "Jobs Completed", value: "/driver/completed-jobs" },
];

export default function DriverCompletedJobsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [params, setParams] = useState({ search: "", page: 1 });
  const searchInputRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [searchTimer, setSearchTimer] = useState(null);

  const {
    data: jobs,
    isLoading,
    isFetching,
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
    queryKey: ["me/jobs/ratings"],
    queryFn: () => ApiKit.me.getRatings().then(({ data }) => data),
    keepPreviousData: true,
    staleTime: 60000, // Cache for a minute
  });

  // Debounced search handler to prevent too many API calls
  const handleSearchChange = (event) => {
    const value = event.target.value;
    
    // Clear previous timer
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    
    // Set params immediately for UI feedback
    setParams(prev => ({ ...prev, search: value, page: 1 }));
    
    // Set a new timer for API call
    const timer = setTimeout(() => {
      refetchJobs();
    }, 400);
    
    setSearchTimer(timer);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
  }, [searchTimer]);

  // Handle page changes
  useEffect(() => {
    if (!isFirstLoad) {
      refetchJobs();
      refetchReview();
    }
  }, [params.page, isFirstLoad]);

  // Handle initial page load vs subsequent search/filter operations
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
  
  // Check if we have jobs that match the search
  const hasJobs = jobs?.results && jobs.results.length > 0;
  const isSearching = !!params.search.trim();

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <div className="flex items-center gap-2">
            <h3>Completed Jobs</h3>
            <Award className="h-6 w-6 text-green-600" />
          </div>
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
            placeholder="Search completed jobs..."
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

          {!isSearchLoading && hasJobs ? (
            <>
              <JobList jobs={jobs.results} />
              <div className="mt-8">
                <Pagination
                  params={params}
                  setParams={setParams}
                  totalCount={jobs.count}
                />
              </div>
            </>
          ) : !isSearchLoading && (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-lg border border-gray-200">
              <div className="text-gray-400 text-5xl mb-4">
                {isSearching ? "🔍" : "🏆"}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {isSearching
                  ? `No results found for "${params.search}"`
                  : "No completed jobs yet"}
              </h3>
              <p className="text-gray-600 mt-2 max-w-md">
                {isSearching
                  ? "Try different search keywords or clear your search."
                  : "Your completed jobs will appear here. Check your assigned jobs to see tasks that need your attention."}
              </p>
              
              {isSearching && (
                <button
                  onClick={() => {
                    setParams(prev => ({ ...prev, search: "" }));
                    setTimeout(refetchJobs, 100);
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
        
        {!isSearchLoading && hasJobs && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" /> 
              Your Reviews
            </h3>
            <ReviewList reviewList={review?.results} />
          </div>
        )}
      </Container>
    </div>
  );
}
