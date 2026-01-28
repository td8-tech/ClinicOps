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
import { redirect } from 'next/navigation'

export default async function ProfissionaisPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check Role
    const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    const userRole = currentUserProfile?.role

    // Medico cannot access this page (extra safety besides sidebar hidden)
    if (userRole === 'medico') {
        redirect('/dashboard')
    }

    const { data: profiles } = await supabase.from('profiles').select('*')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Profissionais</h2>
                
                {/* Recepcao cannot add professionals */}
                {userRole === 'admin' && (
                    <Link href="/profissionais/new">
                        <Button>Adicionar Profissional</Button>
                    </Link>
                )}
            </div>
            
            <div className="rounded-md border bg-white dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {(!profiles || profiles.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                    Nenhum profissional encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                        {profiles?.map((profile) => (
                            <TableRow key={profile.id}>
                                <TableCell>{profile.full_name || 'Sem nome'}</TableCell>
                                <TableCell className="capitalize">{profile.role}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/profissionais/${profile.id}`}>
                                            <Button variant="ghost" size="sm">Gerenciar</Button>
                                        </Link>
                                        {userRole === 'admin' && <DeleteButton id={profile.id} type="profissional" className="h-8 w-8" />}
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
