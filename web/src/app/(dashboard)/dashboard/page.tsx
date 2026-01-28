import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get Clinic Info to filter
    const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user?.id).single()
    const clinicaId = profile?.clinica_id

    // Fetch REAL data
    const { count: pacientesCount } = await supabase.from('pacientes').select('*', { count: 'exact', head: true }).eq('clinica_id', clinicaId)
    
    // Atendimentos today
    const today = new Date().toISOString().split('T')[0]
    const { count: atendimentosHoje } = await supabase.from('atendimentos')
        .select('*', { count: 'exact', head: true })
        .eq('clinica_id', clinicaId)
        .gte('data_hora', `${today}T00:00:00`)
        .lt('data_hora', `${today}T23:59:59`)

    // Faturamento Mês (Mocked for now as we don't have financial transactions table yet)
    // We could sum 'valor' from atendimentos if we had it. For now, let's keep it static or 0.
    const faturamentoMes = "R$ 0,00" 

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-white dark:bg-gray-950">
                <div className="text-sm font-medium">Total Pacientes</div>
                <div className="text-2xl font-bold">{pacientesCount || 0}</div>
            </div>
             <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-white dark:bg-gray-950">
                <div className="text-sm font-medium">Atendimentos Hoje</div>
                <div className="text-2xl font-bold">{atendimentosHoje || 0}</div>
            </div>
             <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-white dark:bg-gray-950">
                <div className="text-sm font-medium">Faturamento Mês (Est.)</div>
                <div className="text-2xl font-bold">{faturamentoMes}</div>
            </div>
        </div>
    )
}
