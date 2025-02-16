"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Container from "./Container";
import logo from "@/public/logo/logo.svg";
import mobileLogo from "@/public/logo/logo.png";
import Link from "next/link";
import MenuBaseNavbar from "./MenuBaseNavbar";
import { Menu } from "lucide-react";
import Drawer from "./Drawer";
import MobileMenuBaseNavbar from "./MobileMenuBaseNavbar";
import useStore from "@/store";
import userPlaceHolder from "@/public/image/user-placeholder.png";
import ApiKit from "@/common/ApiKit";
import NotificationComponent from "./Notification";
import UpdatedMenuBaseNavbar from "./UpdatedMenuBaseNavbar";

export default function BaseNavbar() {
  const [showSignInSubmenu, setShowSignInSubmenu] = useState(false);
  const [showSignUpSubmenu, setShowSignUpSubmenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, initialized } = useStore();

  const handleOverlayClick = () => {
    setShowSignInSubmenu(false);
    setShowSignUpSubmenu(false);
  };

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

  // Don't render anything until we know the auth state
  if (!initialized) {
    return null;
  }

  // Now we can safely render the appropriate navbar
  return (
    <nav className="sticky top-[-.5px] z-50 mb-6 mt-8 h-16 bg-white pb-16 sm:h-max md:py-8">
      <Container extraClassName={"!p-0"}>
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-16">
          <div className="block px-2 sm:hidden">
            <Menu
              onClick={() => setShowMenu(true)}
              className="h-7 w-7 cursor-pointer font-bold text-[#49B74B]"
            />
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

          {(showSignInSubmenu || showSignUpSubmenu) && (
            <div
              className="fixed inset-0 z-50"
              onClick={handleOverlayClick}
            ></div>
          )}

          <menu className="hidden sm:block">
            <MenuBaseNavbar
              showSignInSubmenu={showSignInSubmenu}
              setShowSignInSubmenu={setShowSignInSubmenu}
              showSignUpSubmenu={showSignUpSubmenu}
              setShowSignUpSubmenu={setShowSignUpSubmenu}
            />
            {/* <UpdatedMenuBaseNavbar
              showSignInSubmenu={showSignInSubmenu}
              setShowSignInSubmenu={setShowSignInSubmenu}
              showSignUpSubmenu={showSignUpSubmenu}
              setShowSignUpSubmenu={setShowSignUpSubmenu}
            /> */}
          </menu>

          <div className="block sm:hidden">
            <div className="relative flex items-center gap-4">
              {user && (
                <NotificationComponent
                  handleNotificationClick={handleNotificationClick}
                />
              )}
            </div>
          </div>

          <Drawer
            open={showMenu}
            setOpen={setShowMenu}
            title={
              user ? (
                <div className="flex items-center gap-2 rounded-full border border-white p-1 pl-3.5">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.full_name.length > 10 ? user?.full_name.slice(0, 10) : user?.full_name}
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
              ) : (
                <Link href="/" className="focus:outline-none">
                  <Image
                    src={mobileLogo}
                    alt="logo"
                    priority
                    loading="eager"
                    className="h-10 w-full sm:h-14"
                  />
                </Link>
              )
            }
          >
            <MobileMenuBaseNavbar setShowMenu={setShowMenu} />
          </Drawer>
        </div>
      </Container>
    </nav>
  );
}
