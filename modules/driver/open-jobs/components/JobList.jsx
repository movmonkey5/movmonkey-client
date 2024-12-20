import JobCard from "./JobCard";

export default function JobList({ jobs = [] }) {
  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <>{job.status === "ACTIVE" && <JobCard key={job.uid} job={job} />}</>
      ))}
    </div>
  );
}
