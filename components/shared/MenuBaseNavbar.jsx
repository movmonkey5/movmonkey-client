import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import useStore from "@/store";
import Image from "next/image";
import userPlaceHolder from "@/public/image/user-placeholder.png";
import { Menu } from "@headlessui/react";
import { ProfileMenuDropDown } from "@/lib/keyChain";
import { usePathname } from "next/navigation";
import { addRolePrefixToUrlsAndFilter, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import ApiKit from "@/common/ApiKit";
import NotificationComponent from "./Notification";
import Facebook from "../icon/Facebook";
import Google from "../icon/Google";
import Instagram from "../icon/Insta";
import Twitter from "../icon/Twitter";
import Youtube from "../icon/Youtube";

export default function MenuBaseNavbar({
  showSignInSubmenu,
  setShowSignInSubmenu,
  showSignUpSubmenu,
  setShowSignUpSubmenu,
}) {
  const { user } = useStore();
  const pathname = usePathname();

  const handleNotificationClick = (notification) => {
    let link = "";
    const { model_kind, notification_kind, uid } = notification;
    const userRole = user?.role; // Assuming the user object has the role

    if (model_kind === "QUOTATION") {
      const kind = notification.quotation.kind.toLowerCase();

      // Role-specific URL structure
      if (userRole === "CUSTOMER") {
        if (notification_kind === "NEW_QUOTATION") {
          link = `/quotation/${kind}/${uid}?from=notifications`;
        } else if (notification_kind === "QUOTATION_ACCEPTED") {
          link = `/customer/quoted-jobs/${kind}/${uid}?from=notifications`;
        } else if (notification_kind === "QUOTATION_DECLINED") {
          link = `/customer/quoted-jobs/${kind}/${uid}?from=notifications`;
        }
      } else if (
        userRole === "DELIVERY_DRIVER" ||
        userRole === "REMOVAL_DRIVER"
      ) {
        if (notification_kind === "NEW_QUOTATION") {
          link = `/driver/quotation/${kind}/${uid}?from=notifications`;
        } else if (notification_kind === "QUOTATION_ACCEPTED") {
          link = `/driver/quoted-jobs/${kind}/${uid}?from=notifications`;
        } else if (notification_kind === "QUOTATION_DECLINED") {
          link = `/driver/quoted-jobs/${kind}/${uid}?from=notifications`;
        }
      } else if (userRole === "CLEANING_PROVIDER") {
        if (notification_kind === "NEW_QUOTATION") {
          link = `/cleaner/quotation/${kind}/${uid}?from=notifications`;
        } else if (notification_kind === "QUOTATION_ACCEPTED") {
          link = `/cleaner/quoted-jobs/${kind}/${uid}?from=notifications`;
        } else if (notification_kind === "QUOTATION_COMPLETED") {
          link = `/cleaner/quoted-jobs/${kind}/${uid}?from=notifications`;
        } else if (notification_kind === "QUOTATION_DECLINED") {
          link = `/cleaner/quoted-jobs/${kind}/${uid}?from=notifications`;
        }
      }
    }

    // Redirect to the constructed link
    if (link) {
      window.location.href = link;
    }
  };
  return (
    <div className="relative z-50 flex items-center gap-12">
      <div className="flex items-center max-h-20 gap-4 rounded-[12px] bg-secondary px-4 py-8 text-white lg:gap-8 lg:px-8">
        <Link href={""}>
          <Facebook />
        </Link>
        <Link href={""}>
          <Twitter />
        </Link>
        <Link href={""}>
          <Google />
        </Link>
        <Link href={""}>
          <Youtube />
        </Link>
      </div>

      <ul className=" flex items-center max-h-20 gap-4 rounded-[12px] bg-secondary px-4 py-7 text-white lg:gap-8 lg:px-8">
        <li>
          <Link
            href="/"
            onClick={() => {
              setShowSignInSubmenu(false);
              setShowSignUpSubmenu(false);
            }}
            className={cn("text-white hover:bg-green-700 px-3 py-1.5 rounded-lg", {
              "bg-green-700": pathname === "/",
              "": pathname !== "/",
            })}
          >
            Home
          </Link>
        </li>
        <li>
          <Link href="/about-us" className={cn("text-white hover:bg-green-700 px-3 py-1.5 rounded-lg", {
            "bg-green-700": pathname === "/about-us",
            "": pathname !== "/",
          })}>
            About Us
          </Link>
        </li>

        <li>
          <Link
            href="/blog"
            onClick={() => {
              setShowSignInSubmenu(false);
              setShowSignUpSubmenu(false);
            }}
            className={cn("text-white hover:bg-green-700 px-3 py-1.5 rounded-lg", {
              "bg-green-700": pathname === "/blog",
              "": pathname !== "/",
            })}
          >
            Blog
          </Link>
        </li>

        {user && (
          <NotificationComponent
            handleNotificationClick={handleNotificationClick}
          />
        )}

        {user ? (
          <Menu as="div" className="relative hidden sm:block">
            <Menu.Button className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-white px-4 py-1.5">
              <div>
                <p className="text-start text-xs font-medium text-white">
                  {user?.full_name.length > 10 ? user?.full_name.slice(0,10) : user?.full_name}
                </p>
                <p className="text-start text-[10px] text-white">
                  {user?.role?.split("_")?.join(" ")}
                </p>
              </div>
              <div className="size-7">
                <Image
                  src={
                    Object.keys(user?.avatar)?.length
                      ? user?.avatar["at200x200"]
                      : userPlaceHolder
                  }
                  width={100}
                  height={100}
                  className="size-7 rounded-full"
                  alt="user avatar"
                />
              </div>
            </Menu.Button>

            <Menu.Items
              className={
                "absolute right-0 z-50 mt-1 w-52 origin-top-right rounded-lg bg-gray-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              }
            >
              {addRolePrefixToUrlsAndFilter(
                ProfileMenuDropDown,
                ["/profile", "/open-jobs"],
                user?.role,
              ).map((route, index) => (
                <Menu.Item key={index + 1}>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex w-52 items-center gap-2 p-4 text-center text-sm font-medium duration-300 first:rounded-t-md last:rounded-b-md",
                      {
                        "bg-secondary text-white hover:bg-secondary hover:text-white":
                          pathname === route.href,
                        "bg-white text-black hover:bg-secondary-bg":
                          pathname !== route.href,
                        "hover:bg-danger hover:text-white":
                          route.href === "/logout",
                      },
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.name}
                  </Link>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        ) : (
          <>
            <li className="relative">
              <span
                className="flex cursor-pointer items-center gap-1"
                onClick={() => {
                  setShowSignInSubmenu(!showSignInSubmenu);
                  setShowSignUpSubmenu(false);
                }}
              >
                Sign In
                <div>{showSignInSubmenu ? <ChevronUp /> : <ChevronDown />}</div>
              </span>
              <ul
                className={`absolute right-0 top-10 w-60 rounded-md shadow-lg ${showSignInSubmenu ? "block" : "hidden"
                  }`}
              >
                <Link
                  onClick={() => setShowSignInSubmenu(false)}
                  href="/sign-in"
                  className="block rounded-t bg-primary p-4 text-black duration-100 hover:text-white"
                >
                  User Sign In
                </Link>
                <hr />
                <Link
                  onClick={() => setShowSignInSubmenu(false)}
                  href="/driver-sign-in"
                  className="block bg-primary p-4 text-black duration-100 hover:text-white"
                >
                  Driver Sign In
                </Link>
                <hr />
                <Link
                  onClick={() => setShowSignInSubmenu(false)}
                  href="/cleaning-provider-sign-in"
                  className="block rounded-b bg-primary p-4 text-black duration-100 hover:text-white"
                >
                  Cleaning Provider Sign In
                </Link>
              </ul>
            </li>
            <li className="relative">
              <span
                className="flex cursor-pointer items-center gap-1"
                onClick={() => {
                  setShowSignUpSubmenu(!showSignUpSubmenu);
                  setShowSignInSubmenu(false);
                }}
              >
                Sign Up
                <div>{showSignUpSubmenu ? <ChevronUp /> : <ChevronDown />}</div>
              </span>
              <ul
                className={`absolute right-0 top-10 w-60 rounded-md shadow-lg ${showSignUpSubmenu ? "block" : "hidden"
                  }`}
              >
                <Link
                  onClick={() => setShowSignUpSubmenu(false)}
                  href="/sign-up"
                  className="block rounded-t bg-primary p-4 text-black duration-100 hover:text-white"
                >
                  User Sign Up
                </Link>
                <hr />
                <Link
                  onClick={() => setShowSignUpSubmenu(false)}
                  href="/driver-sign-up"
                  className="block bg-primary p-4 text-black duration-100 hover:text-white"
                >
                  Driver Sign Up
                </Link>
                <hr />
                <Link
                  onClick={() => setShowSignUpSubmenu(false)}
                  href="/cleaning-provider-sign-up"
                  className="block rounded-b bg-primary p-4 text-black duration-100 hover:text-white"
                >
                  Cleaning Provider Sign Up
                </Link>
              </ul>
            </li>
          </>
        )}
      </ul>

    </div>
  );
}
