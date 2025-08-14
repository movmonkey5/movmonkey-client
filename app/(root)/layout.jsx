import PublicAuthGuardHoc from "@/components/hoc/PublicAuthGuardHoc";
import AuthPagesGuard from "@/components/hoc/AuthPagesGuard";
import BaseFooter from "@/components/shared/BaseFooter";
import BaseNavbar from "@/components/shared/BaseNavbar";
import TopBar from "@/components/shared/TopBar";
import dynamic from 'next/dynamic';

// Dynamically import the PendingStatusModal with no SSR
const PendingStatusModal = dynamic(() => import('@/components/PendingStatusModal'), {
  ssr: false,
});

export default function RootLayout({ children }) {
  return (
    <>
      <PublicAuthGuardHoc>
        <AuthPagesGuard>
          {/* <TopBar /> */}
          <BaseNavbar />
          {children}
          <BaseFooter />
          <PendingStatusModal />
        </AuthPagesGuard>
      </PublicAuthGuardHoc>
    </>
  );
}
