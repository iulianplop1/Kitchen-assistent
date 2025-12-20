'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Database } from '@/lib/supabase/types';
import { Droplet, Scale, Target, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Profile = Database['public']['Tables']['profiles']['Row'];
type DailyLog = Database['public']['Tables']['daily_logs']['Row'];

export default function HealthTracking() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [weightHistory, setWeightHistory] = useState<DailyLog[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Load today's log
      const today = new Date().toISOString().split('T')[0];
      const { data: logData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (logData) {
        setTodayLog(logData);
        setWaterIntake(logData.water_intake || 0);
      }

      // Load weight history (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: weightData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .not('weight', 'is', null)
        .order('date', { ascending: true });

      if (weightData) setWeightHistory(weightData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateWaterIntake(change: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newIntake = Math.max(0, waterIntake + change);
      const today = new Date().toISOString().split('T')[0];

      // Upsert today's log
      const { error } = await supabase
        .from('daily_logs')
        .upsert({
          user_id: user.id,
          date: today,
          water_intake: newIntake,
          calories_consumed: todayLog?.calories_consumed || null,
          protein_consumed: todayLog?.protein_consumed || null,
          carbs_consumed: todayLog?.carbs_consumed || null,
          fats_consumed: todayLog?.fats_consumed || null,
          weight: todayLog?.weight || null,
        }, {
          onConflict: 'user_id,date',
        });

      if (error) throw error;
      setWaterIntake(newIntake);
      await loadData();
    } catch (error) {
      console.error('Error updating water intake:', error);
    }
  }

  async function updateWeight() {
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Please enter a valid weight');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const weightValue = parseFloat(weight);

      // Update daily log
      const { error: logError } = await supabase
        .from('daily_logs')
        .upsert({
          user_id: user.id,
          date: today,
          weight: weightValue,
          water_intake: todayLog?.water_intake || null,
          calories_consumed: todayLog?.calories_consumed || null,
          protein_consumed: todayLog?.protein_consumed || null,
          carbs_consumed: todayLog?.carbs_consumed || null,
          fats_consumed: todayLog?.fats_consumed || null,
        }, {
          onConflict: 'user_id,date',
        });

      if (logError) throw logError;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ current_weight: weightValue })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      setWeight('');
      await loadData();
    } catch (error) {
      console.error('Error updating weight:', error);
      alert('Error updating weight');
    }
  }

  async function updateGoals() {
    // This would typically open a modal, but for now we'll use simple prompts
    const calorieGoal = prompt('Enter daily calorie goal:', profile?.daily_calorie_goal?.toString() || '2000');
    const proteinGoal = prompt('Enter daily protein goal (g):', profile?.daily_protein_goal?.toString() || '150');
    const carbGoal = prompt('Enter daily carb goal (g):', profile?.daily_carb_goal?.toString() || '200');
    const fatGoal = prompt('Enter daily fat goal (g):', profile?.daily_fat_goal?.toString() || '65');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          daily_calorie_goal: parseInt(calorieGoal || '2000'),
          daily_protein_goal: parseInt(proteinGoal || '150'),
          daily_carb_goal: parseInt(carbGoal || '200'),
          daily_fat_goal: parseInt(fatGoal || '65'),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error updating goals:', error);
      alert('Error updating goals');
    }
  }

  const chartData = weightHistory.map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: log.weight,
    calories: log.calories_consumed || 0,
  }));

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Health Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Hydration Tracker
            </CardTitle>
          </CardHeader>
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {waterIntake} / 8
            </div>
            <p className="text-gray-600 mb-4">glasses today</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => updateWaterIntake(-1)}
                variant="outline"
                disabled={waterIntake === 0}
              >
                -
              </Button>
              <Button onClick={() => updateWaterIntake(1)} variant="primary">
                +
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-green-600" />
              Weight Tracker
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Weight</p>
              <p className="text-3xl font-bold text-gray-900">
                {profile?.current_weight ? `${profile.current_weight} lbs` : 'Not set'}
              </p>
            </div>
            {profile?.target_weight && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Target Weight</p>
                <p className="text-xl font-semibold text-gray-700">
                  {profile.target_weight} lbs
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter weight (lbs)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={updateWeight}>Update</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Daily Goals
            </CardTitle>
            <Button onClick={updateGoals} variant="outline" size="sm">
              Edit Goals
            </Button>
          </div>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Calories</p>
            <p className="text-2xl font-bold text-gray-900">
              {profile?.daily_calorie_goal || 2000}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Protein</p>
            <p className="text-2xl font-bold text-gray-900">
              {profile?.daily_protein_goal || 150}g
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Carbs</p>
            <p className="text-2xl font-bold text-gray-900">
              {profile?.daily_carb_goal || 200}g
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fats</p>
            <p className="text-2xl font-bold text-gray-900">
              {profile?.daily_fat_goal || 65}g
            </p>
          </div>
        </div>
      </Card>

      {weightHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Weight & Calorie Correlation
            </CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  name="Weight (lbs)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="calories"
                  stroke="#3b82f6"
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}

