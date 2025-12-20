import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error('❌ Gemini API key is not set. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
  if (process.env.NODE_ENV === 'development') {
    console.error('💡 Get a new API key from: https://makersuite.google.com/app/apikey');
  }
}

// Validate API key format (Google API keys start with "AIza")
if (apiKey && !apiKey.startsWith('AIza')) {
  console.warn('⚠️ Warning: Gemini API key format looks incorrect. Google API keys typically start with "AIza"');
}

export const genAI = new GoogleGenerativeAI(apiKey);

export interface ReceiptItem {
  name: string;
  quantity: number;
  unit: string;
  price?: number;
  estimated_expiry_days?: number;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Recipe {
  name: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fats_per_serving: number;
  servings: number;
  appliances_required?: string[];
  missing_ingredients?: string[];
  cooking_time?: number; // in minutes
  prep_time?: number; // in minutes
  total_time?: number; // in minutes (prep + cooking)
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisine_type?: string;
  dietary_tags?: string[]; // e.g., "Vegetarian", "Gluten-Free", "Keto"
  tips?: string[]; // cooking tips and tricks
}

export async function parseReceipt(imageBase64: string): Promise<ReceiptItem[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `You are a professional receipt parser. Analyze this receipt image and extract all food items with their quantities, units, and prices. 
  
  Return the data as a JSON array in this exact format:
  [
    {
      "name": "item name",
      "quantity": number,
      "unit": "unit type (e.g., 'pieces', 'lbs', 'oz', 'kg', 'g')",
      "price": number (if available),
      "estimated_expiry_days": number (estimate based on item type: fresh produce 3-7 days, dairy 5-10 days, meat 2-5 days, pantry items 30-365 days)
    }
  ]
  
  Only return valid JSON, no additional text.`;

  try {
    // Convert base64 to buffer for Gemini
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error: any) {
    console.error('Error parsing receipt:', error);
    if (error?.message?.includes('API key was reported as leaked')) {
      console.error('❌ Your Gemini API key has been revoked. Please get a new key from https://makersuite.google.com/app/apikey');
      console.error('💡 Update the NEXT_PUBLIC_GEMINI_API_KEY secret in GitHub and redeploy.');
    }
    return [];
  }
}

export async function parseNutritionLabel(imageBase64: string): Promise<NutritionData | null> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `You are a nutrition label parser. Extract the nutritional information from this label.
  
  Return the data as JSON in this exact format:
  {
    "calories": number (per serving),
    "protein": number (grams per serving),
    "carbs": number (grams per serving),
    "fats": number (grams per serving)
  }
  
  Only return valid JSON, no additional text.`;

  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error: any) {
    console.error('Error parsing nutrition label:', error);
    if (error?.message?.includes('API key was reported as leaked')) {
      console.error('❌ Your Gemini API key has been revoked. Please get a new key from https://makersuite.google.com/app/apikey');
      console.error('💡 Update the NEXT_PUBLIC_GEMINI_API_KEY secret in GitHub and redeploy.');
    }
    return null;
  }
}

export async function processVoiceCommand(command: string): Promise<ReceiptItem[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `You are a voice command processor for a kitchen inventory app. Parse this voice command and extract food items:
  
  "${command}"
  
  Return the data as a JSON array in this exact format:
  [
    {
      "name": "item name",
      "quantity": number,
      "unit": "unit type (e.g., 'pieces', 'lbs', 'oz', 'kg', 'g')",
      "estimated_expiry_days": number (estimate based on item type)
    }
  ]
  
  Only return valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error: any) {
    console.error('Error processing voice command:', error);
    if (error?.message?.includes('API key was reported as leaked')) {
      console.error('❌ Your Gemini API key has been revoked. Please get a new key from https://makersuite.google.com/app/apikey');
      console.error('💡 Update the NEXT_PUBLIC_GEMINI_API_KEY secret in GitHub and redeploy.');
    }
    return [];
  }
}

export interface RecipePreferences {
  cookingTime?: string;
  flavorPreference?: string;
  preferredCuisine?: string;
  preferredDifficulty?: string;
  dietaryPreference?: string[];
}

export async function generateRecipe(
  availableIngredients: string[],
  mode: 'use-it-up' | 'best-fit',
  appliances: string[] = [],
  preferences: RecipePreferences = {}
): Promise<Recipe | null> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const applianceContext = appliances.length > 0 
    ? ` The user has these appliances available: ${appliances.join(', ')}. Prioritize recipes that use these appliances.`
    : '';
  
  const modePrompt = mode === 'use-it-up'
    ? `Create a recipe using ONLY these ingredients: ${availableIngredients.join(', ')}. Do not suggest any additional ingredients.`
    : `Create a recipe that uses approximately 80% of these ingredients: ${availableIngredients.join(', ')}. List the 2-3 missing ingredients needed.`;
  
  // Build preferences context
  const preferencesContext = [];
  if (preferences.cookingTime) {
    preferencesContext.push(`Cooking time preference: ${preferences.cookingTime}`);
  }
  if (preferences.flavorPreference) {
    preferencesContext.push(`Flavor preference: ${preferences.flavorPreference}`);
  }
  if (preferences.preferredCuisine) {
    preferencesContext.push(`Preferred cuisine: ${preferences.preferredCuisine}`);
  }
  if (preferences.preferredDifficulty) {
    preferencesContext.push(`Difficulty level: ${preferences.preferredDifficulty}`);
  }
  if (preferences.dietaryPreference && preferences.dietaryPreference.length > 0) {
    preferencesContext.push(`Dietary requirements: ${preferences.dietaryPreference.join(', ')}`);
  }
  
  const preferencesText = preferencesContext.length > 0
    ? `\n\nUser preferences:\n${preferencesContext.join('\n')}\n\nPlease ensure the recipe matches these preferences.`
    : '';
  
  const prompt = `You are a professional chef and nutritionist. ${modePrompt}${applianceContext}${preferencesText}
  
  Return the recipe as JSON in this exact format:
  {
    "name": "Recipe Name",
    "ingredients": [
      {
        "name": "ingredient name",
        "quantity": number,
        "unit": "unit type"
      }
    ],
    "instructions": ["step 1", "step 2", ...],
    "calories_per_serving": number,
    "protein_per_serving": number,
    "carbs_per_serving": number,
    "fats_per_serving": number,
    "servings": number,
    "appliances_required": ["appliance1", "appliance2"],
    "missing_ingredients": ["item1", "item2"] (only if mode is best-fit),
    "cooking_time": number (total cooking time in minutes),
    "prep_time": number (preparation time in minutes),
    "total_time": number (prep_time + cooking_time in minutes),
    "difficulty": "Easy" | "Medium" | "Hard",
    "cuisine_type": "string (e.g., Italian, Asian, American, etc.)",
    "dietary_tags": ["Vegetarian", "Gluten-Free", etc.] (if applicable),
    "tips": ["helpful tip 1", "helpful tip 2"] (2-3 cooking tips)
  }
  
  Only return valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error: any) {
    console.error('Error generating recipe:', error);
    if (error?.message?.includes('API key was reported as leaked')) {
      console.error('❌ Your Gemini API key has been revoked. Please get a new key from https://makersuite.google.com/app/apikey');
      console.error('💡 Update the NEXT_PUBLIC_GEMINI_API_KEY secret in GitHub and redeploy.');
    }
    return null;
  }
}

