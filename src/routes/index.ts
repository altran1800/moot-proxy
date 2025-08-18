import { H3Event } from 'h3';
import { getProxyHeaders, getAfterResponseHeaders } from '@/utils/headers.js';
import {
  isTurnstileEnabled,
  createTokenIfNeeded,
  setTokenHeader,
  isAllowedToMakeRequest
} from '@/utils/turnstile.js';

export default async function handler(event: H3Event) {
  // Convert Node headers to Fetch Headers
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.req.headers)) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(', '));
    } else if (value) {
      headers.set(key, value);
    }
  }

  // Turnstile check
  if (isTurnstileEnabled()) {
    const allowed = await isAllowedToMakeRequest(event);
    if (!allowed) {
      return new Response('Not allowed', { status: 403 });
    }
  }

  // Create token if needed
  const token = await createTokenIfNeeded(event);
  if (token) setTokenHeader(event, token);

  const proxyHeaders = getProxyHeaders(headers);
  const responseHeaders = getAfterResponseHeaders(proxyHeaders, event.req.url ?? '');

  return new Response('Hello from proxy!', {
    status: 200,
    headers: responseHeaders,
  });
}
