"use client";
import React, { useState, useEffect } from "react";
import Container from "./Container";
import HomeIcon from "../icon/Home";
import Phone from "../icon/Phone";
import Mail from "../icon/Mail";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import footer_logo from "@/public/logo/footer-logo.png";
import Image from "next/image";
import Link from "next/link";
import ApiKit from "@/common/ApiKit";
import Location from "../icon/Location";

export default function BaseFooter() {
  const [isDriverOrCleaner, setIsDriverOrCleaner] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await ApiKit.me.getMe();
        const userRole = response.data.role;
        setIsDriverOrCleaner(
          userRole === "DELIVERY_DRIVER" ||
            userRole === "REMOVAL_DRIVER" ||
            userRole === "CLEANING_PROVIDER",
        );
        setIsCustomer(userRole === "CUSTOMER");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    checkUserRole();
  }, []);

  return (
    <div>
      <div className="bg-[#343434] text-white">
        <Container>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Link href="/faq" className="block w-fit hover:underline">
              FAQ (Frequently Asked Questions)
            </Link>
            <Link
              href="/privacy-policy"
              className="block w-fit hover:underline"
            >
              Privacy Policy
            </Link>
            {isCustomer ? (
              <Link
                href="/terms-condition"
                className="block w-fit hover:underline"
              >
                Customer Terms & Conditions
              </Link>
            ) : isDriverOrCleaner ? (
              <Link
                href="/drivers-cleaners-terms"
                className="block w-fit hover:underline"
              >
                Service Provider Terms & Conditions
              </Link>
            ) : (
              <>
                <Link
                  href="/terms-condition"
                  className="block w-fit hover:underline"
                >
                  Customer Terms & Conditions
                </Link>
              </>
            )}
          </div>
        </Container>
      </div>
      <div className="bg-secondary text-white">
        <Container>
          <div className=" flex flex-col items-center justify-center space-y-6 lg:space-y-0">
            <Link
              href="/contact"
              className="block hover:underline md:mb-4"
            >
              Contact us
            </Link>
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2 max-sm:w-60">
                <Location />
                <p className="text-center w-fit">
                  366 Wheatley Cres PE28 4XN Cambridgeshire - UK
                </p>
              </div>
              <Link
                href="tel:+01-48039349"
                className="flex items-center gap-2"
              >
                <Phone />
                <p>+01-48039349</p>
              </Link>
              <Link
                href="mailto:support@movmonkey.com"
                className="flex items-center gap-2"
              >
                <Mail />
                <p>support@movmonkey.com</p>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
