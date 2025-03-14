import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ApiKit from "@/common/ApiKit";
import { Loader2, Calendar, ChevronRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

export default function JobCard({ job, isStatusLoading = false }) {
  const router = useRouter();
  const [jobStatus, setJobStatus] = useState(job?.status || null);
  
  // Use React Query for more reliable status fetching and caching
  const { data: statusData, isLoading: isStatusFetching } = useQuery({
    queryKey: [`job-status-${job.kind}-${job.uid}`],
    queryFn: async () => {
      if (job.status) return { status: job.status };
      
      try {
        let response;
        if (job.kind === "DELIVERY_JOB") {
          response = await ApiKit.me.job.delivery.getJob(job.uid);
        } else if (job.kind === "CLEANING_JOB") {
          response = await ApiKit.me.job.cleaning.getJob(job.uid);
        } else if (job.kind === "REMOVAL_JOB") {
          response = await ApiKit.me.job.removal.getJob(job.uid);
        }
        return response.data;
      } catch (error) {
        console.error(`Error fetching status for job ${job.uid}:`, error);
        return { status: "UNKNOWN" };
      }
    },
    staleTime: 60000, // Cache the result for 1 minute
    enabled: !job.status, // Only run the query if job.status is not provided
  });

  // Update status when data is available
  useEffect(() => {
    if (job.status) {
      setJobStatus(job.status);
    } else if (statusData?.status) {
      setJobStatus(statusData.status);
    }
  }, [job.status, statusData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "DRAFT":
        return "bg-gradient-to-r from-amber-400 to-amber-500";
      case "COMPLETED":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "IN_PROGRESS":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "CANCELLED":
        return "bg-gradient-to-r from-red-500 to-red-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const formatStatusText = (status) => {
    if (!status) return "Unknown";
    
    // Replace underscores with spaces and capitalize each word
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleJobClick = () => {
    const { kind, slug, uid } = job;
    
    // If status is DRAFT, route to review page
    if (jobStatus === "DRAFT") {
      router.push(`/review-jobs/${slug}/${uid}`);
    } else {
      // Otherwise route to job details page
      const jobType = kind.toLowerCase();
      router.push(`/created-jobs/${jobType}/${uid}`);
    }
  };

  const jobTypeStyle = jobTypeThemes[job.kind] || { 
    gradient: "bg-gradient-to-br from-gray-200 to-gray-300",
    icon: "📋", 
    accentColor: "border-gray-300",
    lightBg: "bg-gray-50",
    iconBg: "bg-gradient-to-br from-gray-100 to-gray-200"
  };

  // Format dates for display
  const formattedMovingDate = format(new Date(job.moving_date), "dd MMM yyyy");
  const formattedPostDate = job.created_at 
    ? format(new Date(job.created_at), "dd MMM yyyy") 
    : "Not available";

  // Determine if we're in a loading state
  const loading = isStatusLoading || isStatusFetching || (!job.status && !statusData);

  return (
    <div 
      onClick={handleJobClick}
      className={`relative rounded-xl border ${jobTypeStyle.accentColor} ${jobTypeStyle.lightBg} p-5 shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden group`}
    >
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
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{job.title || "Untitled Job"}</h3>
            <p className="text-sm text-gray-600">{job.kind.replace("_", " ")}</p>
          </div>
        </div>
        
        {/* Status Badge with gradient */}
        <div>
          {loading ? (
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
              <span className="text-xs text-gray-600">Loading...</span>
            </div>
          ) : (
            <Badge className={`${getStatusColor(jobStatus)} text-white px-3 py-1 rounded-full shadow-sm`}>
              {formatStatusText(jobStatus)}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Job Details - Updated to show Moving Date and Post Date */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Moving Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <span>Moving: {formattedMovingDate}</span>
        </div>
        
        {/* Post Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className={`p-1.5 rounded-full ${jobTypeStyle.lightBg} ${jobTypeStyle.accentColor} border`}>
            <Clock className="h-3.5 w-3.5" />
          </div>
          <span>Posted: {formattedPostDate}</span>
        </div>
      </div>
      
      {/* Job ID and chevron - removed description */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Job ID: {job.slug}</span>
          <div className={`p-1.5 rounded-full ${jobTypeStyle.gradient} text-white transform transition-transform group-hover:translate-x-1`}>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
