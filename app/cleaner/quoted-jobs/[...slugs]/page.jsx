import UserJobDetailsPage from "@/modules/cleaner/quoted-jobs/[slug]";

export const metadata = {
  title: "Driver Open Job Details - MovMonkey",
};

export default function DriverOpenJobs({ params }) {
  return <UserJobDetailsPage params={params} />;
}
