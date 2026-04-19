import JsonLd from './JsonLd';

export default function ServiceSchema({ title, description }: { title: string; description: string }) {
  return <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Service', name: title, description }} />;
}
