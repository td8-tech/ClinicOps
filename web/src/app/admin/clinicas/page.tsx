import { createClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import Link from 'next/link'

export default async function AdminClinicasPage() {
    const supabase = await createClient()
    const { data: clinicas } = await supabase.from('clinicas').select('*').order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestão de Clínicas</h2>
                {/* Future: Add Create Clinic manually */}
            </div>
            
            <div className="rounded-md border bg-white dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data Cadastro</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clinicas?.map((clinica) => (
                            <TableRow key={clinica.id}>
                                <TableCell className="font-medium">{clinica.nome}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{clinica.id}</TableCell>
                                <TableCell>
                                    <Badge variant={clinica.status_assinatura === 'active' ? 'default' : 'destructive'}>
                                        {clinica.status_assinatura}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(clinica.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Link href={`/admin/clinicas/${clinica.id}`}>
                                        <Button variant="outline" size="sm">Detalhes</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
