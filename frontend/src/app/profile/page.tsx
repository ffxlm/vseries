import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faQuestionCircle, faHeadset, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLine } from '@fortawesome/free-brands-svg-icons';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'โปรไฟล์',
  description: 'จัดการโปรไฟล์ และติดต่อสอบถามช่วยเหลือการใช้งาน VSeries',
  canonical: '/profile',
});

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile Header Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] p-10 text-center shadow-2xl">
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[var(--color-primary)] opacity-5 blur-3xl"></div>
        
        <div className="relative mb-6 inline-flex">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-7xl text-[var(--color-text-secondary)] ring-4 ring-white/5 shadow-inner">
            <FontAwesomeIcon icon={faUserCircle} />
          </div>
          <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-4 border-[#1c1c1e] bg-green-500"></div>
        </div>

        <div className="relative space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">ผู้เยี่ยมชม Guest</h1>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-widest">Guest Member</p>
        </div>

        <div className="relative mt-8 flex flex-col items-center gap-3">
          <button className="relative w-full cursor-not-allowed rounded-2xl bg-white/5 py-4 text-sm font-bold text-white/50 border border-white/10 transition-all sm:w-auto sm:px-12">
            เข้าสู่ระบบ / สมัครสมาชิก
          </button>
          <span className="rounded-full bg-[var(--color-primary)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] border border-[var(--color-primary)]/30">
            เร็ว ๆ นี้ (Coming Soon)
          </span>
        </div>
      </div>

      {/* Help Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
            </div>
            <h2 className="text-xl font-bold text-white">ช่วยเหลือ</h2>
          </div>
        </div>
        
        <div className="grid gap-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1c1c1e] p-5 transition-all hover:bg-[#2c2c2e]">
            <h3 className="mb-2 font-bold text-white flex items-center justify-between">
              วิดีโอไม่โหลด หรือกระตุก?
              <FontAwesomeIcon icon={faChevronRight} className="text-xs text-white/20 group-hover:text-white/40 transition-colors" />
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">ลองรีเฟรชหน้าเว็บ หรือตรวจสอบอินเทอร์เน็ต ระบบใช้ HLS ที่ปรับความละเอียดอัตโนมัติตามความเร็วเน็ต</p>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1c1c1e] p-5 transition-all hover:bg-[#2c2c2e]">
            <h3 className="mb-2 font-bold text-white flex items-center justify-between">
              ต้องการดูซีรีส์เรื่องไหน?
              <FontAwesomeIcon icon={faChevronRight} className="text-xs text-white/20 group-hover:text-white/40 transition-colors" />
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">หากหาซีรีส์ที่ต้องการไม่เจอ หรือต้องการให้เพิ่มเรื่องใหม่ สามารถแจ้งแอดมินผ่านช่องทางด้านล่างได้เลยครับ</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <FontAwesomeIcon icon={faHeadset} size="sm" />
          </div>
          <h2 className="text-xl font-bold text-white">ติดต่อทีมงาน</h2>
        </div>
        
        <div className="space-y-3">
          {/* Line Official */}
          <div className="flex cursor-not-allowed items-center gap-4 rounded-2xl border border-white/5 bg-[#1c1c1e] p-5 opacity-60 transition-all">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#00B900]/10 text-3xl text-[#00B900] shadow-inner">
              <FontAwesomeIcon icon={faLine} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Line Official</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">เร็ว ๆ นี้</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">@vseries (จะเปิดให้บริการเร็วๆ นี้)</p>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-white/5" />
          </div>

          {/* Facebook */}
          <div className="flex cursor-not-allowed items-center gap-4 rounded-2xl border border-white/5 bg-[#1c1c1e] p-5 opacity-60 transition-all">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1877F2]/10 text-2xl text-[#1877F2] shadow-inner">
              <FontAwesomeIcon icon={faFacebook} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Facebook</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">เร็ว ๆ นี้</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">VSeries Thailand</p>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
