'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useStore from '@/store';

const JobRouteGuard = ({ children }) => {
  const { showPendingModal } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  // Public routes that should not show modal
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/about',
    '/contact',
    '/pricing',
    '/about-us',
    '/sign-in',
    '/privacy-policy',
    '/drivers-cleaners-terms',
    '/faq',
    '/sign-up',
    '/cleaning-provider-sign-in',
    '/driver-sign-up',
    '/cleaning-provider-sign-up',
    '/logout',
    '/driver-sign-in'  // Added driver sign in route
  ];
  
  const isPublicRoute = publicRoutes.includes(pathname) || pathname === '';

  const isJobRoute = !isPublicRoute && (
    pathname.includes('/jobs') || 
    pathname.includes('/delivery') || 
    pathname.includes('/removal') || 
    pathname.includes('/cleaning')
  );

  useEffect(() => {
    if (isJobRoute && showPendingModal) {
      router.push('/dashboard');
    }
  }, [isJobRoute, showPendingModal, router]);

  if (isJobRoute && showPendingModal) {
    return null;
  }

  return children;
};

export default JobRouteGuard;
