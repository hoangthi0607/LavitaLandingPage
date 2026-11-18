import { ScrollReveal } from "@/components/content/scroll-reveal";

// Remounts on navigation: the page fades in and scroll reveals are re-armed for the new content.
export default function Template({ children }: { children: React.ReactNode }) {
  return <ScrollReveal className="page-transition">{children}</ScrollReveal>;
}
