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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-neutral-800">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Please provide your information to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className={errors.fullName ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Student ID */}
            <div className="space-y-2">
              <Label htmlFor="studentId">
                Student ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentId"
                type="text"
                placeholder="23-51455-1"
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className={errors.studentId ? 'border-red-500' : ''}
                disabled={loading}
                maxLength={11}
              />
              {errors.studentId && (
                <p className="text-sm text-red-500">{errors.studentId}</p>
              )}
              <p className="text-xs text-neutral-500">
                Format: XX-XXXXX-X (e.g., 23-51455-1)
              </p>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                disabled={loading}
              >
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
                  Saving...
                </span>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
