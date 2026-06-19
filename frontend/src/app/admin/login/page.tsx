'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faClock, faBan } from '@fortawesome/free-solid-svg-icons';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockout, setLockout] = useState<{ isLocked: boolean; remainingMs: number; isPermanent: boolean }>({
    isLocked: false,
    remainingMs: 0,
    isPermanent: false
  });
  const router = useRouter();

  const checkLockoutStatus = useCallback(async () => {
    try {
      const apiUrl = '/api/backend';
      const res = await fetch(`${apiUrl}/admin/security/check-lockout`);
      const data = await res.json();
      
      if (data.success && data.locked) {
        setLockout({
          isLocked: true,
          remainingMs: data.remainingMs || 0,
          isPermanent: data.permanent || false
        });
      } else {
        setLockout({ isLocked: false, remainingMs: 0, isPermanent: false });
      }
    } catch {
      console.error('Failed to check lockout status');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkLockoutStatus();
    }, 0);

    return () => clearTimeout(timer);
  }, [checkLockoutStatus]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockout.isLocked && lockout.remainingMs > 0 && !lockout.isPermanent) {
      timer = setInterval(() => {
        setLockout(prev => {
          const nextMs = prev.remainingMs - 1000;
          if (nextMs <= 0) {
            return { isLocked: false, remainingMs: 0, isPermanent: false };
          }
          return { ...prev, remainingMs: nextMs };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockout.isLocked, lockout.remainingMs, lockout.isPermanent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout.isLocked) return;
    
    setError('');
    setLoading(true);

    try {
      const apiUrl = '/api/backend';
      const res = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
      } else {
        setError(data.message || 'รหัสผ่านไม่ถูกต้อง');
        // Re-check lockout if login fails
        checkLockoutStatus();
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#1b1b1d] p-6 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">SeriesApp</p>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Admin Login</h1>
        </div>
        
        {error && (
          <div className="mb-5 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-center text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        {lockout.isLocked && (
          <div className="mb-5 flex flex-col items-center justify-center gap-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 p-4 text-center">
            <FontAwesomeIcon icon={lockout.isPermanent ? faBan : faClock} className={`text-xl ${lockout.isPermanent ? 'text-red-400' : 'text-yellow-400'}`} />
            <p className="text-sm font-bold text-white">
              {lockout.isPermanent 
                ? 'IP ของคุณถูกแบนถาวร' 
                : `ระบบระงับการใช้งานชั่วคราว: ${formatTime(lockout.remainingMs)}`}
            </p>
            {!lockout.isPermanent && <p className="text-xs text-[var(--color-text-secondary)]">กรุณารอจนกว่าเวลาจะหมดเพื่อเข้าสู่ระบบอีกครั้ง</p>}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="mb-1 block text-sm font-semibold text-[var(--color-text-secondary)]">Username</label>
            <input 
              id="admin-username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={lockout.isLocked}
              className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-white outline-none transition-colors focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold text-[var(--color-text-secondary)]">Password</label>
            <input 
              id="admin-password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={lockout.isLocked}
              className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-white outline-none transition-colors focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || lockout.isLocked}
            className={`mt-4 flex w-full items-center justify-center rounded-md py-2.5 font-bold text-white transition-colors ${
              lockout.isLocked 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-[var(--color-primary)] hover:bg-blue-600 disabled:opacity-70'
            }`}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : lockout.isLocked ? (
              lockout.isPermanent ? 'IP ถูกแบนถาวร' : 'ถูกระงับการเข้าถึง'
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
