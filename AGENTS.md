# Lavita workspace

## Interface work

Before changing the landing page, read `DESIGN.md` and the applicable design guidance in `docs/impeccable/reference/`. The Impeccable source is vendored as documentation, not installed as a runtime dependency or a registered agent skill. See `docs/impeccable/README.md` for provenance.

Preserve Lavita's identity, Vietnamese content, and the facts in the supplied company profile. Keep facts and structure in `src/data/home.ts` and visible text in `src/i18n/dictionaries/` (Vietnamese `vi.ts` is the source; en/zh/ko/ja must keep the same keys), separate from layout and client interactions. Use `@/i18n/link` for internal links so visitors stay in their language. Keep Next.js Server Components as the default; use client components for browser interactions.

Use the established semantic CSS tokens and the self-hosted per-language fonts (Be Vietnam Pro for vi/en, Noto Sans SC/KR/JP for zh/ko/ja, Manrope only in the LAVITA wordmark; see DESIGN.md). Keep service descriptions, project PCCC scopes, and working contact/PDF links. Do not invent certifications, testimonials, revenue, or backend behavior. Growth plans in the profile are not realized revenue.

For interface changes, verify relevant desktop/mobile behavior, keyboard access, reduced motion, content overflow, and contrast. Run typecheck/build when appropriate. Browser QA tools used during this task live in ignored `.tmp/`; they are not project dependencies. Record verification limits accurately.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
