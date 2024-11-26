import { format } from "date-fns";
import Link from "next/link";

const colorSchema = {
  DELIVERY_JOB: "border-[#BAEDE6] bg-[#DBF9F9]",
  REMOVAL_JOB: "border-[#FEC7C5] bg-[#FFF0D1]",
};

const spanColor = {
  DELIVERY_JOB: "border-[#BAEDE6] bg-[#CEF2EE]",
  REMOVAL_JOB: "border-[#FEC7C5] bg-[#FEC7C5]",
};

export default function JobCard({ job }) {
  const postedDate = job?.created_at || new Date();
  const executionDate = job?.moving_date || new Date();

  return (
    <Link href={`/jobs/${job?.uid}`}
    >
      <div
        className={`flex rounded-md border text-sm bg-gray-500 text-black`}
      >
        <div
          className={`hidden w-14 rounded-md border md:block ${spanColor[job?.kind]}`}
        ></div>
        <div className="flex w-full flex-col gap-2 p-4">
          <h4 className="text-xl font-bold">{job?.title}</h4>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
            <p>Posted At: {format(postedDate, "PPPppp")}</p>
            <p>Execution Date: {format(executionDate, "PPP")}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
