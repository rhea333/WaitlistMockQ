'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, Loader2, ReceiptText, ShieldCheck, Timer } from 'lucide-react';

const MINUTES_STEP = 10;
const MAX_MINUTES = 100;
const CENTS_PER_STEP = 5;

const minuteOptions = Array.from(
  { length: MAX_MINUTES / MINUTES_STEP },
  (_, index) => (index + 1) * MINUTES_STEP
);

function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function BillingPage() {
  const [minutes, setMinutes] = useState(50);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const units = minutes / MINUTES_STEP;
  const amountCents = units * CENTS_PER_STEP;
  const totalAfterPurchase = 140 + minutes;

  const selectedSummary = useMemo(
    () => ({
      minutes,
      amount: formatUsd(amountCents),
      unitPrice: `${formatUsd(CENTS_PER_STEP)} / ${MINUTES_STEP} min`,
    }),
    [amountCents, minutes]
  );

  const handleCheckout = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutes }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to start Stripe checkout.');
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error('Stripe checkout did not return a redirect URL.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to start Stripe checkout.');
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[#1f2328]">
      <div className="mx-auto w-full max-w-[1000px] px-6 py-8 pt-20 md:pt-8 lg:px-10">
        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-3 border-b border-[#d8dee4] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#57606a]">Billing and payments</p>
              <h2 className="text-2xl font-semibold text-[#1f2328]">Add time credits</h2>
            </div>
            <div className="rounded-md border border-[#d0d7de] bg-white px-4 py-2 text-sm">
              <span className="font-semibold text-[#1f2328]">140 min</span>
              <span className="ml-2 text-[#57606a]">available</span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,680px)_320px]">
            <section className="rounded-md border border-[#d0d7de] bg-white p-5">
              <div className="mb-5 flex items-start gap-3">
                <CreditCard className="mt-1 h-5 w-5 text-[#0969da]" />
                <div>
                  <h3 className="text-lg font-semibold">Stripe payment</h3>
                  <p className="text-sm leading-5 text-[#57606a]">
                    Add interview time in 10 minute increments, up to 100 minutes per purchase.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label
                      htmlFor="credit-minutes"
                      className="text-sm font-semibold text-[#1f2328]"
                    >
                      Time credits
                    </label>
                    <span className="rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-3 py-1 text-sm font-semibold text-[#0969da]">
                      {selectedSummary.minutes} minutes
                    </span>
                  </div>
                  <input
                    id="credit-minutes"
                    type="range"
                    min={MINUTES_STEP}
                    max={MAX_MINUTES}
                    step={MINUTES_STEP}
                    value={minutes}
                    onChange={(event) => setMinutes(Number(event.target.value))}
                    className="w-full accent-[#0969da]"
                  />
                  <div className="mt-2 flex justify-between text-xs font-medium text-[#57606a]">
                    <span>10 min</span>
                    <span>100 min</span>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-5">
                  {minuteOptions.map((option) => {
                    const active = option === minutes;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMinutes(option)}
                        className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                          active
                            ? 'border-[#0969da] bg-[#ddf4ff] text-[#0969da]'
                            : 'border-[#d0d7de] bg-[#f6f8fa] text-[#24292f] hover:bg-white'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-md border border-[#d0d7de] bg-[#f6f8fa] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#57606a]">Rate</span>
                    <span className="font-semibold text-[#1f2328]">
                      {selectedSummary.unitPrice}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-[#57606a]">Selected time</span>
                    <span className="font-semibold text-[#1f2328]">
                      {selectedSummary.minutes} minutes
                    </span>
                  </div>
                  <div className="mt-3 border-t border-[#d8dee4] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1f2328]">Total due today</span>
                      <span className="text-2xl font-semibold text-[#1f2328]">
                        {selectedSummary.amount}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={status === 'loading'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#635bff] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5149dc] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {status === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Pay with Stripe
                </button>

                {status === 'error' ? (
                  <p className="rounded-md border border-[#ffd8d3] bg-[#fff1f0] px-3 py-2 text-sm text-[#cf222e]">
                    {message}
                  </p>
                ) : null}
              </div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-md border border-[#d0d7de] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Timer className="h-5 w-5 text-[#0969da]" />
                  <h3 className="font-semibold">Credit balance</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#57606a]">Current balance</span>
                    <span className="font-semibold">140 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57606a]">After purchase</span>
                    <span className="font-semibold">{totalAfterPurchase} min</span>
                  </div>
                </div>
              </section>

              <section className="rounded-md border border-[#d0d7de] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#1f883d]" />
                  <h3 className="font-semibold">Secure checkout</h3>
                </div>
                <p className="text-sm leading-5 text-[#57606a]">
                  Stripe handles card details and payment confirmation. Credits are applied after a
                  successful checkout.
                </p>
              </section>

              <section className="rounded-md border border-[#d0d7de] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ReceiptText className="h-5 w-5 text-[#0969da]" />
                  <h3 className="font-semibold">Recent activity</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-[#57606a]">
                      <CheckCircle2 className="h-4 w-4 text-[#1f883d]" />
                      Starter credits
                    </span>
                    <span className="font-semibold">+140 min</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
