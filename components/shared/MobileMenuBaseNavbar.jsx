import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { usePathname } from "next/navigation";
import useStore from "@/store";
import { Button } from "../ui/button";
import { addRolePrefixToUrlsAndFilter, cn } from "@/lib/utils";
import { ProfileMenuDropDown } from "@/lib/keyChain";

export default function MobileMenuBaseNavbar({ setShowMenu }) {
  const [showSignInSubmenu, setShowSignInSubmenu] = useState(false);
  const [showSignUpSubmenu, setShowSignUpSubmenu] = useState(false);
  const { user } = useStore();
  const pathname = usePathname();

  return (
    <menu>
      <ul className="space-y-1">
      <Link
          onClick={() => setShowMenu(false)}
          href="/"
          className={cn("block rounded px-4 py-3 text-black", {
            "bg-secondary text-white": pathname === "/",
            "hover:bg-secondary-bg": pathname !== "/",
          })}
        >
          Home
        </Link>
        <Link
          onClick={() => setShowMenu(false)}
          href="/about-us"
          className={cn("block rounded px-4 py-3 text-black", {
            "bg-secondary text-white": pathname === "/about-us",
            "hover:bg-secondary-bg": pathname !== "/about-us",
          })}
        >
          About Us
        </Link>
        <Link
          href="/blog"
          onClick={() => setShowMenu(false)}
          className={cn("block rounded px-4 py-3 text-black", {
            "bg-secondary text-white": pathname === "/blog",
            "hover:bg-secondary-bg": pathname !== "/blog",
          })}
        >
          Blog
        </Link>

        {user ? (
          <Link
            href="/logout"
            className="absolute bottom-5 right-5 mx-auto w-fit"
          >
            <Button variant="danger" className="w-full gap-2">
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </Link>
        ) : null}

        {!user ? (
          <>
            <Collapsible
              className="cursor-pointer rounded px-4 py-3"
              open={showSignInSubmenu}
              onOpenChange={setShowSignInSubmenu}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <p>Sign In</p>
                <div>{showSignInSubmenu ? <ChevronUp /> : <ChevronDown />}</div>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 space-y-1">
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/sign-in"
                  className={cn("block rounded px-4 py-3 text-black", {
                    "bg-secondary text-white": pathname === "/sign-in",
                    "hover:bg-secondary-bg": pathname !== "/sign-in",
                  })}
                >
                  User Sign In
                </Link>
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/driver-sign-in"
                  className={cn("block rounded px-4 py-3 text-black", {
                    "bg-secondary text-white": pathname === "/driver-sign-in",
                    "hover:bg-secondary-bg": pathname !== "/driver-sign-in",
                  })}
                >
                  Driver Sign In
                </Link>
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/cleaning-provider-sign-in"
                  className={cn("block rounded px-4 py-3 text-black", {
                    "bg-secondary text-white":
                      pathname === "/cleaning-provider-sign-in",
                    "hover:bg-secondary-bg":
                      pathname !== "/cleaning-provider-sign-in",
                  })}
                >
                  Cleaning Provider Sign In
                </Link>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              className="cursor-pointer rounded px-4 py-3"
              open={showSignUpSubmenu}
              onOpenChange={setShowSignUpSubmenu}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <p>Sign Up</p>
                <div>{showSignUpSubmenu ? <ChevronUp /> : <ChevronDown />}</div>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 space-y-1">
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/sign-up"
                  className={cn("block rounded px-4 py-3 text-black", {
                    "bg-secondary text-white": pathname === "/sign-up",
                    "hover:bg-secondary-bg": pathname !== "/sign-up",
                  })}
                >
                  User Sign Up
                </Link>
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/driver-sign-up"
                  className={cn("block rounded px-4 py-3 text-black", {
                    "bg-secondary text-white": pathname === "/driver-sign-up",
                    "hover:bg-secondary-bg": pathname !== "/driver-sign-up",
                  })}
                >
                  Driver Sign Up
                </Link>
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/cleaning-provider-sign-up"
                  className={cn("block rounded px-4 py-3 text-black", {
                    "bg-secondary text-white":
                      pathname === "/cleaning-provider-sign-up",
                    "hover:bg-secondary-bg":
                      pathname !== "/cleaning-provider-sign-up",
                  })}
                >
                  Cleaning Provider Sign Up
                </Link>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <>
            <hr />
            {addRolePrefixToUrlsAndFilter(
              ProfileMenuDropDown,
              ["/profile", "/open-jobs"],
              user?.role,
            )
              .slice(0, ProfileMenuDropDown.length - 1)
              .map((route, index) => (
                <Link
                  key={index + 1}
                  href={route.href}
                  onClick={() => setShowMenu(false)}
                  className={cn(
                    "flex items-center gap-2 rounded px-4 py-3 text-black",
                    {
                      "bg-secondary text-white": pathname === route.href,
                      "hover:bg-secondary-bg": pathname !== route.href,
                    },
                  )}
                >
                  <route.icon />
                  {route.name}
                </Link>
              ))}
          </>
        )}
      </ul>
    </menu>
  );
}
