import Image from "next/image";
import Link from "next/link";

// Brand "A" traced from the official logo (cap height = 100 units): flat apex, no mid crossbar,
// a base bar joined to the right leg and split from the left leg by a thin diagonal gap.
function BrandA() {
  return <svg className="brand-a" viewBox="0 0 110 100" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M0 100 44.6 0h20.9L110 100H30.2l8.1-18h40.6L55 28.7 23 100Z" />
  </svg>;
}

export function Brand() {
  return <Link className="brand" href="/" aria-label="Lavita trang chủ"><Image src="/images/lavita-symbol.png" alt="" width={72} height={72} /><span className="brand-name"><span className="brand-word">L<BrandA />VIT<BrandA /></span><small>Tối ưu giải pháp · Gia tăng giá trị</small></span></Link>;
}
