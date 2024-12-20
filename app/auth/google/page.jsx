/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ApiKit from "@/common/ApiKit";
import Loading from "@/components/shared/Loading";
import { setTokenAndRedirect } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextURL = searchParams.get("next");
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  useEffect(() => {
    const authenticateUser = async () => {
      if (code) {
        try {
          const { data } = await ApiKit.auth.googleLogin({ code });

          setTokenAndRedirect(data.access, () => {
            if (nextURL) {
              router.push(nextURL);
            } else {
              router.push("/create-job");
            }
          });
        } catch (error) {
          router.push("/sign-in");
        }
      } else if (error === "access_denied") {
        router.push("/sign-in");
      } else {
        router.push("/sign-in");
      }
    };

    authenticateUser();
  }, [code]);

  return <Loading className="h-screen" />;
}
