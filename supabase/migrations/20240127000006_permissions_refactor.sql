-- 1. Add medico_id to pacientes
alter table public.pacientes
add column medico_id uuid references public.profiles(id) on delete set null;

-- 2. Update RLS for Pacientes
-- Drop old policies to avoid conflicts
drop policy if exists "Pacientes viewable by clinic members" on public.pacientes;
drop policy if exists "Pacientes insertable by clinic members" on public.pacientes;
drop policy if exists "Pacientes updatable by clinic members" on public.pacientes;
drop policy if exists "Pacientes deletable by admins" on public.pacientes;

-- New Policies
-- Admin & Recepcao: View ALL in clinic
create policy "Pacientes viewable by admin and recepcao" on public.pacientes
for select using (
  clinica_id = public.get_my_clinic_id() 
  and exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role in ('admin', 'recepcao')
  )
);

-- Medico: View ONLY linked patients
create policy "Pacientes viewable by own medico" on public.pacientes
for select using (
  clinica_id = public.get_my_clinic_id() 
  and medico_id = auth.uid()
);

-- Insert/Update: Admin & Recepcao can manage all. Medico manage own.
create policy "Pacientes manage by admin/recepcao" on public.pacientes
for all using (
  clinica_id = public.get_my_clinic_id() 
  and exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role in ('admin', 'recepcao')
  )
);

create policy "Pacientes manage by own medico" on public.pacientes
for update using (
  clinica_id = public.get_my_clinic_id() 
  and medico_id = auth.uid()
);

-- 3. Update RLS for Auditoria (Admin Only)
drop policy if exists "Auditoria viewable by clinic members" on public.auditoria;

create policy "Auditoria viewable by admin only" on public.auditoria
for select using (
  clinica_id = public.get_my_clinic_id() 
  and exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  )
);

-- 4. Update RLS for Documentos
drop policy if exists "Documentos viewable by clinic members" on public.documentos;

-- Admin: View all
create policy "Documentos viewable by admin" on public.documentos
for select using (
  clinica_id = public.get_my_clinic_id() 
  and exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  )
);

-- Medico: View docs of OWN patients
create policy "Documentos viewable by medico" on public.documentos
for select using (
  clinica_id = public.get_my_clinic_id() 
  and exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role = 'medico'
  )
  and exists (
    select 1 from public.pacientes
    where id = documentos.paciente_id
    and medico_id = auth.uid()
  )
);

-- Recepcao: NO ACCESS (Per requirements)
-- No policy created for recepcao = deny by default.
