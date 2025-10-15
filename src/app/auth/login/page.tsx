'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function StudentAuthPage() {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email openid profile',
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging in:', error);
      alert(`Failed to login: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto rounded-full bg-blue-100 p-3 w-fit mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Student Login</CardTitle>
          <CardDescription>
            Sign in with your Microsoft account to access course resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-semibold">Authentication Error</p>
                <p className="mt-1">{error}</p>
                <p className="mt-2 text-xs text-red-600">
                  Make sure Azure AD is properly configured in Supabase.
                </p>
              </div>
            </div>
          )}
          
          <Button
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className="w-full bg-[#0078D4] hover:bg-[#106EBE] text-white"
            size="lg"
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h10.931v10.931H0V0z" fill="#F25022" />
              <path d="M12.069 0H23v10.931H12.069V0z" fill="#7FBA00" />
              <path d="M0 12.069h10.931V23H0V12.069z" fill="#00A4EF" />
              <path d="M12.069 12.069H23V23H12.069V12.069z" fill="#FFB900" />
            </svg>
            {loading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Continue as Guest
            </Button>
          </Link>

          <p className="text-xs text-center text-gray-500 mt-4">
            Admin? <Link href="/admin" className="text-blue-600 hover:underline">Click here</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
