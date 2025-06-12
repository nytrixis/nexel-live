import { supabase } from './supabaseClient';

// Sign up and insert user metadata
export async function signUpWithEmail({ name, email, password, role, college_id }: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  college_id: string | null;
}) {
  console.log('SIGNUP:', { email, password });  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return { error };
  const user = data.user ?? data.session?.user;
  if (user) {
    const { error: metaError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          name,
          email,
          role,
          college_id,
        },
      ]);
    if (metaError) return { error: metaError };
  }

  return { data };
}

export async function signInWithEmail({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { data, error };
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}

export async function signInWithOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  return { data, error };
}