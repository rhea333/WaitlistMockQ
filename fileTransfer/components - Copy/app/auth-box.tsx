'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Linkedin } from 'lucide-react';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/onboarding-types';

type AuthMode = 'login' | 'signup';

const inputClassName =
  'h-12 w-full appearance-none rounded-xl border border-white/28 bg-transparent [background:transparent] px-4 text-sm text-white transition-colors outline-none placeholder:text-white/38 focus:border-white/50';

export default function AuthBox({ defaultMode = 'login' }: { defaultMode?: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeFromQuery = searchParams.get('mode') === 'signup' ? 'signup' : null;
  const [authMode, setAuthMode] = useState<AuthMode>(modeFromQuery ?? defaultMode);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeError, setResumeError] = useState('');

  const handleResumeFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    setResumeError('');

    if (!['pdf', 'docx', 'txt'].includes(ext ?? '')) {
      setResumeError('PDF, DOCX, or TXT');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResumeError('Max 5 MB');
      return;
    }

    setResumeFileName(file.name);
  }, []);

  useEffect(() => {
    setAuthMode(modeFromQuery ?? defaultMode);
  }, [defaultMode, modeFromQuery]);

  const handleContinue = () => {
    router.push(authMode === 'signup' ? '/onboarding' : '/practice');
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05070b] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(82,82,91,0.3)_1px,transparent_1px)] [background-size:16px_16px]" />
      <section className="relative z-10 w-full max-w-[430px] rounded-[32px] bg-transparent p-6 shadow-[0_24px_90px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="mb-7 flex justify-center">
          <div className="relative grid w-full max-w-[250px] grid-cols-2 rounded-full border border-white/15 bg-white/[0.06] p-1">
            <div
              className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white transition-transform duration-200 ease-out"
              style={{
                transform: authMode === 'login' ? 'translateX(0)' : 'translateX(calc(100% + 4px))',
              }}
            />
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                authMode === 'login' ? 'text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                authMode === 'signup' ? 'text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {authMode === 'signup' ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {authMode === 'signup'
              ? 'Set up MockQ for your next interview.'
              : 'Continue your MockQ practice.'}
          </p>
        </div>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleContinue();
          }}
        >
          {authMode === 'signup' ? (
            <input
              type="text"
              placeholder="Username"
              aria-label="Username"
              className={inputClassName}
              required
            />
          ) : null}
          <input
            type="text"
            placeholder={authMode === 'signup' ? 'Email' : 'Username or email'}
            aria-label={authMode === 'signup' ? 'Email' : 'Username or email'}
            className={inputClassName}
            required
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            className={inputClassName}
            required
          />
          {authMode === 'signup' ? (
            <>
              <input
                type="password"
                placeholder="Re-type password"
                aria-label="Re-type password"
                className={inputClassName}
                required
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const file = event.dataTransfer.files?.[0];
                  if (file) handleResumeFile(file);
                }}
                className="flex min-h-20 w-full appearance-none items-center justify-center rounded-xl border border-dashed border-white/30 bg-transparent px-4 py-3 text-center text-sm font-medium text-white/68 transition-colors [background:transparent] hover:border-white/50"
              >
                {resumeFileName || 'Upload resume: PDF, DOCX, or TXT'}
              </button>
              {resumeError ? <p className="text-sm text-rose-300">{resumeError}</p> : null}
              <input
                ref={resumeInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleResumeFile(file);
                }}
              />
            </>
          ) : null}

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-white text-sm font-bold text-black transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-100"
          >
            {authMode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <div className="my-6 h-px w-full bg-linear-to-r from-transparent via-white/28 to-transparent" />

        <p className="mb-3 text-center text-sm text-white/58">Or continue with</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleContinue}
            className="flex h-12 appearance-none items-center justify-center rounded-xl border border-white/28 bg-transparent transition-colors [background:transparent] hover:border-white/45"
            aria-label="Continue with Google"
          >
            <img src="/googleLogo.png" alt="" className="h-5 w-5 object-contain" />
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex h-12 appearance-none items-center justify-center rounded-xl border border-white/28 bg-transparent transition-colors [background:transparent] hover:border-white/45"
            aria-label="Continue with LinkedIn"
          >
            <Linkedin aria-hidden="true" className="h-5 w-5 text-[#0a66c2]" strokeWidth={2.4} />
          </button>
        </div>
      </section>
    </main>
  );
}
