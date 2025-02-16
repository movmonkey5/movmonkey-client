'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useStore from '../store';

const PendingStatusModal = () => {
  const { showPendingModal, showDisabledModal } = useStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extended list of public routes where modal should not show
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
    '/faq',
    '/sign-up',
    '/cleaning-provider-sign-in',
    '/driver-sign-up',
    '/cleaning-provider-sign-up',
    '/logout',
    '/driver-sign-in',
    '/forgot-password',
    '/otp',  // Added OTP route
    '/reset-password'  // Added reset-password route
  ];
  
  // Check if current path is a public route or if it's a protected route with specific parameters
  const isPublicRoute = 
    publicRoutes.includes(pathname) || 
    pathname === '' ||
    (pathname === '/forgot-password' && searchParams.get('redirect') === 'sign-in') ||
    (pathname === '/otp' && searchParams.get('email') && searchParams.get('redirect') === 'sign-in') ||
    pathname === '/reset-password';

  // Don't show modal on public routes or if no modal should be shown
  if (isPublicRoute || (!showPendingModal && !showDisabledModal)) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Darker overlay */}
      <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-md"></div>
      
      {/* Modal container with better responsive sizing */}
      <div className="relative w-full max-w-[95%] sm:max-w-[85%] md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white rounded-3xl p-6 sm:p-8 md:p-12 lg:p-14 shadow-2xl border border-[#49B74B]/20 animate-slideUp">
        {/* Top Icon - adjusted for smaller screens */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 sm:-top-10 md:-top-12">
          <div className={`rounded-full p-4 sm:p-5 md:p-6 shadow-lg ${showDisabledModal ? 'bg-red-500 shadow-red-500/30' : 'bg-[#49B74B] shadow-[#49B74B]/30'} animate-bounce`}>
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {showDisabledModal ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
        </div>
        
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Header - responsive text sizes */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${showDisabledModal ? 'text-red-500' : 'text-[#49B74B]'}`}>
              {showDisabledModal ? 'Account Disabled' : 'Account Under Review'}
            </h3>
            <div className="space-y-2">
              <p className={`text-base sm:text-lg ${showDisabledModal ? 'text-red-500/80' : 'text-[#49B74B]/80'}`}>
                {showDisabledModal ? 'Your account has been disabled' : 'Your application is being processed'}
              </p>
              <p className="text-sm sm:text-base text-gray-600 italic">
                {showDisabledModal ? 
                  'Please contact support for more information about your account status.' :
                  'Please wait patiently. Our admin team will review your documents very soon.'}
              </p>
            
            </div>
          </div>
          
          {/* Show different content based on modal type */}
          {showDisabledModal ? (
            <div className="space-y-6">
              <div className="p-4 sm:p-6 bg-red-50 rounded-xl border-l-4 border-red-500">
                <p className="text-sm sm:text-base md:text-lg text-red-600">
                  Your account has been disabled. This might be due to violation of our terms of service or other compliance issues.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Progress Indicator with text */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} 
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-[#49B74B] rounded-full animate-ping"
                      style={{ animationDelay: `${i * 200}ms` }}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-[#49B74B]/70 animate-pulse">
                  Review in progress...
                </p>
              </div>

              {/* Info Cards - responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-[#49B74B]/5 rounded-xl border-l-4 border-[#49B74B] transform hover:scale-105 transition-transform">
                  <p className="text-sm sm:text-base md:text-lg text-[#49B74B]/90">
                    We ensure platform quality and safety for all users
                  </p>
                </div>
                <div className="p-4 sm:p-6 bg-[#49B74B]/5 rounded-xl border-l-4 border-[#49B74B] transform hover:scale-105 transition-transform">
                  <p className="text-sm sm:text-base md:text-lg text-[#49B74B]/90">
                    Email notification will be sent upon approval
                  </p>
                </div>
              </div>

              {/* Additional waiting message */}
              <div className="mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  You will receive an email notification once your account is approved.
                  <br />
                  <span className="font-medium text-[#49B74B]">
                    Thank you for choosing MovMonkey!
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingStatusModal;
