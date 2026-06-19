'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faFilm, faSignOutAlt, faBars, faTimes, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { adminFetch } from '@/lib/adminFetch';

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: faChartPie },
  { name: 'จัดการซีรีส์', path: '/admin/series', icon: faFilm },
  { name: 'ความปลอดภัย', path: '/admin/security', icon: faShieldAlt },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await adminFetch('/admin/logout', {
        method: 'POST',
      });
    } finally {
      router.push('/admin/login');
    }
  };

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#080808]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white md:flex">
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:sticky top-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-[#161617] 
        transition-transform duration-200 ease-out
      `}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="min-w-0">
            <p className="text-lg font-bold text-white">VSeries</p>
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">Admin console</p>
          </Link>
          <button
            type="button"
            aria-label="ปิดเมนูแอดมิน"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white md:hidden"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <div className="px-3 pb-2 text-xs font-semibold uppercase text-[var(--color-text-secondary)]">เมนูหลัก</div>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith('/admin/series') && item.path === '/admin/series');
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#101011]/95 px-4 backdrop-blur md:hidden">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">VSeries</p>
            <p className="text-base font-bold">Admin</p>
          </div>
          <button
            type="button"
            aria-label="เปิดเมนูแอดมิน"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white"
          >
            <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
          </button>
        </header>

        <main className="px-4 py-5 sm:px-6 md:px-8 md:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
