'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faPlayCircle } from '@fortawesome/free-solid-svg-icons';

type VideoKind = {
  label: string;
  className: string;
  description: string;
};

type VideoUrlFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function getVideoKind(value: string): VideoKind {
  const normalized = value.trim().toLowerCase().split('?')[0].split('#')[0];

  if (normalized.endsWith('.m3u8')) {
    return {
      label: 'HLS',
      className: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
      description: 'ลิงก์ HLS เล่นผ่าน HLS player',
    };
  }

  if (normalized.endsWith('.mp4')) {
    return {
      label: 'MP4',
      className: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
      description: 'ลิงก์ไฟล์ MP4 เล่นด้วย browser video player โดยตรง',
    };
  }

  if (normalized) {
    return {
      label: 'URL',
      className: 'border-white/15 bg-white/10 text-white',
      description: 'รองรับ URL วิดีโอที่ browser หรือ player ของเว็บเล่นได้',
    };
  }

  return {
    label: 'EMPTY',
    className: 'border-white/10 bg-black/30 text-[var(--color-text-secondary)]',
    description: 'วางลิงก์ .m3u8 หรือ .mp4 จากระบบที่คุณใช้',
  };
}

export default function VideoUrlField({ value, onChange }: VideoUrlFieldProps) {
  const videoKind = getVideoKind(value);
  const canOpen = value.trim().startsWith('http://') || value.trim().startsWith('https://');

  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="block text-sm font-semibold text-[var(--color-text-secondary)]">
          Video URL <span className="text-red-400">*</span>
        </span>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${videoKind.className}`}>
          {videoKind.label}
        </span>
      </div>

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <FontAwesomeIcon icon={faPlayCircle} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="url"
            name="videoUrl"
            required
            value={value}
            onChange={onChange}
            placeholder="https://.../playlist.m3u8"
            className="w-full rounded-md border border-white/10 bg-black px-9 py-2.5 font-mono text-sm outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
          />
        </div>
        <a
          href={canOpen ? value : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!canOpen}
          className={`inline-flex w-11 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/15 ${
            canOpen ? '' : 'pointer-events-none opacity-40'
          }`}
          title="เปิด URL เพื่อตรวจสอบ"
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-4 w-4" />
        </a>
      </div>

      <p className="text-xs text-[var(--color-text-secondary)]">{videoKind.description}</p>
    </label>
  );
}
