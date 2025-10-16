'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, FileText, Download, Sparkles, Zap, Shield, Play, Pause } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Ultra Minimal */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] overflow-hidden flex items-center">
        {/* Slideshow Background */}
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
                quality={95}
              />
            </div>
          ))}
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-12 z-10 min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center">
          {/* Slideshow Controls */}
          <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex gap-2 sm:gap-3">
            <button
              onClick={togglePause}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all duration-300"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="h-3 w-3 sm:h-4 sm:w-4" /> : <Pause className="h-3 w-3 sm:h-4 sm:w-4" />}
            </button>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 pb-12 sm:pb-16 px-4">
            {/* Eyebrow text */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white">AIUB Course Resources Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white leading-none tracking-tight">
              Missing
              <br />
              <span className="font-extralight text-neutral-200">Semester</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed px-4">
              Everything you need to excel,
              <br className="hidden sm:block" />
              <span className="text-white/70">all in one place</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg bg-white hover:bg-neutral-100 text-neutral-900 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 font-medium"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/courses" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg bg-transparent hover:bg-white/10 text-white border-2 border-white/40 hover:border-white rounded-full backdrop-blur-md transition-all duration-300 font-medium"
                    >
                      Explore Courses
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/courses" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg bg-white hover:bg-neutral-100 text-neutral-900 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 font-medium"
                    >
                      My Courses
                    </Button>
                  </Link>
                  <Link href="/admin/dashboard" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg bg-transparent hover:bg-white/10 text-white border-2 border-white/40 hover:border-white rounded-full backdrop-blur-md transition-all duration-300 font-medium"
                    >
                      Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Slideshow Indicators */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
            {BANNER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  index === currentBanner 
                    ? 'bg-white w-8 sm:w-12' 
                    : 'bg-white/40 hover:bg-white/60 w-1 sm:w-1.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Minimal */}
      <section className="py-16 sm:py-20 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-neutral-900">{courseStats.files}</div>
              <div className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-widest">Resources</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-neutral-900">{courseStats.courses}</div>
              <div className="text-xs sm:text-sm font-medium text-neutral-500 uppercase tracking-widest">Courses</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-neutral-900">1K+</div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Students</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-6xl md:text-7xl font-extralight text-neutral-900">24/7</div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Ultra Minimal */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-neutral-900 mb-6 leading-tight">
              Built for
              <br />
              <span className="font-light">Excellence</span>
            </h2>
            <p className="text-xl text-neutral-500 font-light">
              Everything designed to help you succeed
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group text-center space-y-6 p-8 rounded-3xl hover:bg-neutral-50 transition-all duration-500">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-neutral-900">Comprehensive</h3>
              <p className="text-neutral-500 leading-relaxed font-light">
                Access complete lecture notes, slides, and study guides for all courses
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center space-y-6 p-8 rounded-3xl hover:bg-neutral-50 transition-all duration-500">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-neutral-900">Instant Access</h3>
              <p className="text-neutral-500 leading-relaxed font-light">
                Find and download materials instantly, organized by course code
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center space-y-6 p-8 rounded-3xl hover:bg-neutral-50 transition-all duration-500">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-neutral-900">Always Available</h3>
              <p className="text-neutral-500 leading-relaxed font-light">
                24/7 access to all resources, study anytime, anywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Minimal */}
      <section className="py-32 bg-neutral-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-neutral-900 mb-6 leading-tight">
              Three Simple
              <br />
              <span className="font-light">Steps</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Step 1 */}
            <div className="group flex items-start gap-8 p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500">
              <div className="text-7xl font-extralight text-neutral-200 group-hover:text-neutral-900 transition-colors duration-500">
                01
              </div>
              <div className="flex-1 pt-3">
                <h3 className="text-2xl font-light text-neutral-900 mb-3">Sign Up</h3>
                <p className="text-neutral-500 leading-relaxed font-light">
                  Quick and secure Google authentication
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group flex items-start gap-8 p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500">
              <div className="text-7xl font-extralight text-neutral-200 group-hover:text-neutral-900 transition-colors duration-500">
                02
              </div>
              <div className="flex-1 pt-3">
                <h3 className="text-2xl font-light text-neutral-900 mb-3">Find Courses</h3>
                <p className="text-neutral-500 leading-relaxed font-light">
                  Browse organized materials by course code
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group flex items-start gap-8 p-8 bg-white rounded-3xl hover:shadow-xl transition-all duration-500">
              <div className="text-7xl font-extralight text-neutral-200 group-hover:text-neutral-900 transition-colors duration-500">
                03
              </div>
              <div className="flex-1 pt-3">
                <h3 className="text-2xl font-light text-neutral-900 mb-3">Start Learning</h3>
                <p className="text-neutral-500 leading-relaxed font-light">
                  Download resources and ace your exams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal */}
      <section className="py-32 bg-neutral-900 text-white relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-tight">
              Ready to start
              <br />
              <span className="font-light text-white/80">your journey?</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login">
                    <Button 
                      size="lg" 
                      className="min-w-[200px] h-14 text-lg bg-white hover:bg-neutral-100 text-neutral-900 rounded-full shadow-2xl transition-all duration-300 font-medium"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="min-w-[200px] h-14 text-lg bg-transparent hover:bg-white/10 text-white border-2 border-white/40 hover:border-white rounded-full transition-all duration-300 font-medium"
                    >
                      Explore Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/courses">
                  <Button 
                    size="lg" 
                    className="min-w-[200px] h-14 text-lg bg-white hover:bg-neutral-100 text-neutral-900 rounded-full shadow-2xl transition-all duration-300 font-medium"
                  >
                    Go to Courses
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-neutral-900 p-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-neutral-900">Missing Semester</div>
                  <div className="text-xs text-neutral-500">AIUB Resources</div>
                </div>
              </div>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                Comprehensive course materials for AIUB computer science students
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-medium text-neutral-900 mb-4 text-sm uppercase tracking-widest">Navigate</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/courses" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                    Contact
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link href="/admin/dashboard" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-medium text-neutral-900 mb-4 text-sm uppercase tracking-widest">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                    Help
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-medium text-neutral-900 mb-4 text-sm uppercase tracking-widest">Community</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/contributors" className="text-neutral-500 hover:text-neutral-900 transition-colors font-light">
                    Contributors
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/codewithtanvir/the-missing-semester-aiub" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-900 transition-colors font-light"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-neutral-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
              <p className="font-light">
                © {new Date().getFullYear()} Missing Semester
              </p>
              <p className="text-xs font-light">
                Made for AIUB Students
              </p>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
