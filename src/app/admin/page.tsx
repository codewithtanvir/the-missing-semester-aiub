'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Brand */}
        <div className="text-center mb-12 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-extralight text-neutral-900 tracking-tight">
              Admin
            </h1>
            <p className="text-neutral-500 font-light">
              Sign in to manage course resources
            </p>
          </div>
        </div>

        {/* Login Form */}
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
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Input */}
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700 uppercase tracking-widest">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-0 py-3 text-lg font-light text-neutral-900 bg-transparent border-0 border-b-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors duration-300 placeholder:text-neutral-300"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700 uppercase tracking-widest">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-0 py-3 text-lg font-light text-neutral-900 bg-transparent border-0 border-b-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors duration-300 placeholder:text-neutral-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-full py-4 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

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
