'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const code = searchParams.get('code');

        console.log('Callback params:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          hasCode: !!code,
          hash: window.location.hash,
          search: window.location.search
        });

        // If we have tokens in the URL hash (implicit flow)
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session error:', error);
            setError(error.message);
            setTimeout(() => router.push('/auth/login?error=' + encodeURIComponent(error.message)), 2000);
            return;
          }

          if (data.session) {
            console.log('Session created successfully:', data.session.user.email);
            router.push('/');
            return;
          }
        }

        // Otherwise, let Supabase handle the code exchange
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => router.push('/auth/login?error=' + encodeURIComponent(sessionError.message)), 2000);
          return;
        }

        if (session) {
          console.log('Session found:', session.user.email);
          router.push('/');
        } else {
          console.log('No session found, checking for existing user...');
          
          // Check if user is already logged in
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (user) {
            console.log('User found:', user.email);
            router.push('/');
          } else {
            console.log('No user session');
            setError('Authentication completed but no session was created. Please try again.');
            setTimeout(() => router.push('/auth/login?error=no_session'), 2000);
          }
        }
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        setError(error.message || 'Authentication failed');
        setTimeout(() => router.push('/auth/login?error=callback_failed'), 2000);
      }
    };

    // Give the URL a moment to populate
    setTimeout(() => {
      handleCallback();
    }, 100);
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">Authentication Error</p>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Completing sign in...</p>
            <p className="text-xs text-gray-500 mt-2">Processing authentication response...</p>
          </>
        )}
      </div>
    </div>
  );
}
