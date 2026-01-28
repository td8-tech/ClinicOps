'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logAction } from '@/lib/actions'

export async function inviteProfessional(prevState: any, formData: FormData) {
    const supabase = await createClient()
    
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    const fullName = formData.get('fullName') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user.id).single()
    if (!profile?.clinica_id) return { error: "No clinic found" }

    // SOLUTION: Use the `supabase.auth.signUp` with a temporary password that the admin shares.
    const tempPassword = "TempPassword123!" 
    
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
            data: {
                clinica_id: profile.clinica_id,
                role: role,
                full_name: fullName
            }
        }
    })

    if (signUpError) {
        return { error: signUpError.message }
    }
    
    // Log the action
    await logAction('invite', 'profiles', { email, role, full_name: fullName })
    
    revalidatePath('/profissionais')
    redirect('/profissionais')
}
