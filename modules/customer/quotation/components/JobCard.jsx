import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";

const colorSchema = {
  DELIVERY_JOB: "border-[#BAEDE6] bg-[#DBF9F9]",
  REMOVAL_JOB: "border-[#FEC7C5] bg-[#FFF0D1]",
  CLEANING_JOB: "border-[#EDD1E0] bg-[#F1EFF0]",
};

const spanColor = {
  DELIVERY_JOB: "border-[#BAEDE6] bg-[#CEF2EE]",
  REMOVAL_JOB: "border-[#FEC7C5] bg-[#FEC7C5]",
  CLEANING_JOB: "border-[#EDD1E0] bg-[#EDD1E0]",
};

export default function JobCard({ job }) {
  const jobID = job.uid;
  const jobKind = job.kind.toLowerCase();

  console.log('Job Kind:', jobKind);

  // Fetch the quotation details
  const { data: quotationDetails } = useQuery({
    queryKey: ["quotation", jobID],
    queryFn: () => ApiKit.me.getQuotationDetails(jobID).then(({ data }) => data),
  });


  // Extract original job ID from quotation details
  const originalJobID = quotationDetails?.delivery_job?.uid;

  console.log("Original Job ID:", originalJobID);

  // Fetch the original job details based on the originalJobID
  const { data: originalJob } = useQuery({
    queryKey: [`/me/jobs/${jobKind}/${originalJobID}`],
    queryFn: () => {
      switch (jobKind) {
        case "delivery_job":
          return ApiKit.me.job.delivery
            .getJob(originalJobID)
            .then(({ data }) => data);
        case "removal":
          return ApiKit.me.job.removal
            .getJob(originalJobID)
            .then(({ data }) => data);
        case "cleaning":
          return ApiKit.me.job.cleaning
            .getJob(originalJobID)
            .then(({ data }) => data);
        default:
          throw new Error(`Invalid job kind: ${jobKind}`);
      }
    },
    enabled: !!originalJobID, // Only run this query if originalJobID is available
  });

  console.log('Original Job:', originalJob);

  // Handling the dates correctly
  const jobCreationDate = originalJob?.created_at
    ? parseISO(originalJob.created_at)
    : new Date();

  const executionDate = originalJob?.moving_date
    ? parseISO(originalJob.moving_date)
    : null; // Can be null if not available

  const quotationDate = quotationDetails?.created_at
    ? parseISO(quotationDetails.created_at)
    : null; // Can be null if not available

  // Formatting the dates
  const formattedExecutionDate = executionDate
    ? format(executionDate, "PPP")
    : "No execution date provided";

  const timeSinceJobCreated = formatDistanceToNow(jobCreationDate, { addSuffix: true });
  const timeSinceQuotation = quotationDate
    ? formatDistanceToNow(quotationDate, { addSuffix: true })
    : "No quotation yet";

  return (
    <Link
      href={`/quotation/${jobKind}/${jobID}`}
      className={`flex rounded-md border text-sm ${colorSchema[job.kind]}`}
    >
      <div
        className={`hidden w-14 rounded-md border md:block ${spanColor[job.kind]}`}
      ></div>
      <div className="flex w-full flex-col gap-2 p-4">
        <h4 className="text-xl font-bold">{job.title}</h4>

        <div className="flex flex-col text-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <p>Job Created: {timeSinceJobCreated}</p>
          <p>Execution Date: {formattedExecutionDate}</p>
          <p>Quotation Created: {timeSinceQuotation}</p>
        </div>
      </div>
    </Link>
  );
}
