import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface/70 shadow-[0_20px_80px_rgba(0,0,0,0.2)]",
        className
      )}
      {...props}
    />
  );
}
