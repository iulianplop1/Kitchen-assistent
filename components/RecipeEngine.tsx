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
  
  // Filter options
  const [cookingTime, setCookingTime] = useState<string>('');
  const [flavorPreference, setFlavorPreference] = useState<string>('');
  const [preferredCuisine, setPreferredCuisine] = useState<string>('');
  const [preferredDifficulty, setPreferredDifficulty] = useState<string>('');
  const [dietaryPreference, setDietaryPreference] = useState<string[]>([]);

  const appliances = [
    'Air Fryer',
    'Slow Cooker',
    'Microwave',
    'Oven',
    'Stovetop',
    'Blender',
    'Food Processor',
    'Instant Pot',
    'Grill',
    'Toaster Oven',
    'Rice Cooker',
    'Stand Mixer',
    'Immersion Blender',
    'Pressure Cooker',
    'Waffle Maker',
    'Griddle',
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
        selectedAppliances,
        {
          cookingTime,
          flavorPreference,
          preferredCuisine,
          preferredDifficulty,
          dietaryPreference,
        }
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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recipe Preferences</CardTitle>
            <Button
              onClick={() => {
                setCookingTime('');
                setFlavorPreference('');
                setPreferredCuisine('');
                setPreferredDifficulty('');
                setDietaryPreference([]);
              }}
              variant="outline"
              size="sm"
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cooking Time
            </label>
            <div className="flex gap-2 flex-wrap">
              {['Quick (under 30 min)', 'Medium (30-60 min)', 'Long (60+ min)', 'Any'].map((time) => (
                <button
                  key={time}
                  onClick={() => setCookingTime(time === 'Any' ? '' : time)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    cookingTime === time || (time === 'Any' && cookingTime === '')
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Flavor Preference
            </label>
            <div className="flex gap-2 flex-wrap">
              {['Sweet', 'Savory', 'Spicy', 'Mild', 'Any'].map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => setFlavorPreference(flavor === 'Any' ? '' : flavor)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    flavorPreference === flavor || (flavor === 'Any' && flavorPreference === '')
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cuisine Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {['Italian', 'Asian', 'American', 'Mexican', 'Mediterranean', 'Indian', 'French', 'Any'].map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setPreferredCuisine(cuisine === 'Any' ? '' : cuisine)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    preferredCuisine === cuisine || (cuisine === 'Any' && preferredCuisine === '')
                      ? 'border-pink-600 bg-pink-50 text-pink-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Difficulty Level
            </label>
            <div className="flex gap-2 flex-wrap">
              {['Easy', 'Medium', 'Hard', 'Any'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setPreferredDifficulty(difficulty === 'Any' ? '' : difficulty)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    preferredDifficulty === difficulty || (difficulty === 'Any' && preferredDifficulty === '')
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Dietary Preferences
            </label>
            <div className="flex gap-2 flex-wrap">
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Carb', 'Dairy-Free', 'Nut-Free'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => {
                    setDietaryPreference((prev) =>
                      prev.includes(diet)
                        ? prev.filter((d) => d !== diet)
                        : [...prev, diet]
                    );
                  }}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    dietaryPreference.includes(diet)
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
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

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-900">Nutrition per Serving:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-900 font-medium block mb-1">Calories:</span>
                <p className="font-bold text-lg text-blue-700">{recipe.calories_per_serving}</p>
              </div>
              <div>
                <span className="text-gray-900 font-medium block mb-1">Protein:</span>
                <p className="font-bold text-lg text-blue-700">{recipe.protein_per_serving}g</p>
              </div>
              <div>
                <span className="text-gray-900 font-medium block mb-1">Carbs:</span>
                <p className="font-bold text-lg text-blue-700">{recipe.carbs_per_serving}g</p>
              </div>
              <div>
                <span className="text-gray-900 font-medium block mb-1">Fats:</span>
                <p className="font-bold text-lg text-blue-700">{recipe.fats_per_serving}g</p>
              </div>
            </div>
            <p className="text-sm text-gray-900 font-medium mt-3">Serves: <span className="font-bold">{recipe.servings}</span></p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-900">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-gray-900 font-medium">
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
                  <li key={idx} className="text-gray-900 font-medium">{ing}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.cooking_time && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold mb-1 text-gray-900">Cooking Time:</h4>
                <p className="text-lg font-bold text-green-700">{recipe.cooking_time} minutes</p>
              </div>
            )}
            {recipe.prep_time && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold mb-1 text-gray-900">Prep Time:</h4>
                <p className="text-lg font-bold text-purple-700">{recipe.prep_time} minutes</p>
              </div>
            )}
            {recipe.total_time && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold mb-1 text-gray-900">Total Time:</h4>
                <p className="text-lg font-bold text-orange-700">{recipe.total_time} minutes</p>
              </div>
            )}
            {recipe.difficulty && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-semibold mb-1 text-gray-900">Difficulty:</h4>
                <p className={`text-lg font-bold ${
                  recipe.difficulty === 'Easy' ? 'text-green-700' :
                  recipe.difficulty === 'Medium' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>{recipe.difficulty}</p>
              </div>
            )}
          </div>

          {recipe.cuisine_type && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-900">Cuisine Type:</h4>
              <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                {recipe.cuisine_type}
              </span>
            </div>
          )}

          {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-900">Dietary Tags:</h4>
              <div className="flex gap-2 flex-wrap">
                {recipe.dietary_tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recipe.appliances_required && recipe.appliances_required.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-900">Required Appliances:</h4>
              <div className="flex gap-2 flex-wrap">
                {recipe.appliances_required.map((app, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recipe.tips && recipe.tips.length > 0 && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                💡 Cooking Tips:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="text-gray-900">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2 text-gray-900">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="text-gray-900 font-medium">{step}</li>
              ))}
            </ol>
          </div>
        </Card>
      )}
    </div>
  );
}

