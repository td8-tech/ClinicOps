import Link from 'next/link'
import { Home, Users, Calendar, FileText, Settings, LogOut, Stethoscope, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export async function Sidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userRole = 'recepcao'
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) userRole = profile.role
  }

  const items = [
    { title: 'Dashboard', url: '/dashboard', icon: Home, roles: ['admin', 'medico', 'recepcao'] },
    { title: 'Pacientes', url: '/pacientes', icon: Users, roles: ['admin', 'medico', 'recepcao'] },
    { title: 'Profissionais', url: '/profissionais', icon: Stethoscope, roles: ['admin', 'recepcao'] }, // Medico nao ve
    { title: 'Agenda', url: '/agenda', icon: Calendar, roles: ['admin', 'medico', 'recepcao'] },
    { title: 'Documentos', url: '/documentos', icon: FileText, roles: ['admin', 'medico'] }, // Recepcao nao ve
    { title: 'Auditoria', url: '/auditoria', icon: ShieldAlert, roles: ['admin'] }, // Apenas admin
    { title: 'Configurações', url: '/settings', icon: Settings, roles: ['admin', 'medico', 'recepcao'] },
  ]

  const filteredItems = items.filter(item => item.roles.includes(userRole))

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-white dark:bg-gray-950 sticky top-0">
      <div className="flex h-16 items-center border-b px-6 font-bold text-xl">
        ClinicOps
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
         <Link href="/api/auth/signout" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            <LogOut className="h-5 w-5" />
            Sair
         </Link>
      </div>
    </div>
  )
}
