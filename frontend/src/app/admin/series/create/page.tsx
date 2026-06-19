'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ExternalImage from '@/components/ExternalImage';
import { adminFetch } from '@/lib/adminFetch';

type LanguageType = 'thai_dub' | 'thai_sub';

interface SeriesFormData {
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  languageType: LanguageType;
  isPopular: boolean;
  isNewSeries: boolean;
}

const initialFormData: SeriesFormData = {
  title: '',
  slug: '',
  description: '',
  posterUrl: '',
  languageType: 'thai_dub',
  isPopular: false,
  isNewSeries: true,
};

export default function CreateSeries() {
  const router = useRouter();
  const [formData, setFormData] = useState<SeriesFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    setFormData((prev) => ({
      ...prev,
      [target.name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminFetch('/admin/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        router.push('/admin/series');
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
          <Link href="/admin/series" className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-white">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
            กลับไปหน้ารวมซีรีส์
          </Link>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">เพิ่มซีรีส์ใหม่</h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70 lg:hidden"
        >
          <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'กำลังบันทึก' : 'บันทึกซีรีส์'}
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
              <h2 className="font-bold text-[var(--color-primary)]">ข้อมูลหลัก</h2>
            </div>
            <div className="space-y-4 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="block text-sm font-semibold text-[var(--color-text-secondary)]">ชื่อเรื่อง <span className="text-red-400">*</span></span>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="เช่น สืบสันดาน ซีซั่น 1"
                    className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
                  />
                </label>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="series-slug" className="text-sm font-semibold text-[var(--color-text-secondary)]">
                      Slug <span className="text-red-400">*</span>
                    </label>
                  </div>
                  <input
                    id="series-slug"
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="master-of-the-house-s1"
                    className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 font-mono text-sm outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
                  />
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Use lowercase letters, numbers, and hyphens only. Example: master-of-the-house-s1
                  </p>
                </div>
              </div>

              <label className="space-y-2">
                <span className="block text-sm font-semibold text-[var(--color-text-secondary)]">เรื่องย่อ <span className="text-red-400">*</span></span>
                <textarea
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="พิมพ์เรื่องย่อของซีรีส์"
                  className="w-full resize-none rounded-md border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#1b1b1d]">
            <div className="border-b border-white/10 px-4 py-3">
              <h2 className="font-bold text-[var(--color-primary)]">สื่อและภาษา</h2>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_128px]">
              <div className="space-y-4">
                <label className="space-y-2">
                  <span className="block text-sm font-semibold text-[var(--color-text-secondary)]">Poster URL <span className="text-red-400">*</span></span>
                  <input
                    type="url"
                    name="posterUrl"
                    required
                    value={formData.posterUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)]"
                  />
                  <p className="text-xs text-[var(--color-text-secondary)]">แนะนำอัตราส่วน 3:4 สำหรับโปสเตอร์แนวตั้ง</p>
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-semibold text-[var(--color-text-secondary)]">ประเภทเสียง</span>
                  <select
                    name="languageType"
                    value={formData.languageType}
                    onChange={handleChange}
                    className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                  >
                    <option value="thai_dub">พากย์ไทย</option>
                    <option value="thai_sub">ซับไทย</option>
                  </select>
                </label>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-white/10 bg-black">
                {formData.posterUrl ? (
                  <ExternalImage src={formData.posterUrl} alt="ตัวอย่างโปสเตอร์" fill sizes="128px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-secondary)]">No Image</div>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <section className="rounded-lg border border-white/10 bg-[#1b1b1d]">
            <div className="border-b border-white/10 px-4 py-3">
              <h2 className="font-bold text-[var(--color-primary)]">การแสดงผล</h2>
            </div>
            <div className="space-y-3 p-4">
              <ToggleRow
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                title="แสดงในหมวดยอดนิยม"
                description="ซีรีส์จะไปปรากฏแถวเด่นบนหน้าแรก"
              />
              <ToggleRow
                name="isNewSeries"
                checked={formData.isNewSeries}
                onChange={handleChange}
                title="แสดงในหมวดมาใหม่"
                description="เหมาะสำหรับเนื้อหาที่เพิ่งเพิ่มเข้าระบบ"
              />
            </div>
          </section>

          <div className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">ตรวจชื่อเรื่อง, slug และลิงก์รูปก่อนบันทึก เพื่อให้หน้าเว็บแสดงผลถูกต้องทันที</p>
            <div className="mt-4 grid gap-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'กำลังบันทึก' : 'บันทึกซีรีส์'}
              </button>
              <Link href="/admin/series" className="inline-flex items-center justify-center rounded-md bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/15">
                ยกเลิก
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}

function ToggleRow({
  name,
  checked,
  onChange,
  title,
  description,
}: {
  name: keyof Pick<SeriesFormData, 'isPopular' | 'isNewSeries'>;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-white/10 bg-black/40 p-3">
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">{description}</span>
      </span>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-5 w-5 accent-[var(--color-primary)]" />
    </label>
  );
}
