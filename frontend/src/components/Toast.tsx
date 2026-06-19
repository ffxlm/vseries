'use client';

type ToastProps = {
  message: string;
  tone?: 'success' | 'error';
  onClose: () => void;
};

export default function Toast({ message, tone = 'success', onClose }: ToastProps) {
  if (!message) return null;

  const toneClassName = tone === 'error'
    ? 'border-red-500/30 bg-red-500/15 text-red-100'
    : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100';

  return (
    <div className="fixed right-4 top-4 z-[110] w-[calc(100vw-2rem)] max-w-sm">
      <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur ${toneClassName}`}>
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-current opacity-70 transition-opacity hover:opacity-100"
          aria-label="ปิดข้อความแจ้งเตือน"
        >
          ×
        </button>
      </div>
    </div>
  );
}
