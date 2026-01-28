'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DownloadButtonProps {
    path: string
    fileName: string
}

export function DownloadButton({ path, fileName }: DownloadButtonProps) {
    
    const handleDownload = async () => {
        const supabase = createClient()
        
        // 1. Create Signed URL (valid for 60 seconds)
        const { data, error } = await supabase.storage
            .from('documentos')
            .createSignedUrl(path, 60)

        if (error || !data) {
            alert('Erro ao gerar link de download')
            return
        }

        // 2. Trigger Download
        const a = document.createElement('a')
        a.href = data.signedUrl
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
        </Button>
    )
}
