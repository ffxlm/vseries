'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faPenToSquare, faPlus, faSearch, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ExternalImage from '@/components/ExternalImage';
import ConfirmDialog from '@/components/ConfirmDialog';
import Toast from '@/components/Toast';
import { adminFetch } from '@/lib/adminFetch';

interface AdminSeries {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  languageType: 'thai_dub' | 'thai_sub';
  totalEpisodes?: number;
  views?: number;
  isPopular?: boolean;
  isNewSeries?: boolean;
}

export default function AdminSeriesList() {
  const [series, setSeries] = useState<AdminSeries[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<AdminSeries | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadSeries() {
      try {
        const res = await adminFetch('/admin/series');
        
        if (res.ok) {
          const json = await res.json();
          setSeries(json.data || []);
        }
      } catch {
        console.error('Failed to fetch series');
      } finally {
        setLoading(false);
      }
    }

    loadSeries();
  }, []);

  const filteredSeries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return series;

    return series.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.slug.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, series]);

  const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      const res = await adminFetch(`/admin/series/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setSeries((current) => current.filter((item) => item._id !== deleteTarget._id));
        showToast('ลบซีรีส์แล้ว');
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

  const handleDeleteAll = async () => {
    setDeleteLoading(true);
    try {
      const res = await adminFetch(`/admin/series/delete-all`, { method: 'DELETE' });
      if (res.ok) {
        setSeries([]);
        showToast('ล้างข้อมูลทั้งหมดแล้ว');
        setDeleteAllOpen(false);
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
        <div className="h-9 w-56 animate-pulse rounded-md bg-white/10" />
        <div className="h-72 animate-pulse rounded-lg border border-white/10 bg-[#1b1b1d]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">คลังเนื้อหา</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">จัดการซีรีส์</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteAllOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600/20 px-4 py-2.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-600 hover:text-white"
          >
            <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4" />
            ล้างข้อมูลทั้งหมด
          </button>
          <Link href="/admin/series/create" className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            เพิ่มซีรีส์
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#1b1b1d] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาชื่อหรือ slug"
            className="w-full rounded-md border border-white/10 bg-black px-9 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
          />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          แสดง {filteredSeries.length} จาก {series.length} เรื่อง
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1d] md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-4 py-3 font-semibold">ซีรีส์</th>
                <th className="px-4 py-3 font-semibold">ภาษา</th>
                <th className="px-4 py-3 font-semibold">ตอน</th>
                <th className="px-4 py-3 font-semibold">สถานะ</th>
                <th className="px-4 py-3 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSeries.map((item) => (
                <tr key={item._id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-black">
                        <ExternalImage src={item.posterUrl} alt={item.title} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold">{item.title}</p>
                        <p className="truncate text-xs text-[var(--color-text-secondary)]">{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.languageType === 'thai_dub' ? 'พากย์ไทย' : 'ซับไทย'}</td>
                  <td className="px-4 py-3">{item.totalEpisodes ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.isPopular && <span className="rounded bg-orange-500/15 px-2 py-1 text-xs font-semibold text-orange-300">ยอดนิยม</span>}
                      {item.isNewSeries && <span className="rounded bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">มาใหม่</span>}
                      {!item.isPopular && !item.isNewSeries && <span className="text-xs text-[var(--color-text-secondary)]">ทั่วไป</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/series/${item._id}/episodes`} className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/15">
                        <FontAwesomeIcon icon={faListUl} className="h-3.5 w-3.5" />
                        ตอน
                      </Link>
                      <Link href={`/admin/series/edit/${item._id}`} className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/15 px-3 py-2 text-xs font-semibold text-blue-200 transition-colors hover:bg-blue-500/25">
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
        </div>
        {filteredSeries.length === 0 && (
          <div className="p-8 text-center text-[var(--color-text-secondary)]">ไม่พบซีรีส์ที่ตรงกับคำค้นหา</div>
        )}
      </div>

      <div className="space-y-3 md:hidden">
        {filteredSeries.map((item) => (
          <article key={item._id} className="rounded-lg border border-white/10 bg-[#1b1b1d] p-3">
            <div className="flex gap-3">
              <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-md bg-black">
                <ExternalImage src={item.posterUrl} alt={item.title} fill sizes="72px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 font-bold">{item.title}</h2>
                <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">{item.slug}</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {item.languageType === 'thai_dub' ? 'พากย์ไทย' : 'ซับไทย'} · {item.totalEpisodes ?? 0} ตอน
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Link href={`/admin/series/${item._id}/episodes`} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold">
                <FontAwesomeIcon icon={faListUl} className="h-3.5 w-3.5" />
                ตอน
              </Link>
              <Link href={`/admin/series/edit/${item._id}`} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-500/15 px-3 py-2 text-xs font-semibold text-blue-200">
                <FontAwesomeIcon icon={faPenToSquare} className="h-3.5 w-3.5" />
                แก้ไข
              </Link>
              <button type="button" onClick={() => setDeleteTarget(item)} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200">
                <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
                ลบ
              </button>
            </div>
          </article>
        ))}
        {filteredSeries.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-[#1b1b1d] p-8 text-center text-[var(--color-text-secondary)]">ไม่พบซีรีส์ที่ตรงกับคำค้นหา</div>
        )}
      </div>
      <ConfirmDialog
        open={deleteAllOpen}
        title="ล้างข้อมูลซีรีส์ทั้งหมด!"
        description="คุณแน่ใจหรือไม่? ซีรีส์และตอนทั้งหมดในระบบจะถูกลบทิ้งอย่างถาวร (ไม่สามารถกู้คืนได้)"
        confirmLabel="ยืนยันการล้างข้อมูล"
        tone="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteAll}
        onCancel={() => setDeleteAllOpen(false)}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="ลบซีรีส์"
        description={`ยืนยันการลบ "${deleteTarget?.title || ''}" ตอนทั้งหมดของซีรีส์นี้จะถูกลบด้วย`}
        confirmLabel="ลบซีรีส์"
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
