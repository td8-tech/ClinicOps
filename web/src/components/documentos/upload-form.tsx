'use client'

import { useActionState, useState } from 'react'
import { uploadDocument, type UploadDocumentState } from '@/app/(dashboard)/documentos/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const initialState: UploadDocumentState = {
  error: '',
  success: false
}

interface UploadFormProps {
    pacientes: any[]
}

export function UploadForm({ pacientes }: UploadFormProps) {
  const [state, formAction, isPending] = useActionState(uploadDocument, initialState)
  const [open, setOpen] = useState(false)

  if (state?.success && open) {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload de Arquivo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Documento</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
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
                    <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="arquivo">Arquivo</Label>
            <Input id="arquivo" name="arquivo" type="file" required />
          </div>

          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Enviando...' : 'Enviar Documento'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
