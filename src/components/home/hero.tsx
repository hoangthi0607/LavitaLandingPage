import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";

// Home hero (21/11/2026): a white block that reads at a glance: the heading, one short sentence, and two large
// actions: find a service, and call the hotline with the number written out. One real project photo sits beside the
// text (never behind it) and nothing moves on its own, so readers with weaker eyesight get dark text on white at a
// large size. The logo stays in the header only.
export async function Hero() {
  const { company, slides, t } = await getContent();
  const [photo] = slides;
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-copy">
      <h1 id="hero-title">{t.home.heroHeading}</h1>
      <p className="hero-lead">{photo.description}</p>
      <div className="hero-actions">
        <Link className="button button-primary hero-button" href="/dich-vu">{t.common.findService}<ArrowRight size={22} aria-hidden="true" /></Link>
        <a className="button hero-call" href={company.phoneHref}><Phone size={22} aria-hidden="true" /><span>{format(t.nav.call, { phone: company.phone })}</span></a>
      </div>
      <Link className="hero-more" href="/du-an">{t.home.hero.seeProjects}</Link>
    </div>
    <div className="hero-media">
      <Image src={photo.image} alt={photo.alt} fill priority sizes="(max-width: 900px) 92vw, 46vw" />
    </div>
  </section>;
}
