'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlay } from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '@/components/ConfirmDialog';
import ExternalImage from '@/components/ExternalImage';

interface HistoryItem {
  slug: string;
  title: string;
  posterUrl: string;
  lastWatchedEpisode: number;
  totalEpisodes: number;
  progressPercentage: number;
  timestamp: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
      const historyStr = localStorage.getItem('watchHistory');
      if (historyStr) {
        try {
          setHistory(JSON.parse(historyStr));
        } catch {}
      }
    });
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('watchHistory');
    setHistory([]);
    setConfirmClearOpen(false);
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold md:text-3xl">ประวัติการเข้าชม</h1>
        {history.length > 0 && (
          <button 
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-2 rounded-md bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/15"
          >
            <FontAwesomeIcon icon={faTrashCan} />
            <span>ล้างประวัติ</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-16 text-center">
          <p className="font-bold">ยังไม่มีประวัติการเข้าชม</p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">เมื่อเริ่มดูตอนแรก ประวัติจะถูกบันทึกไว้ที่นี่</p>
          <Link href="/" className="mt-5 inline-flex rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600">
            ไปดูซีรีส์กันเลย
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="flex gap-4 overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1d] p-3 transition-colors hover:border-[var(--color-primary)]/60 sm:p-4">
              <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-md bg-black sm:w-24">
                <ExternalImage src={item.posterUrl} alt={item.title} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-base sm:text-lg line-clamp-1">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  ดูถึงตอนที่ {item.lastWatchedEpisode} / {item.totalEpisodes}
                </p>
                
                {/* Progress bar */}
                <div className="w-full bg-[#2C2C2E] rounded-full h-1.5 mt-3 mb-4">
                  <div 
                    className="bg-[var(--color-primary)] h-1.5 rounded-full" 
                    style={{ width: `${item.progressPercentage}%` }}
                  ></div>
                </div>

                <div className="mt-auto flex justify-end">
                  <Link 
                    href={`/watch/${item.slug}/${item.lastWatchedEpisode}`}
                    className="flex items-center gap-2 rounded-md bg-[var(--color-primary)]/15 px-4 py-2 text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    <FontAwesomeIcon icon={faPlay} className="w-3 h-3" />
                    <span>ดูต่อ</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={confirmClearOpen}
        title="ล้างประวัติการเข้าชม"
        description="ยืนยันการล้างประวัติการเข้าชมทั้งหมดบนอุปกรณ์นี้"
        confirmLabel="ล้างประวัติ"
        tone="danger"
        onConfirm={handleClearHistory}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
