import { createClient } from '@/lib/supabase/server'
import { PatientForm } from '@/components/patients/patient-form'

export default async function NewPatientPage() {
  const supabase = await createClient()
  
  // Fetch Medicos for Dropdown
  const { data: medicos } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'medico')
    .order('full_name')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Cadastrar Paciente</h2>
      <PatientForm medicos={medicos || []} />
    </div>
  )
}
