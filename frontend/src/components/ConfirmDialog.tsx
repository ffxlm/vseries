'use client';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  tone = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClassName = tone === 'danger'
    ? 'bg-red-500 text-white hover:bg-red-600'
    : 'bg-[var(--color-primary)] text-white hover:bg-blue-600';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#1b1b1d] p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
          >
            {loading ? 'กำลังดำเนินการ' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
