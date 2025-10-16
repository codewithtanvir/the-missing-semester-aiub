'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-lg">Back</span>
        </Link>

        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Effective Date: October 15, 2025 | Last Updated: October 15, 2025
          </p>
        </header>

        <article className="prose prose-lg max-w-none space-y-8">
            <h2>Information We Collect</h2>
            <p>When you use AIUB Files (aiubfiles.app), we collect:</p>

            <h3>Information from Google</h3>
            <ul>
              <li>Email address</li>
              <li>Full name</li>
              <li>Profile picture (if set)</li>
              <li>Google User ID</li>
            </ul>

            <h3>Usage Information</h3>
            <ul>
              <li>Pages visited</li>
              <li>Files downloaded</li>
              <li>Login times</li>
              <li>Device type</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Authenticate your identity</li>
              <li>Provide access to course materials</li>
              <li>Track course usage (for instructors)</li>
              <li>Improve the platform</li>
            </ul>

            <h2>Information Sharing</h2>
            <h3>We DO NOT:</h3>
            <ul>
              <li>Sell your information</li>
              <li>Share with third parties (except Google for authentication)</li>
              <li>Use for marketing purposes</li>
              <li>Share with other students</li>
            </ul>

            <h3>We DO share with:</h3>
            <ul>
              <li>Google (for authentication only)</li>
              <li>Supabase (our database provider, for secure data storage)</li>
            </ul>

            <h2>Data Security</h2>
            <ul>
              <li>All connections use HTTPS encryption</li>
              <li>Data stored in secure Supabase database</li>
              <li>Regular security updates</li>
              <li>Access controls for admin functions</li>
              <li>No passwords stored (Google handles authentication)</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You can:</p>
            <ul>
              <li>Access your information</li>
              <li>Delete your account</li>
              <li>Opt out of usage tracking</li>
              <li>Request data export</li>
            </ul>

            <h2>Cookies</h2>
            <p>We use cookies for:</p>
            <ul>
              <li>Session management (keeping you logged in)</li>
              <li>Authentication state</li>
              <li>PWA installation tracking</li>
            </ul>

            <h2>Children's Privacy</h2>
            <p>
              This service is for university students (18+). If you are under 18, 
              please do not use this service without parental consent.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify 
              users of any changes by updating the "Last Updated" date at the top 
              of this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:support@aiubfiles.app">support@aiubfiles.app</a>
            </p>

          <div className="mt-12 rounded-2xl bg-muted p-6">
            <p className="text-sm">
              <strong>Data Location:</strong> Your data is stored securely in 
              Supabase's infrastructure. We comply with data protection regulations 
              and ensure your information is handled responsibly.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
