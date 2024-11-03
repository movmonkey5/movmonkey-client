import { CircleChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function MoveBackToDetails() {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        router.push(pathName.replace("/edit", ""));
      }}
    >
      <CircleChevronLeftIcon size={24} />
    </Button>
  );
}
