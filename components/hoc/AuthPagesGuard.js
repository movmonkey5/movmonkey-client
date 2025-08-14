'use client';

import { usePathname, useRouter } from 'next/navigation';
import useStore from '@/store';

const AuthPagesGuard = ({ children }) => {
  const { user } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  const restrictedRoutes = [
    '/sign-in',
    '/sign-up',
    '/cleaning-provider-sign-in',
    '/driver-sign-up',
    '/cleaning-provider-sign-up',
    '/driver-sign-in'
  ];

  // Immediate check and redirect without useEffect
  if (user?.status && restrictedRoutes.includes(pathname)) {
    router.replace('/');
    return null; // Return null immediately to prevent any flash of content
  }

  return children;
};

export default AuthPagesGuard;
