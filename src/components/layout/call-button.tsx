import { Phone } from "lucide-react";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";

// Floating hotline button, fixed bottom right on every page (20/11/2026). A red circle with a phone icon and a soft
// ring pulsing outward; on hover or keyboard focus (wide screens) the number slides out beside the icon.
export async function CallButton() {
  const { company, t } = await getContent();
  return <a className="call-float" href={company.phoneHref} aria-label={format(t.nav.call, { phone: company.phone })}>
    <span className="call-float-icon" aria-hidden="true"><Phone size={24} /></span>
    <span className="call-float-label" aria-hidden="true"><span>{company.phone}</span></span>
  </a>;
}
