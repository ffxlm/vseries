import { createPageMetadata } from '@/lib/seo';
import ProfileClient from './ProfileClient';

export const metadata = createPageMetadata({
  title: 'โปรไฟล์',
  description: 'จัดการโปรไฟล์ และติดต่อสอบถามช่วยเหลือการใช้งาน VSeries',
  canonical: '/profile',
});

export default function ProfilePage() {
  return <ProfileClient />;
}
