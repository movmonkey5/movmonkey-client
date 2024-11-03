import { cn } from "@/lib/utils";

export default function Container({ children, extraClassName }) {
  const containerClasses = cn(
    "mx-auto",
    "max-w-7xl",
    "px-4",
    "py-5",
    "lg:py-8",
    extraClassName,
  );

  return <div className={containerClasses}>{children}</div>;
}
