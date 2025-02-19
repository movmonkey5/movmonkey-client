import { format } from "date-fns";
import Link from "next/link";

const colorSchema = {
  DELIVERY_JOB: "border-[#BAEDE6] bg-[#DBF9F9]",
  REMOVAL_JOB: "border-[#FEC7C5] bg-[#FFF0D1]",
  CLEANING_JOB: "border-[#D1E9FF] bg-[#E5F2FF]"
};

const spanColor = {
  DELIVERY_JOB: "border-[#BAEDE6] bg-[#CEF2EE]",
  REMOVAL_JOB: "border-[#FEC7C5] bg-[#FEC7C5]",
  CLEANING_JOB: "border-[#D1E9FF] bg-[#D1E9FF]"
};

export default function JobCard({ job }) {
  if (!job) return null;

  const jobType = job?.job_type || 'DELIVERY_JOB';
  const jobTitle = job?.job_title || 'Untitled Job';
  const jobPath = jobType.toLowerCase().replace('_job', '');
  
  // Use job_uid instead of uid for the link
  const jobId = job?.job_uid;
  
  console.log('JobCard render:', { jobId, jobPath, jobType, job });

  return (
    <Link href={`/driver/assigned-jobs/${jobPath}/${jobId}`}>
      <div className={`flex rounded-md border text-sm ${colorSchema[jobType]}`}>
        <div className={`hidden w-14 rounded-md border md:block ${spanColor[jobType]}`}></div>
        <div className="flex w-full flex-col gap-2 p-4">
          <h4 className="text-xl font-bold">{jobTitle}</h4>
          <div className="flex flex-col text-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <p>Posted At: {format(new Date(job.created_at), "PPPppp")}</p>
            <p>Execution Date: {format(new Date(job.moving_date), "PPP")}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
