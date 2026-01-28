import { createClient } from "./supabase/server"

export async function logAction(acao: string, tabela: string, detalhes?: any) {
  const supabase = await createClient()
  
  // Get current user and clinic
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase.from('profiles').select('clinica_id').eq('id', user.id).single()
  
  await supabase.from('auditoria').insert({
    clinica_id: profile?.clinica_id,
    user_id: user.id,
    acao,
    tabela,
    detalhes
  })
}
