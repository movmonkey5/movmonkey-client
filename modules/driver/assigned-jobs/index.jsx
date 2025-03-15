/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ApiKit from "@/common/ApiKit";
import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import TabNavigation from "@/components/shared/TabNavigation";
import { sanitizeParams } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "@/components/shared/Pagination";
import JobList from "./components/JobList";

const tabs = [
  { label: "Available Jobs", value: "/driver/open-jobs" },
  { label: "Assigned Jobs", value: "/driver/assigned-jobs" },
  { label: "Jobs Completed", value: "/driver/completed-jobs" },
];

export default function DriverAssignedJobsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [params, setParams] = useState({ page: 1 });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const {
    data: jobs,
    isLoading,
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

        <div className="relative min-h-[400px] mt-6">
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
