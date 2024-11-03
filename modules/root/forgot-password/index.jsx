"use client";

import * as Yup from "yup";
import FingerPrint from "@/components/icon/FingerPrint";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { toast } from "sonner";
import ApiKit from "@/common/ApiKit";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      const promise = ApiKit.forgotPassword
        .sendMail(values)
        .then(() => {
          router.push(`/otp?email=${values.email}&redirect=${redirect}`);
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });

      toast.promise(promise, {
        loading: "Sending otp...",
        success: "Otp sent successfully",
        error: (error) => {
          return error.response.data?.message || "Failed to send otp";
        },
      });
    },
  });

  return (
    <div className="flex bg-secondary-bg max-lg:py-10 lg:min-h-[calc(100vh-125px)] lg:items-center">
      <Container>
        <div className="mx-auto max-w-lg rounded border bg-white p-5 py-10 shadow md:p-10">
          <div className="w-fit rounded-2xl border bg-[#F5F5F5] p-2">
            <FingerPrint className="h-10 w-10" />
          </div>

          <h3 className="my-2 text-2xl font-semibold md:mt-4 lg:text-4xl">
            Reset your password
          </h3>
          <p className="text-[#8C8C8C] max-sm:text-sm">
            Enter your email address to rest your password
          </p>

          <div className="mt-6">
            <form onSubmit={formik.handleSubmit}>
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E.g. johndoe@gmail.com"
              />
              <FormikErrorBox formik={formik} field="email" />

              <p className="mt-6 text-[#8C8C8C] max-sm:text-sm">
                We will send you an instruction through your email, so please
                make sure the email address is valid
              </p>

              <div className="mt-6 w-full">
                <Button type="submit" className="w-full" loading={loading}>
                  Send a Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
