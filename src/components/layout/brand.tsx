import Image from "next/image";
import Link from "@/i18n/link";

// Brand "A" traced from the official logo (cap height = 100 units): flat apex, no mid crossbar,
// a base bar joined to the right leg and split from the left leg by a thin diagonal gap.
function BrandA() {
  return <svg className="brand-a" viewBox="0 0 110 100" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M0 100 44.6 0h20.9L110 100H30.2l8.1-18h40.6L55 28.7 23 100Z" />
  </svg>;
}

export type BrandLabels = { tagline: string; home: string; logo: string };

export function Brand({ labels, link = true, className }: { labels: BrandLabels; link?: boolean; className?: string }) {
  const content = <><Image src="/images/lavita-symbol.png" alt="" width={72} height={72} /><span className="brand-name"><span className="brand-word">L<BrandA />VIT<BrandA /></span><small>{labels.tagline}</small></span></>;
  const classes = className ? `brand ${className}` : "brand";
  if (!link) return <div className={classes} role="img" aria-label={labels.logo}>{content}</div>;
  return <Link className={classes} href="/" aria-label={labels.home}>{content}</Link>;
}
