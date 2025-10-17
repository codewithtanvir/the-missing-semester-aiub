'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type UserProfile = {
  profile_completed: boolean;
};

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    gender: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    studentId: '',
    gender: ''
  });

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      // Check if profile already exists
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single() as { data: UserProfile | null };

      if (profile && profile.profile_completed) {
        // Profile already completed, redirect to courses
        router.push('/courses');
      } else {
        // Pre-fill name from Google
        const googleName = user.user_metadata?.full_name || 
                          user.user_metadata?.name || '';
        setFormData(prev => ({ ...prev, fullName: googleName }));
        setCheckingProfile(false);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setCheckingProfile(false);
    }
  };

  const validateStudentId = (id: string): boolean => {
    // Format: XX-XXXXX-X (e.g., 23-51455-1)
    const regex = /^\d{2}-\d{5}-\d{1}$/;
    return regex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ fullName: '', studentId: '', gender: '' });
    
    // Validation
    let hasError = false;
    const newErrors = { fullName: '', studentId: '', gender: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      hasError = true;
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
      hasError = true;
    } else if (!validateStudentId(formData.studentId)) {
      newErrors.studentId = 'Invalid format. Use: XX-XXXXX-X (e.g., 23-51455-1)';
      hasError = true;
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      // Check if student ID already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('student_id')
        .eq('student_id', formData.studentId)
        .single();

      if (existingProfile) {
        setErrors(prev => ({
          ...prev,
          studentId: 'This student ID is already registered'
        }));
        setLoading(false);
        return;
      }

      // Insert profile
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          full_name: formData.fullName.trim(),
          student_id: formData.studentId.trim(),
          gender: formData.gender,
          role: 'student',
          profile_completed: true
        } as any);

      if (insertError) {
        throw insertError;
      }

      // Success! Redirect to courses
      router.push('/courses');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.code === '23505') {
        // Unique constraint violation
        setErrors(prev => ({
          ...prev,
          studentId: 'This student ID is already registered'
        }));
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900"></div>
          <p className="text-neutral-400 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extralight tracking-tight text-neutral-900 mb-6">
            Welcome
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 font-light max-w-md mx-auto">
            Complete your profile to get started
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-neutral-100 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name */}
            <div className="space-y-3">
              <label 
                htmlFor="fullName"
                className="block text-sm font-light text-neutral-600 tracking-wide"
              >
                FULL NAME <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className={`w-full px-0 py-4 text-lg font-light text-neutral-900 placeholder:text-neutral-300 bg-transparent border-b-2 transition-all duration-300 outline-none ${
                  errors.fullName 
                    ? 'border-red-500' 
                    : 'border-neutral-200 focus:border-neutral-900'
                }`}
                disabled={loading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 font-light mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Student ID */}
            <div className="space-y-3">
              <label 
                htmlFor="studentId"
                className="block text-sm font-light text-neutral-600 tracking-wide"
              >
                STUDENT ID <span className="text-red-500">*</span>
              </label>
              <input
                id="studentId"
                type="text"
                placeholder="23-51455-1"
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className={`w-full px-0 py-4 text-lg font-light text-neutral-900 placeholder:text-neutral-300 bg-transparent border-b-2 transition-all duration-300 outline-none font-mono ${
                  errors.studentId 
                    ? 'border-red-500' 
                    : 'border-neutral-200 focus:border-neutral-900'
                }`}
                disabled={loading}
                maxLength={11}
              />
              {errors.studentId ? (
                <p className="text-sm text-red-500 font-light mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.studentId}
                </p>
              ) : (
                <p className="text-xs text-neutral-400 font-light mt-2">
                  Format: XX-XXXXX-X
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label 
                htmlFor="gender"
                className="block text-sm font-light text-neutral-600 tracking-wide"
              >
                GENDER <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: option }))}
                    disabled={loading}
                    className={`px-4 py-3 rounded-xl text-sm font-light transition-all duration-300 ${
                      formData.gender === option
                        ? 'bg-neutral-900 text-white shadow-lg scale-105'
                        : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-sm text-red-500 font-light mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full rounded-2xl bg-neutral-900 text-white px-8 py-5 text-lg font-light shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Saving...
                  </span>
                ) : (
                  'Complete Profile'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-neutral-400 font-light mt-8 animate-in fade-in duration-700 delay-300">
          This information helps us personalize your experience
        </p>
      </div>
    </main>
  );
}
