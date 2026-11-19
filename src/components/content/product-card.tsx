import Image from "next/image";
import { Package } from "lucide-react";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import Link from "@/i18n/link";

type CardProduct = { slug: string; title: string; sku?: string; description?: string; images?: readonly { src: string }[] };

// Product card shared by /san-pham and "related products": the photo fills the square, the title link covers the
// card, and on hover the card lifts while a "view" strip slides up. Styles: app/[lang]/san-pham/catalogue.css (.prod-*).
export function ProductCard({ product, group, copy }: { product: CardProduct; group?: string; copy: Dictionary["productsPage"] }) {
  return <article className="prod-card" data-reveal="up">
    <div className="prod-card-image">
      {product.images?.[0] ? <Image src={product.images[0].src} alt={product.title} fill sizes="(max-width: 480px) 90vw, (max-width: 1024px) 45vw, 24vw" /> : <Package size={52} strokeWidth={1.4} aria-hidden="true" />}
      <span className="prod-card-cta" aria-hidden="true">{copy.view}</span>
    </div>
    <div className="prod-card-body">
      {group && <p className="prod-card-group">{group}</p>}
      <h3><Link href={`/san-pham/${product.slug}`}>{product.title}</Link></h3>
      {product.sku && <p className="prod-card-sku">{format(copy.sku, { sku: product.sku })}</p>}
      {product.description && <p className="prod-card-desc">{product.description}</p>}
    </div>
  </article>;
}
