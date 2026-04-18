import { NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/validators";

const rateLimit = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = 5;

function getIp(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (rateLimit.get(ip) || []).filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= LIMIT) {
    rateLimit.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimit.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const ip = getIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = contactRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
