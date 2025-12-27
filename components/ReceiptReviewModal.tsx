'use client';

import { useState, useEffect } from 'react';
import { ReceiptItem } from '@/lib/gemini/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { X, Plus, Trash2 } from 'lucide-react';

interface ReceiptReviewModalProps {
  items: ReceiptItem[];
  receiptTotal?: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: ReceiptItem[]) => void;
}

export default function ReceiptReviewModal({
  items: initialItems,
  receiptTotal,
  isOpen,
  onClose,
  onConfirm,
}: ReceiptReviewModalProps) {
  const [items, setItems] = useState<ReceiptItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  if (!isOpen) return null;

  const updateItem = (index: number, field: keyof ReceiptItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        name: '',
        quantity: 1,
        unit: 'pieces',
        price: undefined,
        estimated_expiry_days: 7,
      },
    ]);
  };

  const calculateTotal = () => {
    return items
      .filter(item => item.price !== undefined && item.price !== null)
      .reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const calculatedTotal = calculateTotal();
  const totalMatch = receiptTotal !== undefined 
    ? Math.abs(calculatedTotal - receiptTotal) <= 0.10
    : true;

  const handleConfirm = () => {
    // Filter out items without names
    const validItems = items.filter(item => item.name.trim() !== '');
    onConfirm(validItems);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Review Receipt Items</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {receiptTotal !== undefined && (
          <div className={`mb-4 p-4 rounded-lg border-2 ${
            totalMatch 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">Receipt Total:</p>
                <p className="text-2xl font-bold text-gray-900">${receiptTotal.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Items Total:</p>
                <p className={`text-2xl font-bold ${
                  totalMatch ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  ${calculatedTotal.toFixed(2)}
                </p>
                {!totalMatch && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Difference: ${Math.abs(calculatedTotal - receiptTotal).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            {totalMatch && (
              <p className="text-sm text-green-700 mt-2">✓ Prices match!</p>
            )}
            {!totalMatch && (
              <p className="text-sm text-yellow-700 mt-2">
                ⚠ Prices don't match. Please review item prices below.
              </p>
            )}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter item name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="pieces"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || undefined)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    onClick={() => removeItem(index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={addNewItem}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>

          <div className="text-right">
            <p className="text-sm text-gray-600">Total Items: {items.length}</p>
            {receiptTotal === undefined && (
              <p className="text-sm font-medium text-gray-900">
                Items Total: ${calculatedTotal.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="primary">
            Add to Inventory
          </Button>
        </div>
      </Card>
    </div>
  );
}

