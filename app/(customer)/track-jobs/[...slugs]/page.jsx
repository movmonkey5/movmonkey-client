import UserJobTrack from "@/modules/customer/track-jobs/[...slugs]";

export default function UserJobDetails({ params }) {
  return <UserJobTrack params={params} />;
}
