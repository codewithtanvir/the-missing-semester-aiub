'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type UserProfile = {
  profile_completed: boolean;
};

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
        const redirectTo = searchParams.get('redirectTo') || '/courses';

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
            
            // Check if user profile exists
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('profile_completed')
              .eq('user_id', data.session.user.id)
              .single() as { data: UserProfile | null };

            if (!profile || !profile.profile_completed) {
              // New user - redirect to onboarding
              router.push('/onboarding');
            } else {
              // Existing user - redirect to destination
              router.push(redirectTo);
            }
            return;
          }
        }

        // Otherwise, let Supabase handle the code exchange and get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('User authentication error:', userError);
          setError(userError.message);
          setTimeout(() => router.push('/auth/login?error=' + encodeURIComponent(userError.message)), 2000);
          return;
        }

        if (user) {
          console.log('User authenticated:', user.email);
          
          // Check if user profile exists
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('profile_completed')
            .eq('user_id', user.id)
            .single() as { data: UserProfile | null };

          if (!profile || !profile.profile_completed) {
            // New user - redirect to onboarding
            router.push('/onboarding');
          } else {
            // Existing user - redirect to destination
            router.push(redirectTo);
          }
        } else {
          console.log('No authenticated user found');
          setError('Authentication completed but no user session was created. Please try again.');
          setTimeout(() => router.push('/auth/login?error=no_session'), 2000);
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
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <div className="text-red-600 mb-6">
              <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-2xl font-bold">Authentication Error</p>
            </div>
            <p className="text-muted-foreground text-lg mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
            <p className="text-2xl font-bold mb-2">Completing sign in...</p>
            <p className="text-muted-foreground">Processing authentication response...</p>
          </>
        )}
      </div>
    </main>
  );
}
