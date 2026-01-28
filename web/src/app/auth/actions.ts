'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function createClinic(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const nome = formData.get('nome') as string
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Você precisa estar logado para criar uma clínica." }
    }

    // Call the secure RPC function
    const { data: clinicId, error } = await supabase
        .rpc('create_clinic_for_user', { clinic_name: nome })

    if (error) {
        console.error("Erro ao criar clínica:", error)
        return { error: error.message || "Erro ao criar clínica." }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
