-- Drop the old policy first (if it exists) to avoid conflicts
drop policy if exists "Super Admin View All Clinics" on public.clinicas;

-- Create the updated policy for the new admin email
create policy "Super Admin View All Clinics"
  on public.clinicas
  for select
  using (
    auth.email() = 'osbentoalves@gmail.com'
  );
