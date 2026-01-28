import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminDashboard() {
    const supabase = await createClient()
    
    // As we are not bypassing RLS with service role here (using anon client), 
    // this page will only work if the user is ACTUALLY a super admin with db policies 
    // OR if we use a service role client (unsafe in client components, okay in server actions/components but needs env var).
    // For this MVP demonstration, we assume the RLS allows reading 'clinicas' for this specific user or public reading of counts.
    // Since we locked down 'clinicas', this query will return 0 rows for a normal user unless we add a policy.
    
    // NOTE: To make this work, add a policy:
    // create policy "Super admin view all" on clinicas for select using (auth.email() = 'admin@clinicops.com');
    
    const { data: clinicas } = await supabase.from('clinicas').select('*')

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader><CardTitle>Clínicas Ativas</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold">{clinicas?.length || 0}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Receita Mensal (Est.)</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold">R$ {(clinicas?.length || 0) * 299},00</CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Todas as Clínicas</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Criado em</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clinicas?.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                                    <TableCell>{c.nome}</TableCell>
                                    <TableCell>{c.status_assinatura}</TableCell>
                                    <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
