type LanguageType = 'thai_dub' | 'thai_sub';

const badgeTone: Record<LanguageType, string> = {
  thai_dub: 'border-sky-300/35 bg-sky-500/25 text-sky-50 shadow-sky-950/30',
  thai_sub: 'border-amber-300/35 bg-amber-500/25 text-amber-50 shadow-amber-950/30',
};

export default function LanguageBadge({
  languageType,
  className = '',
}: {
  languageType: LanguageType;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border px-2 py-1 text-[11px] font-bold shadow-sm backdrop-blur-md ${badgeTone[languageType]} ${className}`}
    >
      {languageType === 'thai_dub' ? 'พากย์ไทย' : 'ซับไทย'}
    </div>
  );
}
