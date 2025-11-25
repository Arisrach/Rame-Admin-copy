"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-utils';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Perform logout - clear localStorage
    logout();
    
    // Also clear the authentication cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Rame Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Proses logout sedang berlangsung...
          </p>
          <div className="mt-8">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Anda telah berhasil keluar dari sistem.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Anda akan diarahkan kembali ke halaman login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}