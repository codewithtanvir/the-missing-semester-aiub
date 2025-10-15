'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Library, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      setIsAuthenticated(!!user && !error);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <nav className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-2.5 group min-w-0"
            >
              <div className="rounded-lg bg-blue-500 p-1.5 sm:p-2 group-hover:bg-blue-600 transition-colors shadow-md flex-shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="font-bold text-sm sm:text-base lg:text-lg text-blue-500 truncate">
                Missing Semester
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link key={link.href} href={link.href}>
                    <button
                      className={`px-3 lg:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        active 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {link.label}
                    </button>
                  </Link>
                );
              })}
              
              {/* Profile Button - Only show when authenticated */}
              {isAuthenticated && (
                <Link href="/profile">
                  <button
                    className={`px-3 lg:px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      pathname === '/profile'
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Profile</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-800" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-800" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t border-neutral-200 bg-white overflow-hidden transition-all duration-200 ${
            mobileMenuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <button
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-all ${
                      active
                        ? 'bg-blue-500 text-white'
                        : 'text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    {link.label}
                  </button>
                </Link>
              );
            })}
            
            {/* Profile Link - Mobile - Only show when authenticated */}
            {isAuthenticated && (
              <Link href="/profile">
                <button
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    pathname === '/profile'
                      ? 'bg-blue-500 text-white'
                      : 'text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-14 sm:h-16" />
    </>
  );
}
