'use client'

import { useActionState } from 'react'
import { updatePassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const initialState = {
  error: '',
}

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl text-center">Nova Senha</CardTitle>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
            <Button className="w-full" disabled={isPending}>
                {isPending ? 'Atualizando...' : 'Salvar Senha'}
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  )
}
