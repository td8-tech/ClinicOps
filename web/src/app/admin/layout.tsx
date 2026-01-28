import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

// Hardcoded super admin check for MVP
const SUPER_ADMIN_EMAIL = 'osbentoalves@gmail.com'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== SUPER_ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
            <header className="bg-white dark:bg-slate-950 border-b p-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold">Painel Administrativo</h1>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded border border-red-200">SUPER ADMIN</span>
            </header>
            <main className="p-8 overflow-y-auto flex-1">
                {children}
            </main>
        </div>
    </div>
  )
}
