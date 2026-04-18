import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FloatingBadgeProps = {
  children: ReactNode;
  className?: string;
};

export function FloatingBadge({ children, className }: FloatingBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-bg/75 px-4 py-3 text-xs font-bold uppercase text-text shadow-glow backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
