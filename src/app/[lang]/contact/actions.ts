"use server";

import nodemailer from "nodemailer";
import { site } from "@/content/site";
import { defaultLocale, isLocale, localeMeta, type Locale } from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import type { Messages } from "@/i18n/messages/en";
import { BUDGETS, PROJECT_TYPES, TIMELINES, type Field, type InquiryState } from "./inquiry";

const fill = (text: string, values: Record<string, string>) => text.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");

const FIELDS: Field[] = ["projectType", "goal", "website", "budget", "timeline", "name", "company", "email", "phone"];
const LIMITS: Record<Field, number> = {
  projectType: 20,
  goal: 4000,
  website: 300,
  budget: 10,
  timeline: 10,
  name: 120,
  company: 160,
  email: 200,
  phone: 40,
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Submissions faster than this are almost certainly bots. */
const MIN_FILL_MS = 2500;

export async function sendInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  const rawLang = String(form.get("lang") ?? "");
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const m = await loadMessages(lang);
  const e = m.contact.form.errors;

  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(form.get(f) ?? "").trim().slice(0, LIMITS[f])]),
  ) as Record<Field, string>;

  // Spam traps: a hidden field humans never fill, and a minimum time on the form.
  // Bots get a normal-looking success so they don't adapt.
  const started = Number(form.get("started"));
  if (String(form.get("fax") ?? "") !== "" || (started > 0 && Date.now() - started < MIN_FILL_MS)) {
    return { status: "success", name: values.name, email: values.email };
  }

  const errors: Partial<Record<Field, string>> = {};
  if (!PROJECT_TYPES.includes(values.projectType as (typeof PROJECT_TYPES)[number])) errors.projectType = e.projectType;
  if (values.goal.length < 15) errors.goal = e.goal;
  if (!values.name) errors.name = e.name;
  if (!EMAIL.test(values.email)) errors.email = e.email;
  if (!BUDGETS.includes(values.budget as (typeof BUDGETS)[number])) values.budget = "";
  if (!TIMELINES.includes(values.timeline as (typeof TIMELINES)[number])) values.timeline = "";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  try {
    await deliver(values, lang, m);
  } catch (err) {
    console.error("[contact] sending failed:", err);
    return { status: "error", errors: {}, values, server: true };
  }
  return { status: "success", name: values.name, email: values.email };
}

async function deliver(v: Record<Field, string>, lang: Locale, m: Messages) {
  const f = m.contact.form;
  const rows: [string, string][] = [
    [f.projectType, f.types[v.projectType as keyof typeof f.types] ?? v.projectType],
    [f.goal, v.goal],
    [f.website, v.website],
    [f.budget, v.budget ? f.budgets[v.budget as keyof typeof f.budgets] : ""],
    [f.timeline, v.timeline ? f.timelines[v.timeline as keyof typeof f.timelines] : ""],
    [f.name, v.name],
    [f.company, v.company],
    [f.email, v.email],
    [f.phone, v.phone],
  ].filter(([, value]) => value) as [string, string][];

  const owner = {
    subject: `New inquiry · ${v.name}${v.company ? ` (${v.company})` : ""} · ${localeMeta[lang].short}`,
    text: [`Language: ${localeMeta[lang].native} (${lang})`, "", ...rows.map(([k, val]) => `${k}: ${val}`)].join("\n"),
    html: mailHtml({
      dir: "ltr",
      lang: "en",
      intro: [`New inquiry via ${site.domain} — language: ${localeMeta[lang].native}`],
      rows,
    }),
  };

  const mail = m.contact.mail;
  const greeting = fill(mail.greeting, { name: v.name });
  const reply = {
    subject: mail.subject,
    text: [greeting, "", mail.body, "", mail.summary, ...rows.map(([k, val]) => `${k}: ${val}`), "", mail.closing, mail.signature, site.email ?? "", site.phone?.display ?? ""].join("\n"),
    html: mailHtml({
      dir: localeMeta[lang].dir,
      lang,
      intro: [greeting, mail.body],
      summary: mail.summary,
      rows,
      closing: [mail.closing, mail.signature],
    }),
  };

  const host = process.env.SMTP_HOST;
  if (!host) {
    if (process.env.NODE_ENV === "production") throw new Error("SMTP_HOST is not configured");
    console.info("[contact] SMTP not configured — would send:\n", owner.text, "\n---\n", reply.text);
    return;
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const from = process.env.MAIL_FROM ?? `${site.name} <${site.email}>`;
  const to = process.env.MAIL_TO ?? site.email ?? undefined;

  // The inquiry must reach Reza; the confirmation is best-effort.
  await transport.sendMail({ from, to, replyTo: `${v.name} <${v.email}>`, ...owner });
  await transport
    .sendMail({ from, to: `${v.name} <${v.email}>`, replyTo: to, ...reply })
    .catch((err) => console.error("[contact] confirmation failed:", err));
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Simple, client-safe HTML mail: one column, system fonts, no images. */
function mailHtml({
  dir,
  lang,
  intro,
  summary,
  rows,
  closing,
}: {
  dir: "ltr" | "rtl";
  lang: string;
  intro: string[];
  summary?: string;
  rows: [string, string][];
  closing?: string[];
}) {
  const align = dir === "rtl" ? "right" : "left";
  const p = (s: string) => `<p style="margin:0 0 16px;line-height:1.6">${esc(s).replace(/\n/g, "<br>")}</p>`;
  return `<!doctype html><html lang="${lang}" dir="${dir}"><body style="margin:0;background:#f4f3f0;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#141414;text-align:${align}">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:6px;padding:32px">
<p style="margin:0 0 28px;font-size:20px;font-weight:600;letter-spacing:-0.02em" dir="ltr">dotMind<span style="color:#e5893f">.</span></p>
${intro.map(p).join("")}
${summary ? `<p style="margin:24px 0 8px;font-weight:600">${esc(summary)}</p>` : ""}
<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;border-top:1px solid #eee;color:#777;vertical-align:top;width:38%">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table>
${closing ? `<div style="margin-top:28px">${closing.map(p).join("")}</div>` : ""}
<p style="margin:28px 0 0;font-size:12px;color:#999" dir="ltr">${esc(site.email ?? "")} · ${esc(site.phone?.display ?? "")} · ${esc(site.domain)}</p>
</div></body></html>`;
}
