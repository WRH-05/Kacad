import type { Schedule } from '@/lib/hours';

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213540688696';

export const contactInfo = {
  address: {
    line1: 'El Biar',
    city: 'Algiers',
    country: 'Algeria',
    mapsUrl: 'https://maps.app.goo.gl/83ka8fKBYabae2eT8'
  },
  email: 'kennedy@likour.tech',
  phone: {
    display: '+213 540 68 86 96',
    tel: '+213540688696'
  },
  whatsapp: {
    number: whatsappNumber,
    url: `https://wa.me/${whatsappNumber}`,
    message:
      'Hello Kennedy Academy — I would like to know more about the programmes.'
  },
  socials: [
    { id: 'instagram', href: 'https://www.instagram.com/kennedy.acad/' },
    {
      id: 'facebook',
      href: 'https://www.facebook.com/people/Kennedy-Academy/61594130517686/'
    },
    { id: 'maps', href: 'https://maps.app.goo.gl/83ka8fKBYabae2eT8' }
  ],
  /** Open 7 days a week, 09:00–19:00. */
  hours: [
    { days: [0, 1, 2, 3, 4, 5, 6], open: '09:00', close: '19:00' }
  ] satisfies readonly Schedule[]
} as const;

export const timeZone = 'Africa/Algiers' as const;

export function whatsappHref(prefill: string = contactInfo.whatsapp.message): string {
  return `${contactInfo.whatsapp.url}?text=${encodeURIComponent(prefill)}`;
}
