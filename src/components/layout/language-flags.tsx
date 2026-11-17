import { useId } from "react";
import { currentLanguage, languages, type LanguageCode } from "@/data/home";

// Five-point star polygon, first point straight up.
function star(cx: number, cy: number, outer: number, rotate = 0) {
  const inner = outer * 0.382;
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 ? inner : outer;
    const angle = ((-90 + rotate + i * 36) * Math.PI) / 180;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

function Trigram({ x, y, angle }: { x: number; y: number; angle: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`} fill="#000">
    <rect x="-2.2" y="-1.9" width="4.4" height=".9" /><rect x="-2.2" y="-.45" width="4.4" height=".9" /><rect x="-2.2" y="1" width="4.4" height=".9" />
  </g>;
}

// Authored SVG flags (3:2). Flag colours are the official ones, not theme tokens.
function Flag({ code, uid }: { code: LanguageCode; uid: string }) {
  switch (code) {
    case "en": return <svg viewBox="0 0 60 40" aria-hidden="true" focusable="false">
      <clipPath id={`${uid}-t`}><path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" /></clipPath>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" clipPath={`url(#${uid}-t)`} />
      <path d="M30,0 v40 M0,20 h60" stroke="#fff" strokeWidth="12" />
      <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
    </svg>;
    case "vi": return <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#DA251D" /><polygon points={star(15, 10.4, 6)} fill="#FFFF00" />
    </svg>;
    case "zh": return <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#EE1C25" />
      <g fill="#FFFF00"><polygon points={star(5, 5, 3)} /><polygon points={star(10, 2, 1, 23)} /><polygon points={star(12, 4, 1, 46)} /><polygon points={star(12, 7, 1, 70)} /><polygon points={star(10, 9, 1, 21)} /></g>
    </svg>;
    case "ko": return <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#fff" />
      <g transform="rotate(33.69 15 10)">
        <path d="M10,10 a5,5 0 0 1 10,0 z" fill="#CD2E3A" /><path d="M10,10 a5,5 0 0 0 10,0 z" fill="#0047A0" />
        <circle cx="12.5" cy="10" r="2.5" fill="#CD2E3A" /><circle cx="17.5" cy="10" r="2.5" fill="#0047A0" />
      </g>
      <Trigram x={6.6} y={4.4} angle={-56.31} /><Trigram x={23.4} y={4.4} angle={56.31} /><Trigram x={6.6} y={15.6} angle={56.31} /><Trigram x={23.4} y={15.6} angle={-56.31} />
    </svg>;
    case "ja": return <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#fff" /><circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>;
  }
}

export function LanguageFlags({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return <ul className={className ? `language-flags ${className}` : "language-flags"} aria-label="Ngôn ngữ">
    {languages.map(language => {
      const current = language.code === currentLanguage;
      // Translations are not available yet: non-current languages are announced as upcoming and do nothing.
      return <li key={language.code}>
        <button type="button" aria-pressed={current} aria-disabled={current ? undefined : true}
          aria-label={`${language.nativeName}${current ? "" : " (sắp có)"}`} title={current ? language.name : `${language.name} · sắp có`}>
          <Flag code={language.code} uid={`${uid}-${language.code}`} />
        </button>
      </li>;
    })}
  </ul>;
}
