/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ApiKit from "@/common/ApiKit";
import ProfilePictureUploader from "@/components/form/ProfilePictureUploader";
import Container from "@/components/shared/Container";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Password } from "@/components/ui/password";
import useStore from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DriverProfileEditPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useStore();
  const formik = useFormik({
    initialValues: {
      uid: "",
      slug: "",
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      role: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log("start submit");
      setLoading(true);
      const payload = {
        ...values,
        avatar: images[0],
      };

      if (typeof payload.avatar !== "object") {
        delete payload.avatar;
      }
      const formData = new FormData();

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      const promise = ApiKit.me
        .updateProfile(formData)
        .then(() => {
          fetchUser();
          router.push("/driver/profile");
        })
        .catch((error) => {
          console.error(error);
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });

      toast.promise(promise, {
        loading: "Saving changes...",
        success: "Profile updated successfully",
        error: (error) => {
          const errorKeys = Object.keys(error?.response?.data);
          return (
            error.response?.data[errorKeys[0]][0] ||
            error.response.data?.detail ||
            "Profile update failed"
          );
        },
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["me/getProfile"],
    queryFn: () => ApiKit.me.getProfile().then(({ data }) => data),
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        uid: data.uid,
        slug: data.slug,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        role: data.role,
      });
    }
  }, [data]);

  if (isLoading) {
    return <Loading className="min-h-[calc(100vh-8rem)]" />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <Container>
        <h4 className="text-4xl font-bold">Edit Profile</h4>
        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="avatar" className="ml-0">
              Upload profile picture
            </Label>
            <p className="text-xs text-gray-500">
              Recommended: (500px * 500px)
            </p>

            <div className="mt-2">
              <ProfilePictureUploader files={images} setFiles={setImages} />
            </div>
          </div>

          <div className="flex items-center gap-4 max-sm:flex-col">
            {" "}
            <div className="w-full">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={formik.values.username}
                disabled
              />
            </div>
            <div className="w-full">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                type="role"
                name="role"
                value={formik.values.role}
                disabled
              />
            </div>
          </div>

          <div className="flex items-center gap-4 max-sm:flex-col">
            <div className="w-full">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                name="first_name"
                onChange={formik.handleChange}
                value={formik.values.first_name}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                name="last_name"
                onChange={formik.handleChange}
                value={formik.values.last_name}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 max-sm:flex-col">
            <div className="w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="w-full">
              <Label htmlFor="password">Password</Label>
              <Password
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Button loading={loading} type="submit" variant="secondary">
              Save Changes
            </Button>
            <Link href="/driver/profile">
              <Button type="button" variant="accent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
}
