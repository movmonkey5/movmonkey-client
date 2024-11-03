import DriverQuotedJobDetailsPage from "@/modules/driver/quoted-jobs/[slug]";

export const metadata = {
  title: "Driver Open Job Details - MovMonkey",
};

export default function DriverOpenJobs({ params }) {
  return <DriverQuotedJobDetailsPage params={params} />;
}
