import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'ค้นหาซีรีส์',
  description: 'ค้นหาซีรีส์แนวตั้งจากชื่อเรื่อง ทั้งพากย์ไทยและซับไทย บน VSeries',
  canonical: '/search',
  noIndex: true,
});

export default function SearchLayout({ children }: { children: ReactNode }) {
  return children;
}
