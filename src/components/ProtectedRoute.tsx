"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-utils';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    // Check authentication status on the client-side
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    
    if (!authenticated) {
      // Redirect to login page if not authenticated
      router.push('/');
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  // Show loading state initially to prevent hydration mismatch
  if (!checkedAuth || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memeriksa otorisasi...</p>
      </div>
    );
  }

  return <>{children}</>;
}