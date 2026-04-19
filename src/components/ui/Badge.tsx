export function Badge({ children }: { children: string }) {
  return <span className="rounded-full border border-line bg-white/5 px-3 py-1 text-xs font-medium text-text/90">{children}</span>;
}
