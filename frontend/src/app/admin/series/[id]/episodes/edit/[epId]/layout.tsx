import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'แก้ไขตอน',
  description: 'แก้ไขเลขตอน ชื่อตอน และลิงก์วิดีโอของตอนใน SeriesApp',
  noIndex: true,
});

export default function EditEpisodeLayout({ children }: { children: ReactNode }) {
  return children;
}
