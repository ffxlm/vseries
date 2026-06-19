'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faEye, faFilm, faListUl } from '@fortawesome/free-solid-svg-icons';
import { adminFetch } from '@/lib/adminFetch';
import { StatCardsSkeleton } from '@/components/Skeletons';

interface DashboardStats {
  totalSeries: number;
  totalEpisodes: number;
  activeUsers: number;
  dailyUsers: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await adminFetch('/admin/dashboard');
        
        if (res.ok) {
          const json = await res.json();
          setStats(json.data);
        }
      } catch {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const statCards = [
    { label: 'ซีรีส์ทั้งหมด', value: stats?.totalSeries.toLocaleString() ?? '-', icon: faFilm, tone: 'text-[var(--color-primary)]' },
    { label: 'ตอนทั้งหมด', value: stats?.totalEpisodes.toLocaleString() ?? '-', icon: faListUl, tone: 'text-sky-300' },
    { label: 'ผู้ใช้วันนี้', value: stats?.dailyUsers.toLocaleString() ?? '-', icon: faChartPie, tone: 'text-emerald-300' },
    { label: 'ยอดวิวรวม', value: stats?.totalViews.toLocaleString() ?? '-', icon: faEye, tone: 'text-amber-300' },
  ];
  const averageEpisodes = stats && stats.totalSeries > 0 ? (stats.totalEpisodes / stats.totalSeries).toFixed(1) : '-';
  const averageViews = stats && stats.totalSeries > 0 ? Math.round(stats.totalViews / stats.totalSeries).toLocaleString() : '-';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">ภาพรวมระบบ</p>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
      </div>

      {loading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{card.label}</p>
                <FontAwesomeIcon icon={card.icon} className={`h-4 w-4 ${card.tone}`} />
              </div>
              <p className={`mt-3 text-2xl font-bold md:text-3xl ${card.tone}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
          <h2 className="font-bold">ภาพรวมคอนเทนต์</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">จำนวนซีรีส์ในระบบ</dt>
              <dd className="font-semibold">{stats?.totalSeries.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">จำนวนตอนทั้งหมด</dt>
              <dd className="font-semibold">{stats?.totalEpisodes.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--color-text-secondary)]">ตอนเฉลี่ยต่อเรื่อง</dt>
              <dd className="font-semibold">{averageEpisodes}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
          <h2 className="font-bold">การเข้าชม</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">ผู้ใช้ที่บันทึกได้วันนี้</dt>
              <dd className="font-semibold">{stats?.dailyUsers.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">ผู้ใช้ขณะนี้</dt>
              <dd className="font-semibold">{stats?.activeUsers.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--color-text-secondary)]">วิวเฉลี่ยต่อเรื่อง</dt>
              <dd className="font-semibold">{averageViews}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
        <h2 className="font-bold mb-4">ระบบดึงข้อมูลอัตโนมัติ (Auto Sync)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded border border-white/5 bg-white/5 p-4">
            <h3 className="font-semibold text-sm mb-2">ดึงซีรีส์ใหม่ทั้งหมด</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">สแกนและดึงซีรีส์เรื่องใหม่ล่าสุดจาก API ทั้งระบบ</p>
            <SyncButton mode="all" label="ดึงซีรีส์ใหม่ (Sync All)" tone="bg-emerald-600 hover:bg-emerald-500" />
          </div>
          <div className="rounded border border-white/5 bg-white/5 p-4">
            <h3 className="font-semibold text-sm mb-2">อัพเดตลิงก์วิดีโอ</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">ดึงลิงก์วิดีโอล่าสุดมาทับลิงก์ที่เสีย เฉพาะเรื่องที่มีอยู่ในระบบแล้ว</p>
            <SyncButton mode="update" label="อัพเดตแก้ลิงก์ (Update Links)" tone="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]" />
          </div>
        </div>
      </section>
    </div>
  );
}

function SyncButton({ mode, label, tone }: { mode: 'all' | 'update'; label: string; tone: string }) {
  const [status, setStatus] = useState<{ isRunning: boolean; current: number; total: number; message: string; error: string | null }>({
    isRunning: false,
    current: 0,
    total: 0,
    message: '',
    error: null,
  });

  // Poll for status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        const res = await adminFetch('/admin/sync/status');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.mode === mode) {
            setStatus(json.data);
          } else if (json.data && json.data.isRunning && json.data.mode !== mode) {
            // Another mode is running, disable this button maybe
          }
        }
      } catch (e) {
        console.error('Failed to fetch sync status:', e);
      }
    };

    // Check immediately on mount
    checkStatus();

    // Always poll every 2 seconds to catch if it's running
    interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);
  }, [mode]);

  const handleSync = async () => {
    if (status.isRunning) return;
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะรันคำสั่ง ${label}? การทำงานนี้อาจใช้เวลาหลายนาที`)) return;

    setStatus(s => ({ ...s, isRunning: true, message: 'กำลังเริ่มต้น...' }));
    try {
      const res = await adminFetch('/admin/sync/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (!res.ok) {
        const json = await res.json();
        alert(json.message || 'เกิดข้อผิดพลาดในการรันสคริปต์');
        setStatus(s => ({ ...s, isRunning: false }));
      }
    } catch (e) {
      alert('Network error');
      setStatus(s => ({ ...s, isRunning: false }));
    }
  };

  const handleStop = async () => {
    if (!status.isRunning) return;
    try {
      const res = await adminFetch('/admin/sync/stop', { method: 'POST' });
      if (res.ok) {
        setStatus(s => ({ ...s, isRunning: false, message: 'หยุดการทำงานแล้ว', error: null }));
      } else {
        alert('Failed to stop sync');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const progressPercent = status.total > 0 ? Math.round((status.current / status.total) * 100) : 0;

  return (
    <div>
      {!status.isRunning ? (
        <button
          onClick={handleSync}
          className={`w-full rounded py-2 px-4 text-sm font-semibold text-white transition-colors ${tone}`}
        >
          {label}
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="w-full rounded py-2 px-4 text-sm font-semibold text-white transition-colors bg-red-600 hover:bg-red-500"
        >
          หยุดการทำงาน (Stop)
        </button>
      )}

      {status.isRunning && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
            <span>{status.message}</span>
            <span>{status.total > 0 ? `${status.current} / ${status.total} (${progressPercent}%)` : ''}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
      
      {!status.isRunning && status.message && !status.error && (
        <div className="mt-3 text-xs text-emerald-400 text-center font-medium">
          {status.message}
        </div>
      )}
      
      {!status.isRunning && status.error && (
        <div className="mt-3 text-xs text-red-400 text-center font-medium">
          {status.error}
        </div>
      )}
    </div>
  );
}
