import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const packagesData = [
  {
    name: "WEEKLY",
    includes: ["Same dedicated cleaner", "Account manager", "Insured + more"],
  },
  {
    name: "FORTNIGHTLY",
    includes: ["Same dedicated cleaner", "Account manager", "Insured + more"],
  },
  {
    name: "OTHER",
    includes: ["Same dedicated cleaner", "Account manager", "Insured + more"],
  },
];

export default function CleanerPackages({ formik }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packagesData.map((item) => (
        <div
          key={item.name}
          className={cn(
            "flex flex-col justify-center gap-4 rounded-md bg-[#FFF2DE] p-6 shadow-sm",
            {
              "bg-primary": formik.values.cleaning_plan === item.name,
            },
          )}
        >
          <h4 className="text-center text-lg font-bold">{item.name}</h4>
          <ul className="list-inside list-disc text-left">
            {item.includes.map((el) => (
              <li key={el}>{el}</li>
            ))}
          </ul>
          <Button
            type="button"
            className={cn("self-center px-8", {
              "bg-white text-black hover:bg-white hover:text-black":
                formik.values.cleaning_plan === item.name,
            })}
            onClick={() => {
              formik.setFieldValue("cleaning_plan", item.name);
            }}
          >
            {formik.values.cleaning_plan === item.name ? "Selected" : "Select"}
          </Button>
        </div>
      ))}
    </div>
  );
}
