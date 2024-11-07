import Image from "next/image";
import { Star } from "lucide-react"; // Import icon for star rating
import userPlaceHolder from "@/public/image/user-placeholder-green.png"; // Ensure placeholder is imported

export default function ReviewList({ reviewList }) {
  console.log("Review Data:", reviewList);

  return (
    <div className="mt-8">
      <h4 className="mb-4 text-xl font-bold">Reviews Given</h4>
      {reviewList && reviewList.length > 0 ? (
        reviewList.map((review) => (
          <div
            key={review.uid}
            className="mb-4 flex  items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md md:flex-row"
          >
            <Image
              src={review.driver?.avatar?.at350x350 || userPlaceHolder}
              alt={`${review.driver?.full_name || "User"}'s avatar`}
              width={50}
              height={50}
              className="rounded-full border-2 border-secondary object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold lg:text-lg">
                  {review.driver?.full_name || "Anonymous"}
                </h5>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${
                        index < review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.description}</p>
              <p className="mt-1 text-xs lg:text-sm text-gray-500">
                Job Type:{" "}
                <span className="font-medium">
                  {review.kind.replace("_JOB", "")}
                </span>
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews given yet.</p>
      )}
    </div>
  );
}
