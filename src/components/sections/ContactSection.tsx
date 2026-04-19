"use client";

import { useState } from 'react';
import type { Locale } from '@/components/layout/Header';

interface ContactSectionProps {
  title: string;
  text: string;
  phoneNumber: string;
  phoneDisplay: string;
  locale: Locale;
}

/**
 * A simple contact form allowing users to request service. Required fields are
 * phone and service, enforced client‑side. On submit, a POST request is
 * sent to the `/api/contact` route. This component runs on the client
 * because it uses React state to manage form inputs and submission status.
 */
export default function ContactSection({
  title,
  text,
  phoneNumber,
  phoneDisplay,
  locale,
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    vehicle: '',
    location: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (!formData.phone || !formData.service) {
      setErrorMessage('Phone and service are required.');
      return;
    }
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', service: '', vehicle: '', location: '', message: '' });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-heading font-semibold text-text">
          {title}
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-muted">{text}</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-xs font-medium text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
              placeholder="Your name (optional)"
            />
          </div>
          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 text-xs font-medium text-muted">
              Phone <span className="text-danger-soft">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
              placeholder="555‑123‑4567"
              required
            />
          </div>
          {/* Service Needed */}
          <div className="flex flex-col sm:col-span-2">
            <label htmlFor="service" className="mb-1 text-xs font-medium text-muted">
              Service Needed <span className="text-danger-soft">*</span>
            </label>
            <input
              id="service"
              name="service"
              type="text"
              value={formData.service}
              onChange={handleChange}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
              placeholder="e.g. Car lockout, Key replacement"
              required
            />
          </div>
          {/* Vehicle Make/Model */}
          <div className="flex flex-col">
            <label htmlFor="vehicle" className="mb-1 text-xs font-medium text-muted">
              Vehicle Make/Model
            </label>
            <input
              id="vehicle"
              name="vehicle"
              type="text"
              value={formData.vehicle}
              onChange={handleChange}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
              placeholder="e.g. Toyota Camry"
            />
          </div>
          {/* Location */}
          <div className="flex flex-col">
            <label htmlFor="location" className="mb-1 text-xs font-medium text-muted">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
              placeholder="e.g. Philadelphia, PA"
            />
          </div>
          {/* Message */}
          <div className="flex flex-col sm:col-span-2">
            <label htmlFor="message" className="mb-1 text-xs font-medium text-muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
              placeholder="Additional details (optional)"
            ></textarea>
          </div>
          {/* Submit and Call buttons */}
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-start">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-block rounded-full bg-accent-blue px-6 py-3 text-sm font-medium text-black transition-colors hover:brightness-110 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
            </button>
            <a
              href={`tel:${phoneNumber}`}
              className="inline-block rounded-full border border-line px-6 py-3 text-sm font-medium text-text transition-colors hover:border-line/70 hover:bg-white/5"
            >
              Call {phoneDisplay}
            </a>
          </div>
          {/* Status message */}
          {status === 'success' && (
            <p className="col-span-2 mt-4 text-sm text-accent-gold">
              Thank you! We have received your request and will be in touch.
            </p>
          )}
          {errorMessage && (
            <p className="col-span-2 mt-4 text-sm text-danger-soft">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}