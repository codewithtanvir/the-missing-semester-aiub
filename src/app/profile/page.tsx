'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  LogOut, 
  ArrowLeft,
  CreditCard
} from 'lucide-react';

type UserProfile = {
  id: string;
  full_name: string;
  student_id: string;
  gender: string;
};

type UserAuth = {
  email: string;
  avatar_url?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authData, setAuthData] = useState<UserAuth | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      // Load auth data
      const avatarUrl = user.user_metadata?.avatar_url || 
                        user.user_metadata?.picture || '';
      
      setAuthData({
        email: user.email || 'N/A',
        avatar_url: avatarUrl,
      });

      // Load profile data
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single() as { data: UserProfile | null; error: any };

      if (error) {
        console.error('Error loading profile:', error);
        if (error.code === 'PGRST116') {
          router.push('/onboarding');
        }
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900"></div>
          <p className="text-neutral-400 font-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Navigation */}
      <div className="border-b border-neutral-100 bg-white/60 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors duration-300 font-light"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Courses</span>
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors duration-300 font-light"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 sm:px-8 py-16 sm:py-24">
        
        {/* Hero Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Avatar */}
          <div className="mb-8 inline-block">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              {authData?.avatar_url ? (
                <img 
                  src={authData.avatar_url} 
                  alt={profile?.full_name || 'User'} 
                  className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover shadow-xl border-4 border-white"
                />
              ) : (
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-light shadow-xl border-4 border-white">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-neutral-900 mb-4">
            {profile?.full_name || 'Loading...'}
          </h1>
          
          {/* Email */}
          <div className="flex items-center justify-center gap-2 text-neutral-500 font-light text-lg">
            <Mail className="h-4 w-4" />
            {authData?.email}
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          
          {/* Full Name Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-neutral-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-neutral-50">
                <User className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-light mb-2">
                  Full Name
                </p>
                <p className="text-2xl font-light text-neutral-900 truncate">
                  {profile?.full_name}
                </p>
              </div>
            </div>
          </div>

          {/* Student ID Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-neutral-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-neutral-50">
                <CreditCard className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-light mb-2">
                  Student ID
                </p>
                <p className="text-2xl font-mono font-light text-neutral-900">
                  {profile?.student_id}
                </p>
              </div>
            </div>
          </div>

          {/* Gender Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-neutral-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-neutral-50">
                <User className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-light mb-2">
                  Gender
                </p>
                <p className="text-2xl font-light text-neutral-900">
                  {profile?.gender}
                </p>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-neutral-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-neutral-50">
                <Mail className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-light mb-2">
                  Email Address
                </p>
                <p className="text-xl font-light text-neutral-900 truncate">
                  {authData?.email}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-neutral-400 font-light mt-16 animate-in fade-in duration-700 delay-300">
          Need to update your information? Contact support
        </p>
      </div>
    </main>
  );
}

