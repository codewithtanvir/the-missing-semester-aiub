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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/30 to-neutral-50">
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push('/courses')}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={authData?.avatar_url} alt={profile?.full_name || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-3xl font-bold text-neutral-900">{profile?.full_name || 'Loading...'}</h1>
                <p className="text-neutral-600 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  {authData?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <User className="h-5 w-5 text-blue-500" />
              Profile Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-500">Full Name</p>
                <p className="text-lg font-semibold text-neutral-900">{profile?.full_name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-500">Student ID</p>
                <p className="text-lg font-mono font-semibold text-neutral-900">{profile?.student_id}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-500">Gender</p>
                <p className="text-lg font-semibold text-neutral-900">{profile?.gender}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-500">Email</p>
                <p className="text-lg font-semibold text-neutral-900">{authData?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

