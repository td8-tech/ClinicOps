import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { UploadForm } from '@/components/documentos/upload-form'
import { DownloadButton } from '@/components/documentos/download-button'
import { redirect } from 'next/navigation'

export default async function DocumentosPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check Role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    
    if (profile?.role === 'recepcao') {
        redirect('/dashboard') // Access Denied
    }

    const { data: docs } = await supabase.from('documentos').select('*, pacientes(nome)')
    const { data: pacientes } = await supabase.from('pacientes').select('id, nome').order('nome')

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Documentos</h2>
                <UploadForm pacientes={pacientes || []} />
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-950 divide-y">
                {(!docs || docs.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">Nenhum documento armazenado ou visível.</div>
                )}
                {docs?.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-medium">{doc.nome_arquivo}</p>
                                <p className="text-sm text-muted-foreground">Paciente: {doc.pacientes?.nome}</p>
                            </div>
                        </div>
                        <DownloadButton path={doc.url} fileName={doc.nome_arquivo} />
                    </div>
                ))}
            </div>
        </div>
    )
}
