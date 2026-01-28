'use client'

import { useActionState } from 'react'
import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

const initialState = {
  error: '',
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/auth/reset-password" class="text-xs text-blue-500 hover:underline">
                    Esqueceu?
                </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/auth/register" className="text-sm text-blue-500 hover:underline">
            Não tem uma conta? Cadastre-se
        </Link>
      </CardFooter>
    </Card>
  )
}
