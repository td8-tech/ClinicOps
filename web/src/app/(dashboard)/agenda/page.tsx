import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { DeleteButton } from '@/components/ui/delete-button'

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ medico?: string }> }) {
    const { medico } = await searchParams
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check role
    const { data: userProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    const isMedico = userProfile?.role === 'medico'

    let query = supabase.from('atendimentos').select('*, pacientes(nome), profiles(full_name)')

    // Filter Logic
    if (isMedico) {
        query = query.eq('profissional_id', user?.id)
    } else if (medico) {
        query = query.eq('profissional_id', medico)
    }

    const { data: atendimentos } = await query

    // Get medicos list for filter dropdown (if admin/recepcao)
    const { data: medicos } = await supabase.from('profiles').select('*').eq('role', 'medico')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Agenda</h2>
                <div className="flex gap-2">
                    {!isMedico && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Filtrar:</span>
                            <div className="flex gap-1">
                                <Link href="/agenda">
                                    <Button variant={!medico ? 'default' : 'outline'} size="sm">Todos</Button>
                                </Link>
                                {medicos?.map(m => (
                                    <Link key={m.id} href={`/agenda?medico=${m.id}`}>
                                        <Button variant={medico === m.id ? 'default' : 'outline'} size="sm">
                                            Dr. {m.full_name?.split(' ')[0]}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    <Link href="/agenda/new">
                        <Button>Novo Agendamento</Button>
                    </Link>
                </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {(!atendimentos || atendimentos.length === 0) && (
                    <p className="col-span-full text-center text-muted-foreground py-12">Nenhum agendamento para hoje.</p>
                 )}
                 {atendimentos?.map((item) => (
                    <Card key={item.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base">{item.pacientes?.nome}</CardTitle>
                            {!isMedico && <DeleteButton id={item.id} type="agenda" className="h-8 w-8" />}
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{new Date(item.data_hora).toLocaleString()}</p>
                            <p className="font-medium mt-2">{item.descricao}</p>
                            <p className="text-xs text-muted-foreground mt-1">Dr(a). {item.profiles?.full_name}</p>
                        </CardContent>
                    </Card>
                 ))}
            </div>
        </div>
    )
}
