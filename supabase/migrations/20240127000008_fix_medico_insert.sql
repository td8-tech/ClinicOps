-- Fix Insert Policy for Medicos on Pacientes
-- The previous policy 'Pacientes manage by own medico' was only for UPDATE.
-- We need an INSERT policy that allows medicos to create patients if they assign THEMSELVES as medico_id.

create policy "Pacientes insert by own medico" on public.pacientes
for insert with check (
  clinica_id = public.get_my_clinic_id()
  and medico_id = auth.uid()
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'medico'
  )
);
