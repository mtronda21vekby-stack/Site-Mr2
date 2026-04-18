"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { TextArea } from "@/components/ui/TextArea";
import type { GlobalSettings } from "@/types/content";
import type { Locale } from "@/types/common";

type ContactSectionProps = {
  title: string;
  text: string;
  settings: GlobalSettings;
  locale: Locale;
  primaryCta?: string;
  callCta?: string;
};

export function ContactSection({
  title,
  text,
  settings,
  locale,
  primaryCta = "Request Service",
  callCta = "Call Now"
}: ContactSectionProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const copy = {
    en: {
      phone: "Phone",
      serviceHours: "24/7 mobile service",
      languages: "English, Spanish, and Russian content ready",
      mobileOnly: "Mobile service only",
      name: "Name",
      phoneField: "Phone *",
      service: "Service needed *",
      vehicle: "Vehicle make/model",
      location: "Location",
      message: "Message",
      sending: "Sending...",
      sent: "Request received.",
      error: "Please call or check the required fields."
    },
    es: {
      phone: "Teléfono",
      serviceHours: "Servicio móvil 24/7",
      languages: "Contenido listo en inglés, español y ruso",
      mobileOnly: "Solo servicio móvil",
      name: "Nombre",
      phoneField: "Teléfono *",
      service: "Servicio necesario *",
      vehicle: "Marca/modelo del vehículo",
      location: "Ubicación",
      message: "Mensaje",
      sending: "Enviando...",
      sent: "Solicitud recibida.",
      error: "Llama o revisa los campos requeridos."
    },
    ru: {
      phone: "Телефон",
      serviceHours: "Мобильный сервис 24/7",
      languages: "Контент готов на английском, испанском и русском",
      mobileOnly: "Только мобильный сервис",
      name: "Имя",
      phoneField: "Телефон *",
      service: "Нужный сервис *",
      vehicle: "Марка/модель автомобиля",
      location: "Локация",
      message: "Сообщение",
      sending: "Отправляем...",
      sent: "Заявка получена.",
      error: "Позвоните или проверьте обязательные поля."
    }
  }[locale];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      event.currentTarget.reset();
      setStatus("sent");
      return;
    }

    setStatus("error");
  }

  return (
    <Section title={title} intro={text} id="contact" className="bg-surface/35">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-line bg-bg/70 p-6 sm:p-8">
          <p className="text-sm font-bold uppercase text-accent-gold">{copy.phone}</p>
          <a href={`tel:${settings.phonePrimary}`} className="mt-3 block font-heading text-3xl font-semibold text-text">
            {settings.phoneDisplay}
          </a>
          <div className="mt-8 grid gap-3 text-sm text-muted">
            <p>{copy.serviceHours}</p>
            <p>{copy.languages}</p>
            <p>{copy.mobileOnly}</p>
          </div>
          <div className="mt-8">
            <Button href={`tel:${settings.phonePrimary}`}>{callCta}</Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-bg/70 p-6 sm:p-8">
          <div className="hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="name" placeholder={copy.name} autoComplete="name" />
            <Input name="phone" placeholder={copy.phoneField} autoComplete="tel" required />
            <Input name="service" placeholder={copy.service} required />
            <Input name="vehicle" placeholder={copy.vehicle} />
            <Input name="location" placeholder={copy.location} className="sm:col-span-2" />
            <TextArea name="message" placeholder={copy.message} className="sm:col-span-2" />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-lg bg-accent-cyan px-5 py-3 text-sm font-black text-bg transition hover:bg-accent-blue disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "sending"}
            >
              {status === "sending" ? copy.sending : primaryCta}
            </button>
            <a
              href={`tel:${settings.phonePrimary}`}
              className="rounded-lg border border-line px-5 py-3 text-center text-sm font-bold text-text"
            >
              {callCta}
            </a>
          </div>
          {status === "sent" && <p className="mt-4 text-sm text-accent-cyan">{copy.sent}</p>}
          {status === "error" && <p className="mt-4 text-sm text-danger-soft">{copy.error}</p>}
        </form>
      </div>
    </Section>
  );
}
