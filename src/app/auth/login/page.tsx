'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Check for error in URL
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // If already logged in, redirect to home
      if (user) {
        router.push('/');
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Session exists, verify and redirect
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const redirectTo = searchParams.get('redirectTo') || '/courses';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Brand */}
        <div className="text-center mb-12 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-extralight text-neutral-900 tracking-tight">
              Welcome
            </h1>
            <p className="text-neutral-500 font-light">
              Sign in to access course resources
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-red-900">Authentication Error</p>
                  <p className="text-sm text-red-700 font-light">{error}</p>
                  <p className="text-xs text-red-600 font-light">
                    Make sure Google OAuth is properly configured.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group w-full bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-200 hover:border-neutral-300 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-4">
              <svg
                className="h-6 w-6 flex-shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-light text-lg">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </div>
          </button>

          <p className="text-xs text-center text-neutral-400 font-light leading-relaxed">
            By signing in, you agree to access course resources
            <br />
            for educational purposes only
          </p>

          <div className="pt-6 border-t border-neutral-100 text-center">
            <Link 
              href="/" 
              className="text-sm text-neutral-500 hover:text-neutral-900 font-light transition-colors duration-200"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
