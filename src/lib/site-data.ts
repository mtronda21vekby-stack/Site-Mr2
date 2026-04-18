export interface Service {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const callNumber = '+1 (555) 010‑2026';
export const callHref = 'tel:+15550102026';

export const services: Service[] = [
  {
    title: 'Car Lockout',
    description:
      'Fast mobile help when your vehicle is locked and the key is not accessible.',
  },
  {
    title: 'Car Key Replacement',
    description:
      'Replacement solutions for lost, broken, or damaged car keys, cut and programmed on‑site.',
  },
  {
    title: 'Key Programming',
    description:
      'Programming support for many modern vehicle keys, remotes and fobs.',
  },
  {
    title: 'Key Fob Assistance',
    description:
      'Help with fob‑related access and replacement needs to get you back on the road.',
  },
  {
    title: 'Ignition Key Issues',
    description:
      'Support for ignition‑related key problems and related access issues.',
  },
  {
    title: 'Emergency Mobile Service',
    description:
      '24/7 response for urgent automotive key and lock situations across Philadelphia.',
  },
];

export const whyChoose: string[] = [
  'Mobile automotive‑only focus',
  '24/7 urgent response',
  'Same‑day service availability',
  'Modern key and fob support',
  'Clear communication from request to arrival',
  'Service across Philadelphia',
];

export const faq: FaqItem[] = [
  {
    question: 'Do you provide service 24/7?',
    answer:
      'Yes. We are available around the clock for emergency automotive locksmith assistance across Philadelphia.',
  },
  {
    question: 'Do you have a shop location?',
    answer:
      'Currently we are a mobile‑only service. That means we come to you, wherever your vehicle is located in Philadelphia.',
  },
  {
    question: 'Can you help with lost car keys?',
    answer:
      'Absolutely. We can create replacement keys on the spot, including cutting and programming for many modern vehicles.',
  },
  {
    question: 'Do you work across Philadelphia?',
    answer:
      'Yes. Our service area covers the entire Philadelphia region. If you’re nearby, chances are we can help.',
  },
  {
    question: 'Can I request urgent help?',
    answer:
      'For emergencies, call our number anytime. We prioritise urgent lockouts and other critical situations.',
  },
  {
    question: 'Do you work with modern car keys and fobs?',
    answer:
      'We are equipped to cut and program many modern transponder keys, fobs, and smart keys.',
  },
];
