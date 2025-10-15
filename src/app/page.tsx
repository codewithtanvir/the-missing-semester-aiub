'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
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
  const supabase = createClient();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] overflow-hidden">
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
        <div className="relative container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-24 lg:py-32 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex flex-col justify-center">
          {/* Slideshow Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
            {BANNER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  index === currentBanner 
                    ? 'bg-white w-6 sm:w-8' 
                    : 'bg-white/50 hover:bg-white/75 w-1.5 sm:w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 pb-10 sm:pb-14 md:pb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg px-2 sm:px-4">
            <span className="text-lime-400">Missing Semester</span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">of AIUB</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md px-2 sm:px-4">
            Access all computer science course materials, lecture notes, and resources all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center px-2 sm:px-4">
            <Link href={isAuthenticated ? "/courses" : "/auth/login"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white hover:bg-gray-50 text-gray-900 border-2 border-white shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
            <Link href="/courses" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-white/10 hover:bg-white/20 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
                Browse Courses
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-start">
              <div className="rounded-lg bg-blue-500 p-1.5 sm:p-2 shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="text-center md:text-left">
                <div className="font-bold text-neutral-800 text-sm sm:text-base leading-tight">Missing Semester</div>
                <div className="text-xs text-gray-500 mt-0.5">Essential Learning Resources</div>
              </div>
            </div>
            
            {/* Links and Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500 w-full md:w-auto">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-wrap justify-center">
                <Link href="/courses" className="hover:text-blue-500 transition-colors whitespace-nowrap">
                  Browse Courses
                </Link>
                <Link href="/privacy" className="hover:text-blue-500 transition-colors whitespace-nowrap">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-blue-500 transition-colors whitespace-nowrap">
                  Terms
                </Link>
              </div>
              <span className="text-center whitespace-nowrap">© {new Date().getFullYear()} Missing Semester</span>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
