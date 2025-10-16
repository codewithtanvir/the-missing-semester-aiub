'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, User, LogOut, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled 
            ? 'py-2 sm:py-3' 
            : 'py-4 sm:py-6'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div 
            className={`relative transition-all duration-700 ease-out ${
              isScrolled 
                ? 'bg-white/90 backdrop-blur-2xl shadow-lg shadow-black/5 rounded-2xl' 
                : 'bg-white/60 backdrop-blur-md rounded-2xl'
            }`}
          >
            <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center gap-3 group relative z-10"
              >
                <div className="text-lg sm:text-2xl lg:text-3xl font-extralight tracking-tighter text-neutral-900 transition-all duration-500 group-hover:tracking-normal">
                  Missing Semester
                </div>
              </Link>

              {/* Center Navigation - Desktop */}
              <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link key={link.href} href={link.href}>
                      <div
                        className={`relative px-4 py-2 text-sm font-light tracking-wide transition-all duration-500 ${
                          active 
                            ? 'text-neutral-900' 
                            : 'text-neutral-400 hover:text-neutral-700'
                        }`}
                      >
                        {link.label}
                        {active && (
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent animate-in fade-in slide-in-from-bottom-1 duration-500" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Right Side - User Menu */}
              <div className="flex items-center gap-2 sm:gap-4">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1 sm:gap-2 group"
                    >
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white text-xs sm:text-sm font-light transition-all duration-500 group-hover:shadow-lg group-hover:shadow-neutral-900/20">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-neutral-400 transition-transform duration-300 hidden sm:block ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-xl shadow-black/10 border border-neutral-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-3 border-b border-neutral-50">
                            <p className="text-sm font-light text-neutral-900 truncate">{user.email}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">Student</p>
                          </div>
                          <div className="p-1.5">
                            <Link href="/profile">
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-light rounded-lg hover:bg-neutral-50 transition-colors text-neutral-700">
                                <User className="h-4 w-4" />
                                Profile
                              </button>
                            </Link>
                            <button 
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-light rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <button className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-neutral-900 hover:text-neutral-600 transition-colors">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-neutral-100/60 px-4 py-3 flex gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link key={link.href} href={link.href} className="flex-1">
                    <div
                      className={`text-center py-2 text-xs sm:text-sm font-light transition-all duration-300 ${
                        active 
                          ? 'text-neutral-900 border-b-2 border-neutral-900' 
                          : 'text-neutral-400'
                      }`}
                    >
                      {link.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-32 sm:h-30" />
    </>
  );
}
