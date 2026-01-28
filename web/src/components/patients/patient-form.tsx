'use client'

import { useActionState, useState } from 'react'
import { createPatient } from '@/app/(dashboard)/pacientes/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const initialState = {
  error: '',
}

interface PatientFormProps {
    medicos?: { id: string, full_name: string }[]
}

export function PatientForm({ medicos = [] }: PatientFormProps) {
  const [state, formAction, isPending] = useActionState(createPatient, initialState)
  
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2')
    value = value.replace(/(-\d{2})\d+?$/, '$1')
    setCpf(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
    value = value.replace(/(-\d{4})\d+?$/, '$1')
    setPhone(value)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" name="nome" required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="medico_id">Médico Responsável</Label>
            <select 
                id="medico_id" 
                name="medico_id" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
            >
                <option value="">Selecione um médico</option>
                {medicos.map(m => (
                    <option key={m.id} value={m.id}>Dr. {m.full_name}</option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input 
                  id="cpf" 
                  name="cpf" 
                  value={cpf} 
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  name="telefone" 
                  value={phone} 
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
            </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input id="data_nascimento" name="data_nascimento" type="date" />
          </div>
          
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar Paciente'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
