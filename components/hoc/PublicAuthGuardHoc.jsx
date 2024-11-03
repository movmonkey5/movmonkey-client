/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { AUTH_TOKEN_KEY } from "@/lib/keyChain";
import { setTokenAndRedirect } from "@/lib/utils";
import Loading from "../shared/Loading";
import useStore from "@/store";
import HttpKit from "@/common/HttpKit";

let location;
if (typeof window !== "undefined") {
  location = window.location;
}

export default function PublicAuthGuardHoc({ children }) {
  const { userLoading, fetchUser } = useStore();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      setTokenAndRedirect(token).then(() => {
        fetchUser()
          .then(() => {})
          .catch(() => {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            HttpKit.client.defaults.headers.common["Authorization"] = "";
            window.location.reload();
          });
      });
    }
  }, []);

  if (userLoading) {
    return <Loading className="h-screen" />;
  }

  return children;
}
