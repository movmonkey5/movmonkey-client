"use client";

import Image from "next/image";
import * as Yup from "yup";
import UserLogin from "@/public/image/user-login.jpg";
import LoginIcon from "@/components/icon/LoginIcon";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/ui/password";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import Link from "next/link";
import { useFormik } from "formik";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { useState } from "react";
import ApiKit from "@/common/ApiKit";
import { toast } from "sonner";
import { setTokenAndRedirect } from "@/lib/utils";
import GoogleAuth from "./components/GoogleAuth";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignInPage() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const previousURL = searchParams.get("next");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  let location;
  if (typeof window !== "undefined") {
    location = window.location;
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        ...values,
        username: values.username.includes(" ")
          ? values.username.replace(/\s/g, "").toLowerCase()
          : values.username.toLowerCase(),
        kind: "CUSTOMER",
      };
      const promise = ApiKit.auth
        .login(payload)
        .then(({ data }) => {
          formik.resetForm();
          setTokenAndRedirect(data.access, () => {
            if (previousURL) {
              router.push(previousURL);
            } else {
              router.push("/create-job");
            }
          });
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });

      toast.promise(promise, {
        loading: "Logging in...",
        success: "Logged in successfully",
        error: (error) => {
          const errorKeys = Object.keys(error?.response?.data);
          return (
            error.response?.data[errorKeys[0]][0] ||
            error.response.data?.detail ||
            "Failed to create account"
          );
        },
      });
    },
  });

  return (
    <div className="bg-secondary-bg">
      <Container>
        <div className="flex flex-col items-center rounded bg-white lg:flex-row">
          <div className="w-full md:w-6/12 xl:w-5/12">
            <Image
              src={UserLogin}
              alt=""
              className="hidden aspect-auto lg:block lg:rounded-l"
              quality={100}
            />
          </div>
          <div className="mx-auto h-full w-full max-w-lg select-none px-5 py-10 sm:py-20 md:w-6/12 xl:w-7/12">
            <div className="hidden w-fit rounded-2xl border bg-[#F5F5F5] p-2 md:block">
              <LoginIcon className="h-10 w-10" />
            </div>

            <h3 className="my-1 text-2xl font-semibold md:mt-4 lg:text-4xl">
              User Sign In
            </h3>
            <p className="text-[#8C8C8C] max-sm:text-sm">
              Don&#39;t have an account?{" "}
              <Link
                href="/sign-up"
                className="cursor-pointer font-semibold text-black underline"
              >
                Register
              </Link>
            </p>

            <div className="mt-2 lg:mt-6">
              <form
                className="space-y-1 lg:space-y-3"
                onSubmit={formik.handleSubmit}
              >
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormikErrorBox formik={formik} field="username" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Password
                    id="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormikErrorBox formik={formik} field="password" />
                </div>
                <Link
                  href={`/forgot-password?redirect=${pathName.split("/")[1]}`}
                  className="ml-auto block w-fit cursor-pointer text-end font-medium text-secondary hover:underline max-sm:text-sm"
                >
                  Forgot Password?
                </Link>

                <div className="flex items-start space-x-2 pt-2 lg:pt-0">
                  <Checkbox
                    id="terms"
                    checked={agree}
                    className="mt-0.5 rounded border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-white sm:mt-1"
                    onClick={() => setAgree(!agree)}
                  />
                  <label
                    htmlFor="terms"
                    className="cursor-pointer text-xs text-[#5D5F5F] sm:text-sm lg:text-base"
                  >
                    By submitting this form you agree to our Terms and
                    Conditions
                  </label>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="mt-2 px-16"
                    disabled={!agree}
                    loading={loading}
                  >
                    Login
                  </Button>
                </div>
              </form>

              <div className="relative py-3 lg:py-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#8C8C8C]">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleAuth origin={location?.origin} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
