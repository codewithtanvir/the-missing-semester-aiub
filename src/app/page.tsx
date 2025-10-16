'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, FileText, Download, Clock, Users, BookMarked, Star, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { BackToTop } from "@/components/back-to-top";
import { createClient } from "@/lib/supabase/client";

const BANNER_IMAGES = [
  "/images/banners/hero-banner-1.webp",
  "/images/banners/hero-banner-2.webp",
  "/images/banners/hero-banner-3.jpg",
  "/images/banners/hero-banner-4.jpg",
  "/images/banners/hero-banner-5.jpg"
];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [courseStats, setCourseStats] = useState({ courses: 0, files: 0 });
  const supabase = createClient();

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesData, filesData] = await Promise.all([
          supabase.from('courses').select('id', { count: 'exact', head: true }),
          supabase.from('files').select('id', { count: 'exact', head: true })
        ]);
        
        setCourseStats({
          courses: coursesData.count || 0,
          files: filesData.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const nextSlide = () => {
    setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentBanner((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] overflow-hidden flex-1">
        {/* Slideshow Background Images - Full Width */}
        <div className="absolute inset-0 w-full h-full">
          {BANNER_IMAGES.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image 
                src={image}
                alt={`Hero Background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-neutral-900/30 to-neutral-50" />
        </div>

        {/* Content Container */}
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 lg:py-32 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex flex-col justify-center">
          {/* Slideshow Controls */}
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            <button
              onClick={togglePause}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-2 rounded-full transition-all"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>

          {/* Slideshow Indicators */}
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {BANNER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentBanner 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 pb-12 sm:pb-16 md:pb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl px-4 sm:px-6">
            <span className="text-lime-400 bg-black/10 px-2 rounded">Missing Semester</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">of AIUB</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4 sm:px-6 bg-black/10 py-3 rounded-lg backdrop-blur-sm">
            Your comprehensive platform for AIUB computer science course materials, lecture notes, and study resources — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-6">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 border-2 border-white shadow-xl hover:shadow-2xl transition-all font-semibold hover:scale-105">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/courses" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-4 bg-white/20 hover:bg-white/30 text-white border-2 border-white shadow-xl hover:shadow-2xl transition-all backdrop-blur-md font-semibold">
                    Browse Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/courses" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 border-2 border-white shadow-xl hover:shadow-2xl transition-all font-semibold hover:scale-105">
                    Go to My Courses
                  </Button>
                </Link>
                <Link href="/admin/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-4 bg-white/20 hover:bg-white/30 text-white border-2 border-white shadow-xl hover:shadow-2xl transition-all backdrop-blur-md font-semibold">
                    Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Access comprehensive study materials designed specifically for AIUB students
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all group bg-gradient-to-b from-white to-gray-50">
              <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Course Materials</h3>
              <p className="text-gray-600 leading-relaxed">Access lecture notes, slides, and comprehensive study guides for all your courses</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all group bg-gradient-to-b from-white to-gray-50">
              <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <BookMarked className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Organized by Course</h3>
              <p className="text-gray-600 leading-relaxed">Find materials easily organized by course code and semester</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all group bg-gradient-to-b from-white to-gray-50">
              <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Download Anytime</h3>
              <p className="text-gray-600 leading-relaxed">Save resources for offline access and study on the go</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all group bg-gradient-to-b from-white to-gray-50">
              <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 Access</h3>
              <p className="text-gray-600 leading-relaxed">Study anytime, anywhere with round-the-clock access to all resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">{courseStats.files}+</div>
              <div className="text-blue-100 text-sm md:text-base font-medium">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">{courseStats.courses}+</div>
              <div className="text-blue-100 text-sm md:text-base font-medium">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">1K+</div>
              <div className="text-blue-100 text-sm md:text-base font-medium">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">24/7</div>
              <div className="text-blue-100 text-sm md:text-base font-medium">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of AIUB students accessing quality resources
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Sign Up Free</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Create your account using Google authentication. Quick, secure, and hassle-free — no email verification required.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Browse Courses</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Find your courses by code or name. Browse through organized categories and discover all available study materials.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row gap-6 items-start bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Download & Study</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Access lecture notes, slides, and resources. Download materials for offline study and ace your exams!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl md:text-2xl mb-8 md:mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of AIUB students who are already accessing quality course materials and excelling in their studies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login">
                  <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-4 md:py-5 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all font-bold hover:scale-105">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-4 md:py-5 border-2 border-white text-white hover:bg-white/10 shadow-2xl transition-all font-bold">
                    Browse Courses
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-4 md:py-5 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all font-bold hover:scale-105">
                  Go to My Courses
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8">
            {/* Logo and Description */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <div className="rounded-lg bg-blue-500 p-2 shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-neutral-800 text-lg leading-tight">Missing Semester</div>
                  <div className="text-xs text-gray-500">Essential Learning Resources</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto md:mx-0">
                Your comprehensive platform for AIUB computer science course materials and study resources.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/courses" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-blue-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Contact
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-blue-500 transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <p className="text-center md:text-left">
                © {new Date().getFullYear()} Missing Semester. All rights reserved.
              </p>
              <p className="text-center md:text-right text-xs">
                Made with ❤️ for AIUB Students
              </p>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
