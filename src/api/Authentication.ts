import { supabase } from "../lib/supabase";

export const handleSignUp = async (email: string , password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Sign-up error:', error.message);
  }
};

export const handleLogin = async (email: string , password: string) => {

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Login error:', error.message);
  }
};


export const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error.message);
  }
};