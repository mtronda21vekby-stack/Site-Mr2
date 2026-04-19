export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm text-text outline-none ring-0 placeholder:text-muted/80 focus:border-accent-blue" />;
}
