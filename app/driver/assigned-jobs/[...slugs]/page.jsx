import DriverAssignedJobDetailsPage from "@/modules/driver/assigned-jobs/[slug]";

export const metadata = {
  title: "Driver Open Job Details - MovMonkey",
};

export default function DriverOpenJobs({ params }) {
  return <DriverAssignedJobDetailsPage params={params} />;
}
