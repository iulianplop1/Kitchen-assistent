'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, getDaysUntilExpiry, getExpiryColor } from '@/lib/utils';
import { Database } from '@/lib/supabase/types';
import { Droplet, TrendingUp, AlertCircle, Utensils } from 'lucide-react';

type Inventory = Database['public']['Tables']['inventory']['Row'];
type DailyLog = Database['public']['Tables']['daily_logs']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Dashboard() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load inventory
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('expiry_date', { ascending: true });

      if (inventoryData) setInventory(inventoryData);

      // Load today's log
      const today = new Date().toISOString().split('T')[0];
      const { data: logData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      setTodayLog(logData);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const expiringSoon = inventory.filter(item => {
    const days = getDaysUntilExpiry(item.expiry_date);
    return days !== null && days <= 2;
  });

  const macroProgress = profile ? {
    calories: todayLog?.calories_consumed || 0,
    protein: todayLog?.protein_consumed || 0,
    carbs: todayLog?.carbs_consumed || 0,
    fats: todayLog?.fats_consumed || 0,
  } : null;

  const macroGoals = profile ? {
    calories: profile.daily_calorie_goal || 2000,
    protein: profile.daily_protein_goal || 150,
    carbs: profile.daily_carb_goal || 200,
    fats: profile.daily_fat_goal || 65,
  } : null;

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-blue-600" />
              What's for Dinner?
            </CardTitle>
          </CardHeader>
          <p className="text-gray-600">Check your recipes</p>
          <a href="/recipes">
            <Button className="mt-4 w-full" variant="outline">
              View Recipes
            </Button>
          </a>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-red-600">{expiringSoon.length}</p>
          <p className="text-sm text-gray-600">items need attention</p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-blue-600">
            {todayLog?.water_intake || 0} / 8
          </p>
          <p className="text-sm text-gray-600">glasses today</p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <p className="text-3xl font-bold text-green-600">
            {macroProgress?.calories || 0} / {macroGoals?.calories || 2000}
          </p>
          <p className="text-sm text-gray-600">kcal consumed</p>
        </Card>
      </div>

      {macroGoals && macroProgress && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Macro Progress</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Protein</span>
                <span className="text-sm text-gray-600">
                  {macroProgress.protein}g / {macroGoals.protein}g
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((macroProgress.protein / macroGoals.protein) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Carbs</span>
                <span className="text-sm text-gray-600">
                  {macroProgress.carbs}g / {macroGoals.carbs}g
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min((macroProgress.carbs / macroGoals.carbs) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Fats</span>
                <span className="text-sm text-gray-600">
                  {macroProgress.fats}g / {macroGoals.fats}g
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${Math.min((macroProgress.fats / macroGoals.fats) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {expiringSoon.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Items Expiring Soon</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {expiringSoon.slice(0, 5).map((item) => {
              const days = getDaysUntilExpiry(item.expiry_date);
              const color = getExpiryColor(days);
              return (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{item.item_name}</span>
                  <span className={`text-sm font-semibold text-${color}-600`}>
                    {days === 0 ? 'Expires today' : days === 1 ? 'Expires tomorrow' : `${days} days left`}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

