'use client'

export default function CookiePreferencesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="w-fit text-left text-sm transition hover:text-text"
      onClick={() => window.dispatchEvent(new CustomEvent('planetlocksmiths-open-cookie-preferences'))}
    >
      {label}
    </button>
  )
}
