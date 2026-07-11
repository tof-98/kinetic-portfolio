export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL;

const resend = new Resend(RESEND_API_KEY);

// Fixed-window rate limit: max REQUESTS_PER_WINDOW submissions per IP per WINDOW_MS.
// In-memory is safe here because the app runs as a single standalone Node process
// (see astro.config.mjs), not a multi-instance/serverless deployment.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitHits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'yopmail.com',
  'throwawaymail.com',
  'trashmail.com',
  'fakeinbox.com',
  'getnada.com',
  'sharklasers.com',
  'dispostable.com',
  'maildrop.cc',
]);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error(
      'Contact API misconfigured: RESEND_API_KEY and CONTACT_TO_EMAIL must be set.',
    );
    return respond({ error: 'Contact form is temporarily unavailable.' }, 503);
  }

  if (isRateLimited(clientAddress)) {
    return respond({ error: 'Too many requests. Try again later.' }, 429);
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return respond({ error: 'Invalid request' }, 400);
  }

  const { name, email, message, _honeypot } = body;

  // Honeypot: bots fill hidden fields, humans never do
  if (_honeypot) return respond({ ok: true }, 200);

  const nm = (name ?? '').trim();
  const em = (email ?? '').trim();
  const mg = (message ?? '').trim();

  if (!nm) return respond({ error: 'Name required.' }, 422);
  if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
    return respond({ error: 'Valid email required.' }, 422);
  if (DISPOSABLE_EMAIL_DOMAINS.has(em.split('@')[1]?.toLowerCase()))
    return respond({ error: 'Please use a permanent email address.' }, 422);
  if (!mg || mg.length < 5)
    return respond({ error: 'Message too short.' }, 422);
  if (mg.length > 2000) return respond({ error: 'Message too long.' }, 422);

  const { error } = await resend.emails.send({
    from: 'Toufic Hanna — Portfolio <contact@toufichanna.dev>',
    to: CONTACT_TO_EMAIL,
    replyTo: em,
    subject: `Portfolio Contact from ${nm}`,
    text: `From: ${nm} <${em}>\n\n${mg}`,
  });

  if (error) {
    console.error('Resend error:', error);
    return respond({ error: 'Failed to send. Try again.' }, 500);
  }

  return respond({ ok: true }, 200);
};

function respond(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
