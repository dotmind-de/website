/** Shared between the inquiry form and its server action. */
export const PROJECT_TYPES = ["website", "relaunch", "webapp", "app", "seo", "ai", "branding", "other"] as const;
export const BUDGETS = ["b1", "b2", "b3", "b4", "b5"] as const;
export const TIMELINES = ["t1", "t2", "t3", "t4"] as const;

export type Field = "projectType" | "goal" | "website" | "budget" | "timeline" | "name" | "company" | "email" | "phone";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; errors: Partial<Record<Field, string>>; values: Partial<Record<Field, string>>; server?: boolean }
  | { status: "success"; name: string; email: string };
