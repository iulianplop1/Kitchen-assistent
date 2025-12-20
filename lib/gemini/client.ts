import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('Gemini API key is not set');
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
  } catch (error) {
    console.error('Error parsing receipt:', error);
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
  } catch (error) {
    console.error('Error parsing nutrition label:', error);
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
  } catch (error) {
    console.error('Error processing voice command:', error);
    return [];
  }
}

export async function generateRecipe(
  availableIngredients: string[],
  mode: 'use-it-up' | 'best-fit',
  appliances: string[] = []
): Promise<Recipe | null> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const applianceContext = appliances.length > 0 
    ? ` The user has these appliances available: ${appliances.join(', ')}. Prioritize recipes that use these appliances.`
    : '';
  
  const modePrompt = mode === 'use-it-up'
    ? `Create a recipe using ONLY these ingredients: ${availableIngredients.join(', ')}. Do not suggest any additional ingredients.`
    : `Create a recipe that uses approximately 80% of these ingredients: ${availableIngredients.join(', ')}. List the 2-3 missing ingredients needed.`;
  
  const prompt = `You are a professional chef and nutritionist. ${modePrompt}${applianceContext}
  
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
    "missing_ingredients": ["item1", "item2"] (only if mode is best-fit)
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
  } catch (error) {
    console.error('Error generating recipe:', error);
    return null;
  }
}

