import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'เพิ่มตอนใหม่',
  description: 'เพิ่มตอนใหม่ให้ซีรีส์ในระบบหลังบ้านของ SeriesApp',
  noIndex: true,
});

export default function CreateEpisodeLayout({ children }: { children: ReactNode }) {
  return children;
}
