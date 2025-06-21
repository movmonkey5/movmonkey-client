"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Pencil, Wallet, X } from "lucide-react";
import toast from "react-hot-toast";
import ApiKit from "@/common/ApiKit";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userPlaceHolder from "@/public/image/user-placeholder-green.png";
import ReviewList from "./components/ReviewList";
import useStore from "@/store";

export default function DriverProfilePage() {
  const [activeTab, setActiveTab] = useState("actives");
  const [currency, setCurrency] = useState("$"); // Default currency symbol
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Filter states for withdrawal history
  const [historyFilters, setHistoryFilters] = useState({
    status: '',
    date_from: '',
    date_to: ''
  });

  // Get user from store using the hook directly
  const user = useStore((state) => state.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.currencySymbol) {
      setCurrency(user.currencySymbol);
    }
  }, [user]);

  // Add query to fetch earnings data
  const { data: earnings, isLoading: earningsLoading, refetch: refetchEarnings } = useQuery({
    queryKey: ["me.earnings"],
    queryFn: () => ApiKit.me.earnings.getEarnings().then(({ data }) => data),
  });

  // Add query to fetch withdrawal history
  const { data: withdrawalHistory, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
    queryKey: ["me.withdrawalHistory", historyFilters],
    queryFn: () => ApiKit.me.earnings.getWithdrawalHistory(historyFilters).then(({ data }) => data),
    enabled: showHistoryModal, // Only fetch when modal is open
  });

  // Add withdrawal mutation
  const withdrawMutation = useMutation({
    mutationFn: () => ApiKit.me.earnings.withdrawRequest(),
    onSuccess: (response) => {
      console.log("Withdrawal request successful:", response);
      // Refetch earnings to update the balances
      refetchEarnings();
      // Close modals
      setShowWithdrawModal(false);
      setShowConfirmModal(false);
      // Show success toast
      toast.success("Withdrawal request submitted successfully!", {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '500',
        },
        icon: '✅',
      });
    },
    onError: (error) => {
      console.error("Withdrawal request failed:", error);
      // Close confirmation modal but keep withdraw modal open
      setShowConfirmModal(false);
      // Show error toast
      toast.error("Failed to submit withdrawal request. Please try again.", {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '500',
        },
        icon: '❌',
      });
    },
  });

  // Handle withdrawal request button click
  const handleWithdrawRequest = () => {
    setShowConfirmModal(true);
  };

  // Handle confirmation of withdrawal
  const handleConfirmWithdraw = () => {
    withdrawMutation.mutate();
  };

  // Handle cancellation of withdrawal
  const handleCancelWithdraw = () => {
    setShowConfirmModal(false);
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["me.getProfile"],
    queryFn: () => ApiKit.me.getProfile().then(({ data }) => data),
  });
  const { data: review, isLoading: reviewLoading } = useQuery({
    queryKey: ["me/jobs/tatings"],
    queryFn: () => ApiKit.me.getRatings().then(({ data }) => data),
  });

  const { data: activeJobs, isLoading: activeJobsLoading } = useQuery({
    queryKey: ["/me/jobs/assigned"],
    queryFn: () => ApiKit.me.job.assigned.getJobs().then(({ data }) => data),
  });

  const { data: completedJobs, isLoading: completedJobsLoading } = useQuery({
    queryKey: ["/me/jobs/completed"],
    queryFn: () => ApiKit.me.job.completed.getJobs().then(({ data }) => data),
  });

  const { data: draftJobs, isLoading: draftJobsLoading } = useQuery({
    queryKey: ["/me/jobs/favourite"],
    queryFn: () => ApiKit.me.job.favourite.getJobs().then(({ data }) => data),
  });

  if (profileLoading || earningsLoading) {
    return <Loading className="min-h-[calc(100vh-8rem)]" />;
  }

  // Check if user has any pending withdrawal requests (PROCESSING status)
  const hasProcessingWithdrawal = earnings?.balance_for_clear > 0;
  // Use the backend's has_unrequested_balance field to determine if withdraw button should be enabled
  const hasAvailableBalance = earnings?.has_unrequested_balance === true;

