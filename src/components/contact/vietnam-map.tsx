import type { CSSProperties } from "react";
import Image from "next/image";
import { format } from "@/i18n/config";
import { vietnamMap } from "./vietnam-map-data";

const at = (point: { x: number; y: number }) => ({ "--x": `${(point.x / vietnamMap.width) * 100}%`, "--y": `${(point.y / vietnamMap.height) * 100}%` }) as CSSProperties;

// Map of Việt Nam with the head-office marker (logo + ripple) and the Hoàng Sa / Trường Sa archipelagos, as on dcons.vn/lien-he.
export function VietnamMap({ officeLabel, labels, intl }: { officeLabel: string; labels: { map: string; paracel: string; spratly: string }; intl: string }) {
  const { paracel, spratly } = vietnamMap;
  const islands = (cx: number, cy: number) => [[0, 0], [9, -6], [16, 4], [6, 10], [-8, 7], [20, -10], [-4, -11]].map(([dx, dy], index) => <circle key={index} cx={cx + dx} cy={cy + dy} r={1.8} />);
  return <figure className="vn-map" role="img" aria-label={format(labels.map, { office: officeLabel.toLocaleLowerCase(intl) })}>
    <svg viewBox={`0 0 ${vietnamMap.width} ${vietnamMap.height}`} aria-hidden="true" focusable="false">
      <path className="vn-map-land" d={vietnamMap.path} />
      <g className="vn-map-islands">{islands(paracel.x, paracel.y)}{islands(spratly.x, spratly.y)}</g>
      <text className="vn-map-island-label" x={paracel.x} y={paracel.y + 26} textAnchor="middle">{labels.paracel}</text>
      <text className="vn-map-island-label" x={spratly.x + 24} y={spratly.y + 26} textAnchor="end">{labels.spratly}</text>
    </svg>
    <div className="vn-map-marker" style={at(vietnamMap.headOffice)} aria-hidden="true">
      <span className="vn-map-ripple" /><span className="vn-map-ripple vn-map-ripple-late" />
      <Image className="vn-map-logo" src="/images/lavita-symbol.png" alt="" width={44} height={44} />
      <span className="vn-map-label"><span className="vn-map-label-line" /><span className="vn-map-label-text">{officeLabel}</span></span>
    </div>
  </figure>;
}
