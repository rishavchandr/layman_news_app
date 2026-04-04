import { AppState, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient} from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import {SUPABASE_URL , SUPABASE_ANON_KEY} from '@env'



if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL in .env file');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY in .env file');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})


if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}