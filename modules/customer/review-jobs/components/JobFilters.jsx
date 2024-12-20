import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function JobFilters({ kindOptions, jobKind, setJobKind }) {
  return (
    <div className="flex flex-wrap gap-3">
      {kindOptions
        .filter((kind) => kind.count > 0)
        .map((kind) => (
          <Badge
            key={kind.label}
            onClick={() => setJobKind(kind.value)}
            className={cn(
              jobKind === kind.value
                ? "border-2 border-secondary bg-secondary"
                : "border-2 border-black bg-transparent text-black",
              "cursor-pointer px-3 py-1 text-xs xs:text-base",
            )}
          >
            {kind.label}
          </Badge>
        ))}
    </div>
  );
}
