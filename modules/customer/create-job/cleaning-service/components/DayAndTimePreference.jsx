import { cn } from "@/lib/utils";

export default function DayAndTimePreference({ data, handleClick, selected }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {data.map((item) => (
        <button
          type="button"
          key={item}
          className={cn(
            "border px-6 py-4 text-center",
            selected === item.toUpperCase().split(" ").join("_")
              ? "bg-primary text-black"
              : "border-primary text-primary",
          )}
          onClick={() => {
            handleClick(item);
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
