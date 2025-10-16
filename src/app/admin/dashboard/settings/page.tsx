'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, 
  Lock, 
  Mail,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  Database,
  Shield
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Email update state
  const [newEmail, setNewEmail] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  
  // System stats
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCourses: 0,
    totalStorage: 0,
  });
  
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setNewEmail(user.email || "");
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const { count: filesCount } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true });

      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      const { data: allFiles } = await supabase
        .from('files')
        .select('file_size');

      const totalStorage = allFiles?.reduce((sum: number, file: any) => 
        sum + (file.file_size || 0), 0) || 0;

      setStats({
        totalFiles: filesCount || 0,
        totalCourses: coursesCount || 0,
        totalStorage,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail || newEmail === user?.email) {
      toast({
        title: "Error",
        description: "Please enter a different email address",
        variant: "destructive",
      });
      return;
    }

    setUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Confirmation email sent. Please check your inbox.",
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive",
      });
    } finally {
      setUpdatingEmail(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-200 border-t-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-6xl font-extralight text-neutral-900 tracking-tight">Settings</h2>
        <p className="text-neutral-500 mt-3 font-light">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-8">
        <TabsList className="bg-neutral-50 p-2 rounded-full">
          <TabsTrigger value="account" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-light">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-light">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-light">
            <Database className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
            <div className="p-8 border-b border-neutral-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">Profile Information</h3>
              </div>
              <p className="text-neutral-500 font-light text-sm">View and update your account details</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-neutral-700 font-light">Email Address</Label>
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <Mail className="h-5 w-5 text-neutral-400" />
                  <span className="text-sm font-light text-neutral-900">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700 font-light">User ID</Label>
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <User className="h-5 w-5 text-neutral-400" />
                  <span className="font-mono text-xs text-neutral-600">{user?.id}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700 font-light">Account Created</Label>
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <CheckCircle className="h-5 w-5 text-neutral-400" />
                  <span className="text-sm font-light text-neutral-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
            <div className="p-8 border-b border-neutral-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">Change Email Address</h3>
              </div>
              <p className="text-neutral-500 font-light text-sm">Update your email address for account access</p>
            </div>
            <div className="p-8">
              <form onSubmit={handleEmailUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-email" className="text-neutral-700 font-light">New Email Address</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new@example.com"
                    className="rounded-2xl border-neutral-200 focus:border-neutral-900 font-light"
                    required
                  />
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Email Verification Required</p>
                      <p className="text-sm text-neutral-600 font-light mt-1">
                        You'll receive a confirmation email at your new address. Click the link to complete the change.
                      </p>
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={updatingEmail}
                  className="px-8 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-300 font-light disabled:opacity-50"
                >
                  {updatingEmail ? "Updating..." : "Update Email"}
                </button>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
            <div className="p-8 border-b border-neutral-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">Change Password</h3>
              </div>
              <p className="text-neutral-500 font-light text-sm">Update your password to keep your account secure</p>
            </div>
            <div className="p-8">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-neutral-700 font-light">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-2xl border-neutral-200 focus:border-neutral-900 font-light"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-neutral-700 font-light">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-2xl border-neutral-200 focus:border-neutral-900 font-light"
                    required
                  />
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Password Requirements</p>
                      <p className="text-sm text-neutral-600 font-light mt-1">
                        Password must be at least 6 characters long.
                      </p>
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={changingPassword}
                  className="px-8 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-300 font-light disabled:opacity-50"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
            <div className="p-8 border-b border-neutral-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">Security Status</h3>
              </div>
              <p className="text-neutral-500 font-light text-sm">Your account security overview</p>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-neutral-700" />
                    <span className="text-sm font-medium text-neutral-900">Email Verified</span>
                  </div>
                  <span className="text-xs text-neutral-600 font-light">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-neutral-700" />
                    <span className="text-sm font-medium text-neutral-900">Admin Access</span>
                  </div>
                  <span className="text-xs text-neutral-600 font-light">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
            <div className="p-8 border-b border-neutral-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">System Statistics</h3>
              </div>
              <p className="text-neutral-500 font-light text-sm">Overview of system resources and usage</p>
            </div>
            <div className="p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="text-5xl font-extralight text-neutral-900">{stats.totalFiles}</div>
                  <div className="text-sm text-neutral-600 font-light mt-2">Total Files</div>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="text-5xl font-extralight text-neutral-900">{stats.totalCourses}</div>
                  <div className="text-sm text-neutral-600 font-light mt-2">Total Courses</div>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="text-4xl font-extralight text-neutral-900">{formatBytes(stats.totalStorage)}</div>
                  <div className="text-sm text-neutral-600 font-light mt-2">Storage Used</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
            <div className="p-8 border-b border-neutral-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-light text-neutral-900">System Information</h3>
              </div>
              <p className="text-neutral-500 font-light text-sm">Platform and configuration details</p>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-sm font-medium text-neutral-900">Platform</span>
                  <span className="text-sm text-neutral-600 font-light">Next.js 14 + Supabase</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-sm font-medium text-neutral-900">Environment</span>
                  <span className="text-sm text-neutral-600 font-light">Production</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-sm font-medium text-neutral-900">Database</span>
                  <span className="text-sm text-neutral-600 font-light">PostgreSQL (Supabase)</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-sm font-medium text-neutral-900">Storage</span>
                  <span className="text-sm text-neutral-600 font-light">Supabase Storage</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
