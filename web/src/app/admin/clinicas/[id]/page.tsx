import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ClinicDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: clinica } = await supabase.from('clinicas').select('*').eq('id', id).single()
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('clinica_id', id)
    const { count: patientCount } = await supabase.from('pacientes').select('*', { count: 'exact', head: true }).eq('clinica_id', id)

    if (!clinica) notFound()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/clinicas">
                    <Button variant="outline" size="sm">Voltar</Button>
                </Link>
                <h2 className="text-2xl font-bold">{clinica.nome}</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">ID da Clínica</p>
                            <p className="font-mono">{clinica.id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status da Assinatura</p>
                            <p className="capitalize">{clinica.status_assinatura}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                            <p>{new Date(clinica.created_at).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Métricas de Uso</CardTitle>
                        <CardDescription>Resumo de utilização da plataforma</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span>Usuários (Staff)</span>
                            <span className="font-bold">{userCount}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Pacientes</span>
                            <span className="font-bold">{patientCount}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
