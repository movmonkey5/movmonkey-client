import CleanerOpenJobCard from "./CleanerOpenJobCard";

export default function CleanerOpenJobsList({ jobs = [] }) {
  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <CleanerOpenJobCard key={job.uid} job={job} />
      ))}
    </div>
  );
}
