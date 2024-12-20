"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Password = React.forwardRef(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <input
        type={`${showPassword ? "text" : "password"}`}
        className={cn(
          "flex h-10 w-full rounded-full border border-slate-300 bg-white px-3 py-2 pr-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          className,
        )}
        ref={ref}
        {...props}
      />
      <div
        onClick={() => setShowPassword(!showPassword)}
        className="cursor-pointer"
      >
        {showPassword ? (
          <EyeOff className="absolute right-3 top-1/2 h-5 w-6 -translate-y-1/2 transform text-slate-500" />
        ) : (
          <Eye className="absolute right-3 top-1/2 h-5 w-6 -translate-y-1/2 transform text-slate-500" />
        )}
      </div>
    </div>
  );
});
Password.displayName = "Password";

export { Password };
