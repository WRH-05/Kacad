export type LeadContactAction = {
  href: string;
  label: string;
  kind: 'whatsapp' | 'email';
};

function greeting(name: string): string {
  return `Bonjour ${name}, merci pour votre intérêt pour Kennedy Academy. Nous avons bien reçu votre demande. Comment pouvons-nous vous accompagner ?`;
}

/**
 * Normalises a lead's contact into a direct WhatsApp or email action.
 * Algerian local numbers (`0X...`) become international (`213X...`).
 */
export function leadContactAction(contact: string, name: string): LeadContactAction | null {
  const trimmed = contact.trim();

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    const subject = encodeURIComponent('Kennedy Academy — votre demande');
    const body = encodeURIComponent(greeting(name));

    return {
      href: `mailto:${trimmed}?subject=${subject}&body=${body}`,
      label: 'Email Applicant ↗',
      kind: 'email'
    };
  }

  let digits = trimmed.replace(/[^\d]/g, '');

  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `213${digits.slice(1)}`;

  return {
    href: `https://wa.me/${digits}?text=${encodeURIComponent(greeting(name))}`,
    label: 'Open WhatsApp Chat with Applicant ↗',
    kind: 'whatsapp'
  };
}
