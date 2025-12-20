# KitchenIQ – AI-Powered Kitchen & Health Manager

KitchenIQ is a comprehensive web application designed to act as an "Executive Chef and Nutritionist" in your pocket. The app eliminates food waste, simplifies meal preparation, and provides automated health tracking.

## Features

### 🍽️ Smart Inventory Management
- **Visual Logging**: Upload or snap a photo of a grocery receipt. AI parses the text, identifies food items, and estimates quantity and expiry dates.
- **Voice-to-Pantry**: Use the "Listen" button to speak your groceries (e.g., "Add 12 eggs and a bag of apples").
- **Product Registration**: Upload photos of nutrition labels. AI extracts Calories, Protein, Carbs, and Fats.
- **Budget Tracking**: Logs item prices from receipts to track monthly spending and alerts about items expiring before use.

### 👨‍🍳 AI Recipe Engine
- **Use-It-Up Mode**: Suggests recipes using ONLY what's currently in your inventory.
- **Best Fit Mode**: Suggests recipes where you have ~80% of ingredients, clearly listing the 2-3 missing items.
- **Appliance Integration**: Filter recipes by available appliances (Air Fryer, Slow Cooker, Microwave, etc.).

### 💪 Health & Weight Tracking
- **Calorie & Macro Goals**: Set daily targets for Calories, Protein, Carbs, and Fats.
- **Weight Correlation**: Daily weight log with charts comparing "Caloric Intake vs. Weight Change" over time.
- **Hydration Tracker**: Visual "water glass" counter with AI reminders based on sodium intake and activity levels.
- **Chrononutrition**: Generate meal schedules with exact portion sizes to meet calorie goals.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI Engine**: Google Gemini API
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd "Kitchen assistent"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up Supabase database:
   - Create a new Supabase project
   - Go to SQL Editor
   - Run the SQL script from `lib/supabase/schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication page
│   ├── health/            # Health tracking page
│   ├── inventory/         # Inventory management page
│   ├── recipes/           # Recipe engine page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard (home page)
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Inventory.tsx    # Inventory management
│   ├── RecipeEngine.tsx # Recipe generation
│   ├── HealthTracking.tsx # Health metrics
│   └── Navigation.tsx    # App navigation
├── lib/                  # Utility libraries
│   ├── supabase/        # Supabase client and types
│   ├── gemini/          # Gemini API integration
│   └── utils.ts         # Helper functions
└── public/              # Static assets
```

## Database Schema

The application uses four main tables:

1. **profiles**: User goals, weight, and appliance preferences
2. **inventory**: Food items with quantities, expiry dates, and nutritional data
3. **daily_logs**: Daily calorie intake, water consumption, and weight
4. **recipes_saved**: User's favorite AI-generated recipes

See `lib/supabase/schema.sql` for the complete schema with Row Level Security policies.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Create a new site in Netlify and connect your repository
3. Add your environment variables
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Deploy!

## Environment Variables

Make sure to set all required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)
- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key
- `NEXT_PUBLIC_APP_URL`: Your app URL (for production)

## Features in Detail

### Receipt Parsing
Upload a receipt image, and Gemini Vision API extracts:
- Item names
- Quantities and units
- Prices
- Estimated expiry dates based on item type

### Voice Commands
Use browser's Speech Recognition API to add items by voice. The transcript is processed by Gemini to extract structured data.

### Recipe Generation
Gemini generates recipes based on:
- Available ingredients
- Selected mode (Use-It-Up or Best Fit)
- Available appliances
- Nutritional requirements

### Health Tracking
- Track daily macros (calories, protein, carbs, fats)
- Log weight daily
- Monitor water intake
- View weight vs. calorie correlation charts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

