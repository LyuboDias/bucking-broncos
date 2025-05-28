const { createClient } = require('@supabase/supabase-js')

async function checkMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase environment variables not found')
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check if the second_place_id and third_place_id columns exist
    const { data, error } = await supabase
      .from('races')
      .select('id, name, status, second_place_id, third_place_id')
      .limit(1)

    if (error) {
      if (error.message.includes('column "second_place_id" does not exist') || 
          error.message.includes('column "third_place_id" does not exist')) {
        console.error('❌ Database migration not applied!')
        console.log('\n📋 To fix this, run the following SQL in your Supabase dashboard:')
        console.log('\n-- Add second and third place columns to races table')
        console.log('ALTER TABLE races ADD COLUMN second_place_id INTEGER REFERENCES players(id);')
        console.log('ALTER TABLE races ADD COLUMN third_place_id INTEGER REFERENCES players(id);')
        console.log('\n-- Update bets table to add place_rank field')
        console.log('ALTER TABLE bets ADD COLUMN place_rank INTEGER DEFAULT NULL;')
        console.log('COMMENT ON COLUMN bets.place_rank IS \'1 for first place, 2 for second place, 3 for third place, NULL if bet lost\';')
        console.log('\n🔗 Go to: https://supabase.com/dashboard/project/[your-project]/sql')
        return
      }
      throw error
    }

    console.log('✅ Database migration has been applied successfully!')
    console.log('✅ All required columns exist in the races table')
    
  } catch (error) {
    console.error('❌ Error checking migration:', error.message)
  }
}

checkMigration() 