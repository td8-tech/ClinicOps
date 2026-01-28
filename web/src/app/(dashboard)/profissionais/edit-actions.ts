'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logAction } from '@/lib/actions'

export async function updateProfessional(prevState: any, formData: FormData) {
    const supabase = await createClient()
    
    const id = formData.get('id') as string
    const role = formData.get('role') as string
    const fullName = formData.get('fullName') as string

    // Validate Permissions (Only admin/recepcao can edit? Recepcao can manage?)
    // Requirement: "Recepcao: Pode apenas gerenciar profissionais existentes"
    const { data: { user } } = await supabase.auth.getUser()
    const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    
    if (!['admin', 'recepcao'].includes(currentUserProfile?.role)) {
        return { error: "Sem permissão" }
    }

    const { error } = await supabase.from('profiles').update({ role, full_name: fullName }).eq('id', id)

    if (error) {
        return { error: error.message }
    }

    await logAction('update', 'profiles', { id, role, fullName })

    revalidatePath('/profissionais')
    redirect('/profissionais')
}
