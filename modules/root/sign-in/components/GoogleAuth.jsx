"use client";

import GoogleColorful from "@/components/icon/GoogleColorful";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Generate URL with query parameters
const getURLWithQueryParams = (base, params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `${base}?${query}`;
};

export default function GoogleAuth({ origin }) {
  const googleURL = getURLWithQueryParams(
    "https://accounts.google.com/o/oauth2/v2/auth",
    {
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: `${origin}/auth/google`,
      state: process.env.NEXT_PUBLIC_GOOGLE_STATE,
      scope: "openid email profile",
      access_type: "offline",
      include_granted_scopes: "true",
    },
  );

  return (
    <Link href={googleURL}>
      <Button className="w-full bg-[#F5F5F5] text-[#6F6F6F] hover:bg-[#F5F5F5]/90">
        <div>
          <GoogleColorful className="mr-2 flex h-5 w-5 items-center" />
        </div>
        Sign in With Google
      </Button>
    </Link>
  );
}
