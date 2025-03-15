/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { sanitizeParams } from "@/lib/utils";
import ApiKit from "@/common/ApiKit";

import CleanerOpenJobsList from "./components/CleanerOpenJobsList";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import SelectField from "@/components/form/SelectField";
import TabNavigation from "@/components/shared/TabNavigation";
import { Loader2 } from "lucide-react";

const tabs = [
  { label: "Available Jobs", value: "/cleaner/open-jobs" },
  { label: "Assigned Jobs", value: "/cleaner/assigned-jobs" },
  { label: "Jobs Completed", value: "/cleaner/completed-jobs" },
];

export default function CleanerAssignedJobsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [params, setParams] = useState({ page: 1 }); // Removed search parameter
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const {
    data: jobs,
    isLoading,
    isFetching,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: [`/me/jobs/assigned`, params],
    queryFn: () =>
      ApiKit.me.job.assigned
        .getJobs(sanitizeParams(params))
        .then(({ data }) => data),
    keepPreviousData: true,
  });

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

  // Determine if we're in a loading state (but not initial load)
  const isContentLoading = isFetching && !isFirstLoad;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 lg:min-h-[calc(100vh-80px)]">
      <div className="bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>Cleaner's Assigned Jobs</h3>
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

        {/* Search bar has been removed */}

        <div className="relative min-h-[400px] mt-8">
          {/* Local loading indicator that doesn't block interaction */}
          {isContentLoading && (
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
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800">No assigned jobs</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                You don't have any assigned cleaning jobs at the moment. Check the available jobs section to find new opportunities.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
