"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-utils';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // null means still checking

  useEffect(() => {
    // Check authentication status on the client-side immediately
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);

      if (!authenticated) {
        // Redirect to login page if not authenticated
        router.push('/');
      }
    };

    // Check immediately if we're on the client
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memeriksa otorisasi...</p>
      </div>
    );
  }

  // If authenticated, render children; otherwise redirect (handled in useEffect)
  if (!isAuth) {
    return null; // Redirect effect should take care of navigation
  }

  return <>{children}</>;
}