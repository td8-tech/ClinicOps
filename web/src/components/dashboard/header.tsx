import { createClient } from '@/lib/supabase/server'
import { UserNav } from '@/components/dashboard/user-nav'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let fullName = 'Usuário'
  let email = user?.email

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    
    if (profile?.full_name) {
      fullName = profile.full_name
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-950">
      <h1 className="text-lg font-semibold">Visão Geral</h1>
      <div className="flex items-center gap-4">
        <UserNav fullName={fullName} email={email} />
      </div>
    </header>
  )
}
