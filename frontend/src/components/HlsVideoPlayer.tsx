'use client';

import Hls from 'hls.js';
import { useEffect, useMemo, useRef, useState } from 'react';

type HlsVideoPlayerProps = {
  src: string;
  className?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
};

function isHlsUrl(src: string) {
  try {
    return new URL(src, window.location.href).pathname.toLowerCase().endsWith('.m3u8');
  } catch {
    return src.toLowerCase().includes('.m3u8');
  }
}

export default function HlsVideoPlayer({ src, className, onEnded, onTimeUpdate }: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fatalPlaybackError, setFatalPlaybackError] = useState<{ src: string; message: string } | null>(null);
  const unsupportedHlsMessage = useMemo(() => {
    if (!src || typeof document === 'undefined' || !isHlsUrl(src)) return '';
    const probe = document.createElement('video');
    if (probe.canPlayType('application/vnd.apple.mpegurl') || Hls.isSupported()) return '';
    return 'เบราว์เซอร์นี้ไม่รองรับการเล่นวิดีโอ HLS';
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;

    if (!isHlsUrl(src)) {
      video.src = src;
      return undefined;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return undefined;
    }

    if (!Hls.isSupported()) {
      return undefined;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      startLevel: 0,
      capLevelOnFPSDrop: true,
      backBufferLength: 45,
      maxBufferLength: 90,
      maxMaxBufferLength: 180,
      maxBufferSize: 60 * 1024 * 1024,
      abrEwmaDefaultEstimate: 1800000,
      abrEwmaFastLive: 3,
      abrEwmaSlowLive: 9,
      abrBandWidthFactor: 0.85,
      abrBandWidthUpFactor: 0.7,
      manifestLoadingTimeOut: 8000,
      manifestLoadingMaxRetry: 4,
      manifestLoadingRetryDelay: 500,
      levelLoadingTimeOut: 8000,
      levelLoadingMaxRetry: 4,
      levelLoadingRetryDelay: 500,
      fragLoadingTimeOut: 12000,
      fragLoadingMaxRetry: 6,
      fragLoadingRetryDelay: 500,
    });

    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        setFatalPlaybackError({ src, message: 'ไม่สามารถโหลดวิดีโอได้' });
        hls.destroy();
      }
    });

    return () => {
      hls.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        controls
        playsInline
        className={className}
        onEnded={onEnded}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          onTimeUpdate?.(video.currentTime, video.duration);
        }}
      >
        Your browser does not support the video tag.
      </video>
      {(unsupportedHlsMessage || (fatalPlaybackError?.src === src ? fatalPlaybackError.message : '')) && (
        <div className="absolute inset-x-4 bottom-4 rounded-md border border-red-500/40 bg-black/80 px-4 py-3 text-center text-sm font-semibold text-red-200">
          {unsupportedHlsMessage || fatalPlaybackError?.message}
        </div>
      )}
    </>
  );
}
