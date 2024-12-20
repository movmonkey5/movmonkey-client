import CustomerAuthGuardHoc from "@/components/hoc/CustomerAuthGuardHoc";
import AuthNavbar from "../../components/shared/AuthNavbar";
import BaseFooter from "@/components/shared/BaseFooter";
import BaseNavbar from "@/components/shared/BaseNavbar";

export default function CustomerLayout({ children }) {
  return (
    <>
      <CustomerAuthGuardHoc>
        <AuthNavbar />
        {/* <BaseNavbar /> */}
        <div> {children}</div>
        <BaseFooter />
      </CustomerAuthGuardHoc>
    </>
  );
}
