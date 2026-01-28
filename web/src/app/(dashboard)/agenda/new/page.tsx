import { createClient } from '@/lib/supabase/server'
import { AppointmentForm } from '@/components/agenda/appointment-form'

export default async function NewAppointmentPage() {
    const supabase = await createClient()
    
    // Fetch Patients
    const { data: pacientes } = await supabase.from('pacientes').select('id, nome, cpf').order('nome')
    
    // Fetch Professionals (Only Medicos)
    const { data: profissionais } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', 'medico') // Filter: Only show Medicos
        .order('full_name')

    return (
        <div>
            <AppointmentForm 
                pacientes={pacientes || []} 
                profissionais={profissionais || []} 
            />
        </div>
    )
}
