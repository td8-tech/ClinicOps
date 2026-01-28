import Link from 'next/link'
import { LayoutDashboard, Building2, CreditCard, Activity, LogOut } from 'lucide-react'

const items = [
  { title: 'Visão Geral', url: '/admin', icon: LayoutDashboard },
  { title: 'Clínicas', url: '/admin/clinicas', icon: Building2 },
  { title: 'Planos', url: '/admin/planos', icon: CreditCard },
  { title: 'Assinaturas', url: '/admin/assinaturas', icon: Activity },
]

export function AdminSidebar() {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-slate-900 text-white sticky top-0">
      <div className="flex h-16 items-center border-b border-slate-800 px-6 font-bold text-xl">
        <span className="text-red-500 mr-2">Admin</span> Master
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-800 p-4">
         <Link href="/dashboard" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <LogOut className="h-5 w-5" />
            Voltar ao App
         </Link>
      </div>
    </div>
  )
}
