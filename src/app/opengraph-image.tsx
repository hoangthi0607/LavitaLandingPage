import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/home";

export const alt = "Lavita – Thiết kế, thi công và bảo trì phòng cháy chữa cháy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [font, logo, photo] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/manrope-semibold.ttf")),
    readFile(join(process.cwd(), "public/images/lavita-symbol.png")),
    readFile(join(process.cwd(), "public/images/installation-og.png")),
  ]);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#302824", color: "#fff6ec", fontFamily: "Manrope" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 760, padding: "54px 58px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}><img src={`data:image/png;base64,${logo.toString("base64")}`} width={68} height={68} alt="" /><span style={{ fontSize: 48, fontWeight: 600 }}>LAVITA</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}><div style={{ fontSize: 60, lineHeight: 1.15, fontWeight: 600 }}>Giải pháp phòng cháy chữa cháy</div><div style={{ fontSize: 26, color: "#d5c5b6" }}>Thiết kế · Thi công · Bảo trì</div></div>
        <div style={{ fontSize: 22, color: "#ffc493" }}>{new URL(site.url).hostname}</div>
      </div>
      <div style={{ display: "flex", width: 440, height: "100%", borderLeft: "1px solid #776355" }}><img src={`data:image/png;base64,${photo.toString("base64")}`} width={440} height={630} style={{ objectFit: "cover" }} alt="" /></div>
    </div>,
    { ...size, fonts: [{ name: "Manrope", data: font, style: "normal", weight: 600 }] },
  );
}
