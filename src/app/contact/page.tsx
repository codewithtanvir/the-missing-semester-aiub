import { Navigation } from "@/components/navigation";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Us - Missing Semester",
  description: "Get in touch with the Missing Semester team for support, feedback, or collaboration.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Ultra Minimal */}
      <section className="py-32 md:py-40">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight text-neutral-900 leading-none tracking-tight">
              Contact
            </h1>
            <p className="text-2xl md:text-3xl text-neutral-500 font-light">
              We're here to help
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Discord Card */}
            <div className="text-center p-16 rounded-3xl bg-white border border-neutral-100 shadow-xl">
              <div className="space-y-8">
                <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-light text-neutral-900">Join Our Community</h3>
                  <p className="text-xl text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
                    Connect with fellow students, get instant help, and stay updated
                  </p>
                </div>
                <a 
                  href="https://discord.gg/uTwRgRs5zp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <button className="min-w-[250px] px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl">
                    <MessageCircle className="h-5 w-5 inline mr-2" />
                    Join Discord Server
                  </button>
                </a>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4 p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300">
                <div className="text-5xl">⚡</div>
                <h4 className="text-xl font-light text-neutral-900">Instant Responses</h4>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Get help in real-time from community members
                </p>
              </div>
              <div className="text-center space-y-4 p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300">
                <div className="text-5xl">👥</div>
                <h4 className="text-xl font-light text-neutral-900">Active Community</h4>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Connect with students and share knowledge
                </p>
              </div>
              <div className="text-center space-y-4 p-8 rounded-3xl bg-white hover:shadow-lg transition-all duration-300">
                <div className="text-5xl">📚</div>
                <h4 className="text-xl font-light text-neutral-900">Resource Sharing</h4>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Access shared notes and study materials
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-tight">
              Looking for
              <br />
              <span className="font-light text-white/80">course materials?</span>
            </h2>
            <Link href="/courses">
              <button className="min-w-[200px] px-8 py-4 bg-white text-neutral-900 rounded-full hover:bg-neutral-100 transition-all duration-300 font-medium text-lg shadow-2xl hover:shadow-white/20">
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
