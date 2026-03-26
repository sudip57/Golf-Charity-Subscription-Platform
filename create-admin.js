import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env file from the root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// In Node.js, we use process.env instead of import.meta.env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Environment Variables. Check your .env file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createAdmin() {
  console.log('Attempting to create admin user...');
  
  // Note: signUp creates a normal user. 
  // To make them an admin, you must update the 'role' column after creation.
  const { data, error } = await supabase.auth.signUp({
    email: 'testadmin123@gmail.com',
    password: 'admin123',
  });
  
  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('Successfully created user:', data.user?.email);
    
  if (data.user) {
    const { error: upsertError } = await supabase.from("users").upsert({
      id: data.user.id,
      email: data.user.email,
      subscription_status: "active",
      role: "admin" // 🟢 CRITICAL: Set the role to admin here
    });

    if (upsertError) {
      console.error('Error updating role:', upsertError.message);
    } else {
      console.log('User promoted to Admin in the users table.');
    }
  }
}

createAdmin();