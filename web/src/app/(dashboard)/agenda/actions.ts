'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { logAction } from '@/lib/actions'

export async function createAppointment(prevState: any, formData: FormData) {
    const supabase = await createClient()
    
    // ... auth checks ...
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user.id).single()
    if (!profile?.clinica_id) return { error: "No clinic found for user" }

    const data = {
        clinica_id: profile.clinica_id,
        paciente_id: formData.get('paciente_id') as string,
        profissional_id: formData.get('profissional_id') as string,
        data_hora: formData.get('data_hora') as string,
        descricao: formData.get('descricao') as string,
        status: 'agendado'
    }

    const { data: newAppt, error } = await supabase.from('atendimentos').insert(data).select().single()

    if (error) {
        return { error: error.message }
    }

    await logAction('create', 'atendimentos', { id: newAppt.id, data: data.data_hora })

    revalidatePath('/agenda')
    redirect('/agenda')
}
