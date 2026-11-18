import { notFound } from "next/navigation";

// Unknown paths render the localized not-found page inside the [lang] layout (header, footer, language).
export default function UnknownPage() {
  notFound();
}
