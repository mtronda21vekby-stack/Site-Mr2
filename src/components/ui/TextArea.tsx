import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg border border-line bg-bg/70 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent-cyan",
        className
      )}
      {...props}
    />
  );
}
