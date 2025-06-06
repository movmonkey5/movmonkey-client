import { format } from "date-fns";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

// Define beautiful job type themes with cleaning-specific styles
const jobTypeThemes = {
  CLEANING_JOB: { 
    gradient: "bg-gradient-to-br from-[#EDD1E0] to-[#D6A5C9]",
    icon: "🧹", 
    accentColor: "border-[#EDD1E0]",
    lightBg: "bg-[#F1EFF0]",  // Updated to match the provided color
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
  const postedDate = job?.created_at || new Date();
  const executionDate = job?.moving_date || new Date();
  
  // URL structure for cleaning jobs
  const jobUrl = `/cleaner/open-jobs/${job?.slug}?kind=cleaning`;
  
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
        
        <div className="flex items-start">
          <div className="flex gap-4 items-center">
            {/* Job Type Icon with gradient background - using emoji instead of SVG */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${jobTypeStyle.iconBg} text-2xl shadow-sm`}>
              {jobTypeStyle.icon}
            </div>
            
            {/* Job Title and Type */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{job?.title || "Untitled Job"}</h3>
              <p className="text-sm text-gray-600">{cleaningType}</p>
            </div>
          </div>
        </div>
        
        {/* Job Details - Cleaning Date and Post Date */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Cleaning Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span>Cleaning Date: {format(executionDate, "dd MMM yyyy")}</span>
          </div>
          
          {/* Post Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>Posted: {format(postedDate, "dd MMM yyyy")}</span>
          </div>
        </div>

        {/* Additional details like room count, if available */}
        {job?.room_count && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-md border border-gray-100">
            <span className="font-medium">{job.room_count}</span> Rooms
          </div>
        )}
      </div>
    </Link>
  );
}
