import CustomerAuthGuardHoc from "@/components/hoc/CustomerAuthGuardHoc";
import AuthNavbar from "../../components/shared/AuthNavbar";
import BaseFooter from "@/components/shared/BaseFooter";

export default function CustomerLayout({ children }) {
  return (
    <>
      <CustomerAuthGuardHoc>
        <AuthNavbar />
        <div> {children}</div>
        <BaseFooter />
      </CustomerAuthGuardHoc>
    </>
  );
}
