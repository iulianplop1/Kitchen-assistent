import ShoppingList from '@/components/ShoppingList';
import Navigation from '@/components/Navigation';

export default function ShoppingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ShoppingList />
    </div>
  );
}

