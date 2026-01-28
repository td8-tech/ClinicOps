import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteButton } from '@/components/ui/delete-button'
import Link from 'next/link'

export default async function PacientesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check permission logic for UI (though RLS handles security)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    const isRecepcao = profile?.role === 'recepcao'

    const { data: pacientes, error } = await supabase.from('pacientes').select('*')

    if (error) {
        // Handle error (e.g., table doesn't exist yet)
        console.error("Supabase Error:", error)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Pacientes</h2>
                <Link href="/pacientes/new">
                    <Button>Novo Paciente</Button>
                </Link>
            </div>
            
            <div className="rounded-md border bg-white dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(!pacientes || pacientes.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Nenhum paciente cadastrado.
                                </TableCell>
                            </TableRow>
                        )}
                        {pacientes?.map((paciente) => (
                            <TableRow key={paciente.id}>
                                <TableCell>{paciente.nome}</TableCell>
                                <TableCell>{paciente.cpf}</TableCell>
                                <TableCell>{paciente.telefone}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/pacientes/${paciente.id}`}>
                                            <Button variant="ghost" size="sm">Editar</Button>
                                        </Link>
                                        {!isRecepcao && <DeleteButton id={paciente.id} type="paciente" className="h-8 w-8" />}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
