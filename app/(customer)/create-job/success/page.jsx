import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DeliveryDriverJobPostSuccess() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-5">
      <h1 className="mb-8 text-3xl">WHAT HAPPENS NEXT ?</h1>
      <div className="w-full max-w-lg rounded-lg p-5">
        <div className="mb-4 flex flex-col items-center gap-4  bg-green-100 p-6 ">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
            1
          </div>
          <p className="ml-4 ">
            Your quote request has been sent to up to 4 of our top service
            providers.
          </p>
        </div>
        <div className="mb-4 flex flex-col items-center gap-4  bg-green-100 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
            2
          </div>
          <p className="ml-4">
            You will soon receive no-obligation quotes in the Notification tab
            of your profile.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="mt-5 ">
            <Link href="/create-job">
              <Button className="bg-green-500 px-14 font-medium text-white hover:bg-black hover:text-white">
                Close
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
