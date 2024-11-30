import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import useStore from "@/store";
import Image from "next/image";
import userPlaceHolder from "@/public/image/user-placeholder.png";
import { Menu } from "@headlessui/react";
import { ProfileMenuDropDown } from "@/lib/keyChain";
import { usePathname } from "next/navigation";
import { addRolePrefixToUrlsAndFilter, cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import NotificationComponent from "./Notification";
import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react";

export default function UpdatedMenuBaseNavbar() {
  const { user } = useStore();
  const pathname = usePathname();
  const [showSignInSubmenu, setShowSignInSubmenu] = useState(false);
  const [showSignUpSubmenu, setShowSignUpSubmenu] = useState(false);
  const [showSocialDropdown, setShowSocialDropdown] = useState(false);
  const signInDropdownRef = useRef(null);
  const signUpDropdownRef = useRef(null);
  const socialDropdownRef = useRef(null);

  const handleNotificationClick = (notification) => {
    let link = "";
    const { model_kind, notification_kind, uid } = notification;
    const userRole = user?.role;

    if (model_kind === "QUOTATION") {
      const kind = notification.quotation.kind.toLowerCase();

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

    if (link) {
      window.location.href = link;
    }
  };

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns if clicked outside
      const closeDropdown = (ref, setState) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setState(false);
        }
      };

      closeDropdown(socialDropdownRef, setShowSocialDropdown);
      closeDropdown(signInDropdownRef, setShowSignInSubmenu);
      closeDropdown(signUpDropdownRef, setShowSignUpSubmenu);
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const NavLink = ({ href, children, onClick }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-gray-700 transition-colors duration-300 ease-in-out hover:text-white hover:bg-secondary rounded-md",
        {
          "bg-secondary text-white": pathname === href,
          "text-gray-600": pathname !== href,
        }
      )}
    >
      {children}
    </Link>
  );

  const SignInDropdown = () => (
    <div className="relative" ref={signInDropdownRef}>
      <button
        className="flex items-center gap-1 text-gray-700 hover:text-secondary"
        onClick={(e) => {
          e.stopPropagation();
          setShowSignInSubmenu(!showSignInSubmenu);
          setShowSignUpSubmenu(false);
          setShowSocialDropdown(false);
        }}
      >
        Sign In
        {showSignInSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {showSignInSubmenu && (
        <div 
          className="absolute right-0 top-full mt-6 w-60 rounded-md border bg-white shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="/sign-in"
            onClick={(e) => {
              e.stopPropagation();
              setShowSignInSubmenu(false);
            }}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            User Sign In
          </Link>
          <Link
            href="/driver-sign-in"
            onClick={(e) => {
              e.stopPropagation();
              setShowSignInSubmenu(false);
            }}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Driver Sign In
          </Link>
          <Link
            href="/cleaning-provider-sign-in"
            onClick={(e) => {
              e.stopPropagation();
              setShowSignInSubmenu(false);
            }}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Cleaning Provider Sign In
          </Link>
        </div>
      )}
    </div>
  );

  const SignUpDropdown = () => (
    <div className="relative" ref={signUpDropdownRef}>
      <button
        className="flex items-center gap-1 text-gray-700 hover:text-secondary"
        onClick={(e) => {
          e.stopPropagation();
          setShowSignUpSubmenu(!showSignUpSubmenu);
          setShowSignInSubmenu(false);
          setShowSocialDropdown(false);
        }}
      >
        Sign Up
        {showSignUpSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {showSignUpSubmenu && (
        <div 
          className="absolute right-0 top-full mt-6 w-60 rounded-md border bg-white shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="/sign-up"
            onClick={(e) => {
              e.stopPropagation();
              setShowSignUpSubmenu(false);
            }}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            User Sign Up
          </Link>
          <Link
            href="/driver-sign-up"
            onClick={(e) => {
              e.stopPropagation();
              setShowSignUpSubmenu(false);
            }}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Driver Sign Up
          </Link>
          <Link
            href="/cleaning-provider-sign-up"
            onClick={(e) => {
              e.stopPropagation();
              setShowSignUpSubmenu(false);
            }}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Cleaning Provider Sign Up
          </Link>
        </div>
      )}
    </div>
  );

  const SocialLinksDropdown = () => (
    <div className="relative" ref={socialDropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowSocialDropdown(!showSocialDropdown);
          setShowSignInSubmenu(false);
          setShowSignUpSubmenu(false);
        }}
        className="flex items-center gap-1 text-gray-700 hover:text-secondary"
      >
        Social Links
        {showSocialDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {showSocialDropdown && (
        <div 
          className="absolute right-0 top-full mt-6 w-60 rounded-md border bg-white shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setShowSocialDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <Facebook size={20} /> Facebook
          </Link>
          <Link
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setShowSocialDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <Linkedin size={20} /> LinkedIn
          </Link>
          <Link
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setShowSocialDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <Twitter size={20} /> Twitter
          </Link>
          <Link
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setShowSocialDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <Instagram size={20} /> Instagram
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav className="container mx-auto flex items-center justify-between py-4">
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-4">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about-us">About Us</NavLink>
        <NavLink href="/blog">Blog</NavLink>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center justify-end space-x-8">
          {user ? (
            <>
              {user && <NotificationComponent handleNotificationClick={handleNotificationClick} />}
              <Menu as="div" className="relative">
                <Menu.Button className="flex cursor-pointer items-center gap-2 rounded-full border p-1 pl-3">
                  <div className="text-right">
                    <p className="text-xs font-medium">{user?.full_name}</p>
                    <p className="text-xs text-gray-600">
                      {user?.role?.split("_")?.join(" ")}
                    </p>
                  </div>
                  <Image
                    src={
                      Object.keys(user?.avatar)?.length
                        ? user?.avatar["at200x200"]
                        : userPlaceHolder
                    }
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="user avatar"
                  />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-52 rounded-md border bg-white shadow-lg z-50">
                  {addRolePrefixToUrlsAndFilter(
                    ProfileMenuDropDown,
                    ["/profile", "/open-jobs"],
                    user?.role,
                  ).map((route, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <Link
                          href={route.href}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100",
                            {
                              "bg-gray-100": pathname === route.href,
                              "text-red-500": route.href === "/logout",
                            }
                          )}
                        >
                          <route.icon className="h-5 w-5" />
                          {route.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            </>
          ) : (
            <div className="flex items-center space-x-8">
              <SignInDropdown />
              <SignUpDropdown />
            </div>
          )}
        </div>

        <SocialLinksDropdown />
      </div>
    </nav>
  );
}