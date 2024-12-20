"use client";

import ApiKit from "@/common/ApiKit";
import OtpInbox from "@/components/icon/OtpInbox";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function OtpPage() {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const redirect = searchParams.get("redirect");
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (value.length === 0) {
      toast.error("Please enter otp");
    } else if (value.length < 6) {
      toast.error("Otp must be 6 digits long");
    } else {
      setLoading(true);
      const promise = ApiKit.forgotPassword
        .resetPassword({ otp: value })
        .then(() => {
          router.push(
            `/reset-password?email=${email}&otp=${value}&redirect=${redirect}`,
          );
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });

      toast.promise(promise, {
        loading: "Verifying otp...",
        success: "Otp verified successfully",
        error: (error) => {
          return error.response.data?.message || "Failed to verify otp";
        },
      });
    }
  };

  const handleResend = () => {
    setValue("");
    setResetLoading(true);
    const promise = ApiKit.forgotPassword
      .sendMail({ email })
      .then(() => {})
      .catch((error) => {
        console.log(error);
        throw error;
      })
      .finally(() => {
        setResetLoading(false);
      });

    toast.promise(promise, {
      loading: "Resending otp...",
      success: "Otp sent successfully",
      error: (error) => {
        return error.response.data?.message || "Failed to resend otp";
      },
    });
  };

  return (
    <div className="flex bg-secondary-bg max-lg:py-10 lg:min-h-[calc(100vh-125px)] lg:items-center">
      <Container>
        <div className="mx-auto max-w-lg rounded border bg-white p-5 py-10 shadow md:p-10">
          <div className="w-fit rounded-2xl border bg-[#F5F5F5] p-2">
            <OtpInbox className="h-10 w-10" />
          </div>

          <h3 className="my-2 text-2xl font-semibold md:mt-4 lg:text-4xl">
            Reset your password
          </h3>
          <p className="text-[#8C8C8C] max-sm:text-sm">
            We sent a code to{" "}
            <span className="font-bold text-black">{email}</span>
          </p>

          <div className="mt-6">
            <div>
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
              >
                <InputOTPGroup className="w-fit">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {resetLoading ? (
                <p className="mt-6 text-[#8C8C8C] max-sm:text-sm">
                  Resending otp...
                </p>
              ) : (
                <p className="mt-6 text-[#8C8C8C] max-sm:text-sm">
                  Didn’t receive the email?{" "}
                  <span
                    onClick={handleResend}
                    className="cursor-pointer font-bold text-black hover:underline"
                  >
                    Click to resend
                  </span>
                </p>
              )}

              <div className="mt-6">
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  className="w-full"
                >
                  Confirmation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