console.log(earnings,"earningsssssssssssssssssssssssssssssssssss" )
  
  // Calculate total earned (withdrawn + available + processing)
  const totalEarned = (earnings?.with_drawn_balance || 0) + 
                     (earnings?.balance_for_use || 0) + 
                     (earnings?.balance_for_clear || 0);
  
  // Define tab colors for consistent styling
  const tabColors = {
    actives: {
      active: "from-blue-500 to-blue-600",
      glow: "rgba(59,130,246,0.7)",
      text: "text-blue-600",
      light: "#1e40af",
      badge: "bg-blue-500"
    },
    completed: {
      active: "from-green-500 to-green-600",
      glow: "rgba(34,197,94,0.7)",
      text: "text-green-600",
      light: "#15803d",
      badge: "bg-green-500"
    },
    favourite: {
      active: "from-amber-500 to-amber-600",
      glow: "rgba(245,158,11,0.7)",
      text: "text-amber-600",
      light: "#d97706",
      badge: "bg-amber-500"
    },
  };
  
  console.log(activeJobs, "activeJobsData");

  // Custom tab icons with unique glow colors for each tab
  const tabIcons = {
    actives: (
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    completed: (
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    favourite: (
      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    ),
  };

  // Helper function to determine job type from slug
  const getJobTypeFromSlug = (slug) => {
    if (!slug) return "removal"; // Default
    
    if (slug.toLowerCase().includes("delivery")) return "delivery";
    if (slug.toLowerCase().includes("removal")) return "removal";
    
    return "removal"; // Default fallback
  };

  // Job type icons for different job types
  const jobTypeIcons = {
    removal: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ),
    delivery: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
      </svg>
    ),
  };

  // Enhanced job rendering with dynamic icons based on job type
  const renderJobList = (jobs, type) => (
    <div className="mt-2">
      <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-100 p-3">
        <p className="text-lg font-medium text-[#0588d1]">
          <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0588d1] text-white">
            {jobs?.count || 0}
          </span>
          {type} {(jobs?.count || 0) !== 1 ? "Jobs" : "Job"}
        </p>
      </div>

      {jobs?.results?.length ? (
        <div className="space-y-2">
          {jobs.results.map((job) => {
            // Extract job type from job_type field (e.g., "DELIVERY_JOB" -> "delivery")
            // Or fallback to kind field if job_type is not available
            let jobType = "removal"; // default fallback
            
            if (job?.job_type) {
              // Extract from job_type (e.g., "DELIVERY_JOB" -> "delivery")
              jobType = job.job_type.split('_')[0].toLowerCase();
            } else if (job?.kind) {
              // Fallback to kind field if available
              jobType = job.kind.toLowerCase().includes("delivery") ? "delivery" : "removal";
            }
            
            // Get the appropriate job ID for the link - prefer job_uid if it's for an active job
            const jobIdentifier = job?.job_uid || job?.uid;
            
            // Determine the correct path based on job status
            const jobPath = job?.status === "ACCEPTED" || job?.status === "IN_PROGRESS" 
              ? `/driver/assigned-jobs/${jobType}/${jobIdentifier}`
              : `/driver/open-jobs/${job?.slug}?kind=${jobType}`;
            
            console.log(`Job: ${job?.job_title || job?.title}, Type: ${jobType}, Path: ${jobPath}`);
            
            return (
              <Link
                href={jobPath}
                key={job?.uid || job?.id || jobIdentifier}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:bg-primary/10"
              >
                <div className="flex items-center">
                  <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full
                    ${jobType === 'delivery' ? 'bg-green-500' : 'bg-blue-500'} 
                    text-white`}>
                    {jobTypeIcons[jobType] || jobType.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{job?.title || job?.job_title || "Untitled Job"}</p>
                    <p className="text-sm text-gray-500">
                      <span className="capitalize">{jobType}</span> • 
                      {job?.job_uid ? ` ID: ${job.job_uid.substring(0, 8)}...` : 
                       job?.slug ? ` ID: ${job.slug.substring(0, 10)}...` : " No ID"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                  {job.status}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="mb-2 text-gray-500">No {type.toLowerCase()} jobs found</p>
        </div>
      )}
    </div>
  );

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setHistoryFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setHistoryFilters({
      status: '',
      date_from: '',
      date_to: ''
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 pb-8">
      <div className="bg-primary text-lg font-semibold text-black md:text-2xl lg:mt-6">
        <Container>
          <h3 className="px-4 py-3 text-3xl font-bold">
            Total Earned: {currency} {totalEarned.toFixed(2)}
          </h3>
        </Container>
      </div>

      <Container>
        <h4 className="text-2xl font-bold lg:text-4xl">Driver Profile</h4>

        <div className="mt-5 flex gap-5 max-xs:flex-col xs:items-center xs:justify-between">
          <div className="flex items-center gap-5">
            <div className="size-16 lg:size-24">
              <Image
                src={profile?.avatar?.at350x350 || userPlaceHolder}
                width={350}
                height={350}
                className="size-16 rounded-full border-2 border-secondary lg:size-24"
                alt="user avatar"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold lg:text-2xl">
                {profile?.full_name}
              </h4>
              <p className="text-base lg:text-xl">{profile?.email}</p>
              <p className="text-base lg:text-xl">
                {" "}
                Currency : <b>{currency}</b>
              </p>
              <p className="text-base text-[#0588d1] lg:text-xl">
                {completedJobs?.count || 0} {(completedJobs?.count || 0) !== 1 ? "Jobs" : "Job"}{" "}
                completed
              </p>
              <p>Total Rated : {review?.count || 0}</p>
              <p className="font-medium text-green-600">Available Balance: {currency} {earnings?.balance_for_use || 0}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 max-xs:mt-0 max-xs:w-full sm:flex-row">
            <Link href="/driver/profile/edit" className="block">
              <Button variant="secondary" className="gap-2 max-xs:w-full">
                <Pencil className="size-5" />
                <span className="hidden md:block"> Edit Profile</span>
              </Button>
            </Link>
            <Button 
              onClick={() => setShowHistoryModal(true)}
              className="gap-2 max-xs:w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25 border-0"
            >
              <ClipboardList className="size-5" />
              <span className="hidden md:block">History</span>
            </Button>
            <Button 
              onClick={() => setShowWithdrawModal(true)}
              className="gap-2 max-xs:w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!hasAvailableBalance}
            >
              <Wallet className="size-5" />
              <span className="hidden md:block">Withdraw</span>
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center sm:block">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            value={activeTab}
            className="w-full"
          >
            {/* Tabs with reduced width */}
            <div className="mb-6 mx-auto max-w-3xl">              
              <TabsList className="flex h-auto w-full gap-2 bg-transparent p-0">
                {[
                  { id: "actives", label: "Active Jobs" },
                  { id: "completed", label: "Completed Jobs" },
                  { id: "favourite", label: "Jobs in Favourite" }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`
                      group relative flex-1 rounded-xl border border-gray-200/80 py-2.5 px-1.5
                      transition-all duration-300 ease-out
                      ${activeTab === tab.id 
                        ? `bg-gradient-to-br ${tabColors[tab.id].active} text-white` 
                        : 'bg-white hover:border-gray-300'}
                    `}
                    style={{
                      boxShadow: activeTab === tab.id 
                        ? `0 8px 20px -6px ${tabColors[tab.id].glow}` 
                        : '0 2px 6px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {tabIcons[tab.id]}
                      {/* Explicitly setting text color to white when active */}
                      <span className={`font-medium text-sm ${activeTab === tab.id ? 'text-white' : tabColors[tab.id].text}`}>
                        {tab.label}
                      </span>
                      
                      {tab.id === "actives" && activeJobs?.count > 0 && (
                        <span className={`ml-2 flex h-6 min-w-6 items-center justify-center rounded-full 
                          ${activeTab === tab.id ? 'bg-white text-blue-600' : tabColors[tab.id].badge + ' text-white'}
                          px-2 text-xs font-bold shadow-md transition-all`}>
                          {activeJobs.count}
                        </span>
                      )}
                      {tab.id === "completed" && completedJobs?.count > 0 && (
                        <span className={`ml-2 flex h-6 min-w-6 items-center justify-center rounded-full 
                          ${activeTab === tab.id ? 'bg-white text-green-600' : tabColors[tab.id].badge + ' text-white'}
                          px-2 text-xs font-bold shadow-md transition-all`}>
                          {completedJobs.count}
                        </span>
                      )}
                      {tab.id === "favourite" && draftJobs?.count > 0 && (
                        <span className={`ml-2 flex h-6 min-w-6 items-center justify-center rounded-full 
                          ${activeTab === tab.id ? 'bg-white text-amber-600' : tabColors[tab.id].badge + ' text-white'}
                          px-2 text-xs font-bold shadow-md transition-all`}>
                          {draftJobs.count}
                        </span>
                      )}
                    </div>
                    
                    {/* Animated glow effect when active */}
                    {activeTab === tab.id && (
                      <>
                        <div className="absolute inset-0 -z-10 animate-pulse rounded-xl opacity-30" 
                             style={{backgroundColor: tabColors[tab.id].light, 
                                    boxShadow: `0 0 25px 3px ${tabColors[tab.id].glow}`}}>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-white opacity-20"></div>
                      </>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
              <TabsContent value="actives" className="m-0 outline-none">
                {activeJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(activeJobs, "Active")
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="m-0 outline-none">
                {completedJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(completedJobs, "Completed")
                )}
              </TabsContent>
              
              <TabsContent value="favourite" className="m-0 outline-none">
                {draftJobsLoading ? (
                  <Loading />
                ) : (
                  renderJobList(draftJobs, "Favourite")
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Container>
      <Container>
        {/* Review list from existing code */}
        <ReviewList reviewList={review?.results} />
      </Container>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Withdrawal Dashboard</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Balance Information */}
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Available for Withdrawal</p>
                  <p className="text-3xl font-bold text-green-600">
                    {currency} {earnings?.balance_for_use || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Processing</p>
                  <p className="text-lg font-semibold text-blue-700">
                    {currency} {earnings?.balance_for_clear || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Withdrawn</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {currency} {earnings?.with_drawn_balance || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleWithdrawRequest}
                disabled={!hasAvailableBalance || withdrawMutation.isPending || hasProcessingWithdrawal}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {withdrawMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : hasProcessingWithdrawal ? (
                  <>
                    <Wallet className="mr-2 size-5" />
                    Withdrawal Already Requested
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 size-5" />
                    Request for Withdraw
                  </>
                )}
              </Button>

              {!hasAvailableBalance && !hasProcessingWithdrawal && (
                <p className="text-sm text-red-600 text-center">
                  All available commissions have already been requested for withdrawal
                </p>
              )}

              {hasProcessingWithdrawal && (
                <p className="text-sm text-blue-600 text-center">
                  You have a withdrawal request being processed. Please wait for completion before requesting another withdrawal.
                </p>
              )}

              <Button
                onClick={() => setShowWithdrawModal(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>

            {/* Information Text */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Once you request a withdrawal, the amount will be moved to "Processing" 
                status and will be reviewed by our team. Processing typically takes 1-3 business days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Withdrawal Request</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to request a withdrawal of{" "}
                <span className="font-semibold text-green-600">
                  {currency} {earnings?.balance_for_use || 0}
                </span>
                ?
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This action cannot be undone and the funds will be moved to processing status.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleCancelWithdraw}
                variant="outline"
                className="flex-1"
                disabled={withdrawMutation.isPending}
              >
                No, Cancel
              </Button>
              <Button
                onClick={handleConfirmWithdraw}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={withdrawMutation.isPending || hasProcessingWithdrawal}
              >
                {withdrawMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  "Yes, Withdraw"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Withdrawal History</h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Filter Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={historyFilters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SUCCEEDED">Succeeded</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={historyFilters.date_from}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={historyFilters.date_to}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            {withdrawalHistory?.summary && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {withdrawalHistory.summary.total_requests}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-600 mb-1">Processing</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {currency} {withdrawalHistory.summary.total_processing.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 mb-1">Withdrawn</p>
                  <p className="text-2xl font-bold text-green-700">
                    {currency} {withdrawalHistory.summary.total_withdrawn.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* History Table */}
            <div className="overflow-y-auto max-h-96">
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading history...</span>
                </div>
              ) : withdrawalHistory?.history?.length > 0 ? (
                <div className="space-y-3">
                  {withdrawalHistory.history.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.job_title}</h4>
                          <p className="text-sm text-gray-600">{item.job_type} • ID: {item.job_id?.substring(0, 8)}...</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {currency} {item.withdrawal_amount.toFixed(2)}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            item.status === 'SUCCEEDED' 
                              ? 'bg-green-100 text-green-800' 
                              : item.status === 'PROCESSING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Requested: {new Date(item.withdrawal_requested_date).toLocaleDateString()}</span>
                        <div className="text-right">
                          <div>Payment: {currency} {item.payment_amount.toFixed(2)}</div>
                          <div>Commission: -{currency} {item.commission_amount.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No withdrawal history found</p>
                  {Object.values(historyFilters).some(filter => filter !== '') && (
                    <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
                  )}
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowHistoryModal(false)}
                variant="outline"
                className="px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
