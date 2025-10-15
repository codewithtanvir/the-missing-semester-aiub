'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-3xl">Terms of Service</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Effective Date: October 15, 2025 | Last Updated: October 15, 2025
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-blue max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using AIUB Files (aiubfiles.app), you accept and agree 
              to be bound by the terms and provisions of this agreement.
            </p>

            <h2>Permitted Use</h2>
            <p>AIUB Files is designed for:</p>
            <ul>
              <li>Educational purposes only</li>
              <li>Accessing course materials provided by your instructors</li>
              <li>Downloading lecture notes, assignments, and learning resources</li>
              <li>Supporting your academic learning and coursework</li>
            </ul>

            <h2>Prohibited Use</h2>
            <p>You may NOT:</p>
            <ul>
              <li>Share your login credentials with others</li>
              <li>Redistribute course materials publicly or commercially</li>
              <li>Use course materials for commercial purposes</li>
              <li>Attempt to hack, breach, or compromise the system</li>
              <li>Upload malicious files or content</li>
              <li>Impersonate other users or administrators</li>
              <li>Scrape or download materials in bulk using automated tools</li>
            </ul>

            <h2>Account Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul>
              <li>Keeping your Google account secure</li>
              <li>All activities that occur under your account</li>
              <li>Using materials strictly for educational purposes</li>
              <li>Not sharing downloaded materials publicly</li>
              <li>Reporting any security issues or bugs to instructors</li>
              <li>Logging out from shared devices</li>
            </ul>

            <h2>Course Content and Copyright</h2>
            <p>All course materials are:</p>
            <ul>
              <li>Owned by the respective instructors and/or AIUB</li>
              <li>Protected by copyright law</li>
              <li>Licensed to you for educational use only</li>
              <li>Not for redistribution, resale, or public sharing</li>
            </ul>

            <h2>Service Availability</h2>
            <p>
              We strive to provide 99.9% uptime, but we cannot guarantee:
            </p>
            <ul>
              <li>Continuous, uninterrupted access to the service</li>
              <li>No technical errors or bugs</li>
              <li>No data loss (always keep local backups)</li>
              <li>Availability during maintenance periods</li>
            </ul>

            <h2>Changes to Service</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Update features and functionality</li>
              <li>Change the design and user interface</li>
              <li>Add, modify, or remove courses and materials</li>
              <li>Modify these terms at any time</li>
              <li>Suspend or terminate the service (with notice)</li>
            </ul>

            <h2>Account Termination</h2>
            <p>We may suspend or terminate your access if you:</p>
            <ul>
              <li>Violate these terms of service</li>
              <li>Misuse the platform or its content</li>
              <li>Share materials inappropriately</li>
              <li>Engage in harmful or illegal activities</li>
              <li>Are no longer affiliated with AIUB (graduated, transferred, etc.)</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>
              AIUB Files is provided "as is" without warranties of any kind, either 
              express or implied. We are not liable for:
            </p>
            <ul>
              <li>Any damages arising from use or inability to use the service</li>
              <li>Loss of data or course materials</li>
              <li>Interruptions in service</li>
              <li>Third-party content or links</li>
            </ul>

            <h2>Privacy</h2>
            <p>
              Your use of AIUB Files is also governed by our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              . Please review it to understand how we collect and use your information.
            </p>

            <h2>Third-Party Services</h2>
            <p>This service uses:</p>
            <ul>
              <li><strong>Google OAuth</strong> - For authentication</li>
              <li><strong>Supabase</strong> - For database and storage</li>
              <li><strong>Vercel</strong> - For hosting</li>
            </ul>
            <p>
              Your use of these services is subject to their respective terms and 
              privacy policies.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The AIUB Files platform, including its design, code, and branding, is 
              the intellectual property of its creators. You may not copy, modify, 
              or distribute the platform itself.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about these Terms of Service, please contact:{" "}
              <a href="mailto:support@aiubfiles.app">support@aiubfiles.app</a>
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws 
              of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, 
              Bangladesh.
            </p>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Last Updated:</strong> October 15, 2025
              </p>
              <p className="text-sm text-blue-900 mb-0">
                By continuing to use AIUB Files, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
