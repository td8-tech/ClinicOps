'use client'

import { useActionState } from 'react'
import { createAppointment } from '@/app/(dashboard)/agenda/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const initialState = {
  error: '',
}

interface AppointmentFormProps {
    pacientes: any[]
    profissionais: any[]
}

export function AppointmentForm({ pacientes, profissionais }: AppointmentFormProps) {
  const [state, formAction, isPending] = useActionState(createAppointment, initialState)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Agendamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="paciente_id">Paciente</Label>
            <select 
                id="paciente_id" 
                name="paciente_id" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
            >
                <option value="">Selecione um paciente</option>
                {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
                ))}
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="profissional_id">Profissional</Label>
            <select 
                id="profissional_id" 
                name="profissional_id" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
            >
                <option value="">Selecione um profissional</option>
                {profissionais.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="data_hora">Data e Hora</Label>
            <Input id="data_hora" name="data_hora" type="datetime-local" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição / Motivo</Label>
            <Input id="descricao" name="descricao" placeholder="Ex: Consulta de rotina" required />
          </div>

          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
