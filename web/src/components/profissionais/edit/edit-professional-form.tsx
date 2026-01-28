'use client'

import { useActionState } from 'react'
import { updateProfessional } from '@/app/(dashboard)/profissionais/edit-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const initialState = {
  error: '',
}

interface EditProfessionalFormProps {
    profile: {
        id: string
        full_name: string
        role: string
        email?: string
    }
}

export function EditProfessionalForm({ profile }: EditProfessionalFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfessional, initialState)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gerenciar Profissional</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={profile.id} />
          
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" name="fullName" defaultValue={profile.full_name} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select name="role" required defaultValue={profile.role}>
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
            {isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
