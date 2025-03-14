import { format } from "date-fns";
import Link from "next/link";
import { Calendar, Clock, CheckCircle } from "lucide-react";

// Define beautiful job type themes
const jobTypeThemes = {
  DELIVERY_JOB: { 
    gradient: "bg-gradient-to-br from-[#BAEDE6] to-[#8BD6DB]",
    icon: "🚚",
    accentColor: "border-[#BAEDE6]",
    lightBg: "bg-[#DBF9F9]",
    iconBg: "bg-gradient-to-br from-[#BAEDE6] to-[#8BD6DB]"
  },
  REMOVAL_JOB: { 
    gradient: "bg-gradient-to-br from-[#FFD7A5] to-[#FEB47B]",
    icon: "🏠", 
    accentColor: "border-[#FEC7C5]",
    lightBg: "bg-[#FFF0D1]",
    iconBg: "bg-gradient-to-br from-[#FFE7C3] to-[#FEC7A5]"
  },
  CLEANING_JOB: { 
    gradient: "bg-gradient-to-br from-[#EDD1E0] to-[#D6A5C9]",
    icon: "🧹", 
    accentColor: "border-[#EDD1E0]",
    lightBg: "bg-[#F1EFF0]",
    iconBg: "bg-gradient-to-br from-[#F1E0EB] to-[#E5C1D9]"
  },
};

export default function JobCard({ job }) {
  if (!job) return null;

  const jobType = job?.job_type || job?.kind || 'DELIVERY_JOB';
  const jobTitle = job?.job_title || job?.title || 'Untitled Job';
  const jobPath = jobType.toLowerCase().replace('_job', '');
  
  // Keep the original link structure
  const jobId = job?.job_uid || job?.uid;
  const jobUrl = `/driver/completed-jobs/${jobPath}/${jobId}`;

  const jobTypeStyle = jobTypeThemes[jobType] || { 
    gradient: "bg-gradient-to-br from-gray-200 to-gray-300",
    icon: "📋", 
    accentColor: "border-gray-300",
    lightBg: "bg-gray-50",
    iconBg: "bg-gradient-to-br from-gray-100 to-gray-200"
  };

  // Format dates
  const movingDate = job?.moving_date ? new Date(job.moving_date) : new Date();
  const createdDate = job?.created_at ? new Date(job.created_at) : new Date();
  const completedDate = job?.completed_at ? new Date(job.completed_at) : new Date();

  return (
    <Link href={jobUrl}>
      <div className={`relative rounded-xl border ${jobTypeStyle.accentColor} ${jobTypeStyle.lightBg} p-5 shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden group`}>
        {/* Success ribbon in corner */}
        <div className="absolute top-0 right-0">
          <div className="relative h-16 w-16 overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 -translate-x-6 translate-y-[-30px] rotate-45 bg-green-500"></div>
            <CheckCircle className="absolute right-2 top-2 h-5 w-5 text-white" />
          </div>
        </div>
        
        {/* Decorative gradient element */}
        <div className={`absolute top-0 left-0 w-24 h-24 -ml-8 -mt-8 rounded-full ${jobTypeStyle.gradient} opacity-20 transition-all group-hover:opacity-30`}></div>
        
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            {/* Job Type Icon with gradient background */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${jobTypeStyle.iconBg} text-2xl shadow-sm`}>
              {jobTypeStyle.icon}
            </div>
            
            {/* Job Title and Type */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{jobTitle}</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{jobType.replace("_", " ")}</span>
                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Job Details - Moving Date and Completed Date */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Moving Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span>Moving: {format(movingDate, "dd MMM yyyy")}</span>
          </div>
          
          {/* Completed Date - use completion date if available, otherwise post date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`p-1.5 rounded-full bg-green-50 border border-green-300`}>
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            </div>
            <span>Completed: {format(completedDate, "dd MMM yyyy")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
