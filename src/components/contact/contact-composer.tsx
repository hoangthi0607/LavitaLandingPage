"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Mail, X } from "lucide-react";
import { company, getProject, getService, services } from "@/data/home";

type ContactComposerProps = {
  initialServiceSlug?: string;
  initialProjectSlug?: string;
};

export function ContactComposer({ initialServiceSlug, initialProjectSlug }: ContactComposerProps) {
  const [serviceSlug, setServiceSlug] = useState(initialServiceSlug ?? "");
  const [projectSlug, setProjectSlug] = useState(initialProjectSlug);
  const [name, setName] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [needs, setNeeds] = useState("");
  const service = getService(serviceSlug);
  const project = getProject(projectSlug);
  const subject = service ? `Tư vấn PCCC – ${service.title}` : "Trao đổi nhu cầu PCCC với Lavita";
  const body = [
    "Kính gửi Lavita,",
    "",
    service ? `Tôi muốn trao đổi về dịch vụ: ${service.title}.` : "Tôi muốn được tư vấn dịch vụ PCCC phù hợp công trình.",
    ...(project ? [`Dự án tôi đã tham khảo: ${project.title} (${project.tag}).`] : []),
    ...(name.trim() ? [`Người liên hệ: ${name.trim()}`] : []),
    ...(workplace.trim() ? [`Công trình / đơn vị: ${workplace.trim()}`] : []),
    ...(needs.trim() ? ["", "Nhu cầu cần trao đổi:", needs.trim()] : []),
    "",
    "Xin vui lòng trao đổi thêm qua email này.",
    "Trân trọng.",
  ].join("\n");
  const emailHref = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return <section className="contact-composer" aria-labelledby="contact-composer-title">
    <h2 id="contact-composer-title">Chuẩn bị nội dung tư vấn</h2>
    <p>Chọn dịch vụ và bổ sung thông tin bạn muốn trao đổi. Các mục bên dưới đều không bắt buộc.</p>
    <noscript>
      <p className="contact-noscript">Cần bật JavaScript để đưa thông tin bạn nhập vào email. Bạn vẫn có thể <a href={company.phoneHref}>gọi {company.phone}</a> hoặc <a href={`mailto:${company.email}`}>gửi email trực tiếp</a>.</p>
    </noscript>
    {project && <div className="contact-reference">
      <div>
        <span>Dự án bạn đã tham khảo</span>
        <Link href={`/du-an/${project.slug}`}>{project.title} <ArrowUpRight size={17} aria-hidden="true" /></Link>
        <p>{project.tag}</p>
      </div>
      <button type="button" className="contact-remove-reference" onClick={() => setProjectSlug(undefined)} aria-label={`Bỏ dự án tham khảo ${project.title}`}>
        <X size={18} aria-hidden="true" /><span>Bỏ chọn</span>
      </button>
    </div>}
    <div className="contact-fields">
      <div className="contact-field">
        <label htmlFor="contact-service">Dịch vụ cần trao đổi</label>
        <select id="contact-service" value={serviceSlug} onChange={event => setServiceSlug(event.target.value)}>
          <option value="">Chưa xác định dịch vụ</option>
          {services.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </select>
      </div>
      <div className="contact-field-pair">
        <div className="contact-field">
          <label htmlFor="contact-name">Người liên hệ</label>
          <input id="contact-name" type="text" autoComplete="name" maxLength={120} value={name} onChange={event => setName(event.target.value)} />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-workplace">Công trình / đơn vị</label>
          <input id="contact-workplace" type="text" autoComplete="organization" maxLength={180} value={workplace} onChange={event => setWorkplace(event.target.value)} />
        </div>
      </div>
      <div className="contact-field">
        <label htmlFor="contact-needs">Nhu cầu cần trao đổi</label>
        <textarea id="contact-needs" rows={5} maxLength={1500} aria-describedby="contact-needs-hint" value={needs} onChange={event => setNeeds(event.target.value)} />
        <p id="contact-needs-hint" className="contact-field-hint">Bạn có thể ghi loại công trình, địa điểm, tình trạng hệ thống và nhu cầu PCCC hiện tại.</p>
      </div>
    </div>
    <details className="contact-email-preview">
      <summary>Xem nội dung email</summary>
      <p><strong>Tiêu đề:</strong> {subject}</p>
      <pre>{body}</pre>
    </details>
    <div className="contact-compose-action">
      <a className="button button-primary" href={emailHref}><Mail size={19} aria-hidden="true" />Mở email tư vấn<ArrowUpRight size={18} aria-hidden="true" /></a>
      <p>Liên kết mở ứng dụng email của bạn với nội dung đã điền. Bạn kiểm tra và tự chọn gửi đến {company.email}.</p>
    </div>
    <p className="contact-email-help">Ứng dụng email chưa được thiết lập? <a href={`mailto:${company.email}`}>{company.email}</a> hoặc <a href={company.phoneHref}>gọi {company.phone}</a>.</p>
  </section>;
}
