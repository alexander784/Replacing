'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f4f0] text-[#1a1a2e] font-serif">
      <section className="bg-[#1a1a2e] px-10 pt-28 pb-24 text-center relative overflow-hidden">
        <div className="w-12 h-[3px] bg-[#e8c97e] mx-auto mb-8" />

        <p className="text-[#e8c97e] text-xs tracking-[0.22em] uppercase mb-5 font-serif">
          Official Student Services
        </p>

        <h1 className="text-[#f5f4f0] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[1.2] max-w-2xl mx-auto mb-6">
          Student ID Replacement
          <br />
          <em className="text-[#e8c97e] italic">Made Simple.</em>
        </h1>

        <p className="text-[#b0b8cc] text-[1.05rem] leading-[1.75] max-w-lg mx-auto mb-11 font-serif">
          Submit your replacement request through the official university portal —
          verified, secure, and processed by authorised staff.
        </p>

        <Link
          href="/auth/login"
          className="inline-block bg-[#e8c97e] text-[#1a1a2e] px-10 py-[0.85rem] font-serif font-bold text-[0.9rem] tracking-[0.1em] no-underline uppercase"
        >
          Request Replacement
        </Link>
      </section>

      <section className="py-24 px-10 bg-[#f5f4f0]">
        <div className="max-w-[960px] mx-auto">
          <p className="text-center text-[#8a7a5a] text-[0.7rem] tracking-[0.22em] uppercase mb-3">
            Process
          </p>
          <h2 className="text-center text-[1.9rem] font-normal mb-14 text-[#1a1a2e]">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-[#d4cfc3]">
            {[
              {
                step: '01',
                title: 'Submit Your Details',
                body: 'Log in and complete the replacement request form with your student information.',
              },
              {
                step: '02',
                title: 'Admin Verification',
                body: 'University administrators review and validate your submission for accuracy.',
              },
              {
                step: '03',
                title: 'Receive Approval',
                body: 'Once approved, you will be notified and guided through the collection process.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-[#f5f4f0] p-11 px-8">
                <span className="block text-[#e8c97e] text-[2rem] font-bold font-serif mb-4 leading-none">
                  {step}
                </span>
                <h3 className="text-base font-bold mb-[0.65rem] text-[#1a1a2e] tracking-[0.02em]">
                  {title}
                </h3>
                <p className="text-[#5a5a72] text-[0.9rem] leading-[1.7] m-0 font-serif">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#252540] py-20 px-10 text-center">
        <div className="w-8 h-[2px] bg-[#e8c97e] mx-auto mb-8" />
        <h2 className="text-[#f5f4f0] text-[1.65rem] font-normal mb-5">
          Secure &amp; Officially Administered
        </h2>
        <p className="text-[#9090a8] max-w-[560px] mx-auto leading-[1.8] text-[0.95rem] font-serif">
          Every request is handled exclusively by authorised university staff.
          Your personal data is protected and processed solely for the purpose
          of identity verification, in compliance with university data policy.
        </p>
      </section>

      <section className="py-24 px-10 text-center bg-[#f5f4f0]">
        <h2 className="text-[1.9rem] font-normal mb-3 text-[#1a1a2e]">
          Ready to Get Started?
        </h2>
        <p className="text-[#5a5a72] mb-9 font-serif text-[0.95rem]">
          Create an account or sign in to begin your replacement request.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth/register/"
            className="inline-block bg-[#1a1a2e] text-[#f5f4f0] px-9 py-[0.85rem] font-serif font-bold text-[0.85rem] tracking-[0.1em] no-underline uppercase"
          >
            Create Account
          </Link>
          <Link
            href="/auth/login"
            className="inline-block bg-transparent text-[#1a1a2e] px-9 py-[0.85rem] font-serif font-bold text-[0.85rem] tracking-[0.1em] no-underline uppercase border-[1.5px] border-[#1a1a2e]"
          >
            Sign In
          </Link>
        </div>
      </section>

      <footer className="bg-[#1a1a2e] py-7 px-10 text-center">
        <p className="text-[#5a6080] text-[0.78rem] tracking-[0.06em] m-0 font-serif">
          © {new Date().getFullYear()} University ID Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}