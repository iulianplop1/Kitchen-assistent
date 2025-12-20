import RecipeEngine from '@/components/RecipeEngine';
import Navigation from '@/components/Navigation';

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <RecipeEngine />
    </div>
  );
}

