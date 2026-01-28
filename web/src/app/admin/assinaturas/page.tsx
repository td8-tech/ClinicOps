import { createClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'

export default async function AdminAssinaturasPage() {
    const supabase = await createClient()
    const { data: clinicas } = await supabase.from('clinicas').select('*')

    // Mock subscription data since we don't have Stripe connected yet
    // In real app, we would query a 'subscriptions' table
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Controle de Assinaturas</h2>
            
            <div className="rounded-md border bg-white dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Clínica</TableHead>
                            <TableHead>Plano</TableHead>
                            <TableHead>Status Pagamento</TableHead>
                            <TableHead>Próxima Cobrança</TableHead>
                            <TableHead>Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clinicas?.map((clinica) => (
                            <TableRow key={clinica.id}>
                                <TableCell className="font-medium">{clinica.nome}</TableCell>
                                <TableCell>Pro (Anual)</TableCell>
                                <TableCell>
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Pago</Badge>
                                </TableCell>
                                <TableCell>{new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}</TableCell>
                                <TableCell>R$ 299,00</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
