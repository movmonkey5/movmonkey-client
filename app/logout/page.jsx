/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AUTH_TOKEN_KEY } from "@/lib/keyChain";
import useStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const { logOut } = useStore();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await logOut();
      router.push("/sign-in");
    };

    logout();
  }, []);

  return null;
}
