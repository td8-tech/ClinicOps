'use client'

import { useActionState, useState } from 'react'
import { updatePatient } from '@/app/(dashboard)/pacientes/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const initialState = {
  error: '',
}

interface EditPatientFormProps {
  patient: {
    id: string
    nome: string
    cpf: string | null
    telefone: string | null
    data_nascimento: string | null
  }
}

export function EditPatientForm({ patient }: EditPatientFormProps) {
  const [state, formAction, isPending] = useActionState(updatePatient, initialState)
  
  const [cpf, setCpf] = useState(patient.cpf || '')
  const [phone, setPhone] = useState(patient.telefone || '')

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
        <CardTitle>Editar Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={patient.id} />
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" name="nome" defaultValue={patient.nome} required />
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
            <Input id="data_nascimento" name="data_nascimento" type="date" defaultValue={patient.data_nascimento || ''} />
          </div>
          
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
