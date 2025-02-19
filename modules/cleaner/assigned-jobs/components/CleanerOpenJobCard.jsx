import { format } from "date-fns";
import Link from "next/link";

const colorSchema = {
  CLEANING_JOB: "border-[#EDD1E0] bg-[#F1EFF0]",
};

const spanColor = {
  CLEANING_JOB: "border-[#EDD1E0] bg-[#EDD1E0]",
};

export default function CleanerOpenJobCard({ job }) {
  if (!job) return null;

  // Get the actual job UID and format job type
  const actualJobId = job.job_uid;
  const jobType = job.job_type?.toLowerCase()?.replace('_job', '');
  
  console.log('Job Card Data:', { 
    quotationId: job.uid,
    actualJobId,
    jobType, 
    fullJob: job 
  });

  const postedDate = job.created_at || new Date();
  const executionDate = job.moving_date || new Date();

  return (
    <Link 
      href={`/cleaner/assigned-jobs/${jobType}/${actualJobId}`}
      className={`flex rounded-md border text-sm ${colorSchema[job.job_type]}`}
    >
      <div
        className={`hidden w-14 rounded-md border md:block ${spanColor[job.job_type]}`}
      ></div>
      <div className="flex w-full flex-col gap-2 p-4">
        <h4 className="text-xl font-bold">{job?.job_title
        }</h4>

        <div className="flex flex-col text-gray-700 sm:flex-row sm:items-center sm:justify-between ">
          <p>Posted At: {format(postedDate, "PPPppp")}</p>
          <p>Execution Date: {format(executionDate, "PPP")}</p>
        </div>
      </div>
    </Link>
  );
}
