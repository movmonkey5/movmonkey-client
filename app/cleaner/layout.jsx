import AuthNavbar from "../../components/shared/AuthNavbar";
import CleanerAuthGuardHoc from "@/components/hoc/CleanderAuthGuardHoc";
import BaseFooter from "@/components/shared/BaseFooter";
import BaseNavbar from "@/components/shared/BaseNavbar";

export default function CleanerLayout({ children }) {
  return (
    <>
      <CleanerAuthGuardHoc>
        <AuthNavbar />
        {/* <BaseNavbar /> */}
        <div> {children}</div>
        <BaseFooter />
      </CleanerAuthGuardHoc>
    </>
  );
}
