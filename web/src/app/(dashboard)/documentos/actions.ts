'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadDocument(prevState: any, formData: FormData) {
    const supabase = await createClient()
    
    const file = formData.get('arquivo') as File
    const paciente_id = formData.get('paciente_id') as string

    if (!file || !paciente_id) {
        return { error: "Arquivo e Paciente são obrigatórios." }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user.id).single()
    if (!profile?.clinica_id) return { error: "No clinic found" }

    // 1. Upload file to Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${profile.clinica_id}/${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, file)

    if (uploadError) {
        return { error: `Erro no upload: ${uploadError.message}` }
    }

    // 2. Get Public URL (or just path)
    // For private buckets, we don't store public URL usually, but let's store the path or signed URL generator needed.
    // The table has `url` column. Let's store the path for now or the public URL if public.
    // Assuming private, we store the path.
    
    const { data: { publicUrl } } = supabase.storage.from('documentos').getPublicUrl(fileName)

    // 3. Save metadata
    const { error: dbError } = await supabase.from('documentos').insert({
        clinica_id: profile.clinica_id,
        paciente_id: paciente_id,
        nome_arquivo: file.name,
        url: fileName, // Storing path to generate signed url later
        tipo: file.type
    })

    if (dbError) {
        return { error: `Erro ao salvar registro: ${dbError.message}` }
    }

    revalidatePath('/documentos')
    return { success: true }
}
