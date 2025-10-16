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
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {/* Discord - Main Contact Method */}
            <div className="text-center p-12 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-xl">
              <div className="bg-indigo-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Join Our Discord Community</h3>
              <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
                Connect with fellow students, get instant help, share resources, and stay updated with course materials.
              </p>
              <a 
                href="https://discord.gg/uTwRgRs5zp" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-base px-8 py-6">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Join Discord Server
                </Button>
              </a>
            </div>

            {/* Info Section */}
            <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">💬 Why Discord?</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold mb-1">Instant Responses</h4>
                  <p className="text-sm text-gray-600">Get help in real-time from community members</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">👥</div>
                  <h4 className="font-semibold mb-1">Active Community</h4>
                  <p className="text-sm text-gray-600">Connect with students and share knowledge</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📚</div>
                  <h4 className="font-semibold mb-1">Resource Sharing</h4>
                  <p className="text-sm text-gray-600">Access shared notes and study materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Looking for Course Materials?</h2>
          <Link href="/courses">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 py-4">
              Browse Courses
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
