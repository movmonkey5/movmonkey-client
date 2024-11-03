/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY, ROLE } from "@/lib/keyChain";
import { setTokenAndRedirect } from "@/lib/utils";
import useStore from "@/store";
import Loading from "../shared/Loading";

export default function CleanerAuthGuardHoc({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userLoading, fetchUser } = useStore();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      setTokenAndRedirect(token)
        .then(() => {
          fetchUser();
        })
        .catch((error) => {
          console.log("Error from setTokenAndRedirect", error);
          router.push("/logout");
        });
    } else {
      const nextURL = { next: pathname };
      const queryParams = new URLSearchParams(nextURL).toString();
      router.push(`/cleaning-provider-sign-in?${queryParams}`);
    }
  }, []);

  if (userLoading) {
    return <Loading className="h-screen" />;
  }

  return user?.username && user?.role === ROLE.CLEANING_PROVIDER
    ? children
    : null;
}
