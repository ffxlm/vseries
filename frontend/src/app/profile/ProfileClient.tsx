'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faQuestionCircle, 
  faChevronRight, 
  faChevronDown, 
  faChevronUp, 
  faHistory 
} from '@fortawesome/free-solid-svg-icons';

export default function ProfileClient() {
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    // Get watch history count from localStorage
    const historyStr = localStorage.getItem('watchHistory');
    if (historyStr) {
      try {
        const historyData = JSON.parse(historyStr);
        if (Array.isArray(historyData)) {
          setHistoryCount(historyData.length);
        }
      } catch {}
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'เว็บ VSeries มีค่าบริการหรือต้องเติมเหรียญไหม?',
      a: 'ไม่มีการเก็บค่าบริการหรือระบบเติมเหรียญใด ๆ ทั้งสิ้นครับ แพลตฟอร์มนี้เปิดให้ผู้ใช้งานทุกคนสามารถเข้าชมซีรีส์แนวตั้งทุกเรื่อง ทุกตอน ได้ฟรี 100%'
    },
    {
      q: 'วิดีโอไม่โหลด หรือกระตุกทำอย่างไร?',
      a: 'ลองรีเฟรชหน้าเว็บ หรือตรวจสอบระดับสัญญาณอินเทอร์เน็ต ระบบสตรีมมิ่งของเราใช้เทคโนโลยี HLS ซึ่งจะช่วยปรับเปลี่ยนความละเอียดภาพตามความเร็วอินเทอร์เน็ตของคุณโดยอัตโนมัติ'
    }
  ];

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-24 animate-pulse rounded-lg border border-white/10 bg-[#1b1b1d]" />
        <div className="h-20 animate-pulse rounded-lg border border-white/10 bg-[#1b1b1d]" />
        <div className="h-32 animate-pulse rounded-lg border border-white/10 bg-[#1b1b1d]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header Profile Section */}
      <div className="rounded-lg border border-white/10 bg-[#1b1b1d] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {/* Avatar Icon */}
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-3xl text-[var(--color-text-secondary)] border border-white/10 shadow-inner sm:h-16 sm:w-16 sm:text-4xl">
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
            <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-[#1b1b1d] bg-emerald-500 sm:h-4 sm:w-4" />
          </div>

          {/* User Meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white sm:text-xl truncate">ผู้ใช้งาน VSeries</h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">ยินดีต้อนรับเข้าสู่แหล่งรวมซีรีส์แนวตั้งฟรี</p>
          </div>
        </div>
      </div>

      {/* Watch History - Full Width Banner */}
      <Link 
        href="/history" 
        className="group flex items-center justify-between rounded-lg border border-white/10 bg-[#1b1b1d] p-4 transition-all hover:border-[var(--color-primary)]/40 hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-lg text-[var(--color-primary)]">
            <FontAwesomeIcon icon={faHistory} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white sm:text-base">ประวัติการรับชมของคุณ</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              คุณดูซีรีส์ค้างไว้ทั้งหมด <span className="font-semibold text-white">{historyCount}</span> เรื่อง
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">ดูทั้งหมด</span>
          <FontAwesomeIcon icon={faChevronRight} className="text-[var(--color-text-secondary)] text-sm group-hover:text-white transition-colors" />
        </div>
      </Link>

      {/* FAQ Accordion Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <FontAwesomeIcon icon={faQuestionCircle} className="text-[var(--color-primary)] text-sm" />
          <h2 className="text-sm font-bold text-white sm:text-base">ช่วยเหลือและคำถามทั่วไป</h2>
        </div>
        
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] overflow-hidden divide-y divide-white/5">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-white/[0.01]"
                >
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  <FontAwesomeIcon 
                    icon={isOpen ? faChevronUp : faChevronDown} 
                    className="text-xs text-[var(--color-text-secondary)] transition-transform shrink-0" 
                  />
                </button>
                {isOpen && (
                  <div className="bg-white/[0.005] px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
