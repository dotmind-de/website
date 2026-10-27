import type { Locale } from "../config";
import { en, type Messages } from "./en";

const loaders: Record<Locale, () => Promise<Messages>> = {
  en: async () => en,
  de: () => import("./de").then((m) => m.de),
  tr: () => import("./tr").then((m) => m.tr),
  fa: () => import("./fa").then((m) => m.fa),
  ar: () => import("./ar").then((m) => m.ar),
};

/** Interface text for a given language (no request context needed). */
export const loadMessages = (locale: Locale) => loaders[locale]();
