import { Navigation } from "@/components/navigation";
import { BookOpen, Download, Search, User, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Help Center - Missing Semester",
  description: "Find answers to frequently asked questions about using Missing Semester platform.",
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Ultra Minimal */}
      <section className="py-32 md:py-40">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-neutral-900 flex items-center justify-center">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight text-neutral-900 leading-none tracking-tight">
              Help
            </h1>
            <p className="text-2xl md:text-3xl text-neutral-500 font-light">
              Find answers to common questions
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-light text-neutral-900">How do I create an account?</h3>
                    <p className="text-neutral-600 leading-relaxed font-light">
                      Click on "Get Started" on the homepage and sign in with your Google account. 
                      It's quick, secure, and requires no email verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-light text-neutral-900">How do I find course materials?</h3>
                    <p className="text-neutral-600 leading-relaxed font-light">
                      Navigate to the "Courses" page, search for your course by code or name, 
                      and click on the course to view all available materials. You can also use 
                      the search bar to find specific resources.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-light text-neutral-900">Can I download materials for offline use?</h3>
                    <p className="text-neutral-600 leading-relaxed font-light">
                      Yes! All materials can be downloaded for offline access. Simply click on any 
                      resource and use the download button. Files are available in various formats 
                      including PDF, PPTX, and DOCX.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-light text-neutral-900">What types of materials are available?</h3>
                    <p className="text-neutral-600 leading-relaxed font-light">
                      We offer lecture notes, slide presentations, past papers, assignments, 
                      lab manuals, and study guides for all AIUB computer science courses.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-light text-neutral-900">Is my data secure?</h3>
                    <p className="text-neutral-600 leading-relaxed font-light">
                      Absolutely! We use industry-standard security measures and Google OAuth 
                      for authentication. We never store your passwords, and your personal 
                      information is encrypted and protected.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-light text-neutral-900">I can't find my course. What should I do?</h3>
                    <p className="text-neutral-600 leading-relaxed font-light">
                      If your course isn't listed, please <Link href="/contact" className="text-neutral-900 hover:text-neutral-600 font-normal underline underline-offset-4">contact us</Link> with 
                      the course code and name. We're constantly adding new courses and materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-32 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-tight">
              Still need
              <br />
              <span className="font-light text-white/80">help?</span>
            </h2>
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
              Can't find what you're looking for? We're here to help
            </p>
            <Link href="/contact">
              <button className="min-w-[200px] px-8 py-4 bg-white text-neutral-900 rounded-full hover:bg-neutral-100 transition-all duration-300 font-medium text-lg shadow-2xl hover:shadow-white/20">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
