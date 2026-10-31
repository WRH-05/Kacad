export const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

/**
 * Replace `{token}` placeholders with values. Unknown tokens are left intact
 * so a missing key is visible in the UI instead of rendering "undefined".
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, token: string) =>
    token in values ? String(values[token]) : match
  );
}
