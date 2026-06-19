'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFilm, faSearch, faHistory, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'หน้าแรก', path: '/', icon: faHome },
    { name: 'หมวดหมู่', path: '/category/all', icon: faFilm },
    { name: 'ค้นหา', path: '/search', icon: faSearch },
    { name: 'ประวัติ', path: '/history', icon: faHistory },
    { name: 'โปรไฟล์', path: '/profile', icon: faUser },
  ];

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 hidden border-b border-white/10 bg-[#101011]/95 backdrop-blur-md md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 text-xl font-bold text-white">
                VSeries
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    pathname === item.path || (pathname.startsWith('/category') && item.path.includes('category'))
                      ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-center border-b border-white/10 bg-[#101011]/95 px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="text-lg font-bold text-white">
          VSeries
        </Link>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#101011]/95 pb-2 backdrop-blur-lg md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
                pathname === item.path || (pathname.startsWith('/category') && item.path.includes('category'))
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="text-[12px]" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
