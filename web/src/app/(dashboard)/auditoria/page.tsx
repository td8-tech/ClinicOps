import { createClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { redirect } from 'next/navigation'

export default async function AuditoriaPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check Role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    
    // Only Admin can see audit logs
    if (profile?.role !== 'admin') {
        redirect('/dashboard') // Access Denied
    }
    
    const { data: logs, error } = await supabase
        .from('auditoria')
        .select(`
            *,
            profiles ( full_name, role )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Erro auditoria:", error)
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Logs de Auditoria</h2>
            
            <div className="rounded-md border bg-white dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data/Hora</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Tabela</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(!logs || logs.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                        {logs?.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{log.profiles?.full_name || 'Sistema'}</span>
                                        <span className="text-xs text-muted-foreground">{log.profiles?.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="uppercase text-xs font-bold">{log.acao}</TableCell>
                                <TableCell>{log.tabela}</TableCell>
                                <TableCell className="font-mono text-xs max-w-xs truncate">
                                    {JSON.stringify(log.detalhes)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
