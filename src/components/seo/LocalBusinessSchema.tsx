import JsonLd from './JsonLd';
import { getGlobalSettings } from '@/lib/content';
import { siteUrl } from '@/lib/seo';

export default function LocalBusinessSchema() {
  const settings = getGlobalSettings();
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'AutomotiveBusiness'],
        name: settings.brandName,
        areaServed: `${settings.primaryCity}, ${settings.primaryState}`,
        telephone: settings.phoneDisplay,
        url: siteUrl,
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '00:00', closes: '23:59' }]
      }}
    />
  );
}
