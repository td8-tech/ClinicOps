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

const mockPlanos = [
    { id: 1, nome: 'Starter', preco: 99, limite_profissionais: 1, limite_pacientes: 500, status: 'Ativo' },
    { id: 2, nome: 'Pro', preco: 299, limite_profissionais: 5, limite_pacientes: 'Ilimitado', status: 'Ativo' },
    { id: 3, nome: 'Enterprise', preco: 0, limite_profissionais: 'Ilimitado', limite_pacientes: 'Ilimitado', status: 'Inativo' },
]

export default function AdminPlanosPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Planos de Assinatura</h2>
                <Button>Novo Plano</Button>
            </div>
            
            <div className="rounded-md border bg-white dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço (R$)</TableHead>
                            <TableHead>Limites</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockPlanos.map((plano) => (
                            <TableRow key={plano.id}>
                                <TableCell className="font-medium">{plano.nome}</TableCell>
                                <TableCell>
                                    {plano.preco > 0 ? `R$ ${plano.preco},00` : 'Sob Consulta'}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {plano.limite_profissionais} Profissional(is) • {plano.limite_pacientes} Pacientes
                                </TableCell>
                                <TableCell>
                                    <Badge variant={plano.status === 'Ativo' ? 'outline' : 'secondary'}>
                                        {plano.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" disabled>Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
