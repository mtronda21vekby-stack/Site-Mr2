import type { Locale } from '@/components/layout/Header'

const content: Record<Locale, { eyebrow: string; title: string; intro: string; services: Array<{ title: string; description: string; details: string[] }> }> = {
  en: {
    eyebrow: 'Automotive locksmith details',
    title: 'What customers usually need before booking service.',
    intro: 'Clear service information helps customers understand the job before submitting a request. Vehicle locksmith work can vary by make, year, security system, key type, and parts availability.',
    services: [
      {
        title: 'Car lockout service',
        description: 'For locked vehicles, keys locked inside, trunk lockouts, or urgent access situations.',
        details: ['Vehicle location is required', 'Some vehicles need non-damaging specialty tools', 'Call immediately if the car is running, unsafe, or blocking traffic'],
      },
      {
        title: 'Car key replacement',
        description: 'For lost, damaged, or missing automotive keys where a replacement key may be needed.',
        details: ['Make, model, and year affect key type', 'Some vehicles require programming', 'Proof of authorization may be requested'],
      },
      {
        title: 'Key fob and transponder programming',
        description: 'For remote keys, smart keys, push-to-start vehicles, and transponder systems.',
        details: ['Programming availability depends on vehicle system', 'A working key may be required for some cases', 'Parts availability can affect timing and price'],
      },
      {
        title: 'Ignition and broken key help',
        description: 'For broken keys, stuck keys, worn ignition cylinders, or ignition-related access issues.',
        details: ['Do not force a stuck key', 'Describe whether the key turns or is broken inside', 'Some repairs may require parts or additional inspection'],
      },
    ],
  },
  es: {
    eyebrow: 'Detalles de cerrajería automotriz',
    title: 'Información que ayuda antes de solicitar servicio.',
    intro: 'El trabajo automotriz puede variar por marca, año, sistema de seguridad, tipo de llave y disponibilidad de piezas.',
    services: [
      { title: 'Auto cerrado', description: 'Para vehículos cerrados, llaves adentro o baúl cerrado.', details: ['Ubicación requerida', 'Algunos autos requieren herramientas especiales', 'Llame si el auto está encendido o en una situación insegura'] },
      { title: 'Reemplazo de llave', description: 'Para llaves perdidas, dañadas o faltantes.', details: ['Marca, modelo y año importan', 'Algunos autos requieren programación', 'Puede requerirse autorización'] },
      { title: 'Programación de control', description: 'Para controles remotos, smart keys y transponders.', details: ['Depende del sistema del vehículo', 'A veces se requiere una llave funcional', 'Piezas afectan tiempo y precio'] },
      { title: 'Ignición y llave rota', description: 'Para llaves rotas, atascadas o problemas de ignición.', details: ['No fuerce una llave atascada', 'Explique si la llave gira o está rota', 'Puede requerir inspección adicional'] },
    ],
  },
  ru: {
    eyebrow: 'Детали автомобильной услуги',
    title: 'Что клиенту важно знать перед заявкой.',
    intro: 'Автомобильные ключи и замки отличаются по марке, году, системе безопасности, типу ключа и наличию деталей.',
    services: [
      { title: 'Открытие автомобиля', description: 'Если машина закрыта, ключи внутри, багажник закрыт или нужен срочный доступ.', details: ['Нужна локация автомобиля', 'Некоторым авто нужны специальные инструменты', 'Звоните сразу, если машина заведена или ситуация опасная'] },
      { title: 'Замена автомобильного ключа', description: 'Если ключ потерян, поврежден или нужен новый ключ.', details: ['Марка, модель и год влияют на тип ключа', 'Некоторым авто нужно программирование', 'Может потребоваться подтверждение доступа'] },
      { title: 'Брелки и transponder-ключи', description: 'Для smart key, push-to-start, remote key и transponder систем.', details: ['Доступность зависит от системы авто', 'Иногда нужен рабочий ключ', 'Наличие деталей влияет на сроки и цену'] },
      { title: 'Зажигание и сломанный ключ', description: 'Если ключ застрял, сломался или проблема в замке зажигания.', details: ['Не усиливайте застрявший ключ', 'Опишите, поворачивается ли ключ', 'Может потребоваться осмотр или детали'] },
    ],
  },
}

export default function ServiceDepthSection({ locale }: { locale: Locale }) {
  const data = content[locale]

  return (
    <section className="relative overflow-hidden bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-gold">{data.eyebrow}</p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">{data.title}</h2>
          <p className="mt-5 text-base leading-8 text-muted">{data.intro}</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {data.services.map((service, index) => (
            <article key={service.title} className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl sm:p-6">
              <div className="absolute right-[-2.5rem] top-[-2.5rem] h-28 w-28 rounded-full border border-accent-blue/20" />
              <div className="relative">
                <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent-cyan">Service {String(index + 1).padStart(2, '0')}</p>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{service.description}</p>
                <ul className="mt-5 grid gap-2">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex gap-3 text-sm leading-6 text-text/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
