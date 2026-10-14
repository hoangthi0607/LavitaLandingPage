import Image from "next/image";
import Link from "next/link";
export function Brand() {
  return <Link className="brand" href="/" aria-label="Lavita trang chủ"><Image src="/images/lavita-symbol.png" alt="" width={48} height={48} /><span className="brand-name">LAVITA<small>Tối ưu giải pháp · Gia tăng giá trị</small></span></Link>;
}
