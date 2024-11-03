import DriverOpenJobDetailsPage from "@/modules/driver/open-jobs/slug";

export const metadata = {
  title: "Driver Open Job Details - MovMonkey",
};

export default function DriverOpenJobs({ params }) {
  return <DriverOpenJobDetailsPage params={params} />;
}
