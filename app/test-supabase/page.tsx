'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestSupabase() {
  const [status, setStatus] = useState<string>('Testing...');
  const [details, setDetails] = useState<any>(null);

  async function testConnection() {
    try {
      setStatus('Testing Supabase connection...');
      
      // Test 1: Check environment variables
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        setStatus('❌ Environment variables missing!');
        setDetails({ error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY' });
        return;
      }
      
      setDetails({ step1: '✅ Environment variables found', url: url.substring(0, 30) + '...' });
      
      // Test 2: Try to get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setStatus('❌ Session check failed');
        setDetails({ ...details, sessionError: sessionError.message });
        return;
      }
      
      setDetails({ 
        ...details, 
        step2: session ? '✅ User is logged in' : 'ℹ️ No active session',
        userId: session?.user?.id 
      });
      
      // Test 3: Try to access profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (profilesError) {
        setStatus('❌ Database access failed');
        setDetails({ 
          ...details, 
          profilesError: profilesError.message,
          hint: 'Make sure you ran the schema.sql in Supabase SQL Editor'
        });
        return;
      }
      
      setDetails({ 
        ...details, 
        step3: '✅ Database tables accessible'
      });
      
      setStatus('✅ All tests passed!');
      
    } catch (error: any) {
      setStatus('❌ Test failed');
      setDetails({ error: error.message });
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <button
        onClick={testConnection}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        Run Tests
      </button>
      <div className="mt-4">
        <p className="font-semibold">{status}</p>
        {details && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

