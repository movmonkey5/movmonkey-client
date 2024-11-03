import PublicAuthGuardHoc from "@/components/hoc/PublicAuthGuardHoc";
import BaseFooter from "@/components/shared/BaseFooter";
import BaseNavbar from "@/components/shared/BaseNavbar";
import TopBar from "@/components/shared/TopBar";

export default function RootLayout({ children }) {
  return (
    <>
      <PublicAuthGuardHoc>
        {/* <TopBar /> */}
        <BaseNavbar />
        {children}
        <BaseFooter />
      </PublicAuthGuardHoc>
    </>
  );
}
