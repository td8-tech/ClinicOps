import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditProfessionalForm } from '@/components/profissionais/edit/edit-professional-form'

export default async function EditProfessionalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single()

    if (!profile) {
        notFound()
    }

    return (
        <div>
            <EditProfessionalForm profile={profile} />
        </div>
    )
}
