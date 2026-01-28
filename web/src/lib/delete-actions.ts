'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/actions'

// --- AGENDAS ---
export async function deleteAppointment(id: string) {
    const supabase = await createClient()
    
    // Check permission logic in code (Double safety)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    
    if (!['admin', 'recepcao'].includes(profile?.role)) {
        return { error: "Sem permissão para excluir agendamentos." }
    }

    const { error } = await supabase.from('atendimentos').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAction('delete', 'atendimentos', { id })
    revalidatePath('/agenda')
    return { success: true }
}

// --- PACIENTES ---
export async function deletePatient(id: string) {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    
    // RLS handles the specifics (Medico vs Admin), but we can pre-check role
    if (profile?.role === 'recepcao') {
        return { error: "Sem permissão para excluir pacientes." }
    }

    const { error } = await supabase.from('pacientes').delete().eq('id', id)

    if (error) return { error: "Erro ao excluir: Verifique se você tem permissão sobre este paciente." }

    await logAction('delete', 'pacientes', { id })
    revalidatePath('/pacientes')
    return { success: true }
}

// --- PROFISSIONAIS ---
export async function deleteProfessional(id: string) {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    
    if (profile?.role !== 'admin') {
        return { error: "Apenas administradores podem excluir profissionais." }
    }

    // Delete Profile (RLS allows Admin)
    // Note: This leaves the Auth User orphaned in Supabase Auth. 
    // To fully delete, we'd need Service Role. For MVP, we delete the profile record.
    const { error } = await supabase.from('profiles').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAction('delete', 'profiles', { id })
    revalidatePath('/profissionais')
    return { success: true }
}
