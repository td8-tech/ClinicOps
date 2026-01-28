-- 1. DELETE Policy for Atendimentos (Agenda)
-- Allow: Admin, Recepcao
-- Deny: Medico (and others)
drop policy if exists "Atendimentos deletable by clinic members" on public.atendimentos;

create policy "Atendimentos delete by admin/recepcao" on public.atendimentos
for delete using (
  clinica_id = public.get_my_clinic_id()
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'recepcao')
  )
);

-- 2. DELETE Policy for Pacientes
-- Allow: Admin (any in clinic)
-- Allow: Medico (only if linked to them)
drop policy if exists "Pacientes deletable by admins" on public.pacientes;

create policy "Pacientes delete by permission" on public.pacientes
for delete using (
  clinica_id = public.get_my_clinic_id()
  and (
    -- Admin can delete ANY in clinic
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
    OR
    -- Medico can delete ONLY OWN patients
    (
      exists (
        select 1 from public.profiles
        where id = auth.uid()
        and role = 'medico'
      )
      and medico_id = auth.uid()
    )
  )
);

-- 3. DELETE Policy for Profiles (Profissionais)
-- Allow: Admin Only
-- Note: This deletes the public profile. Auth user deletion requires Supabase Admin API.
create policy "Profiles delete by admin" on public.profiles
for delete using (
  clinica_id = public.get_my_clinic_id()
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);
