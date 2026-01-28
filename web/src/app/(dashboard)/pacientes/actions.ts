'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { logAction } from '@/lib/actions'

export async function createPatient(prevState: any, formData: FormData) {
    const supabase = await createClient()
    
    // ... auth checks ...
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user.id).single()
    if (!profile?.clinica_id) return { error: "No clinic found for user" }

    const data = {
        clinica_id: profile.clinica_id,
        medico_id: formData.get('medico_id') as string, // New field
        nome: formData.get('nome') as string,
        cpf: formData.get('cpf') as string,
        telefone: formData.get('telefone') as string,
        data_nascimento: formData.get('data_nascimento') ? (formData.get('data_nascimento') as string) : null,
    }

    const { data: newPatient, error } = await supabase.from('pacientes').insert(data).select().single()

    if (error) {
        return { error: error.message }
    }

    await logAction('create', 'pacientes', { id: newPatient.id, nome: newPatient.nome })

    revalidatePath('/pacientes')
    redirect('/pacientes')
}

export async function updatePatient(prevState: any, formData: FormData) {
    const supabase = await createClient()
    
    const id = formData.get('id') as string
    
    const data = {
        nome: formData.get('nome') as string,
        cpf: formData.get('cpf') as string,
        telefone: formData.get('telefone') as string,
        data_nascimento: formData.get('data_nascimento') ? (formData.get('data_nascimento') as string) : null,
    }

    const { error } = await supabase.from('pacientes').update(data).eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/pacientes')
    redirect('/pacientes')
}
