import { NextResponse } from 'next/server';

const MINUTES_STEP = 10;
const MAX_MINUTES = 100;
const CENTS_PER_STEP = 5;

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to enable checkout.' },
      { status: 501 }
    );
  }

  let minutes: number;

  try {
    const body = await request.json();
    minutes = Number(body?.minutes);
  } catch {
    return NextResponse.json({ error: 'Invalid checkout request.' }, { status: 400 });
  }

  const isValidMinutes =
    Number.isInteger(minutes) &&
    minutes >= MINUTES_STEP &&
    minutes <= MAX_MINUTES &&
    minutes % MINUTES_STEP === 0;

  if (!isValidMinutes) {
    return NextResponse.json(
      { error: 'Choose 10 to 100 minutes in 10 minute increments.' },
      { status: 400 }
    );
  }

  const amountCents = (minutes / MINUTES_STEP) * CENTS_PER_STEP;
  const baseUrl = getBaseUrl(request);
  const params = new URLSearchParams({
    mode: 'payment',
    success_url: `${baseUrl}/billing?checkout=success&minutes=${minutes}`,
    cancel_url: `${baseUrl}/billing?checkout=cancelled`,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(amountCents),
    'line_items[0][price_data][product_data][name]': `${minutes} MockQ time credits`,
    'line_items[0][price_data][product_data][description]': `${minutes} interview minutes at $0.05 per 10 minutes`,
    'metadata[minutes]': String(minutes),
    'metadata[kind]': 'time_credits',
  });

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const data = await stripeResponse.json();

  if (!stripeResponse.ok) {
    return NextResponse.json(
      { error: data?.error?.message || 'Stripe checkout could not be created.' },
      { status: stripeResponse.status }
    );
  }

  return NextResponse.json({ url: data.url });
}
