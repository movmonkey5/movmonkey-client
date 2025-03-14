import JobCard from "./JobCard";
import { motion } from "framer-motion";

export default function JobList({ jobs = [] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {jobs.map((job) => (
        <motion.div key={job.uid || job.job_uid} variants={item}>
          <JobCard job={job} />
        </motion.div>
      ))}
      {jobs.length === 0 && (
        <div className="col-span-full text-center p-8">
          <p>No completed jobs available</p>
        </div>
      )}
    </motion.div>
  );
}
