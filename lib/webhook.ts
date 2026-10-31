/**
 * Forward a payload to a configured webhook. Returns true only when the
 * receiver answered with a 2xx. Never logs submitted personal data.
 */
export async function forwardWebhook(url: string, payload: unknown): Promise<boolean> {
  try {
    const parsed = new URL(url);

    const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:' && !isLoopback) {
      console.error('[webhook] refusing a non-HTTPS URL in production');
      return false;
    }

    const headers: Record<string, string> = {
      'content-type': 'application/json'
    };

    if (process.env.WEBHOOK_SECRET) {
      headers['x-kennedy-secret'] = process.env.WEBHOOK_SECRET;
    }

    const response = await fetch(parsed.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5_000)
    });

    if (!response.ok) {
      console.error('[webhook] receiver returned a non-2xx status', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      '[webhook] forward failed',
      error instanceof Error ? error.name : 'unknown error'
    );
    return false;
  }
}
