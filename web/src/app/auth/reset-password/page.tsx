'use client'

import { useActionState } from 'react'
import { resetPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

const initialState = {
  error: '',
  success: ''
}

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl text-center">Recuperar Senha</CardTitle>
        </CardHeader>
        <CardContent>
            {state?.success ? (
                <div className="text-green-600 text-center space-y-4">
                    <p>{state.success}</p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full">Voltar ao Login</Button>
                    </Link>
                </div>
            ) : (
                <form action={formAction} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
                <Button className="w-full" disabled={isPending}>
                    {isPending ? 'Enviando...' : 'Enviar Link'}
                </Button>
                </form>
            )}
        </CardContent>
        {!state?.success && (
            <CardFooter className="justify-center">
                <Link href="/auth/login" className="text-sm text-blue-500 hover:underline">
                    Voltar ao Login
                </Link>
            </CardFooter>
        )}
        </Card>
    </div>
  )
}
