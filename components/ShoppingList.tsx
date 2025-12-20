'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Plus, X, Check } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  created_at: string;
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShoppingList();
  }, []);

  async function loadShoppingList() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll use localStorage. In production, you'd create a shopping_list table
      const stored = localStorage.getItem(`shopping_list_${user.id}`);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveShoppingList(itemsToSave: ShoppingItem[]) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      localStorage.setItem(`shopping_list_${user.id}`, JSON.stringify(itemsToSave));
    } catch (error) {
      console.error('Error saving shopping list:', error);
    }
  }

  function addItem() {
    if (!newItem.trim()) return;

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      completed: false,
      created_at: new Date().toISOString(),
    };

    const updated = [...items, item];
    setItems(updated);
    saveShoppingList(updated);
    setNewItem('');
  }

  function toggleItem(id: string) {
    const updated = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updated);
    saveShoppingList(updated);
  }

  function deleteItem(id: string) {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    saveShoppingList(updated);
  }

  function clearCompleted() {
    const updated = items.filter(item => !item.completed);
    setItems(updated);
    saveShoppingList(updated);
  }

  const completedCount = items.filter(item => item.completed).length;
  const activeItems = items.filter(item => !item.completed);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Shopping List</h1>
        {completedCount > 0 && (
          <Button onClick={clearCompleted} variant="outline" size="sm">
            Clear Completed
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Add Items
          </CardTitle>
        </CardHeader>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add item to shopping list..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </Card>

      <div className="space-y-2">
        {activeItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Active Items</h2>
            {activeItems.map((item) => (
              <Card key={item.id} className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{item.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {items.filter(item => item.completed).length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-600">Completed</h2>
            {items
              .filter(item => item.completed)
              .map((item) => (
                <Card key={item.id} className="mb-2 opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 line-through">{item.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}

        {items.length === 0 && (
          <Card>
            <p className="text-center text-gray-600 py-8">
              Your shopping list is empty. Add items to get started!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

