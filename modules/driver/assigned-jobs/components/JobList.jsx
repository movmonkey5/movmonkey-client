import Link from "next/link";
import { format } from "date-fns";
import JobCard from "./JobCard";

export default function JobList({ jobs = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.uid} job={job} />
      ))}
    </div>
  );
}
