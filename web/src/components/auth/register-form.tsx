'use client'

import { useActionState } from 'react'
import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

const initialState = {
  error: '',
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" name="fullName" type="text" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
      </CardContent>
       <CardFooter className="justify-center">
        <Link href="/auth/login" className="text-sm text-blue-500 hover:underline">
            Já tem uma conta? Entre
        </Link>
      </CardFooter>
    </Card>
  )
}
