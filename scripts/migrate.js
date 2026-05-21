const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: {
    transport: require('ws')
  }
});

async function migrate() {
  const recipesPath = path.resolve(process.cwd(), 'lib/data/recipes.json');
  if (!fs.existsSync(recipesPath)) {
    console.error('Recipes file not found');
    return;
  }

  const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));

  console.log(`Found ${recipes.length} recipes to migrate...`);
  
  for (const recipe of recipes) {
    const { id, ...recipeData } = recipe; 
    
    // We will omit the string ID from the JSON so Supabase can generate its own UUID, 
    // OR if the user created it with text ID, we keep it. Let's omit ID to be safe if UUID is expected.
    const { data, error } = await supabase.from('recipes').insert([recipeData]).select();

    if (error) {
      console.error(`Error inserting ${recipeData.slug}:`, error.message);
    } else {
      console.log(`Success: ${recipeData.slug}`);
    }
  }
}

migrate();
