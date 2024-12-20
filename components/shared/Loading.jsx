import { cn } from "@/lib/utils";
import MovMonkey from "../icon/MovMonkey";

export default function Loading({ className, iconClassName }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center py-20",
        className,
      )}
    >
      <MovMonkey className={iconClassName} />
    </div>
  );
}
