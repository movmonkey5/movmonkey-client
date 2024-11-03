"use client";

import * as Yup from "yup";
import ApiKit from "@/common/ApiKit";
import NewPassword from "@/components/icon/NewPassword";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Password } from "@/components/ui/password";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import FormikErrorBox from "@/components/form/FormikErrorBox";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const otp = searchParams.get("otp");
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        ...values,
        otp,
      };

      const promise = ApiKit.forgotPassword
        .resetPassword(payload)
        .then(() => {
          router.push(`/${redirect}`);
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });

      toast.promise(promise, {
        loading: "Resetting password...",
        success: "Password reset successfully",
        error: (error) => {
          return error.response.data?.message || "Failed to reset password";
        },
      });
    },
  });

  return (
    <div className="flex bg-secondary-bg max-lg:py-10 lg:min-h-[calc(100vh-125px)] lg:items-center">
      <Container>
        <div className="mx-auto max-w-lg rounded border bg-white p-5 py-10 shadow md:p-10">
          <div className="w-fit rounded-2xl border bg-[#F5F5F5] p-2">
            <NewPassword className="h-10 w-10" />
          </div>

          <h3 className="my-2 text-2xl font-semibold md:mt-4 lg:text-4xl">
            Set your new password
          </h3>
          <p className="text-[#8C8C8C] max-sm:text-sm">
            Password must be at least 6 characters long and contain both letters
            and numbers.
          </p>

          <div className="mt-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-3">
                <div>
                  <Password
                    id="password"
                    name="password"
                    placeholder="Enter your new password"
                    values={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <>
                      <div>
                        <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                          {formik.errors.password}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div>
                  <Password
                    id="confirm_password"
                    placeholder="Confirm your new password"
                    name="confirm_password"
                    values={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirm_password &&
                  formik.errors.confirm_password ? (
                    <>
                      <div>
                        <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                          {formik.errors.confirm_password}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 w-full">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full lg:px-16"
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
