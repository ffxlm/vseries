'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { adminFetch } from '@/lib/adminFetch';
import VideoUrlField from '@/components/VideoUrlField';

interface EpisodeFormData {
  seriesId: string;
  episodeNumber: number | '';
  title: string;
  videoUrl: string;
}

export default function CreateEpisode() {
  const router = useRouter();
  const params = useParams();
  const seriesId = params.id as string;

  const [formData, setFormData] = useState<EpisodeFormData>({
    seriesId,
    episodeNumber: '',
    title: '',
    videoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'episodeNumber' ? (value ? parseInt(value, 10) : '') : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminFetch('/admin/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        router.push(`/admin/series/${seriesId}/episodes`);
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href={`/admin/series/${seriesId}/episodes`} className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-white">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
            กลับไปหน้ารวมตอน
          </Link>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">เพิ่มตอนใหม่</h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70 lg:hidden"
        >
          <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'กำลังบันทึก' : 'บันทึก'}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="rounded-lg border border-white/10 bg-[#1b1b1d]">
            <div className="border-b border-white/10 px-4 py-3">
              <h2 className="font-bold text-[var(--color-primary)]">ข้อมูลตอน</h2>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-[180px_minmax(0,1fr)]">
              <label className="space-y-2">
                <span className="block text-sm font-semibold text-[var(--color-text-secondary)]">เลขตอน <span className="text-red-400">*</span></span>
                <input
                  type="number"
                  min="1"
                  name="episodeNumber"
                  required
                  value={formData.episodeNumber}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
                />
              </label>
              <label className="space-y-2">
                <span className="block text-sm font-semibold text-[var(--color-text-secondary)]">ชื่อตอน <span className="text-red-400">*</span></span>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="เช่น จุดเริ่มต้นของความแค้น"
                  className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#1b1b1d]">
            <div className="border-b border-white/10 px-4 py-3">
              <h2 className="font-bold text-[var(--color-primary)]">ไฟล์วิดีโอ</h2>
            </div>
            <div className="p-4">
              <VideoUrlField value={formData.videoUrl} onChange={handleChange} />
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
            <h2 className="font-bold text-[var(--color-primary)]">บันทึกตอน</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">เลขตอนต้องไม่ซ้ำกับตอนอื่นในซีรีส์เดียวกัน</p>
            <div className="mt-4 grid gap-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'กำลังบันทึก' : 'บันทึกตอนใหม่'}
              </button>
              <Link href={`/admin/series/${seriesId}/episodes`} className="inline-flex items-center justify-center rounded-md bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/15">
                ยกเลิก
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
