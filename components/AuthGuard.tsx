'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const isAuthPage = pathname === '/auth' || pathname?.startsWith('/auth/');
      
      if (!session && !isAuthPage) {
        // Not logged in and not on auth page - redirect to auth
        window.location.href = '/auth';
        return;
      }
      
      if (session && isAuthPage) {
        // Logged in but on auth page - redirect to home
        window.location.href = '/';
        return;
      }
      
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const isAuthPage = pathname === '/auth' || pathname?.startsWith('/auth/');
  
  // Allow auth page or authenticated users
  if (isAuthPage || isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated and not on auth page - will redirect
  return null;
}

