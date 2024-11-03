"use client";

import SelectField from "@/components/form/SelectField";
import Container from "@/components/shared/Container";
import TabNavigation from "@/components/shared/TabNavigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const tabs = [
  { label: "Available Jobs", value: "/cleaner/open-jobs" },
  { label: "Assigned Jobs", value: "/cleaner/assigned-jobs" },
  { label: "Jobs Completed", value: "/cleaner/completed-jobs" },
];

export default function CleanerCompletedJobsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [params, setParams] = useState({ search: "", page: 1 });

  return (
    <div className="min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-80px)]">
      <div className=" bg-primary text-2xl font-semibold text-black md:text-2xl lg:mt-10">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:h-20">
          <h3>Cleaner’s Job Board</h3>
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
      </Container>
    </div>
  );
}
