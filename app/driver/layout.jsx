import DriverAuthGuardHoc from "@/components/hoc/DriverAuthGuardHoc";
import AuthNavbar from "../../components/shared/AuthNavbar";
import BaseFooter from "@/components/shared/BaseFooter";

export default function CustomerLayout({ children }) {
  return (
    <>
      <DriverAuthGuardHoc>
        <AuthNavbar />
        <div> {children}</div>
        <BaseFooter />
      </DriverAuthGuardHoc>
    </>
  );
}
