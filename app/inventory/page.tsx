import Inventory from '@/components/Inventory';
import Navigation from '@/components/Navigation';

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Inventory />
    </div>
  );
}

