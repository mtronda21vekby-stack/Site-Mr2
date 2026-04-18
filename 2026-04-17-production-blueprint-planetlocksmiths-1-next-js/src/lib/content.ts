import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Locale } from "@/types/common";
import type {
  AreaPage,
  FAQContent,
  GlobalSettings,
  HomeContent,
  ReviewsContent,
  ServicePage
} from "@/types/content";

const contentRoot = path.join(process.cwd(), "src/content");

function readJson<T>(...segments: string[]): T {
  const filePath = path.join(contentRoot, ...segments);
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function readCollection<T>(locale: Locale, collection: "services" | "areas") {
  const directory = path.join(contentRoot, collection, locale);

  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson<T>(collection, locale, file));
}

export function getGlobalSettings() {
  return readJson<GlobalSettings>("settings", "global.json");
}

export function getHomeContent(locale: Locale) {
  return readJson<HomeContent>("home", `${locale}.json`);
}

export function getReviews(locale: Locale) {
  return readJson<ReviewsContent>("reviews", `${locale}.json`);
}

export function getFaq(locale: Locale) {
  return readJson<FAQContent>("faq", `${locale}.json`);
}

export function getServices(locale: Locale) {
  return readCollection<ServicePage>(locale, "services");
}

export function getService(locale: Locale, slug: string) {
  const filePath = path.join(contentRoot, "services", locale, `${slug}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  return readJson<ServicePage>("services", locale, `${slug}.json`);
}

export function getAreas(locale: Locale) {
  return readCollection<AreaPage>(locale, "areas");
}

export function getArea(locale: Locale, slug: string) {
  const filePath = path.join(contentRoot, "areas", locale, `${slug}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  return readJson<AreaPage>("areas", locale, `${slug}.json`);
}
