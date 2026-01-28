import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get Clinic Info
    const { data: profile } = await supabase.from('profiles').select('*, clinicas(*)').eq('id', user?.id).single()
    const clinica = profile?.clinicas

    // Mock usage stats (In real app, perform count queries)
    const { count: pacientesCount } = await supabase.from('pacientes').select('*', { count: 'exact', head: true })
    const { count: storageCount } = await supabase.from('documentos').select('*', { count: 'exact', head: true })

    const maxPacientes = 500 // Example limit for Starter plan
    const usedPercentage = Math.min(100, Math.round(((pacientesCount || 0) / maxPacientes) * 100))

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configurações</h2>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Plano & Uso</CardTitle>
                        <CardDescription>Gerencie sua assinatura e limites</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-lg">{clinica?.nome || 'Minha Clínica'}</p>
                                <p className="text-sm text-muted-foreground">Plano Atual: <span className="font-bold text-primary">Starter</span></p>
                            </div>
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                Ativo
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Pacientes Cadastrados</span>
                                <span>{pacientesCount} / {maxPacientes}</span>
                            </div>
                            <Progress value={usedPercentage} />
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">Documentos Armazenados: {storageCount} arquivos</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Clínica</CardTitle>
                        <CardDescription>Informações visíveis nos documentos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Para alterar os dados da clínica, entre em contato com o suporte.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
