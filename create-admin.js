import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createAdmin() {
  console.log('Attempting to create admin user...');
  const { data, error } = await supabase.auth.signUp({
    email: 'sudiptarafdar756@gmail.com',
    password: 'admin123',
  });
  
  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('Successfully created admin user:', data.user?.email);
    
    if (data.user) {
        await supabase.from("users").upsert({
            id: data.user.id,
            email: data.user.email,
            subscription_status: "active"
        });
        console.log('Upserted user record into users table.');
    }
  }
}

createAdmin();
