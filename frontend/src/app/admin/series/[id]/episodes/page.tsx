'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPenToSquare, faPlus, faSearch, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '@/components/ConfirmDialog';
import Toast from '@/components/Toast';
import { adminFetch } from '@/lib/adminFetch';

interface Episode {
  _id: string;
  episodeNumber: number;
  title: string;
  views: number;
}

export default function AdminEpisodesList() {
  const params = useParams();
  const seriesId = params.id as string;

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Episode | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadEpisodes() {
      try {
        const res = await adminFetch(`/admin/episodes/${seriesId}`);
        
        if (res.ok) {
          const json = await res.json();
          setEpisodes(json.data || []);
        }
      } catch {
        console.error('Failed to fetch episodes');
      } finally {
        setLoading(false);
      }
    }

    loadEpisodes();
  }, [seriesId]);

  const filteredEpisodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return episodes;

    return episodes.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        String(item.episodeNumber).includes(normalizedQuery)
      );
    });
  }, [episodes, query]);

  const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      const res = await adminFetch(`/admin/episodes/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setEpisodes((current) => current.filter((item) => item._id !== deleteTarget._id));
        showToast('ลบตอนแล้ว');
        setDeleteTarget(null);
      } else {
        showToast('ลบข้อมูลไม่สำเร็จ', 'error');
      }
    } catch {
      showToast('ลบข้อมูลไม่สำเร็จ', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-64 animate-pulse rounded-md bg-white/10" />
        <div className="h-96 animate-pulse rounded-lg border border-white/10 bg-[#1b1b1d]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/admin/series" className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-white">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
            กลับไปหน้ารวมซีรีส์
          </Link>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">จัดการตอน</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">เรียงตามเลขตอนจากน้อยไปมาก</p>
        </div>
        <Link href={`/admin/series/${seriesId}/episodes/create`} className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600">
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          เพิ่มตอน
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#1b1b1d] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาเลขตอนหรือชื่อตอน"
            className="w-full rounded-md border border-white/10 bg-black px-9 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
          />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          แสดง {filteredEpisodes.length} จาก {episodes.length} ตอน
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1d]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[var(--color-text-secondary)]">
              <tr>
                <th className="w-24 px-4 py-3 font-semibold">ตอนที่</th>
                <th className="min-w-48 px-4 py-3 font-semibold">ชื่อตอน</th>
                <th className="px-4 py-3 font-semibold">ยอดวิว</th>
                <th className="px-4 py-3 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredEpisodes.map((item) => (
                <tr key={item._id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-3">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-[var(--color-primary)]/15 px-2 font-bold text-[var(--color-primary)]">
                      {item.episodeNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.title}</td>
                  <td className="px-4 py-3">{item.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/series/${seriesId}/episodes/edit/${item._id}`} className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/15 px-3 py-2 text-xs font-semibold text-blue-200 transition-colors hover:bg-blue-500/25">
                        <FontAwesomeIcon icon={faPenToSquare} className="h-3.5 w-3.5" />
                        แก้ไข
                      </Link>
                      <button 
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/25"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEpisodes.length === 0 && (
            <div className="p-8 text-center text-[var(--color-text-secondary)]">ไม่พบตอนที่ตรงกับคำค้นหา</div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="ลบตอน"
        description={`ยืนยันการลบตอนที่ ${deleteTarget?.episodeNumber || ''} ${deleteTarget?.title || ''}`}
        confirmLabel="ลบตอน"
        tone="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      {toast && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
