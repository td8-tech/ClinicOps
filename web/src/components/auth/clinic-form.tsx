'use client'

import { useActionState } from 'react'
import { createClinic } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const initialState = {
  error: '',
}

export function ClinicForm() {
  const [state, formAction, isPending] = useActionState(createClinic, initialState)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Criar Clínica</CardTitle>
        <CardDescription className="text-center">
            Configure sua clínica para começar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome da Clínica</Label>
            <Input id="nome" name="nome" type="text" placeholder="Ex: Clínica Saúde" required />
          </div>
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Criando...' : 'Começar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
