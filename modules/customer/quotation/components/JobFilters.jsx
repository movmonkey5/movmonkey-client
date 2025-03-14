import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function JobFilters({ kindOptions, jobKind, setJobKind }) {
  const handleKindClick = (value) => {
    setJobKind(value);
  };

  // Animation variants for filter buttons
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 5, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-2 md:gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {kindOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => handleKindClick(option.value)}
          className={cn(
            "rounded-full border border-primary px-4 py-1.5 text-sm transition-colors md:text-base",
            {
              "bg-primary text-white": jobKind === option.value,
              "bg-transparent text-primary": jobKind !== option.value,
            }
          )}
          variants={item}
        >
          {option.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
