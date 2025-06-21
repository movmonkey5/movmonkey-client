import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ApiKit from '@/common/ApiKit';
import DeliveryOverview from './components/DeliveryOverView';
import CleaningOverview from './components/CleaningOverview';
import RemovalOverview from './components/RemovalOverview';

export default function AssignedJobDetails({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobType, setJobType] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // First get all assigned jobs
        const assignedJobsResponse = await ApiKit.me.job.assigned.getJobs();
        console.log('All assigned jobs:', assignedJobsResponse.data);

        // Find the specific job we're looking for
        const assignedJob = assignedJobsResponse.data.results.find(
          job => job.uid === params.slug
        );

        if (!assignedJob) {
          console.error('Job not found in assigned jobs list');
          throw new Error('Job not found in your assigned jobs');
        }

        // Determine job type from category
        let type = '';
        const categorySlug = assignedJob?.category?.[0]?.slug?.toLowerCase();
        
        if (categorySlug.includes('delivery')) {
          type = 'delivery';
        } else if (categorySlug.includes('removal')) {
          type = 'removal';
        } else if (categorySlug.includes('cleaning')) {
          type = 'cleaning';
        } else {
          throw new Error('Unknown job type');
        }

        console.log('Detected job type:', type);
        setJobType(type);

        // Get detailed job information
        const response = await ApiKit.me.job.assigned.getJobDetails(params.slug, type);
        console.log('Job details:', response.data);

        if (!response.data) {
          throw new Error('No job details received');
        }

        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        toast.error(err.message || 'Failed to load job details');
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchJobDetails();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Job not found</div>
      </div>
    );
  }

  // Render the appropriate overview component based on job type
  const renderJobOverview = () => {
    switch (jobType) {
      case 'delivery':
        return <DeliveryOverview job={job} />;
      case 'removal':
        return <RemovalOverview job={job} />;
      case 'cleaning':
        return <CleaningOverview job={job} />;
      default:
        return <div>Unknown job type</div>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-gray-600">Job Type: {jobType}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg">
        {renderJobOverview()}
      </div>

      {/* Error message if any */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
