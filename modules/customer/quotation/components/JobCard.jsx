import { useQuery } from "@tanstack/react-query";
import ApiKit from "@/common/ApiKit";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";

// Define job type themes with gradients and colors
const jobTypeThemes = {
  DELIVERY_JOB: { 
    gradient: "bg-gradient-to-br from-[#BAEDE6] to-[#8BD6DB]",
    icon: "🚚",
    accentColor: "border-[#8BD6DB]",
    lightBg: "bg-[#F0FAFA]",
    iconBg: "bg-gradient-to-br from-[#BAEDE6] to-[#8BD6DB]"
  },
  REMOVAL_JOB: { 
    gradient: "bg-gradient-to-br from-[#FFD7A5] to-[#FEB47B]",
    icon: "🏠", 
    accentColor: "border-[#FEB47B]",
    lightBg: "bg-[#FFF9F0]",
    iconBg: "bg-gradient-to-br from-[#FFE7C3] to-[#FEC7A5]"
  },
  CLEANING_JOB: { 
    gradient: "bg-gradient-to-br from-[#EDD1E0] to-[#D6A5C9]",
    icon: "🧹", 
    accentColor: "border-[#D6A5C9]",
    lightBg: "bg-[#F9F0F5]",
    iconBg: "bg-gradient-to-br from-[#F1E0EB] to-[#E5C1D9]"
  },
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
    ? format(executionDate, "dd MMM yyyy")
    : "No execution date";

  const formattedJobDate = format(jobCreationDate, "dd MMM yyyy");
  const formattedQuotationDate = quotationDate
    ? format(quotationDate, "dd MMM yyyy")
    : "No date";

  const jobTypeStyle = jobTypeThemes[job.kind] || { 
    gradient: "bg-gradient-to-br from-gray-200 to-gray-300",
    icon: "📋", 
    accentColor: "border-gray-300",
    lightBg: "bg-gray-50",
    iconBg: "bg-gradient-to-br from-gray-100 to-gray-200"
  };

  return (
    <Link href={`/quotation/${jobKind}/${jobID}`}>
      <div className={`relative rounded-xl border ${jobTypeStyle.accentColor} ${jobTypeStyle.lightBg} p-5 shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden group`}>
        {/* Decorative gradient element */}
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${jobTypeStyle.gradient} opacity-20 transition-all group-hover:opacity-30`}></div>
        
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            {/* Job Type Icon with gradient background */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${jobTypeStyle.iconBg} text-2xl shadow-sm`}>
              {jobTypeStyle.icon}
            </div>
            
            {/* Job Title and Type */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.kind?.replace("_", " ")}</p>
            </div>
          </div>
        </div>
        
        {/* Job Details - Moving Date and quotation date */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Job Created Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span>Created: {formattedJobDate}</span>
          </div>
          
          {/* Execution Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span>Moving: {formattedExecutionDate}</span>
          </div>
          
          {/* Quotation Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>Quoted: {formattedQuotationDate}</span>
          </div>
        </div>
        
        {/* Job ID and chevron */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Quotation ID: {job.uid}</span>
            <div className={`p-1.5 rounded-full ${jobTypeStyle.gradient} text-white transform transition-transform group-hover:translate-x-1`}>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
