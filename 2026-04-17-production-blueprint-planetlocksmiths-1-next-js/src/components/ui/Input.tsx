import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-lg border border-line bg-bg/70 px-4 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent-cyan",
        className
      )}
      {...props}
    />
  );
}
