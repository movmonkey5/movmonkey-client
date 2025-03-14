import { format } from "date-fns";
import Link from "next/link";
import { Calendar, Clock, CheckCircle } from "lucide-react";

// Define job type themes matching the other components
const jobTypeThemes = {
  CLEANING_JOB: { 
    gradient: "bg-gradient-to-br from-[#EDD1E0] to-[#D6A5C9]",
    icon: "🧹", 
    accentColor: "border-[#EDD1E0]",
    lightBg: "bg-[#F1EFF0]",
    iconBg: "bg-gradient-to-br from-[#F1E0EB] to-[#E5C1D9]"
  },
  DEEP_CLEANING_JOB: { 
    gradient: "bg-gradient-to-br from-[#BBE0D8] to-[#8ECECA]",
    icon: "🧽",
    accentColor: "border-[#BBE0D8]",
    lightBg: "bg-[#E8F5F2]",
    iconBg: "bg-gradient-to-br from-[#CBE9E3] to-[#9ED8D2]"
  },
  // Default theme as fallback
  DEFAULT: { 
    gradient: "bg-gradient-to-br from-[#D9E3F7] to-[#ABC9FF]",
    icon: "🧹",
    accentColor: "border-[#D9E3F7]",
    lightBg: "bg-[#F0F4FC]",
    iconBg: "bg-gradient-to-br from-[#E4EBF9] to-[#C5D8FF]"
  }
};

export default function JobCard({ job }) {
  const completedDate = job?.completed_at || job?.updated_at || new Date();
  const executionDate = job?.moving_date || new Date();
  
  // Extract job type from job_type field or kind field
  let jobKind = "cleaning"; // Default for cleaner
  
  if (job?.job_type) {
    jobKind = job.job_type.split('_')[0].toLowerCase();
  } else if (job?.kind) {
    jobKind = job.kind.toLowerCase().includes("cleaning") ? "cleaning" : "cleaning";
  }
  
  // Generate URL in the same format as driver's jobs
  const jobUrl = `/cleaner/open-jobs/${job?.slug}?kind=${jobKind}`;
  
  // Get appropriate theme based on job type, with fallback
  const jobTypeStyle = jobTypeThemes[job?.kind] || jobTypeThemes.DEFAULT;

  // Cleaning type label - extract from category or job title if available
  const cleaningType = job?.category?.title || 
                      (job?.title?.includes("Deep") ? "Deep Cleaning" : "Regular Cleaning");

  return (
    <Link href={jobUrl}>
      <div className={`relative rounded-xl border ${jobTypeStyle.accentColor} ${jobTypeStyle.lightBg} p-5 shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden group`}>
        {/* Decorative gradient element */}
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${jobTypeStyle.gradient} opacity-20 transition-all group-hover:opacity-30`}></div>
        
        {/* Add completed badge */}
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Completed</span>
        </div>
        
        <div className="flex items-start">
          <div className="flex gap-4 items-center">
            {/* Job Type Icon with gradient background */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${jobTypeStyle.iconBg} text-2xl shadow-sm`}>
              {jobTypeStyle.icon}
            </div>
            
            {/* Job Title and Type */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{job?.title || job?.job_title || "Untitled Job"}</h3>
              <p className="text-sm text-gray-600">{cleaningType}</p>
            </div>
          </div>
        </div>
        
        {/* Job Details - Cleaning Date and Completion Date */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Cleaning Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span>Cleaning Date: {format(executionDate, "dd MMM yyyy")}</span>
          </div>
          
          {/* Completed Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>Completed: {format(completedDate, "dd MMM yyyy")}</span>
          </div>
        </div>

        {/* Additional details like room count, if available */}
        {job?.room_count && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-md border border-gray-100">
            <span className="font-medium">{job.room_count}</span> Rooms
          </div>
        )}
        
        {/* Completion indicator */}
        <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle className="h-4 w-4" />
          <span>Job successfully completed</span>
        </div>
      </div>
    </Link>
  );
}
