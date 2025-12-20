'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not set!');
      setError('Configuration error: Supabase credentials missing');
    }
    // Don't check session here - let the middleware handle redirects to avoid loops
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Attempting to', isSignUp ? 'sign up' : 'sign in', 'with email:', email);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          setError(signUpError.message || 'Sign up failed');
          setLoading(false);
          return;
        }

        console.log('Sign up successful, user:', data.user?.id);

        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert({
            user_id: data.user.id,
            daily_calorie_goal: 2000,
            daily_protein_goal: 150,
            daily_carb_goal: 200,
            daily_fat_goal: 65,
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't block signup if profile creation fails
          }

          // Check if email confirmation is required
          if (data.session) {
            console.log('Session created, redirecting in 1 second...');
            // Give time for Supabase to set cookies properly
            setTimeout(() => {
              console.log('Redirecting now...');
              window.location.replace('/');
            }, 1000);
            // Don't set loading to false - let the redirect happen
          } else {
            setError('Please check your email to confirm your account! You can sign in after confirming.');
          }
        }
      } else {
        console.log('Signing in...');
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          setError(signInError.message || 'Sign in failed');
          setLoading(false);
          return;
        }

        console.log('Sign in successful, session:', data.session ? 'created' : 'not created');

        if (data.session) {
          console.log('Session created, redirecting in 1 second...');
          // Give time for Supabase to set cookies properly
          setTimeout(() => {
            console.log('Redirecting now...');
            // Use replace to avoid adding to history
            window.location.replace('/');
          }, 1000);
          // Don't set loading to false - let the redirect happen
        } else {
          // Check if email confirmation is required
          const { data: { user } } = await supabase.auth.getUser();
          if (user && !user.email_confirmed_at) {
            setError('Please check your email to confirm your account before signing in.');
          } else {
            setError('No session created. Please try again.');
          }
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">KitchenIQ</CardTitle>
          <p className="text-center text-gray-600 mt-2">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </CardHeader>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </Card>
    </div>
  );
}

