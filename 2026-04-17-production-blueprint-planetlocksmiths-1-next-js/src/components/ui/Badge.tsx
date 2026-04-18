import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
