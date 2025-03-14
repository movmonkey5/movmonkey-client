import JobCard from "./JobCard";

export default function JobList({ jobs = [] }) {
  // Keep the existing logic to filter active jobs
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {jobs.map((job) => (
        job.status === "ACTIVE" && <JobCard key={job.uid} job={job} />
      ))}
    </div>
  );
}
