import type { Metadata } from "next";
import BackLink from "../_components/BackLink";
import { versionMetadata } from "../_data/seo";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  ...versionMetadata("classic", {
    description: "Privacy policy for marczelloo.dev and how your data is handled.",
    path: "/privacy",
  }),
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-bg-900 text-text-base px-4 py-16 sm:px-6 sm:py-24">
      <article className="mx-auto max-w-2xl">
        {/* Back link */}
        <BackLink
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider
                     text-text-mute transition-colors hover:text-primary-300 mb-10"
          icon={<ArrowLeft size={15} weight="bold" aria-hidden="true" />}
        />

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-base mb-3">Privacy Policy</h1>
        <p className="text-sm text-text-mute mb-12">Last updated: February 8, 2026</p>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-text-soft">
          <section>
            <h2 className="text-lg font-semibold text-text-base mb-3">Overview</h2>
            <p>
              This website (<strong className="text-text-base">marczelloo.dev</strong>) is a personal portfolio operated
              by Marcel Moskwa. Your privacy is important. This site is designed to collect as little data as possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-base mb-3">No Cookies or Tracking</h2>
            <p>
              This site does <strong className="text-text-base">not</strong> use cookies, analytics scripts, tracking
              pixels, or any third-party tracking services. No fingerprinting or behavioral profiling takes place.
            </p>
            <p className="mt-3">
              The only client-side storage used is{" "}
              <code className="text-primary-300 text-xs px-1 py-0.5 rounded bg-surface-800">localStorage</code> to
              remember whether you&apos;ve dismissed the privacy information banner. This is a simple key-value flag and
              contains no personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-base mb-3">Contact Form Data</h2>
            <p>When you submit the contact form, the following information is collected:</p>
            <ul className="mt-3 ml-4 list-disc space-y-1 text-text-soft marker:text-primary-700">
              <li>
                <strong className="text-text-base">Name</strong> - to address you properly
              </li>
              <li>
                <strong className="text-text-base">Email address</strong> - to reply to your message
              </li>
              <li>
                <strong className="text-text-base">Message content</strong> - the text you send
              </li>
            </ul>
            <p className="mt-3">This data is:</p>
            <ul className="mt-2 ml-4 list-disc space-y-1 text-text-soft marker:text-primary-700">
              <li>
                Sent to me via email through <strong className="text-text-base">Resend</strong> (a transactional email
                service)
              </li>
              <li>
                Forwarded as a notification to a private <strong className="text-text-base">Discord</strong> channel via
                webhook
              </li>
              <li>
                <strong className="text-text-base">Not stored</strong> in any database and not shared with third parties
                beyond the services above
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-base mb-3">Third-Party Services</h2>
            <ul className="ml-4 list-disc space-y-2 text-text-soft marker:text-primary-700">
              <li>
                <strong className="text-text-base">Resend</strong> - handles transactional email delivery.{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 underline underline-offset-2 hover:text-primary-400 transition-colors"
                >
                  Their privacy policy
                </a>
              </li>
              <li>
                <strong className="text-text-base">Discord</strong> - receives message notifications via webhook.{" "}
                <a
                  href="https://discord.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 underline underline-offset-2 hover:text-primary-400 transition-colors"
                >
                  Their privacy policy
                </a>
              </li>
              <li>
                <strong className="text-text-base">Hosting provider</strong> - may collect standard server logs (IP
                address, user agent, timestamps) as part of normal infrastructure operation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-base mb-3">Your Rights</h2>
            <p>
              Under GDPR and similar regulations, you have the right to request access to, correction of, or deletion of
              any personal data I may have received through the contact form. To exercise these rights, email me at{" "}
              <a
                href="mailto:moskwamarcel@gmail.com"
                className="text-primary-300 underline underline-offset-2 hover:text-primary-400 transition-colors"
              >
                moskwamarcel@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-base mb-3">Changes</h2>
            <p>
              This policy may be updated occasionally. Any changes will be reflected on this page with an updated date.
            </p>
          </section>
        </div>

        {/* Divider */}
        <div className="mt-16 h-px bg-border-subtle" />
        <p className="mt-6 text-xs text-text-mute/50 text-center">
          &copy; {new Date().getFullYear()} Marczelloo - marczelloo.dev
        </p>
      </article>
    </main>
  );
}
