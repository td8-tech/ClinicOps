'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function resetPassword(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // Note: Supabase needs 'Site URL' configured in Auth Settings to work properly.
  // It will send a link like: https://your-site.com/auth/callback?code=...&next=/auth/update-password
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: "Verifique seu email para redefinir a senha." }
}
