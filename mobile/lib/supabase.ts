import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Hardcoded for now, or use .env in real mobile app (react-native-dotenv)
const supabaseUrl = 'https://jfwymztmoqzdngljatdx.supabase.co';
const supabaseAnonKey = 'sb_publishable_8Y-hVRKoxPNfHUo3jmZ9UQ_qK_NGwLe';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
