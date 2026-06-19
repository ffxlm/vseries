'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getApiUrl } from '@/lib/api';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    // Only track if not an admin route and not already checked-in this session
    if (!isAdminRoute && !sessionStorage.getItem('checked_in')) {
      const apiUrl = getApiUrl();
      fetch(`${apiUrl}/series/check-in`, { method: 'POST' })
        .then(() => sessionStorage.setItem('checked_in', 'true'))
        .catch(() => console.error('Check-in failed'));
    }
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <main className="min-h-screen bg-black">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-14 pb-20 md:pt-16 md:pb-8">
        {children}
      </main>
    </>
  );
}
