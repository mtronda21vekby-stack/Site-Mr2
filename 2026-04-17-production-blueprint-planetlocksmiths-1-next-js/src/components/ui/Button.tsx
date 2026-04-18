import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ href, children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-bg",
        variant === "primary" &&
          "bg-accent-cyan text-bg shadow-glow hover:bg-accent-blue",
        variant === "secondary" &&
          "border border-line bg-white/5 text-text hover:border-accent-cyan hover:bg-white/10",
        variant === "ghost" && "text-text hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
