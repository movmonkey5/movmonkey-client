import JobCard from "./JobCard";

export default function CleanerOpenJobsList({ jobs = [] }) {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {jobs.map((job) => (
        <JobCard key={job.uid} job={job} />
      ))}
    </div>
  );
}
