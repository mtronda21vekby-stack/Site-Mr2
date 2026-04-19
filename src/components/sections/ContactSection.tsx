import { Section } from '@/components/ui/Section';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { getGlobalSettings } from '@/lib/content';

export default function ContactSection({ locale }: { locale: string }) {
  const settings = getGlobalSettings();
  return (
    <Section id="contact" eyebrow="contact" title="Request service" description="UI is ready for a backend later. For now, the page is static, deploy-safe, and presentable.">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-line bg-surface/80 p-6 md:p-8">
          <form className="grid gap-4">
            <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
            <Input placeholder="Name" required />
            <Input placeholder="Phone" required />
            <Input placeholder="Service Needed" required />
            <Input placeholder="Vehicle Make / Model" />
            <Input placeholder="Location" />
            <TextArea rows={5} placeholder="Message" />
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-bg shadow-glow hover:bg-accent-cyan">Request Service</button>
              <Button href={`tel:${settings.phonePrimary}`} variant="secondary">Call Now</Button>
            </div>
          </form>
        </div>
        <div className="rounded-[32px] border border-line bg-surface-2/80 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-cyan">Service details</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
            <p><span className="text-text">Phone:</span> {settings.phoneDisplay}</p>
            <p><span className="text-text">Language support:</span> English, Español, Русский</p>
            <p><span className="text-text">Availability:</span> {settings.serviceHours}</p>
            <p><span className="text-text">Format:</span> Mobile service only</p>
            <p><span className="text-text">Coverage:</span> Philadelphia, PA</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
