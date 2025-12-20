'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { generateRecipe, Recipe } from '@/lib/gemini/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Database } from '@/lib/supabase/types';
import { ChefHat, ShoppingCart, CheckCircle } from 'lucide-react';

type Inventory = Database['public']['Tables']['inventory']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function RecipeEngine() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mode, setMode] = useState<'use-it-up' | 'best-fit'>('use-it-up');
  const [loading, setLoading] = useState(false);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);

  const appliances = [
    'Air Fryer',
    'Slow Cooker',
    'Microwave',
    'Oven',
    'Stovetop',
    'Blender',
    'Food Processor',
  ];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id);

      if (inventoryData) setInventory(inventoryData);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setSelectedAppliances(profileData.owned_appliances || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async function handleGenerateRecipe() {
    if (inventory.length === 0) {
      alert('Your inventory is empty. Add items first!');
      return;
    }

    setLoading(true);
    try {
      const availableIngredients = inventory.map(item => item.item_name);
      const generatedRecipe = await generateRecipe(
        availableIngredients,
        mode,
        selectedAppliances
      );

      if (generatedRecipe) {
        setRecipe(generatedRecipe);
      } else {
        alert('Failed to generate recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('Error generating recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function saveRecipe() {
    if (!recipe) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('recipes_saved')
        .insert({
          user_id: user.id,
          recipe_name: recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          calories_per_serving: recipe.calories_per_serving,
          protein_per_serving: recipe.protein_per_serving,
          carbs_per_serving: recipe.carbs_per_serving,
          fats_per_serving: recipe.fats_per_serving,
          servings: recipe.servings,
          appliances_required: recipe.appliances_required || [],
        });

      if (error) throw error;
      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe.');
    }
  }

  async function addMissingToShoppingList() {
    if (!recipe || !recipe.missing_ingredients || recipe.missing_ingredients.length === 0) {
      alert('No missing ingredients to add!');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const stored = localStorage.getItem(`shopping_list_${user.id}`);
      const existingItems: Array<{ id: string; name: string; completed: boolean; created_at: string }> = stored ? JSON.parse(stored) : [];

      const newItems = recipe.missing_ingredients
        .filter(ing => !existingItems.some(item => item.name.toLowerCase() === ing.toLowerCase()))
        .map(ing => ({
          id: Date.now().toString() + Math.random().toString(),
          name: ing,
          completed: false,
          created_at: new Date().toISOString(),
        }));

      const updated = [...existingItems, ...newItems];
      localStorage.setItem(`shopping_list_${user.id}`, JSON.stringify(updated));
      alert(`Added ${newItems.length} item(s) to shopping list!`);
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      alert('Error adding items to shopping list.');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Recipe Engine</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recipe Mode</CardTitle>
        </CardHeader>
        <div className="flex gap-4 mb-4">
          <Button
            variant={mode === 'use-it-up' ? 'primary' : 'outline'}
            onClick={() => setMode('use-it-up')}
          >
            Use-It-Up Mode
          </Button>
          <Button
            variant={mode === 'best-fit' ? 'primary' : 'outline'}
            onClick={() => setMode('best-fit')}
          >
            Best Fit Mode
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {mode === 'use-it-up'
            ? 'Generate recipes using ONLY what you have in your inventory.'
            : 'Generate recipes that use ~80% of your ingredients. Missing items will be listed.'}
        </p>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Appliances</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {appliances.map((appliance) => (
            <button
              key={appliance}
              onClick={() => {
                setSelectedAppliances((prev) =>
                  prev.includes(appliance)
                    ? prev.filter((a) => a !== appliance)
                    : [...prev, appliance]
                );
              }}
              className={`p-2 rounded border-2 transition-colors ${
                selectedAppliances.includes(appliance)
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {appliance}
            </button>
          ))}
        </div>
      </Card>

      <Button
        onClick={handleGenerateRecipe}
        disabled={loading || inventory.length === 0}
        size="lg"
        className="w-full"
      >
        <ChefHat className="w-5 h-5 mr-2" />
        {loading ? 'Generating Recipe...' : 'Generate Recipe'}
      </Button>

      {recipe && (
        <Card>
          <div className="flex justify-between items-start mb-4">
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <Button onClick={saveRecipe} variant="outline" size="sm">
              Save Recipe
            </Button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Nutrition per Serving:</h4>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Calories:</span>
                <p className="font-semibold">{recipe.calories_per_serving}</p>
              </div>
              <div>
                <span className="text-gray-600">Protein:</span>
                <p className="font-semibold">{recipe.protein_per_serving}g</p>
              </div>
              <div>
                <span className="text-gray-600">Carbs:</span>
                <p className="font-semibold">{recipe.carbs_per_serving}g</p>
              </div>
              <div>
                <span className="text-gray-600">Fats:</span>
                <p className="font-semibold">{recipe.fats_per_serving}g</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Serves: {recipe.servings}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-gray-700">
                  {ing.quantity} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </div>

          {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Missing Ingredients:
                </h4>
                <Button onClick={addMissingToShoppingList} variant="outline" size="sm">
                  Add to Shopping List
                </Button>
              </div>
              <ul className="list-disc list-inside">
                {recipe.missing_ingredients.map((ing, idx) => (
                  <li key={idx} className="text-gray-700">{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {recipe.appliances_required && recipe.appliances_required.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Required Appliances:</h4>
              <div className="flex gap-2 flex-wrap">
                {recipe.appliances_required.map((app, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
        </Card>
      )}
    </div>
  );
}

