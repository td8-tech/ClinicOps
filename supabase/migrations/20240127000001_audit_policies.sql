-- Enable RLS on auditoria
alter table public.auditoria enable row level security;

-- Policy to allow inserting audit logs
create policy "Auditoria insertable by authenticated users" on public.auditoria
  for insert with check (auth.role() = 'authenticated');

-- Policy to allow viewing audit logs (restricted to clinic members)
create policy "Auditoria viewable by clinic members" on public.auditoria
  for select using (clinica_id = public.get_my_clinic_id());
