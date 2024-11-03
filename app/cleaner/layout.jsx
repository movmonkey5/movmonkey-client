import AuthNavbar from "../../components/shared/AuthNavbar";
import CleanerAuthGuardHoc from "@/components/hoc/CleanderAuthGuardHoc";
import BaseFooter from "@/components/shared/BaseFooter";

export default function CleanerLayout({ children }) {
  return (
    <>
      <CleanerAuthGuardHoc>
        <AuthNavbar />
        <div> {children}</div>
        <BaseFooter />
      </CleanerAuthGuardHoc>
    </>
  );
}
