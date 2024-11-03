"use client";

import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/ui/password";
import { Button } from "@/components/ui/button";
import GoogleColorful from "@/components/icon/GoogleColorful";
import Container from "@/components/shared/Container";
import Link from "next/link";
import { useFormik } from "formik";
import { useState } from "react";
import FormikErrorBox from "@/components/form/FormikErrorBox";
import ApiKit from "@/common/ApiKit";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  country: Yup.string().required("Country is required"),
});

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      city: "",
      country: "",
      address: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        ...values,
        phone: values.phone.startsWith("+") ? values.phone : `+${values.phone}`,
      };

      const promise = ApiKit.auth
        .customerRegister(payload)
        .then(() => {
          formik.resetForm();
          router.push("/sign-in");
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => setLoading(false));

      toast.promise(promise, {
        loading: "Registering...",
        success: "Registration successful",
        error: (error) => {
          const errorKeys = Object.keys(error?.response?.data);
          return (
            error.response?.data[errorKeys[0]][0] ||
            error.response.data?.detail ||
            "Registration failed"
          );
        },
      });
    },
  });

  return (
    <div className="bg-secondary-bg">
      <Container>
        <div>
          <div className="mx-auto w-full max-w-lg select-none rounded-md bg-white px-5 py-10 md:w-6/12 lg:px-10 xl:w-7/12">
            <h3 className="my-1 text-2xl font-semibold md:mt-4 lg:text-4xl">
              User Sign Up
            </h3>
            <p className="text-[#8C8C8C] max-sm:text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="cursor-pointer font-semibold text-black underline"
              >
                Login
              </Link>
            </p>

            <div className="mt-2 lg:mt-6">
              <form
                className="space-y-1 lg:space-y-3"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex flex-col items-center justify-between gap-1 xs:flex-row sm:gap-3">
                  <div className="w-full space-y-1">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      type="text"
                      id="first_name"
                      placeholder="E.g. John"
                      value={formik.values.first_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <FormikErrorBox formik={formik} field={"first_name"} />
                  </div>

                  <div className="w-full space-y-1">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      type="text"
                      id="last_name"
                      placeholder="E.g. Doe"
                      value={formik.values.last_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <FormikErrorBox formik={formik} field="last_name" />
                  </div>
                </div>

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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="text"
                    id="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormikErrorBox formik={formik} field="email" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <PhoneInput
                    country={"gb"}
                    type="tel"
                    id="phone"
                    placeholder="Enter your phone"
                    onChange={(formattedValue) => {
                      formik.setFieldValue("phone", formattedValue);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  <FormikErrorBox formik={formik} field="phone" />
                </div>
                {/* City */}
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    type="text"
                    id="city"
                    placeholder="Enter your city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormikErrorBox formik={formik} field="city" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="block w-full rounded-3xl border  border-gray-300 p-2"
                  >
                    <option value="">Select Country</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                    <option value="ca">Canada</option>
                    <option value="us">United States</option>
                  </select>
                  <FormikErrorBox formik={formik} field="country" />
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Enter your address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormikErrorBox formik={formik} field="address" />
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

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="mt-5 px-16 lg:mt-2"
                    disabled={loading}
                  >
                    Register Now
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
