import Link from "next/link";
import { Section } from "@/components/ui/Section";
import type { AreaPage } from "@/types/content";
import type { Locale } from "@/types/common";
import { localizedPath } from "@/lib/i18n";

type ServiceAreasProps = {
  locale: Locale;
  title: string;
  intro: string;
  areas: AreaPage[];
};

export function ServiceAreas({ locale, title, intro, areas }: ServiceAreasProps) {
  const roadmapCopy = {
    en: {
      eyebrow: "Coverage roadmap",
      title: "Philadelphia first. Nearby areas next.",
      text: "The content model already supports more city pages without changing the page architecture."
    },
    es: {
      eyebrow: "Mapa de cobertura",
      title: "Filadelfia primero. Zonas cercanas después.",
      text: "El modelo de contenido ya permite sumar más páginas de ciudad sin cambiar la arquitectura."
    },
    ru: {
      eyebrow: "Карта покрытия",
      title: "Сначала Филадельфия. Потом близкие зоны.",
      text: "Контентная модель уже поддерживает новые городские страницы без изменения архитектуры."
    }
  }[locale];

  return (
    <Section title={title} intro={intro} id="areas">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-line bg-surface/70 p-6 sm:p-8">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={localizedPath(locale, `/areas/${area.slug}`)}
              className="block rounded-lg border border-line bg-bg/55 p-5 transition hover:border-accent-cyan"
            >
              <p className="text-sm font-bold uppercase text-accent-gold">{area.state}</p>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-text">{area.city}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{area.intro}</p>
            </Link>
          ))}
        </div>
        <div className="rounded-lg border border-line bg-[radial-gradient(circle_at_30%_25%,rgba(77,162,255,0.2),transparent_30%),#0B1020] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase text-accent-cyan">{roadmapCopy.eyebrow}</p>
          <p className="mt-4 text-3xl font-semibold text-text">{roadmapCopy.title}</p>
          <p className="mt-4 text-sm leading-6 text-muted">{roadmapCopy.text}</p>
        </div>
      </div>
    </Section>
  );
}
