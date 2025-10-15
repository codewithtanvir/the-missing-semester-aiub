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
      <section className="relative w-full min-h-[600px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-neutral-900/20 to-neutral-50" />
        </div>

        {/* Content Container */}
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          {/* Slideshow Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {BANNER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            <span className="text-lime-400">Missing Semester</span>
            <br />of AIUB
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Access all computer science course materials, lecture notes, and resources all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={isAuthenticated ? "/courses" : "/auth/login"}>
              <Button size="lg" className="text-lg px-8 py-6 bg-white hover:bg-gray-50 text-gray-900 border-2 border-white shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-neutral-800">Missing Semester</div>
                <div className="text-xs text-gray-500">Essential Learning Resources</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/courses" className="hover:text-blue-500 transition-colors">
                Browse Courses
              </Link>
              <span>© {new Date().getFullYear()} Missing Semester</span>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
