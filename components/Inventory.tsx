'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { parseReceipt, processVoiceCommand, parseNutritionLabel } from '@/lib/gemini/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, getDaysUntilExpiry, getExpiryColor } from '@/lib/utils';
import { Database } from '@/lib/supabase/types';
import { Camera, Mic, Search, X } from 'lucide-react';

type Inventory = Database['public']['Tables']['inventory']['Row'];

export default function Inventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    loadInventory();
    initializeSpeechRecognition();
  }, []);

  function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        if (recognition) {
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            await handleVoiceInput(transcript);
            setIsListening(false);
          };
          recognition.onerror = () => {
            setIsListening(false);
          };
          recognitionRef.current = recognition;
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
      }
    }
  }

  async function loadInventory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      if (data) setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReceiptUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingReceipt(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const items = await parseReceipt(base64);
        await addItemsToInventory(items);
        setIsProcessingReceipt(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing receipt:', error);
      setIsProcessingReceipt(false);
    }
  }

  async function handleVoiceInput(transcript: string) {
    try {
      const items = await processVoiceCommand(transcript);
      await addItemsToInventory(items);
    } catch (error) {
      console.error('Error processing voice input:', error);
    }
  }

  async function startListening() {
    if (recognitionRef.current) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        alert('Error starting voice input. Please try again.');
      }
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  }

  async function addItemsToInventory(items: any[]) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const inventoryItems = items.map(item => ({
        user_id: user.id,
        item_name: item.name,
        category: 'Other',
        quantity: item.quantity || 1,
        unit: item.unit || 'pieces',
        price: item.price || null,
        expiry_date: item.estimated_expiry_days
          ? new Date(today.getTime() + item.estimated_expiry_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null,
      }));

      const { error } = await supabase
        .from('inventory')
        .insert(inventoryItems);

      if (error) throw error;
      await loadInventory();
    } catch (error) {
      console.error('Error adding items:', error);
    }
  }

  async function handleNutritionLabelUpload(itemId: string, file: File) {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const nutrition = await parseNutritionLabel(base64);
        
        if (nutrition) {
          const { error } = await supabase
            .from('inventory')
            .update({
              calories_per_unit: nutrition.calories,
              protein_per_unit: nutrition.protein,
              carbs_per_unit: nutrition.carbs,
              fats_per_unit: nutrition.fats,
            })
            .eq('id', itemId);

          if (error) throw error;
          await loadInventory();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing nutrition label:', error);
    }
  }

  async function deleteItem(id: string) {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">The Fridge</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingReceipt}
            variant="outline"
          >
            <Camera className="w-4 h-4 mr-2" />
            {isProcessingReceipt ? 'Processing...' : 'Scan Receipt'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleReceiptUpload}
            className="hidden"
          />
          <Button
            onClick={startListening}
            disabled={isListening}
            variant="outline"
          >
            <Mic className="w-4 h-4 mr-2" />
            {isListening ? 'Listening...' : 'Voice Add'}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const days = getDaysUntilExpiry(item.expiry_date);
          const color = getExpiryColor(days);
          
          return (
            <Card key={item.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{item.item_name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {item.expiry_date && (
                <div className={`mb-2 p-2 rounded ${
                  color === 'red' ? 'bg-red-50 border border-red-200' :
                  color === 'orange' ? 'bg-orange-50 border border-orange-200' :
                  'bg-green-50 border border-green-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    color === 'red' ? 'text-red-700' :
                    color === 'orange' ? 'text-orange-700' :
                    'text-green-700'
                  }`}>
                    {days === null
                      ? 'No expiry date'
                      : days < 0
                      ? 'Expired'
                      : days === 0
                      ? 'Expires today'
                      : days === 1
                      ? 'Expires tomorrow'
                      : `Expires in ${days} days`}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatDate(item.expiry_date)}
                  </p>
                </div>
              )}

              {item.price && (
                <p className="text-sm text-gray-600 mb-2">
                  Price: ${item.price.toFixed(2)}
                </p>
              )}

              {(!item.calories_per_unit || !item.protein_per_unit) && (
                <div className="mt-2">
                  <label className="text-xs text-gray-600 mb-1 block">
                    Add nutrition label:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleNutritionLabelUpload(item.id, file);
                    }}
                    className="text-xs"
                  />
                </div>
              )}

              {item.calories_per_unit && (
                <div className="mt-2 text-xs text-gray-600">
                  <p>Cal: {item.calories_per_unit} | P: {item.protein_per_unit}g | C: {item.carbs_per_unit}g | F: {item.fats_per_unit}g</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <p className="text-center text-gray-600 py-8">
            {searchTerm ? 'No items found' : 'Your inventory is empty. Add items to get started!'}
          </p>
        </Card>
      )}
    </div>
  );
}

