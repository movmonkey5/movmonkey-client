'use client';

import { useEffect } from 'react';
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
    '/cleaning-provider-sign-up'
  ];

  useEffect(() => {
    if (user?.status && restrictedRoutes.includes(pathname)) {
      router.replace('/');
    }
  }, [user, pathname, router]);

  // Don't render restricted pages if user has a status
  if (user?.status && restrictedRoutes.includes(pathname)) {
    return null;
  }

  return children;
};

export default AuthPagesGuard;
