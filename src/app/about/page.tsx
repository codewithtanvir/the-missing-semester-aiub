import { Navigation } from "@/components/navigation";
import { BookOpen, Target, Users, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us - Missing Semester",
  description: "Learn about Missing Semester's mission to provide quality educational resources to AIUB students.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Ultra Minimal */}
      <section className="py-32 md:py-40">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight text-neutral-900 leading-none tracking-tight">
              About Us
            </h1>
            <p className="text-2xl md:text-3xl text-neutral-500 font-light leading-relaxed">
              Empowering students with accessible,
              <br className="hidden sm:block" />
              organized course materials
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-neutral-900 flex items-center justify-center">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-5xl md:text-6xl font-extralight text-neutral-900">Our Mission</h2>
              <p className="text-xl text-neutral-600 leading-relaxed font-light max-w-3xl mx-auto">
                Missing Semester was created to solve a common problem: scattered course materials, 
                difficult-to-find lecture notes, and lack of centralized resources. We bring everything 
                together in one accessible location.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="text-center space-y-6 p-8 rounded-3xl hover:bg-white transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">Comprehensive</h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  All course materials in one place
                </p>
              </div>

              <div className="text-center space-y-6 p-8 rounded-3xl hover:bg-white transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">Community-Driven</h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Built by students, for students
                </p>
              </div>

              <div className="text-center space-y-6 p-8 rounded-3xl hover:bg-white transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">Always Free</h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  No hidden costs, ever
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
              Ready to start
              <br />
              <span className="font-light text-white/80">your journey?</span>
            </h2>
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
              Join thousands of AIUB students accessing quality course materials
            </p>
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
