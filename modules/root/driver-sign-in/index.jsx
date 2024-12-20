"use client";

import * as Yup from "yup";
import DriverLogin from "@/public/image/driver-login.jpg";
import Image from "next/image";
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
import { useState } from "react";
import ApiKit from "@/common/ApiKit";
import { toast } from "sonner";
import SelectField from "@/components/form/SelectField";
import { driverRole } from "@/lib/keyChain";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import { setTokenAndRedirect } from "@/lib/utils";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  kind: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .required("Role is required"),
});

export default function DriverLogInPage() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const previousURL = searchParams.get("next");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      kind: null,
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        ...values,
        username: values.username.includes(" ")
          ? values.username.replace(/\s/g, "").toLowerCase()
          : values.username.toLowerCase(),
        kind: values.kind.value,
      };
      const promise = ApiKit.auth
        .login(payload)
        .then(({ data }) => {
          formik.resetForm();
          setTokenAndRedirect(data.access, () => {
            if (previousURL) {
              router.push(previousURL);
            } else {
              router.push("/driver/open-jobs");
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
              src={DriverLogin}
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
              Driver Sign In
            </h3>
            <p className="text-[#8C8C8C] max-sm:text-sm">
              Welcome to MovMonkey, let’s get you sign in!
            </p>

            <form className="mt-2 lg:mt-6" onSubmit={formik.handleSubmit}>
              <div className="space-y-1 lg:space-y-3">
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
                <div className="space-y-1">
                  <Label htmlFor="kind">Select your driving role</Label>
                  <SelectField
                    name="kind"
                    placeholder="E.g. Delivery Driver"
                    options={driverRole}
                    onChange={(selectValue) =>
                      formik.setFieldValue("kind", selectValue)
                    }
                    value={formik.values.kind}
                  />
                  {formik.touched.kind && formik.errors.kind ? (
                    <>
                      <div>
                        <div className="mt-2 rounded-full border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">
                          {formik.errors.kind}
                        </div>
                      </div>
                    </>
                  ) : null}
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
                    className="mt-2 w-44"
                    disabled={!agree}
                    loading={loading}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
