import Link from "next/link";
import Facebook from "../icon/Facebook";
import Google from "../icon/Google";
import Instagram from "../icon/Insta";
import Twitter from "../icon/Twitter";
import Youtube from "../icon/Youtube";
import Container from "./Container";

export default function TopBar() {
  return (
    <header className="flex w-full items-center bg-black/80 py-1 text-white sm:h-[3rem] sm:py-0">
      <Container extraClassName="!py-0 max-w-6xl w-full">
        <div className="flex flex-col-reverse items-center justify-between gap-1 sm:flex-row">
          {/* social icons  */}
          <div className="flex items-center gap-4">
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
              <Instagram />
            </Link>
            <Link href={""}>
              <Youtube />
            </Link>
          </div>

          {/* contact info  */}
          <div className="flex items-center justify-between text-center xs:gap-8 sm:divide-x sm:text-left">
            <div>
              <Link
                href={`tel:1800-9938-2839`}
                className="block text-center text-xs sm:w-fit sm:text-left"
              >
                1800-9938-2839
              </Link>
              <Link
                href={`mailto:support@movmonkey.com`}
                className="block text-center text-xs sm:w-fit sm:text-left"
              >
                support@movmonkey.com
              </Link>
            </div>
            <div className="hidden pl-8 sm:block">
              <p className="text-xs">A-507 SOUTH</p>
              <p className="text-xs">Whales, Australia</p>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
