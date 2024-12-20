"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const DEFAULT_STYLES =
  "cursor-pointer text-base truncate overflow-x-auto px-10";
const ACTIVE_TAB_STYLES =
  "font-semibold rounded-t-md border-b-4 border-secondary pb-[9px] px-10";
const DEFAULT_TAB_STYLES = "font-normal px-10";

export default function TabNavigation(props) {
  const { tabs } = props;
  const pathname = usePathname();

  return (
    <ul className="flex w-full justify-between gap-8 border-b-4 border-[#E3E3E3] pb-2">
      {tabs.map((tab) => (
        <li key={tab.label}>
          <Link
            href={tab.value}
            className={cn(
              DEFAULT_STYLES,
              pathname === tab.value ? ACTIVE_TAB_STYLES : DEFAULT_TAB_STYLES,
            )}
          >
            {tab.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
