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
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Find answers to common questions
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">How do I create an account?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Click on "Get Started" on the homepage and sign in with your Google account. 
                      It's quick, secure, and requires no email verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">How do I find course materials?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Navigate to the "Courses" page, search for your course by code or name, 
                      and click on the course to view all available materials. You can also use 
                      the search bar to find specific resources.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Can I download materials for offline use?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Yes! All materials can be downloaded for offline access. Simply click on any 
                      resource and use the download button. Files are available in various formats 
                      including PDF, PPTX, and DOCX.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">What types of materials are available?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We offer lecture notes, slide presentations, past papers, assignments, 
                      lab manuals, and study guides for all AIUB computer science courses.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-rose-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Is my data secure?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Absolutely! We use industry-standard security measures and Google OAuth 
                      for authentication. We never store your passwords, and your personal 
                      information is encrypted and protected.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-indigo-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">I can't find my course. What should I do?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      If your course isn't listed, please <Link href="/contact" className="text-blue-500 hover:text-blue-600 font-medium">contact us</Link> with 
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 py-4">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
