export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function absoluteUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planetlocksmiths.com";
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
