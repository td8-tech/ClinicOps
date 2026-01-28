'use client'

import { useActionState } from 'react'
import { inviteProfessional } from '@/app/(dashboard)/profissionais/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const initialState = {
  error: '',
}

export function ProfessionalForm() {
  const [state, formAction, isPending] = useActionState(inviteProfessional, initialState)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Adicionar Profissional</CardTitle>
        <CardDescription>
            Crie uma conta para um novo membro da equipe. A senha inicial será <strong>TempPassword123!</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select name="role" required defaultValue="medico">
                <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="recepcao">Recepção</SelectItem>
                </SelectContent>
            </Select>
          </div>

          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Criando Conta...' : 'Criar Profissional'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
