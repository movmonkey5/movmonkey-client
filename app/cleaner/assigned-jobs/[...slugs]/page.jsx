import CleanerAssignedJobDetailsPage from "@/modules/cleaner/assigned-jobs/[slug]";

export const metadata = {
  title: "Driver Open Job Details - MovMonkey",
};

export default function DriverOpenJobs({ params }) {
  return <CleanerAssignedJobDetailsPage params={params} />;
}
