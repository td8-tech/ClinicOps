'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { deleteAppointment, deletePatient, deleteProfessional } from '@/lib/delete-actions'

interface DeleteButtonProps {
    id: string
    type: 'agenda' | 'paciente' | 'profissional'
    className?: string
}

export function DeleteButton({ id, type, className }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm('Tem certeza que deseja excluir este registro?')) return

        startTransition(async () => {
            let result
            if (type === 'agenda') result = await deleteAppointment(id)
            if (type === 'paciente') result = await deletePatient(id)
            if (type === 'profissional') result = await deleteProfessional(id)

            if (result?.error) {
                alert(result.error)
            }
        })
    }

    return (
        <Button 
            variant="destructive" 
            size="icon" 
            className={className} 
            onClick={handleDelete}
            disabled={isPending}
            title="Excluir"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
