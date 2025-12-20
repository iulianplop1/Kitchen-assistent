# KitchenIQ Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Settings > API**
3. Copy your **Project URL** and **anon/public key**
4. Go to **SQL Editor** and run the SQL script from `lib/supabase/schema.sql`
5. This will create all necessary tables with Row Level Security (RLS) policies

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

**Note:** The API key in the PRD is provided, but you should use your own for production.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### Authentication
- Sign up/Sign in page at `/auth`
- Automatic profile creation on signup
- Protected routes via middleware

### Dashboard (`/`)
- Overview of expiring items
- Daily macro progress
- Water intake tracker
- Quick access to recipes

### Inventory (`/inventory`)
- View all items with expiry dates
- Color-coded freshness indicators:
  - 🟢 Green: Fresh (3+ days)
  - 🟠 Orange: Expiring soon (1-2 days)
  - 🔴 Red: Expired or expiring today
- Search functionality
- Receipt scanning (upload image)
- Voice input for adding items
- Nutrition label parsing

### Recipes (`/recipes`)
- **Use-It-Up Mode**: Recipes using only available ingredients
- **Best Fit Mode**: Recipes with ~80% available ingredients
- Appliance filtering
- Save favorite recipes
- Add missing ingredients to shopping list

### Shopping List (`/shopping`)
- Manually add items
- Check off completed items
- Automatically populated from "Best Fit" recipes
- Clear completed items

### Health Tracking (`/health`)
- Daily macro goals (calories, protein, carbs, fats)
- Weight tracking with charts
- Water intake tracker
- Weight vs. calorie correlation graph

## Database Tables

### profiles
Stores user goals, weight, and appliance preferences.

### inventory
Food items with quantities, expiry dates, prices, and nutritional data.

### daily_logs
Daily calorie intake, water consumption, and weight measurements.

### recipes_saved
User's favorite AI-generated recipes.

## API Integration

### Gemini API
The app uses Google Gemini API for:
- Receipt parsing (image to structured data)
- Nutrition label extraction
- Voice command processing
- Recipe generation

**Model Used:** `gemini-1.5-pro`

### Supabase
- Authentication
- Real-time database
- Row Level Security (RLS) for data protection

## Troubleshooting

### Receipt/Nutrition Label Parsing Not Working
- Ensure your Gemini API key is valid
- Check that images are in JPEG format
- Verify the API key has vision capabilities enabled

### Voice Input Not Working
- Voice input requires browser support for Speech Recognition API
- Works best in Chrome/Edge
- May require HTTPS in production

### Database Errors
- Verify your Supabase credentials
- Ensure RLS policies are set up correctly
- Check that tables exist in your Supabase project

## Deployment

### Vercel
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
Make sure to set all environment variables in your hosting platform's dashboard.

## Next Steps

1. **Customize Goals**: Set your daily macro goals in the Health page
2. **Add Appliances**: Select your available appliances in the Recipes page
3. **Scan Receipts**: Start adding items by scanning receipts
4. **Generate Recipes**: Use the Recipe Engine to find meals based on your inventory
5. **Track Health**: Log your weight and water intake daily

## Support

For issues or questions, please check the README.md or open an issue on GitHub.

