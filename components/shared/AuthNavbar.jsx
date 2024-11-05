"use client";

import Image from "next/image";
import logo from "@/public/logo/logo.png";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { LogOut, Menu as MenuIcon } from "lucide-react";
import Drawer from "@/components/shared/Drawer";
import { useEffect, useState } from "react";
import useStore from "@/store";
import userPlaceHolder from "@/public/image/user-placeholder.png";
import { Menu } from "@headlessui/react";
import { ProfileMenuDropDown } from "@/lib/keyChain";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { addRolePrefixToUrlsAndFilter, cn } from "@/lib/utils";
import ApiKit from "@/common/ApiKit";
import NotificationComponent from "./Notification";
import Facebook from "../icon/Facebook";
import Google from "../icon/Google";
import Instagram from "../icon/Insta";
import Twitter from "../icon/Twitter";
import Youtube from "../icon/Youtube";

export default function AuthNavbar() {
  const { user } = useStore();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

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
    <nav className="sticky top-[-.5px] z-50 mb-6 h-16 bg-white pb-16 sm:h-max md:py-8">
      <Container extraClassName={"!py-0"}>
        <div className="relative flex h-16 items-center justify-between sm:h-20">
          <div className="block bg-white px-2 py-4 sm:hidden">
            <div className="relative flex  items-center gap-4 bg-white ">
              <MenuIcon
                onClick={() => setShowMenu(true)}
                className="h-7 w-7 cursor-pointer font-bold text-[#49B74B]"
              />
            </div>
          </div>

          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              priority
              loading="eager"
              className="h-10 w-full sm:h-14"
            />
          </Link>
          {user && (
            <div className="block sm:hidden">
              <NotificationComponent
                handleNotificationClick={handleNotificationClick}
              />
            </div>
          )}

          <div className="flex items-center gap-4 sm:gap-20">
            <div className="hidden items-center gap-4 rounded-[12px] bg-secondary px-4 py-9 text-white sm:flex lg:gap-8 lg:px-8">
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

            <div className="hidden items-center rounded-[12px] bg-secondary px-4  py-5 text-white sm:flex sm:gap-4 lg:px-8">
              <ul className="flex items-center gap-4 text-white lg:gap-8">
                <li>
                  <Link href="/" className="text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-white" href="/blog">
                    Blog
                  </Link>
                </li>
                {user && (
                  <NotificationComponent
                    handleNotificationClick={handleNotificationClick}
                  />
                )}
              </ul>

              <Menu as="div" className="relative hidden sm:block">
                <Menu.Button className="flex cursor-pointer items-center gap-2 rounded-full border border-white p-1 pl-3.5">
                  <div>
                    <p className="text-start text-sm font-medium text-white">
                      {user?.full_name}
                    </p>
                    <p className="text-start text-xs text-white">
                      {user?.role.split("_").join(" ")}
                    </p>
                  </div>
                  <div className="size-10">
                    <Image
                      src={
                        Object.keys(user?.avatar)?.length
                          ? user?.avatar["at200x200"]
                          : userPlaceHolder
                      }
                      width={100}
                      height={100}
                      className="size-10 rounded-full"
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
            </div>
          </div>

          <Drawer
            open={showMenu}
            setOpen={setShowMenu}
            title={
              <div className="flex items-center gap-2 rounded-full border border-white p-1 pl-3.5">
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.full_name}
                  </p>
                  <p className="text-start text-xs text-white">
                    {user?.role.split("_").join(" ")}
                  </p>
                </div>
                <div className="size-8">
                  <Image
                    src={
                      Object.keys(user?.avatar)?.length
                        ? user?.avatar["at200x200"]
                        : userPlaceHolder
                    }
                    width={100}
                    height={100}
                    className="size-8 rounded-full"
                    alt="user avatar"
                  />
                </div>
              </div>
            }
          >
            <menu>
              <ul className="space-y-1">
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

                <hr />

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
                  href="/blog"
                  onClick={() => setShowMenu(false)}
                  className={cn("block rounded px-4 py-3 text-black", {
                    "bg-secondary text-white": pathname === "/blog",
                    "hover:bg-secondary-bg": pathname !== "/blog",
                  })}
                >
                  Blog
                </Link>

                <Link
                  href="/logout"
                  className="absolute bottom-5 right-5 mx-auto w-fit"
                >
                  <Button variant="danger" className="w-full gap-2">
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </Link>
              </ul>
            </menu>
          </Drawer>
        </div>
      </Container>
    </nav>
  );
}
