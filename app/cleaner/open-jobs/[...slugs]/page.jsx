import CleanerOpenJobDetailsPage from "@/modules/cleaner/open-jobs/[slugs]";

export const metadata = {
  title: "Cleaner Open Job Details - MovMonkey",
};

export default function DriverOpenJobs({ params }) {
  return <CleanerOpenJobDetailsPage slug={params.slugs[0]} />;
}
