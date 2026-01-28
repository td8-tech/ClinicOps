import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditPatientForm } from '@/components/patients/edit-patient-form'

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: paciente } = await supabase.from('pacientes').select('*').eq('id', id).single()

    if (!paciente) {
        notFound()
    }

    return (
        <div>
            <EditPatientForm patient={paciente} />
        </div>
    )
}
